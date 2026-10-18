# MRL 系統狀態核對（2026-10-18）

本報告區分可由倉庫或 GitHub 證據確認的事項、尚未能驗證的線上狀態，以及明確待辦。文件中的設定與部署說明不視為實際上線證據。

## 已驗證

| 項目 | 證據與狀態 |
|---|---|
| Canonical GitHub repository | `dofaromg/mrliouword-root` 的 GitHub Actions CI run 於 2026-10-11 checkout `main` 成功（commit `60fbd85ab8c3b5b97fd0f126cfd006f181c570d6`）。這確認新名稱可用；不代表舊 URL redirect 已核實。 |
| 最近 main CI | [CI run 44](https://github.com/dofaromg/mrliouword-root/actions/runs/38124908153) 於 2026-10-11 成功。當時工作只驗證 ShellCheck、JavaScript 語法及 JSON；未執行 Python 測試。 |
| Local-FS pipeline tests | 2026-10-18 在本地執行 `python3 tests/test_mrl_pipeline.py`，4 項測試通過。 |

## 未驗證（缺少可取得的線上證據）

| 項目 | 核對結果 |
|---|---|
| 舊 repository URL redirect | 尚未獨立確認 `dofaromg/----2` 是否轉址至 canonical repository。 |
| Branch protection | 本次可用的 GitHub 工具未提供分支保護設定；不能據此確認 `main` 有保護規則。 |
| 網域、DNS、Worker 部署與健康狀態 | 本次環境無法解析目標網域，故未能探測 `mrliouword.com`、`mrliouhan.ai/health`、status page 或 Worker。這是本次核對環境的限制，不表示服務已故障。 |
| 正式信箱 | 營運文件描述 Email Routing 設定，但本次未能核對 DNS、路由配置或實際收信測試。 |
| 備份與 DL580 | 本倉庫記載備份政策、RPO/RTO 目標及 DL580 單點風險；未取得備份紀錄、復原演練結果或主機健康證據。 |
| C# Pro API | 倉庫無 C# 專案或此 API 的實作。提供的片段在 `Dictionary` 處截斷，且沒有供應商文件、API URL、認證規格、完整回應 schema、執行環境或使用情境，無法安全決定介接方式。 |

## 待處理

1. 由有權限者核對舊 URL redirect、`main` branch protection，以及 GitHub Actions 最新成功的 CI run。
2. 從可解析外部 DNS 的環境核對兩個官方網域、`status.mrliouword.com`、Worker 路由及 `/health` 回應；完成郵件 DNS 與四個正式信箱的實際收信測試。
3. 提供備份成功紀錄、R2/離線副本保留設定與 DL580 復原演練證據；確認 DL580 與 `mrliouhan.ai` 的介接健康狀態。
4. C# API 整合前，提供完整程式碼、官方 API 文件、目標部署環境和預期使用流程；API key 只透過服務端秘密管理提供，不要貼在對話或提交到版本庫。

## 倉庫缺口處理

- `MRL_Pipeline_MANIFEST.json`、現行 pipeline 程式標頭與入口文件已改用 canonical repository 名稱；`ingest/` 中的舊名稱作為歷史來源保留。
- `registry/MRL_REPOSITORY_MAP.json` 將狀態更新為 `renamed_redirect_unverified`：新名稱由 CI checkout 證實，舊名稱 redirect 仍待核對。
- CI 現已執行既有標準函式庫測試 `python3 tests/test_mrl_pipeline.py`。
- Status Worker 設定仍含 `REPLACE_WITH_KV_NAMESPACE_ID` 範例值；其部署及綁定狀態須線上確認。
