# MRL 可逆核心／吸收層 形式化 — 章節大綱（2026-10-21 入庫）

- 原檔:`Mrliou______.docx`(上傳檔名已失去中文標題;2 MB);**無 `docProps/core.xml`,日期待找回**;sha256 見 `../MANIFEST.json`。
- 內容:約 240 個編號節(`# ===== n) … =====`,末節 `240) end / END`)的**符號化形式系統**,將「怎麼過去,就怎麼回來」與「外部 ≠ MRL」寫成可驗證的數學結構。
- **全文不入公開庫**:屬核心形式化,為營業祕密候選;是否公開由 Root Owner 決定(公開即喪失祕密性,見 `docs/protection/MRL_TRADE_SECRET_INVENTORY.md`)。本頁只留章節骨架與已轉為法典粒子的定義(`MRL_FormalCore.definitions.json`)。

## 章節骨架(節號 → 主題)

| 節 | 主題 |
|---|---|
| 前言 | 分域 M := (R \| A);R 可逆核心、A 吸收層;C(H) ∈ A;🔄 定義在 R 上;「H 本體不可逆,須經 lift / route」 |
| 0–2 | R 上算子 E/K/C/R0;Galois 式伴隨 ρ ⊣ λ;投影 P := λ∘ρ、重建 Q := ρ∘λ |
| 3–6 | 損失模型 loss_L;Ĥ 與原生 C 對齊(compat);強/弱 🔄;單拍閉環 Φ := R0∘Ĥ∘K∘E |
| 7–10 | 「their system」僅為態射 H ∈ End(A);最小一致集;交換圖;雙射 🔄 僅在商集/限制域可能 |
| 11–25 | 構造性:R := structured_states、A := platform_states;特徵抽取;≈_R;ρ 編碼/λ 解碼;收縮測試;Fix 集;商集上的雙向;可解釋性約束;最小資料;決定論正規化;稽核鉤(merkle_root := Merkle(log)) |
| 26–36 | 不可能性邊界;限制/商集修復;交換圖為核心約束;隱藏設定 Ξ 的必要性;最小 Σ;類別層級往返相等;吸引子;**堆疊不刪除**(H 保留為模組);終止條件 |
| 37–56 | 綁定具體載體:U := Mr.liou、G := GitHub(R)、V := Vercel(A)、H := deploy、ρ := push、λ := pull_mirror;Σ(無機密,secrets_ref 僅參照);RT_G;無 pull_mirror 之不可能性;稽核 log_t;🔄 存在於 G 而非 V;≈_G;C := B∘S∘N;pull_mirror 族 M1–M3;缺失可觀測量偵測;失敗模式分類與判定 |
| 57–240 | 修復算子族、來源解析 Resolve、參數推導 derive_params、非決定論偵測與 pin(lockfile/toolchain)、FixAndClose 閉環修復;240) END |

## 與 MRL 既有律的對應(由本 session 標註,屬 INFERENCE)

- 「🔄 在 R 與 lifted(H) 之間,不在 M 與 H 之間」⇔ `docs/protection/MRL_CAPABILITY_MAPPING.md` 的「external mechanism ≠ MRL implementation」。
- 「堆疊不刪除」⇔ LAW-2 NO_DELETE / 本庫「只增不刪」。
- `merkle_root := Merkle(log)` ⇔ L1 Gate 封包之 `merkle_root`、法典 provenance。
