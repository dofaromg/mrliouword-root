# MRL 安全基線（Security Baseline）v1.0 — WP-10

> 落實 [MRL World Model Engineering Plan](https://app.notion.com/p/3c38eeeec5b581be907ad10f49a51f1a)
> 之 **WP-10 Security / Safety / Supply Chain**。搭配 [MRL_OPERATIONS](../MRL_OPERATIONS.md)、
> [MRL_CLOUDFLARE_SETUP](../MRL_CLOUDFLARE_SETUP.md)、[SECURITY.md](../../SECURITY.md)。

## 1. 憑證與密鑰管理（IAM / Secret Management）

**目標終態**:一個正在運行的服務 = 一顆最小權限 token(有到期日、有命名、登錄在案)。

規則:
1. **禁止明文外流**:token / API key 不得出現在對話、程式碼、公開網頁或 commit。
2. **集中保管**:secret 存 Cloudflare Secrets Store,不散落於各 worker 環境變數明文。
3. **最小權限**:每顆 token 只給該服務所需的權限與資源範圍,不用「所有帳戶 / 無到期日」。
4. **輪替優於刪除**:正當且在用的 token 用 **Roll(換值)** 保留身分;不明或孤兒 token 才 **Delete**。
5. **登錄**:每顆 token 記於憑證登錄表(用途 / 範圍 / 到期 / 對應服務 / 狀態)。

### 1.1 已知外洩事件（待處理）

| 事件 ID | 憑證種類 | 暴露來源 | 動作 | 狀態 |
|---------|----------|----------|------|------|
| EXP-001 | CF API token（`cfut_` 前綴） | 公開證據頁明文 | Dashboard Roll | **待輪替** |
| EXP-002 | bridge key（弱密碼字串，值不在此重述） | 同上 | 換強隨機值 | **待輪替** |
| EXP-003 | MRL app token（`mrl_admin_` 前綴） | 同上 | app 端重簽 | **待輪替** |
| EXP-004 | MRL app token（`mrl_owner_` 前綴） | 同上 | app 端重簽 | **待輪替** |
| EXP-005 | 帳號內過量 token（~22 顆，多為全帳號／無到期） | 歷史累積 | 依「還在用？權限過大？」逐顆 Roll/Delete | **清理中** |

> 本表**不重述任何完整憑證值**（避免二次外洩）；完整值僅存在於歷史外洩來源，輪替後即失效。

> 提醒:公開頁的 secret 一旦輪替,頁內舊值即成死值——可在**不刪除該紀錄**的前提下解除暴露。

## 2. Agent 自主性與權限（對應 WP-14）

- Agent Identity → Capability → Tool Permission → Sandbox → Execution → **Audit**。
- 對外服務(如 chat worker)必須有:驗證閘門、rate limiting、單次請求上限、濫用偵測。
- 未經授權的自動外送(如把資料 PUT 到第三方)須有明確 opt-in,並留 audit trace。

## 3. 供應鏈安全（Supply Chain）

- Source → Dependency → Build → Artifact → **Signature** → Registry → Deployment。
- 依賴掃描、SBOM、artifact 簽章、可重現建置(reproducible build)。
- 本 repo 已有 GitGuardian(secret 掃描)+ CI lint;後續加依賴掃描。

## 4. Guardrails / 事件回應（對應 WP-13）

- 對外 LLM 產出需基本 input/output 防護 + 使用政策(避免以品牌名產出有害內容)。
- 事件回應流程(依計畫第 6 節):
  `Detect → Classify → Isolate → Preserve Evidence → Failover/Rollback → Restore → Verify → Resume → Backfill`。
- 漏洞回報管道見 [SECURITY.md](../../SECURITY.md)(`security@mrliouword.com`,啟用後生效)。

## 5. 可靠性 / 災難復原（對應 WP-18，詳見 MRL_OPERATIONS）

- 3-2-1 備份、憑證隔離的不可變第三副本、季度復原演練、RPO ≤ 24h / RTO ≤ 1 工作天。
- DL580 單點:降級模式 + Cloudflare Tunnel 收斂內部服務(勿在公開 DNS 暴露內網 IP)。

## 6. 網路暴露收斂（即辦清單）

- [ ] 輪替第 1.1 節所有外洩憑證
- [ ] 帳號 token 收斂至「一服務一 token、最小權限、有到期」
- [ ] 對外 chat worker 加驗證閘門 + rate limiting;關閉不必要的 `workers.dev` 公開路由
- [ ] `mrliouhan.ai` 刪除內網 A 記錄 + 補 SPF/DMARC/DKIM(見 MRL_OPERATIONS)
- [ ] 全帳號啟用硬體金鑰 2FA(GitHub / Cloudflare)
