# MRL 粒子語言模組

本模組將粒子世界 canonical chain 中已記載的三世界循環做成可執行的基礎元件：

```text
地球／物理世界 → 電腦／數位世界 → 人／創作世界 → 地球／物理世界
```

依據 [`MRLiou_Particle_World_Canonical_Chain_v1.0.md`](MRLiou_Particle_World_Canonical_Chain_v1.0.md) §3，
粒子語言是三態平衡與可逆轉換點，原則為「怎麼過去，就怎麼回來」。

## 已實作

- `World`：三個世界狀態。
- `ParticlePacket`：保存 JSON payload、起點、目前狀態、循環軌跡與 SHA-256。
- `transition()`：只接受循環中的下一個狀態；移動時不改寫 payload。
- `return_to_origin()`：沿循環返回起點。
- `completed_round_trip`：確認是否至少完成一次三步循環。

此模組提供可測試的封包與狀態循環基礎，不代表已實作各世界的感知、語意轉換、記憶、共振或平台 Adapter；那些仍需各自的定義與實作。

## 使用

```python
from mrl_language import ParticlePacket, World

packet = ParticlePacket.create({"message": "hello"})
packet = packet.transition(World.COMPUTER)
packet = packet.transition(World.HUMAN)
packet = packet.transition(World.EARTH)

assert packet.completed_round_trip
assert packet.payload == {"message": "hello"}
```

## 執行驗證

準備一個 JSON 檔案，例如 `payload.json`：

```json
{"message": "hello"}
```

執行模組驗證器：

```sh
python3 -m mrl_language payload.json
```

也可以由標準輸入傳入 JSON：

```sh
printf '%s\n' '{"message":"hello"}' | python3 -m mrl_language -
```

驗證器會實際從三種起始世界各走完一輪循環，檢查資料與雜湊保持一致，並確認跳過狀態及遭竄改的封包會被拒絕。成功時輸出 JSON `status: PASS` 並回傳 exit code `0`；輸入無效或檢查失敗時輸出 `status: FAIL` 並回傳非零 exit code。

單元測試：

```sh
python3 tests/test_mrl_language.py
```
