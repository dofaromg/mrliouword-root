// MRL 定價頁(mrliouword.com/pricing)
// 目錄資料來源:Stripe 帳戶 Mrliouword, LLC 既有的 8 條 live Payment Link(2026-10-22 查核)+ MRL APIWorks 方案。
// 紀律:只列真的能付款的連結與真的存在的方案;沒有付款連結的商品不在這裡編造按鈕。
// 商品文案逐字取自 Stripe 商品描述(案主自寫),屬 CLAIM:設定 ≠ 交付,見 docs/business/MRL_COMMERCIAL_LEDGER.md §9.6。

export const PRICING_CATALOG = {
  mrl_asset: true,
  mrl_namespace: "MRL",
  origin_signature: "MrLiouWord",
  merchant: "Mrliouword, LLC",
  processor: "stripe",
  verified_at: "2026-10-22",
  sections: [
    {
      id: "plans",
      title: "MRL AI 方案",
      subtitle: "月費訂閱,隨時可取消。付款由 Stripe 處理,收款方為 Mrliouword, LLC。",
      items: [
        {
          id: "pro", name: "MRL AI Pro", price: 49900, currency: "twd", interval: "month", featured: true,
          description: "適合專業用戶與開發者",
          features: ["無限次 AI 對話", "所有 Claude 模型", "影片生成器(每月 50 次)", "技能創作者(無限制)", "優先回應速度"],
          cta: "訂閱 Pro", url: "https://buy.stripe.com/aFa00i9rBgDMbtJe3kb7y03",
          stripe: { payment_link: "plink_1TsLQLCpDvQ01veflZHUOXxb", price: "price_1TWs0BCpDvQ01vefGDdm8GnN", product: "prod_UVtnEhYrLAbayG" },
        },
        {
          id: "enterprise", name: "MRL AI Enterprise", price: 199900, currency: "twd", interval: "month",
          description: "適合團隊與企業",
          features: ["Pro 全部功能", "最多 20 個成員帳號", "影片生成器(無限制)", "API 存取", "自訂系統提示詞", "使用量分析", "SLA 99.9%(依合約議定;SLA 文件尚為草案)"],
          cta: "訂閱 Enterprise", url: "https://buy.stripe.com/eVqaEWdHR0EO2Xd8J0b7y04",
          alt_urls: ["https://buy.stripe.com/fZu14m9rB3R0cxN7EWb7y02"],
          stripe: { payment_link: "plink_1TsLQQCpDvQ01vefid1J4ZIp", price: "price_1TWs0PCpDvQ01vefYvJZpqxQ", product: "prod_UVtngTX51uM9ag", alt_payment_links: ["plink_1TY1OzCpDvQ01vef830GbIUh"] },
        },
        {
          id: "basic", name: "MRL AI", price: 29900, currency: "twd", interval: "month",
          description: "MRL AI 月費訂閱(早期方案)",
          features: ["MRL 母體 AI 助手存取", "月費計價,隨時取消"],
          cta: "訂閱 MRL AI", url: "https://buy.stripe.com/7sYaEWgU31IS55lf7ob7y06",
          stripe: { payment_link: "plink_1TsLQcCpDvQ01veflQDL28xv", price: "price_1TGxGaCpDvQ01vef8FU00LPO", product: "prod_UFSAkex5opoBju" },
        },
      ],
    },
    {
      id: "credits",
      title: "AI 點數包",
      subtitle: "一次性購買,永不過期,可用於影片生成、技能創作等進階功能。",
      items: [
        {
          id: "credits-100", name: "100 點數包", price: 9900, currency: "twd", interval: null,
          description: "購買 100 點 AI 使用點數,永不過期",
          features: ["100 點", "永不過期"],
          cta: "購買 100 點", url: "https://buy.stripe.com/aFa14mfPZdrAapF8J0b7y05",
          alt_urls: ["https://buy.stripe.com/cNi28qcDN9bk8hxgbsb7y00"],
          stripe: { payment_link: "plink_1TsLQWCpDvQ01vefgjhFDVc8", price: "price_1TWs0dCpDvQ01vef9mp6nzLg", product: "prod_UVtoX1qoYuk4jg", alt_payment_links: ["plink_1TY1OuCpDvQ01vef8pi0g2MB"] },
        },
        {
          id: "credits-500", name: "500 點數包", price: 39900, currency: "twd", interval: null, featured: true,
          description: "購買 500 點 AI 使用點數,享 8 折優惠,永不過期",
          features: ["500 點", "8 折", "永不過期"],
          cta: "購買 500 點", url: "https://buy.stripe.com/7sY6oG8nxfzI0P52kCb7y01",
          stripe: { payment_link: "plink_1TY1OxCpDvQ01vefHmDpjZqw", price: "price_1TWs0qCpDvQ01vefuvY01HrO", product: "prod_UVtoWG1JNX34Cw" },
        },
        {
          id: "credits-1000", name: "1,000 點數包", price: 69900, currency: "twd", interval: null,
          description: "購買 1000 點 AI 使用點數,7 折優惠,永不過期",
          features: ["1,000 點", "7 折", "永不過期"],
          cta: "購買 1,000 點", url: "https://buy.stripe.com/5kQ14meLVfzI55lcZgb7y07",
          stripe: { payment_link: "plink_1TsLQiCpDvQ01vefMmy9zS1P", price: "price_1TsJ3uCpDvQ01vef9N7ni4WE", product: "prod_Us3AvV0mgiwz6E" },
        },
      ],
    },
    {
      id: "apiworks",
      title: "MRL APIWorks — API 建構服務",
      subtitle: "MrLiouWord 旗下 API 建構事業體:客製 API、代理閘道、OAuth 全託管、DL580 私有部署。美金計價。",
      items: [
        {
          id: "apiworks-dl580", name: "DL580 主權自架", price: null, currency: "usd", interval: null, price_label: "一次性建構費",
          description: "跑在你自己的 DL580,資料完全不外流",
          features: ["無限次呼叫(受硬體限制)", "本地憑證保管", "自訂路由規則", "一次性建構費,無月費"],
          cta: "洽詢建構", url: "https://mrl-apiworks.z814241.workers.dev/#contact",
        },
        {
          id: "apiworks-pro", name: "APIWorks Pro", price: 2900, currency: "usd", interval: "month", price_label: "起", featured: true,
          description: "託管 Proxy + 主流連接器,開箱即用",
          features: ["50 個連接器", "10 萬次 / 月呼叫", "OAuth 全託管", "Email 技術支援"],
          cta: "選擇 Pro", url: "https://mrl-apiworks.z814241.workers.dev/#pricing",
        },
        {
          id: "apiworks-private", name: "私有雲", price: null, currency: "usd", interval: null, price_label: "洽談",
          description: "私有部署、SLA、自訂連接器與稽核",
          features: ["不限連接器", "私有 VPC / 地端部署", "稽核與監控儀表板", "專屬工程支援"],
          cta: "聯絡我們", url: "https://mrl-apiworks.z814241.workers.dev/#contact",
        },
      ],
    },
  ],
  links: {
    home: "https://mrliouword.com",
    apiworks: "https://mrl-apiworks.z814241.workers.dev",
    terms: "https://github.com/dofaromg/mrliouword-root/blob/main/docs/legal/TERMS_OF_SERVICE.md",
    privacy: "https://github.com/dofaromg/mrliouword-root/blob/main/docs/legal/PRIVACY_POLICY.md",
    sla: "https://github.com/dofaromg/mrliouword-root/blob/main/docs/business/MRL_SLA.md",
    contact: "legal@mrliouword.com",
  },
};

