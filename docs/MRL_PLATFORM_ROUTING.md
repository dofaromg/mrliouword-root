# MRL 官方平台路由規格

## 1. Canonical Endpoints

```yaml
mrl_platform:
  root_repository: https://github.com/dofaromg/----2
  official_frontend: https://mrliouword.com
  official_backend: https://mrliouhan.ai
  definition_runtime_host: DL580
  origin_signature: MrLiouWord
```

## 2. 統一指向規則

所有 MRL 內部產品的新版本必須使用：

```text
Frontend Base URL = https://mrliouword.com
Backend Base URL  = https://mrliouhan.ai
```

建議環境變數：

```dotenv
MRL_OFFICIAL_FRONTEND_URL=https://mrliouword.com
MRL_API_BASE_URL=https://mrliouhan.ai
MRL_ROOT_REPOSITORY=https://github.com/dofaromg/----2
MRL_ORIGIN_SIGNATURE=MrLiouWord
MRL_DEFINITION_RUNTIME=DL580
```

產品端不得直接把第三方部署網址、供應商 API 或臨時 tunnel 當成 canonical URL。必要時透過 `mrliouhan.ai` 後端 adapter 轉接。

## 3. 官方請求路徑

```text
Client
  → mrliouword.com
  → mrliouhan.ai
  → MRL Gateway / Auth / API Router
  → MRL Service
  → DL580 Definition Runtime（定義、生成、驗證或本地模型需求）
```

## 4. 轉移回收清單

每一個既有產品或外部服務需建立以下紀錄：

```yaml
service_id: MRL_<SERVICE>
current_origin:
  provider: external
  url: ""
  repository: ""
  data_location: ""
target:
  backend: https://mrliouhan.ai
  frontend: https://mrliouword.com
  runtime: DL580
migration:
  config_exported: false
  secrets_recreated: false
  data_mirrored: false
  adapter_ready: false
  dns_ready: false
  validation_passed: false
  rollback_ready: false
```

## 5. DL580 發布契約

DL580 提供或驗證的能力必須具備：

- MRL canonical module ID
- 版本與 origin signature
- manifest 與 hash
- health / ready 狀態
- 輸入輸出 schema
- audit trace
- 可回滾版本

`mrliouhan.ai` 只發布已通過定義層驗證的能力；`mrliouword.com` 只呈現由官方後端提供的 canonical 產品介面。

## 6. 完成條件

一項產品只有在以下條件全部成立時，才算完成平台回收：

- [ ] 已登錄 MRL canonical 名稱
- [ ] 已建立 `mrliouhan.ai` 後端路由
- [ ] 已建立 `mrliouword.com` 前端入口
- [ ] 外部平台只保留 adapter / mirror 身分
- [ ] DL580 定義或驗證流程已接通
- [ ] secrets、資料與設定由 Root Owner 控制
- [ ] 有 health、trace、manifest 與 rollback proof
