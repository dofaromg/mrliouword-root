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

if [[ "$TOKEN_VALUE" != openai-domain-verification=dv-* ]]; then
  echo "ERROR: verification token must look like: openai-domain-verification=dv-..." >&2
  exit 1
fi

cf() {
  curl -sS -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
       -H "Content-Type: application/json" "$@"
}

echo "==> Looking up zone for $DOMAIN ..."
ZONE_ID=$(cf "$API/zones?name=$DOMAIN&status=active" | python3 -c '
import json,sys
d=json.load(sys.stdin)
r=d.get("result") or []
print(r[0]["id"] if r else "")
')

if [[ -z "$ZONE_ID" ]]; then
  echo "ERROR: no active Cloudflare zone found for $DOMAIN with this token." >&2
  echo "Check that the domain is on this Cloudflare account and the token can read the zone." >&2
  exit 1
fi
echo "    zone id: $ZONE_ID"

echo "==> Checking for an existing openai-domain-verification TXT record ..."
EXISTING_ID=$(cf "$API/zones/$ZONE_ID/dns_records?type=TXT&name=$DOMAIN" | python3 -c '
import json,sys
d=json.load(sys.stdin)
for r in d.get("result") or []:
    if "openai-domain-verification=" in r.get("content",""):
        print(r["id"]); break
')

PAYLOAD=$(python3 -c "
import json
print(json.dumps({'type':'TXT','name':'$DOMAIN','content':'$TOKEN_VALUE','ttl':300}))
")

if [[ -n "$EXISTING_ID" ]]; then
  echo "==> Updating existing record $EXISTING_ID ..."
  RESP=$(cf -X PUT "$API/zones/$ZONE_ID/dns_records/$EXISTING_ID" --data "$PAYLOAD")
else
  echo "==> Creating TXT record on $DOMAIN ..."
  RESP=$(cf -X POST "$API/zones/$ZONE_ID/dns_records" --data "$PAYLOAD")
fi

echo "$RESP" | python3 -c '
import json,sys
d=json.load(sys.stdin)
if d.get("success"):
    r=d["result"]
    print(f"    OK: {r[\"type\"]} {r[\"name\"]} -> {r[\"content\"]} (ttl {r[\"ttl\"]})")
else:
    print("    FAILED:", json.dumps(d.get("errors"), ensure_ascii=False))
    sys.exit(1)
'

echo "==> Verifying via DNS (may take a minute to propagate) ..."
if command -v dig >/dev/null 2>&1; then
  dig +short TXT "$DOMAIN" @1.1.1.1 | grep -F "openai-domain-verification" || \
    echo "    Not visible yet — wait for propagation, then click Verify in the OpenAI dashboard."
else
  echo "    'dig' not installed; check manually: dig +short TXT $DOMAIN @1.1.1.1"
fi

echo "Done. Return to https://platform.openai.com/settings (Domain verification) and click Verify."