// 所有可付款連結(含舊連結),供測試與帳本對照。
export function paymentLinks(catalog = PRICING_CATALOG) {
  const out = [];
  for (const s of catalog.sections) for (const it of s.items) {
    if (it.url && it.url.startsWith("https://buy.stripe.com/")) out.push(it.url);
    for (const u of it.alt_urls || []) out.push(u);
  }
  return out;
}

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function money(item) {
  if (item.price == null) return `<span class="amt">${esc(item.price_label || "洽詢")}</span>`;
  const n = (item.price / 100).toLocaleString("en-US", { maximumFractionDigits: 0 });
  const cur = item.currency === "usd" ? "US$" : "NT$";
  const per = item.interval === "month" ? " <span class=\"per\">/ 月</span>" : item.interval === "year" ? " <span class=\"per\">/ 年</span>" : "";
  const tail = item.price_label ? ` <span class="per">${esc(item.price_label)}</span>` : "";
  return `<span class="cur">${cur}</span><span class="amt">${n}</span>${per}${tail}`;
}

function card(item) {
  const feats = (item.features || []).map((f) => `<li>${esc(f)}</li>`).join("");
  const alt = (item.alt_urls || []).length
    ? `<p class="alt">其他有效付款連結:${item.alt_urls.map((u, i) => `<a href="${esc(u)}" rel="noopener">連結 ${i + 2}</a>`).join("、")}</p>` : "";
  const ext = item.url.startsWith("https://buy.stripe.com/") ? ` <span class="stripe">Stripe 付款</span>` : "";
  return `<article class="card${item.featured ? " featured" : ""}" id="${esc(item.id)}">
  ${item.featured ? '<div class="tag">最多人選</div>' : ""}
  <h3>${esc(item.name)}</h3>
  <p class="desc">${esc(item.description || "")}</p>
  <p class="price">${money(item)}</p>
  <ul class="feats">${feats}</ul>
  <a class="cta" href="${esc(item.url)}" rel="noopener">${esc(item.cta)}</a>${ext}
  ${alt}
</article>`;
}

