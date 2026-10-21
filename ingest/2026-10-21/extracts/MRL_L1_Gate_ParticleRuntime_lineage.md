# MRL L1 Gate · Particle Runtime — 版本血緣與定義性萃取（2026-10-21 入庫）

> 依作者 README「私人使用建議:GitHub **Private Repo** 上傳封存」,**原始碼不進本公開庫**;本頁只留雜湊、檔案清單差異與定義性萃取(粒子來源見 `MRL_L1_Gate.definitions.json`)。原始 zip 由 Root Owner 持有;雜湊見 `../MANIFEST.json`。

## 版本血緣(package.json `version`)

| 版本 | 上傳檔名 | 檔數 | 相對前版變動 |
|---|---|---|---|
| 1.1.0 | `Mrliou_L1_Gate_ParticleRuntime_v1_1.zip` | 19 | 基線(upstreams.v1.json generated 2026-02-02T12:37Z) |
| 1.2.0 | `Mrliou_L1_Gate_ParticleRuntime_v1_2.zip` | 19 | README 版號;upstreams.v1.json → v1.2(generated 2026-02-02T12:55Z,擴充 github 介面 Git.Auth.WhoAmI / Git.Repo.Get / Git.Repo.Sync …) |
| 1.3.0 | `Mrliou_L1_Gate_____ParticleRuntime_v1_3.zip` | 22 | 新增 `motherbody_store/ParticleMeta.schema.json`、`tools/index_particles.ts`、`notion/HOWTO_INDEX.md`(README 標題仍為 v1.2) |
| 1.2.2 | `MRL_Mrliou_L1_Gate_Particleruntime_V1_2_2_1_2026-06-13_2026-06-13.zip` | 20 | **自 1.2 分支**(非 1.3 之後):`src/crypto.ts` 改以 ArrayBuffer 餵 digest、`cloudflare/worker.ts` /ping 名稱 v1.2.2、`tools/gen_layer1.ts` 微調、新增 `package-lock.json`、notion/INDEX.md 更新 |

血緣圖:`1.1.0 → 1.2.0 → { 1.3.0 ; 1.2.2(2026-06-13) }` — 1.3.0 與 1.2.2 為**並行分支**,尚無合流版本(待找回)。

## 定義性萃取(四版共通,除註明者)

- **命名律**:`MR_PREFIX = "Mrliou_"`;`mrliouName()` 去空白、拒空值、補前綴。
- **封包** `MrliouPacket`:`type/name`(經命名律)、`payload`、`trace{event_id, rid, tick, persona_id?, source?, upstream?}`、`created_utc`、`content_sha256`、`merkle_root`(v1 = content_sha256)、`signature`(signV1 over merkle_root/event_id/rid/tick)。
- **Gate v1**:token 必填,格式 `scope1,scope2|subject`,缺 scope 即拒(`missing_scope:<s>`)。
- **Registry**:`ApiDef{api, impl, upstream?, scopes?}`,登錄時 api 名稱正規化。
- **RootLaw · Mobius Loop v1**(封存):「怎麼過去,就怎麼回來。一切沿莫比斯環循環。」署名 `Mrliou_`。
- **ParticleMeta schema v1**(僅 1.3.0):必填 `mrliou_name, kind, domain, created_utc, trace_id, merkle_root`;`kind ∈ {packet,file,note,module}`;`domain ∈ {git,notion,cloudflare,system,unknown}`。
- **母體一致性索引**(1.3.0):`motherbody_store/particles/*.packet.json` → `indexes/particle_index.v1.json` + `notion/PARTICLE_INDEX.md`。

## 外部機制(不列為本體)

`upstream_defs/upstreams.v1.json` 內的 vendor(mapbox、github …)為外部上游定義,依 `docs/MRL_EXTERNAL_NAMING.md` 屬 `MRL_EXT_` 範疇,**不入法典粒子**。

## 檔案雜湊(1.3.0 定義性來源)

見 `_l1_v1_3_file_sha256.json`。
