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

執行測試：

```sh
python3 tests/test_mrl_language.py
```