export function pricingHtml(catalog = PRICING_CATALOG) {
  const sections = catalog.sections.map((s) => `<section class="sec" id="${esc(s.id)}">
  <header><h2>${esc(s.title)}</h2><p>${esc(s.subtitle || "")}</p></header>
  <div class="grid">${s.items.map(card).join("\n")}</div>
</section>`).join("\n");
  const L = catalog.links;
  return `<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>MRL 定價 — MrLiouWord</title>
<meta name="description" content="MrLiouWord / MRL 的方案與定價:MRL AI 訂閱、AI 點數包、MRL APIWorks API 建構服務。付款由 Stripe 處理,收款方 Mrliouword, LLC。">
<meta name="mrl-asset" content="true"><meta name="mrl-namespace" content="MRL"><meta name="mrl-origin-signature" content="MrLiouWord">
<link rel="canonical" href="https://mrliouword.com/pricing">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;700&family=JetBrains+Mono:wght@400;500&display=swap">
<style>
:root{--bg:#0b0f14;--panel:#121923;--line:#1f2a37;--fg:#e6edf3;--muted:#8b98a8;--acc:#5eead4;--acc2:#60a5fa;--warn:#fbbf24}
*{box-sizing:border-box}html,body{margin:0;background:var(--bg);color:var(--fg);font-family:"Noto Sans TC",system-ui,-apple-system,sans-serif;line-height:1.55}
a{color:var(--acc2)}code,.mono{font-family:"JetBrains Mono",ui-monospace,monospace}
.wrap{max-width:1120px;margin:0 auto;padding:0 20px}
.top{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:18px 0;border-bottom:1px solid var(--line)}
.top .brand{font-weight:700;letter-spacing:.02em;text-decoration:none;color:var(--fg)}.top .brand small{color:var(--acc);font-weight:500;margin-left:8px}
.top nav a{color:var(--muted);text-decoration:none;margin-left:18px;font-size:14px}.top nav a:hover{color:var(--fg)}
.hero{padding:56px 0 24px}.hero h1{font-size:clamp(28px,4vw,40px);margin:0 0 10px;font-weight:700}.hero p{color:var(--muted);margin:0;max-width:720px}
.hero .sig{margin-top:14px;font-size:12px;color:var(--muted)}.hero .sig code{color:var(--acc)}
.sec{padding:36px 0}.sec header h2{margin:0 0 6px;font-size:22px}.sec header p{margin:0 0 20px;color:var(--muted)}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px}
.card{position:relative;background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:22px 20px;display:flex;flex-direction:column}
.card.featured{border-color:var(--acc);box-shadow:0 0 0 1px rgba(94,234,212,.25) inset}
.tag{position:absolute;top:-11px;left:18px;background:var(--acc);color:#04221d;font-size:12px;font-weight:700;padding:2px 10px;border-radius:999px}
.card h3{margin:4px 0 4px;font-size:18px}.desc{margin:0 0 12px;color:var(--muted);font-size:14px;min-height:21px}
.price{margin:0 0 14px;font-weight:700}.price .cur{font-size:14px;color:var(--muted);margin-right:3px}.price .amt{font-size:30px}.price .per{font-size:13px;color:var(--muted);font-weight:400}
.feats{list-style:none;padding:0;margin:0 0 18px;color:#c9d3de;font-size:14px;flex:1}.feats li{padding:4px 0 4px 20px;position:relative}.feats li:before{content:"✓";position:absolute;left:0;color:var(--acc)}
.cta{display:block;text-align:center;background:var(--acc2);color:#061225;text-decoration:none;font-weight:700;padding:11px 14px;border-radius:10px}.cta:hover{filter:brightness(1.08)}
.card.featured .cta{background:var(--acc)}
.stripe{display:block;text-align:center;font-size:11px;color:var(--muted);margin-top:8px}.alt{font-size:11px;color:var(--muted);margin:8px 0 0;text-align:center}
.note{background:#0f1620;border:1px solid var(--line);border-left:3px solid var(--warn);border-radius:10px;padding:14px 16px;color:#c9d3de;font-size:14px;margin:12px 0 0}
.foot{border-top:1px solid var(--line);margin-top:30px;padding:26px 0 40px;color:var(--muted);font-size:13px}.foot a{color:var(--muted)}.foot .row{display:flex;flex-wrap:wrap;gap:8px 20px;margin-top:8px}
</style>
</head>
<body>
<div class="wrap">
  <div class="top">
    <a class="brand" href="${esc(L.home)}">MrLiouWord <small>MRL</small></a>
    <nav><a href="#plans">方案</a><a href="#credits">點數包</a><a href="#apiworks">APIWorks</a><a href="${esc(L.home)}">回首頁</a></nav>
  </div>
  <div class="hero">
    <h1>方案與定價</h1>
    <p>MRL AI 訂閱、AI 點數包,以及 MRL APIWorks 的 API 建構服務。所有線上付款由 Stripe 處理,收款方為 <strong>${esc(catalog.merchant)}</strong>;台幣方案以 NT$ 計價,APIWorks 以 US$ 計價。</p>
    <p class="sig">origin_signature: <code>${esc(catalog.origin_signature)}</code> · namespace <code>${esc(catalog.mrl_namespace)}</code> · 目錄核對日 <code>${esc(catalog.verified_at)}</code></p>
  </div>
${sections}
  <div class="note"><strong>付款與開通</strong>:付款連結會開啟 Stripe 託管的結帳頁,我們不經手你的卡號。目前採<strong>人工開通</strong>:付款完成後,我們依 Stripe 的付款通知於 1 個工作天內開通服務或入帳點數,並以你結帳時填的 email 聯絡。訂閱可於 Stripe 收據連結中管理或取消。發票、退款與開通問題請<strong>直接回覆 Stripe 寄給你的收據信</strong>(最可靠),或來信 <a href="mailto:${esc(L.contact)}">${esc(L.contact)}</a>。</div>
  <footer class="foot">
    <div>© 2026 ${esc(catalog.merchant)} · MrLiouWord / MRL</div>
    <div class="row"><a href="${esc(L.terms)}" rel="noopener">服務條款(草案)</a><a href="${esc(L.privacy)}" rel="noopener">隱私權政策(草案)</a><a href="${esc(L.sla)}" rel="noopener">SLA(草案)</a><a href="${esc(L.apiworks)}" rel="noopener">MRL APIWorks</a><a href="/pricing.json">pricing.json</a></div>
  </footer>
</div>
</body>
</html>
`;
}
