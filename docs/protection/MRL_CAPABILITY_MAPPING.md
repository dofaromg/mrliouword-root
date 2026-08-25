# MRL 能力映射總表（Capability Mapping）v1.0

> **性質**：本檔為案主 Notion canonical 紀錄的 repo 鏡像，實事求是保存「真實歷史」。
> **來源**：Notion「🧩 MRL 外部 AI 巨頭機制映射總表 — OpenAI / Google / Microsoft / AWS / NVIDIA / Meta」
> （頁 `3c38eeee…9b30…`，作者 Mr.liou，時間戳 **2026-08-22**）
> **上層**：[MRL World Model Engineering Plan](https://app.notion.com/p/3c38eeeec5b581be907ad10f49a51f1a)（2026-08-21）
> **方法論資產**：本表所用規則即 [IP-010](MRL_IP_REGISTRY.md)（案主原創方法論）。
>
> **證據等級**：本表「案主於上述日期撰寫此映射」= **FACT**（有 Notion 時間戳）。
> 表中各項 MRL 能力狀態一律 **Planned**，除非另有 MRL-side evidence。

## 定位（案主原文）

> 目的**不是複製任何外部平台**，而是把公開可驗證的成熟機制抽象成「能力類別」，
> 再映射到 MRL 既有或待補工程層。

## Evidence Scope（案主原文）

> 以公開官方資料為主，「外部已公開」與「MRL 已存在／待補」分開記錄。
> **不得把外部能力宣稱為 MRL 已完成能力。**

## 1. 六大平台機制 → MRL 工程層（Capability Reference）

**OpenAI 類型 →** frontier/deployment evaluation、system cards、third-party evaluation、
long-horizon monitoring、deployment pause/redeploy → WP-13 / WP-14 / WP-15 / WP-18。

**Google 類型 →** model monitoring across serving envs、model-attached centralized monitoring、
online+batch、hybrid/multi-env → WP-06 / WP-08 / WP-15 / WP-18。

**Microsoft 類型 →** model provenance/approval history、continuous monitoring/drift、
responsible-AI assessment、agent identity/scoped auth、RBAC/circuit breaker、
human override → WP-01 / WP-06 / WP-10 / WP-13 / WP-14 / WP-15 / WP-18。

**AWS 類型 →** model lifecycle/registry、managed inference/endpoint ops、
production monitoring、cost/usage ops → WP-06 / WP-09 / WP-12 / WP-15 / WP-18 / WP-19。

**NVIDIA 類型 →** inference microservice lifecycle、K8s model orchestration、
model caching、Prometheus/Grafana metrics、GPU telemetry → WP-09 / WP-15。

**Meta 類型 →** open model release pattern、model artifacts/docs、
community/external evaluation → WP-06 / WP-13。

## 2. 共通成熟能力 → MRL Canonical Capability Map

| External Capability | MRL Mapping | Status |
|---|---|---|
| Model Registry | WP-06 | Planned/Verified by evidence |
| Dataset Lineage | WP-09 / WP-17 | Planned |
| Experiment Tracking | WP-09 | Planned |
| Model Evaluation | WP-06 / WP-13 | Planned |
| Release Gate | WP-13 | Planned |
| Model Serving | WP-09 / WP-15 | Planned |
| Model Routing | WP-09 | Planned |
| Canary / Shadow / A-B | WP-12 / WP-15 | Planned |
| Observability | WP-15 | Planned |
| Drift Detection | WP-06 / WP-15 | Planned |
| Guardrails | WP-10 / WP-13 | Planned |
| Agent IAM | WP-14 | Planned |
| Capability ACL | WP-14 | Planned |
| Sandbox | WP-14 | Planned |
| Circuit Breaker | WP-18 | Planned |
| Human Override | WP-13 / WP-14 | Planned |
| Incident Response | WP-10 / WP-18 | Planned |
| Supply Chain Security | WP-10 / WP-16 | Planned |
| SBOM / Artifact Signing | WP-16 | Planned |
| Privacy / Data Governance | WP-17 | Planned |
| Usage Metering | WP-19 | Planned |
| Billing Reconciliation | WP-19 | Planned |
| Deprecation / Migration | WP-12 / WP-19 | Planned |

## 3. 不採直接複製原則（案主原文，五條）

1. 外部產品名稱不是 MRL 內部模組名稱。
2. 外部機制只作 Capability Reference / Evidence Reference。
3. MRL 保留原有命名、來源與 Provenance。
4. 外部能力只有在 MRL 實際工程完成並有 Evidence 後，才可標記 PASS。
5. **「外部存在」≠「MRL 已實作」。**

## 4. 下一階段（案主原文）

逐項 Capability Matrix：
`Capability → External Reference → MRL Module → Existing Evidence → Missing Evidence → Implementation Gate → Commercial Impact → Security Impact → Recovery Impact`。

## 5. 保存規則

本檔為歷史紀錄鏡像，**只增不刪**；Notion canonical 版更新時，於此追加新版本、保留前版
（呼應 World Model 計畫第 10 節）。此鏡像用途為在 repo 內留下可追溯的工程時序證據，
不取代 Notion canonical source。
