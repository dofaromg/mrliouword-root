# Syncthing 檔案分析說明 v1.0

> 定位：本文件為 **ingest 外部材料分析**，非 canonical 定義。所有納入 MRL 的決策保留給 Root Owner。

## 1. 檔案概述

| 項目 | 內容 |
| --- | --- |
| 來源 | 使用者上傳 `syncthingmain.zip`，解壓後根目錄 `syncthing-main/` |
| 專案 | Syncthing — 持續性、去中心（P2P）檔案同步程式 |
| 版本 | v2.0（依 `relnotes/v2.0.md`） |
| 授權 | Mozilla Public License 2.0（MPLv2） |
| 語言／工具鏈 | Go 1.25（`go.mod`）；GUI 為前端資產；protobuf（`buf`）產生協定碼 |
| 規模 | 約 942 個檔案，約 400 個非測試 `.go` 原始碼檔 |
| 官方性質 | 上游開源專案（`github.com/syncthing/syncthing`），與 MRL 無隸屬關係 |

## 2. 目錄與架構分析

| 層 | 路徑 | 職責 |
| --- | --- | --- |
| 進入點 | `cmd/syncthing/` | 主程式；另含 `stdiscosrv`、`strelaysrv` 等基礎設施服務與 CLI |
| 協定 | `lib/protocol/` | Block Exchange Protocol（BEP）、裝置 ID（Luhn 校驗）、TLS 身分、加密資料夾 |
| 同步引擎 | `lib/model/` | folder 型態 sendrecv / sendonly / recvonly / recvenc、puller、index handler |
| 連線／穿透 | `lib/discover/`、`lib/relay/`、`lib/nat/`、`lib/upnp/`、`lib/stun/` | 裝置探索、中繼、NAT 穿透 |
| 設定／介面 | `lib/config/`、`lib/api/`、`gui/` | 設定模型、REST API、Web GUI |
| 儲存 | `internal/db/`（SQLite） | v2 起資料庫後端由 LevelDB 改為 SQLite |
| 協定定義 | `proto/bep`、`proto/discoproto` 等 | protobuf 契約來源 |

### 核心機制
- **BEP（Block Exchange Protocol）**：檔案切成區塊，裝置間交換區塊索引與資料；`lib/protocol/doc.go` 明載本套件即 BEP 實作。
- **裝置身分與安全**：每台裝置由 TLS 憑證衍生唯一 Device ID；連線經 TLS 加密；支援「加密資料夾」讓中繼／不受信任節點無法讀取內容。
- **去中心拓撲**：無中央伺服器保存資料；探索伺服器與中繼僅協助建立連線，不持有明文檔案。

### v2.0 重點變更（`relnotes/v2.0.md`）
- 資料庫 LevelDB → **SQLite**（首次啟動有遷移程序）。
- 結構化日誌、可分套件設定 log level、新增 WARNING 級別。
- 刪除項目不再永久保留，預設 15 個月後遺忘（可用 `--db-delete-retention-interval` 調整）。
- v2 裝置間**預設多連線**（1 條索引 metadata ＋ 2 條資料）。
- 命令列選項現代化：舊式單破折號長選項不再支援。

## 3. Syncthing 自身目標解讀（依 `GOALS.md`，重要性排序）

| 序 | 目標 | 解讀 |
| --- | --- | --- |
| 1 | 免於資料遺失 | 最高原則；不為效能或易用做出不安全取捨 |
| 2 | 抵禦攻擊者 | 資料不得被未授權方竊聽或竄改；匿名性目前非目標 |
| 3 | 易用 | 將複雜密碼學／數學抽象化，讓一般大眾可用 |
| 4 | 自動 | 變更自動偵測、衝突自動解決、連線自動維持，僅必要時提示 |
| 5 | 普遍可用 | 桌機、伺服器、樹莓派等常見電腦；非目標於烤麵包機等裝置 |
| 6 | 為個人 | 以賦能個人使用者為主；企業需求次於個人 |
| 7 | 其他 | 效能等值得追求，但不得凌駕上述目標 |

**取捨主軸**：安全（Safe）與安全性（Secure）優先於效能與易用性。

## 4. 在 MRL 脈絡下的行動目標

| # | 行動目標 | 說明 |
| --- | --- | --- |
| A1 | 定位為外部參考／證據 | Syncthing 歸入 `ingest/`，作為去中心同步的技術參照，**不升格為 canonical、不主張 MRL 擁有權**（對齊 `NAMING.md`／`SOVEREIGNTY.md`） |
| A2 | 可借鏡之機制 | BEP 區塊交換、TLS 裝置身分、加密資料夾、去中心探索／中繼模型，可對照 MRL `ingest/pipeline`（`logic_pipeline.py`、`pipeline_sync_localfs.json`）之本地檔案同步需求 |
| A3 | 與 DL580／後端對接評估 | 評估是否將「裝置身分＋加密同步」概念納入 DL580 定義執行層與 `mrliouhan.ai` 後端的資料流；僅記錄評估點，實作決策待核准 |
| A4 | 授權相容性追蹤 | MPLv2 為檔案級 copyleft；若未來考慮引用其程式碼或設計，需先確認與 MRL 授權策略相容 |
| A5 | 版本鏈存證 | 於 `ingest/` 保留此 v2.0 版本快照與本分析，供後續比對與追蹤 |

## 5. 邊界聲明

- 本文件僅為**分析與存證**，未改動 Syncthing 任何原始碼，亦未將其納入 MRL canonical 範圍。
- 「登錄／分析」不等於「採用」；是否借鏡、對接或引用，一律由 Root Owner 於 `main` 核准後生效。
- 外部品牌、網址與敘述僅保留於本 Evidence 文件，不進入 MRL 定義層。

---

分析對象：Syncthing v2.0（MPLv2）｜分析日期：2026-07-28｜狀態：ingest / 待 Root Owner 裁決
