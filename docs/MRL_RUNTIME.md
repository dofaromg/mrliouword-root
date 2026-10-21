# MRL 對話執行模組

此 MVP 以 Claude Messages API 作為可替換模型層，使用 MRL 粒子語言保存使用者輸入與模型回覆的三世界軌跡：

```text
使用者訊息：人 → 地球 → 電腦 → Claude API
模型回覆：Claude API／電腦 → 人
```

每輪只有在模型成功回覆後才寫入本次程序的對話上下文。上下文只保存在記憶體，預設最多保留 40 則訊息；程式結束即清除。此版本不啟用工具呼叫、不保存磁碟會話，也不宣稱已接上 MRL 其他平台或 runtime。

## 設定與執行

需要 Python 3.10 或更新版本。模組僅使用 Python 標準函式庫，不需安裝額外套件。

在 shell 設定 Anthropic API key（不要貼入程式碼、命令歷史或提交檔案）：

```sh
export ANTHROPIC_API_KEY='由操作者安全設定的 API key'
```

啟動互動對話：

```sh
python3 -m mrl_runtime
```

可用環境變數 `MRL_CLAUDE_MODEL` 或 `--model` 指定帳戶可用的模型；也可用 `--system` 提供此對話的 system 指令，或用 `--max-tokens` 設定單次回覆上限。輸入 `/exit` 或 `/quit` 結束。

## 驗證

離線單元測試會使用假模型與攔截的 HTTP 回應，不會呼叫 Anthropic 或消耗 API 額度：

```sh
python3 tests/test_mrl_runtime.py
```

只有配置有效 API key 並啟動 CLI，才會測到實際 Claude 網路呼叫；離線測試 PASS 不代表外部服務已連線。
