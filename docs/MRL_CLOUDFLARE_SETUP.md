# MRL Cloudflare 連線設定（Cloudflare Connection Setup）

本文件定義 MRL 官方網域在 Cloudflare 上的連線與 DNS 驗證流程，涵蓋：

- Cloudflare API Token 建立與保管
- OpenAI 網域驗證（`openai-domain-verification` TXT 記錄）
- 與本倉庫 `scripts/cloudflare/` 工具的搭配方式

適用網域（見 [MRL 官方平台路由](MRL_PLATFORM_ROUTING.md)）：

```text
mrliouword.com   # 官方前端
mrliouhan.ai     # 官方後端
```

## 1. 建立 Cloudflare API Token

1. 前往 <https://dash.cloudflare.com/profile/api-tokens> → **Create Token**。
2. 使用 **Edit zone DNS** 範本，權限至少包含：
   - `Zone.Zone : Read`
   - `Zone.DNS : Edit`
3. Zone Resources 限定為目標網域（最小權限原則）。
4. Token 只存放在環境變數或秘密管理系統，**不得**提交進本倉庫：

```dotenv
CLOUDFLARE_API_TOKEN=<your-token>
```

依照 [MRL 主權聲明](SOVEREIGNTY.md)，secrets 由 Root Owner 控制；任何 AI 或外部平台僅能透過被授權的環境變數使用，不得保存或外流。

## 2. OpenAI 網域驗證（TXT 記錄）

OpenAI 平台（platform.openai.com → Settings → Domain verification）會發給一組驗證值，格式如下：

```text
openai-domain-verification=dv-XXXXXXXXXXXXXXXXXXXX
```

驗證方式：在**發起驗證的那個網域**的根網域（zone apex）新增一筆 TXT 記錄：

| 欄位 | 值 |
|------|-----|
| Type | `TXT` |
| Name | `@`（即根網域，如 `mrliouword.com`） |
| Content | `openai-domain-verification=dv-...`（完整字串） |
| TTL | `300`（或 Auto） |
| Proxy | 不適用（TXT 記錄不經 proxy） |

### 使用腳本自動設定

```bash
export CLOUDFLARE_API_TOKEN=<token>
./scripts/cloudflare/setup_openai_domain_verification.sh mrliouword.com "openai-domain-verification=dv-..."
```

腳本行為：

1. 依網域查詢 zone id
2. 若已存在 `openai-domain-verification` TXT 記錄則更新，否則新建
3. 透過 `1.1.1.1` 查詢確認記錄可見

完成後回到 OpenAI 後台按 **Verify**。DNS 傳播通常在數分鐘內完成。

### 手動設定（Cloudflare Dashboard）

Dashboard → 選擇網域 → **DNS** → **Add record** → 依上表填入即可。

## 3. 驗證與稽核

```bash
# 確認 TXT 記錄已生效
dig +short TXT mrliouword.com @1.1.1.1 | grep openai-domain-verification
```

依 MRL 工程規範，完成後應在遷移紀錄中將對應項目標記：

```yaml
migration:
  dns_ready: true
```

## 4. 邊界與原則

- 驗證 token（`dv-...`）本身不是機密（它公開發布在 DNS 中），但 Cloudflare API Token 是機密。
- 每個網域的驗證值由 OpenAI 針對該網域發放；不可跨網域重用。
- 本倉庫僅保存流程與工具，不保存任何 API Token 或帳號憑證。
