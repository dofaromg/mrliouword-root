# MRL 營運規範（Operations）v0.1

涵蓋：正式信箱、uptime 監控與 status page、DL580 備援與災難復原。
搭配文件：[MRL_CLOUDFLARE_SETUP.md](MRL_CLOUDFLARE_SETUP.md)、[MRL_PLATFORM_ROUTING.md](MRL_PLATFORM_ROUTING.md)。

## 1. 正式聯絡信箱

### 1.1 目標信箱

| 信箱 | 用途 |
|------|------|
| `support@mrliouword.com` | 使用者支援（服務條款指定） |
| `privacy@mrliouword.com` | 隱私權請求（隱私政策指定） |
| `legal@mrliouword.com` | 法務聯絡 |
| `security@mrliouword.com` | 漏洞回報（SECURITY.md 指定） |

### 1.2 現況與設定步驟（Cloudflare Email Routing，收信）

`mrliouword.com` 已啟用 Cloudflare Email Routing（SPF 已含 `_spf.mx.cloudflare.net`）。
新增自訂位址：Dashboard → `mrliouword.com` → **Email → Email Routing → Custom addresses**
→ 依上表建立四個位址，目的地暫時指向 Root Owner 現用信箱。

### 1.3 已知限制與升級路徑

- Email Routing 是**只收不寄**：以 `support@` 名義回信需要寄件方案。
- 短期：Gmail「以其他地址寄件（Send mail as）」+ 第三方 SMTP。
- 正式：升級 Google Workspace（或同級服務），把 MX 換為該服務，
  屆時**同步更新 SPF/DKIM/DMARC**（現行 DMARC 為 `p=reject` 嚴格政策，換 MX 不同步會擋信）。

### 1.4 `mrliouhan.ai` 郵件防偽（必辦）

該網域目前無任何郵件記錄，任何人可冒名寄信。此網域不寄信，應宣告拒收：

```text
TXT  @          "v=spf1 -all"
TXT  _dmarc     "v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s"
TXT  *._domainkey  "v=DKIM1; p="
```

## 2. Uptime 監控與 Status Page

### 2.1 監控目標

| 端點 | 檢查 | 預期 |
|------|------|------|
| `https://mrliouword.com/` | HTTP GET | 200，< 3s |
| `https://mrliouhan.ai/health` | HTTP GET | 200 + JSON `status: ok` |

### 2.2 兩層方案

1. **外部監控（必備，5 分鐘可完成）**：使用外部服務（如 UptimeRobot 免費方案）
   對上表端點做 1–5 分鐘間隔檢查，告警送 `support@mrliouword.com`。
   外部視角能發現 Cloudflare 之外的整條鏈路問題。
2. **自營 status page（本倉庫提供）**：`ops/status-worker/` 是可直接部署的
   Cloudflare Worker——Cron 每 5 分鐘打端點、結果寫入 KV，
   對外提供 `/`（狀態頁）與 `/api/status`（JSON）。
   部署後綁定 `status.mrliouword.com`。部署步驟見該目錄 README。

### 2.3 事件處理原則

- 狀態頁誠實反映故障；重大事件（> 30 分鐘中斷）事後補簡短 postmortem。
- 告警去重：同一端點 15 分鐘內不重複告警。

## 3. DL580 備援與災難復原（DR）

### 3.1 風險陳述

DL580 是 MRL 定義執行層（Definition Runtime）的**單點**。
其失效影響：定義驗證、生成、本地模型能力停擺；
`mrliouhan.ai` 依賴的後端能力降級。

### 3.2 備份政策（3-2-1）

| 項目 | 副本 1（工作） | 副本 2（Git 異地） | 副本 3（獨立不可變） | 頻率／保留 |
|------|----------------|---------------------|------------------------|------------|
| 定義與 registry | DL580 | 本倉庫（GitHub） | 每日 `git bundle` 以**唯一物件鍵**（含日期/UUID）寫入 R2，並套 **Bucket Lock** 保留 | **每日**（或每次變更後）；保留 90 天 |
| 服務設定 | DL580（config-as-code） | 本倉庫（GitHub） | 同上（隨 bundle 一併匯出） | **每日**；保留 90 天 |
| 資料/模型產物 | DL580 | 加密快照 → R2 | 離線硬碟（每月輪替一次） | 每日；保留 90 天 |

- **R2 無原生物件版控**：覆寫同一鍵會直接蓋掉舊值。故副本 3 必須用**唯一物件鍵**（附時間戳/UUID）+ **Bucket Lock**（或等效保留控制）維持不可變，不能靠 R2 自動保留歷史。
- 副本 3 必須與 GitHub、Cloudflare 帳號**憑證隔離**（獨立金鑰或離線媒介）——
  帳號遭入侵或倉庫被刪時仍可還原。理想上副本 3 應在 GitHub 與 Cloudflare 兩個失效邊界之外。
- 復原演練：**每季一次，從副本 3 還原**重建最小可用環境並驗證內容完整性。

原則：**3** 份副本、**2** 種媒介、**1** 份異地。未經演練的備份視同不存在。

### 3.3 網路暴露收斂（必辦）

`mrliouhan.ai` 的公開 DNS 目前含一筆 `100.78.70.78`（CGNAT/Tailscale 內網段）A 記錄：

- 公網無法路由，等於死連結；
- 同時洩露內部網路拓撲。

處置：**刪除該 A 記錄**，DL580 對外一律經 **Cloudflare Tunnel**（`cloudflared`）
接入，公開 DNS 只留 Cloudflare 代理的記錄。

### 3.4 降級模式（graceful degradation）

DL580 離線時，`mrliouhan.ai` 的 Workers 層應：

1. `/health` 回報 `degraded` 並列出不可用能力；
2. 不依賴 DL580 的端點照常服務；
3. 依賴 DL580 的端點回 `503` + `Retry-After`，而非逾時。

### 3.5 復原目標（初版）

| 指標 | 目標 |
|------|------|
| RPO（可容忍資料損失） | ≤ 24 小時（每日快照） |
| RTO（可容忍停機） | ≤ 1 個工作天（重建最小環境） |

## 4. 待辦核對清單

- [ ] Email Routing 建立 support/privacy/legal/security 四個位址，並各寄一封測試信確認可收（`security@` 收信測試是安全政策生效前提）
- [ ] `mrliouhan.ai` 加上 SPF `-all` + DMARC reject + 空 DKIM
- [ ] 刪除 `mrliouhan.ai` 的 `100.78.70.78` A 記錄，改走 Cloudflare Tunnel
- [ ] 外部 uptime 監控上線（UptimeRobot 或同級）
- [ ] 部署 `ops/status-worker/` 並綁定 `status.mrliouword.com`
- [ ] 法律專業人士審閱 `docs/legal/` 兩份草案後正式發布
- [ ] 首次 DL580 復原演練排程
