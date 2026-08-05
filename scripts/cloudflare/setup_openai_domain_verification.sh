#!/usr/bin/env bash
# MRL Cloudflare DNS setup — OpenAI domain verification TXT record
#
# Usage:
#   export CLOUDFLARE_API_TOKEN=<token with Zone.Zone:Read + Zone.DNS:Edit>
#   ./setup_openai_domain_verification.sh <domain> <verification-token>
#
# Example:
#   ./setup_openai_domain_verification.sh mrliouword.com openai-domain-verification=dv-xxxxxxxxxxxx
#
# The record is created as a TXT record on the zone apex (root domain),
# which is where OpenAI looks for it during verification.

set -euo pipefail

API="https://api.cloudflare.com/client/v4"

if [[ -z "${CLOUDFLARE_API_TOKEN:-}" ]]; then
  echo "ERROR: CLOUDFLARE_API_TOKEN is not set." >&2
  echo "Create a token at https://dash.cloudflare.com/profile/api-tokens" >&2
  echo "Required permissions: Zone.Zone:Read, Zone.DNS:Edit (scoped to the target zone)." >&2
  exit 1
fi

DOMAIN="${1:-}"
TOKEN_VALUE="${2:-}"

if [[ -z "$DOMAIN" || -z "$TOKEN_VALUE" ]]; then
  echo "Usage: $0 <domain> <openai-domain-verification=dv-...>" >&2
  exit 1
fi

# Exact DNS zone name only — rejects Cloudflare filter operators (contains:,
# starts_with:, ...) and anything that isn't URL-safe in a query string.
if [[ ! "$DOMAIN" =~ ^[A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])?)+$ ]]; then
  echo "ERROR: '$DOMAIN' is not a valid DNS zone name (e.g. example.com)." >&2
  exit 1
fi

if [[ ! "$TOKEN_VALUE" =~ ^openai-domain-verification=dv-[A-Za-z0-9_-]+$ ]]; then
  echo "ERROR: verification token must look like: openai-domain-verification=dv-..." >&2
  exit 1
fi

# Token is passed via a header file on a process-substitution fd, not argv,
# so it never appears in the process list. --fail aborts on non-2xx.
cf() {
  curl -sS --fail --connect-timeout 10 --max-time 60 \
       -H @<(printf 'Authorization: Bearer %s\n' "$CLOUDFLARE_API_TOKEN") \
       -H "Content-Type: application/json" "$@"
}

# Reads a Cloudflare JSON response on stdin; exits non-zero on success:false.
require_api_success() {
  python3 -c '
import json, sys
d = json.load(sys.stdin)
if not d.get("success"):
    sys.exit("Cloudflare API error: " + json.dumps(d.get("errors"), ensure_ascii=False))
sys.stdout.write(json.dumps(d))
'
}

echo "==> Looking up zone for $DOMAIN ..."
ZONE_ID=$(cf "$API/zones?name=$DOMAIN&status=active" | require_api_success | python3 -c '
import json, sys
d = json.load(sys.stdin)
r = d.get("result") or []
print(r[0]["id"] if r else "")
')

if [[ -z "$ZONE_ID" ]]; then
  echo "ERROR: no active Cloudflare zone found for $DOMAIN with this token." >&2
  echo "Check that the domain is on this Cloudflare account and the token can read the zone." >&2
  exit 1
fi
echo "    zone id: $ZONE_ID"

echo "==> Checking for an existing openai-domain-verification TXT record ..."
EXISTING_ID=""
PAGE=1
while :; do
  OUT=$(cf "$API/zones/$ZONE_ID/dns_records?type=TXT&name=$DOMAIN&per_page=100&page=$PAGE" \
        | require_api_success | python3 -c '
import json, sys
d = json.load(sys.stdin)
rid = ""
for r in d.get("result") or []:
    if r.get("content", "").startswith("openai-domain-verification="):
        rid = r["id"]
        break
info = d.get("result_info") or {}
print(rid or "-", info.get("total_pages") or 1)
')
  EXISTING_ID=${OUT%% *}
  TOTAL_PAGES=${OUT##* }
  if [[ "$EXISTING_ID" != "-" ]]; then
    break
  fi
  EXISTING_ID=""
  if (( PAGE >= TOTAL_PAGES )); then
    break
  fi
  PAGE=$((PAGE + 1))
done

PAYLOAD=$(python3 -c '
import json, sys
print(json.dumps({"type": "TXT", "name": sys.argv[1], "content": sys.argv[2], "ttl": 300}))
' "$DOMAIN" "$TOKEN_VALUE")

if [[ -n "$EXISTING_ID" ]]; then
  # PATCH only touches the fields in PAYLOAD; comment/tags on the record survive.
  echo "==> Updating existing record $EXISTING_ID ..."
  RESP=$(cf -X PATCH "$API/zones/$ZONE_ID/dns_records/$EXISTING_ID" --data "$PAYLOAD")
else
  echo "==> Creating TXT record on $DOMAIN ..."
  RESP=$(cf -X POST "$API/zones/$ZONE_ID/dns_records" --data "$PAYLOAD")
fi

printf '%s' "$RESP" | require_api_success | python3 -c '
import json, sys
r = json.load(sys.stdin)["result"]
print("    OK: {} {} -> {} (ttl {})".format(r["type"], r["name"], r["content"], r["ttl"]))
'

echo "==> Verifying via DNS (may take a minute to propagate) ..."
if command -v dig >/dev/null 2>&1; then
  if dig +short TXT "$DOMAIN" @1.1.1.1 | tr -d '"' | grep -Fxq "$TOKEN_VALUE"; then
    echo "    Verified: exact TXT record is publicly visible."
  else
    echo "    Not visible yet (or an older value is cached)."
    echo "    Propagation usually takes minutes but can take up to 24 hours — retry Verify later."
  fi
else
  echo "    'dig' not installed; check manually:"
  echo "    dig +short TXT $DOMAIN @1.1.1.1 | tr -d '\"' | grep -Fx \"$TOKEN_VALUE\""
fi

echo "Done. Return to https://platform.openai.com/settings (Domain verification) and click Verify."
echo "If verification fails at first, wait for DNS propagation and retry."
