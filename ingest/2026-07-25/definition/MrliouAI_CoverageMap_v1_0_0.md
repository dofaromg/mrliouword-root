# MrliouAI 覆蓋對照表 v1.0.0

## Requested vs Generated

| 使用者要求 | 可驗證產物 | 狀態 |
| --- | --- | --- |
| 去重 | 唯一 URL Registry、去重報告、原始 occurrences | PASS |
| 蒸餾 | 8 域 Capability Registry、25 區 Source Map | PASS |
| 重構 MrliouAI 核心 | 核心規格、狀態機、政策、契約、可執行 Runtime | PASS |
| 不讓外部名稱升格 | Authority Policy、Provider-neutral Ports、Evidence 隔離 | PASS |
| 非空殼 | Runtime 有狀態變更、冪等、退款不變量、事件驗證入口 | PASS |
| 可驗證 | Node 測試、PowerShell 驗證、Manifest、SHA-256 | PASS |
| 來源可追溯 | 原始 `llms.txt`、來源 SHA、行號與 URL occurrences | PASS |

## 來源區覆蓋

| Canonical Domain | 來源區 | 處理方式 |
| --- | --- | --- |
| D01 Transaction | Payment Methods、Payments | 吸收為付款／退款／爭議能力 |
| D02 Recurring Revenue | Billing、Invoicing | 吸收為合約／用量／帳單／權益能力 |
| D03 Platform Money Movement | Connect | 受控平台資金移動能力 |
| D04 Billing Operations | Tax、Revenue Recognition、Sigma | 吸收為稅務／會計／報表能力 |
| D05 Risk and Identity | Identity、Radar | 受控身分與風險決策能力 |
| D06 Financial Products | Issuing、Capital、Crypto、Climate、Atlas、Financial Connections、Treasury | 法規與資格閘門擴充域 |
| D07 Channel Experience | Checkout、Link、Elements、Payment Links、Terminal | 只進入通路／Adapter 層 |
| D08 Operations and Governance | Docs、Architecture and Dashboard、Optional | 吸收為安全、版本、事件與營運規則 |

來源 25/25 區已映射；解析連結 472/472 次已追蹤；唯一 URL 458/458 筆已保留。Coverage = 100%。

## 語意處理判準

- **吸收**：可跨供應商成立的商務實體、狀態、不變量與治理規則。
- **映射**：供應商特有的 API、產品、帳戶與 UI 只能透過 Adapter 對接。
- **閘門**：受地區、法規、資格或風險限制的金融能力預設停用。
- **隔離**：來源品牌、網址、文件敘述只留在 Evidence / Provenance。

## 未遺失但未實作的範圍

來源中的所有唯一 URL 均已登錄，但「登錄」不等於「每一項外部產品已實作」。本版 Runtime 實作的是共通交易核心；訂閱、平台分潤、稅務、身分與受監管金融產品已完成模型定位和介面邊界，需在後續 Wave 逐域實作與驗證。
