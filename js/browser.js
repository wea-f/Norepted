// ─── BROWSER ──────────────────────────────────────────
const PROXY_SOURCES = [
  {
    label: "CodeTabs",
    type: "html",
    build: target => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(target)}`
  },
  {
    label: "ThingProxy",
    type: "html",
    build: target => `https://thingproxy.freeboard.io/fetch/${target}`
  },
  {
    label: "CorsProxy",
    type: "html",
    build: target => `https://corsproxy.io/?${encodeURIComponent(target)}`
  },
  {
    label: "AllOrigins",
    type: "html",
    build: target => `https://api.allorigins.win/raw?url=${encodeURIComponent(target)}`
  },
  {
    label: "Reader Mode",
    type: "reader",
    build: target => `https://r.jina.ai/http://${target.replace(/^https?:\/\//, "")}`
  }
];
const searchEngines = {
  google: "https://www.google.com/search?hl=en&gl=us&q=",
  bing:   "https://www.bing.com/search?cc=us&setlang=en&mkt=en-US&q="
};
let activeEngine = 'google', tabs = [], activeTabId = null;

function setEngine(btn, engine) {
  activeEngine = engine;
  document.querySelectorAll('.engine-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  const icon = document.getElementById('newtab-engine-icon');
  if (icon) icon.textContent = engine === 'google' ? 'G' : 'B';
}

const DEFAULT_SHORTCUTS = [
  { label:'YouTube', url:'https://www.youtube.com',  icon:'https://www.youtube.com/favicon.ico' },
  { label:'Google',  url:'https://www.google.com',   icon:'https://www.google.com/favicon.ico' },
  { label:'GitHub',  url:'https://github.com',       icon:'https://github.com/favicon.ico' },
  { label:'Reddit',  url:'https://www.reddit.com',   icon:'https://www.reddit.com/favicon.ico' },
];

function buildShortcuts() {
  const c = document.getElementById('newtab-shortcuts'); if (!c) return;
  DEFAULT_SHORTCUTS.forEach(s => {
    const item = document.createElement('div'); item.className = 'shortcut-item';
    const icon = document.createElement('div'); icon.className = 'shortcut-icon';
    const img  = document.createElement('img'); img.src = s.icon; img.alt = '';
    img.onerror = () => { icon.textContent = s.label[0]; };
    icon.appendChild(img);
    const lbl = document.createElement('span'); lbl.className = 'shortcut-label'; lbl.textContent = s.label;
    item.append(icon, lbl);
    item.addEventListener('click', () => loadUrlInActiveTab(s.url));
    c.appendChild(item);
  });
}

function createNewTab(url = '') {
  const tabId = 'tab_' + Date.now();
  const tabEl = document.createElement('div');
  tabEl.className = 'browser-tab'; tabEl.id = `ui_${tabId}`;
  tabEl.innerHTML = `<span class="tab-title">New Tab</span><button class="close-tab" onclick="closeTab('${tabId}',event)">×</button>`;
  tabEl.onclick = () => switchTabFocus(tabId);
  document.getElementById('tab-container').appendChild(tabEl);
  const iframe = document.createElement('iframe');
  iframe.id = `frame_${tabId}`; iframe.className = 'browser-frame';
  iframe.sandbox = "allow-forms allow-scripts allow-same-origin allow-popups";
  document.getElementById('iframes-container').appendChild(iframe);
  tabs.push({ id: tabId, url });
  switchTabFocus(tabId);
  if (url) loadUrlInActiveTab(url);
}

function closeTab(tabId, event) {
  event.stopPropagation();
  document.getElementById(`ui_${tabId}`)?.remove();
  document.getElementById(`frame_${tabId}`)?.remove();
  tabs = tabs.filter(t => t.id !== tabId);
  if (tabs.length === 0) createNewTab();
  else if (activeTabId === tabId) switchTabFocus(tabs[tabs.length-1].id);
}

function closeBrowserApp() { switchTab('landing'); }

function toggleStealth() {
  document.title = "My Drive - Google Drive";
  document.querySelectorAll("link[rel*='icon']").forEach(el => el.remove());
  const l = document.createElement('link'); l.rel = 'shortcut icon';
  l.href = 'https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png';
  document.head.appendChild(l);
  showToast("Stealth: Tab now looks like Google Drive.");
}

function switchTabFocus(tabId) {
  activeTabId = tabId;
  document.querySelectorAll('.browser-tab').forEach(t => t.classList.remove('active'));
  document.getElementById(`ui_${tabId}`).classList.add('active');
  document.querySelectorAll('.browser-frame').forEach(f => f.classList.remove('active'));
  document.getElementById(`frame_${tabId}`).classList.add('active');
  const td = tabs.find(t => t.id === tabId);
  document.getElementById('browser-url').value = td.url || '';
  const nt = document.getElementById('new-tab-screen');
  if (nt) nt.classList.toggle('active', !td.url);
}

async function loadUrlInActiveTab(raw, forceProxyIndex = null) {
  if (!activeTabId || !raw) return;
  let target = raw.trim();
  if (/^(http|https):\/\/[^ "]+$|^[^ ".]+\.[^ ".]+$/.test(target)) {
    if (!target.startsWith('http')) target = 'https://' + target;
  } else {
    target = searchEngines[activeEngine] + encodeURIComponent(target);
  }
  const td = tabs.find(t => t.id === activeTabId); 
  td.url = target;

  document.getElementById(`ui_${activeTabId}`).querySelector('.tab-title').innerText = "Loading…";
  document.getElementById('new-tab-screen').classList.remove('active');
  const loader = document.getElementById('browser-loader');
  const st = document.getElementById('proxy-status');
  if (loader) loader.style.display = 'block';
  if (st) { st.classList.remove('hidden'); st.innerText = "Bypassing filters…"; }


  const errors = [];

  // FIX: If forceProxyIndex is passed (manual switch), ONLY try that specific proxy.
  // If it's a new search (null), map out the whole array so it auto-loops.
  const proxiesToTry = forceProxyIndex !== null 
    ? [ { index: forceProxyIndex, proxy: PROXY_SOURCES[forceProxyIndex] } ]
    : PROXY_SOURCES.map((proxy, index) => ({ index, proxy }));

  for (const item of proxiesToTry) {
    const proxy = item.proxy;
    const proxyIndex = item.index;

    try {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 5000);
      if (st) st.innerText = `Trying ${proxy.label}...`;

      const resp = await fetch(proxy.build(target), { signal: controller.signal });
      clearTimeout(tid);
      let html = await resp.text();
      if (!resp.ok) throw new Error(html.slice(0, 160) || `HTTP ${resp.status}`);

      if (proxy.type === "reader") {
        html = renderReaderPage(target, html);
      } else {
        const base = `<base href="${target}">`;
        html = html.includes('<head>') ? html.replace('<head>',`<head>${base}`) : base + html;
      }

      document.getElementById(`frame_${activeTabId}`).srcdoc = html;

      // CRITICAL: Cache the proxy index that successfully responded on this tab
      td.currentProxyIndex = proxyIndex; 

      try { document.getElementById(`ui_${activeTabId}`).querySelector('.tab-title').innerText = new URL(target).hostname; } catch(e){}
      if (st) {
        st.classList.remove('hidden');
        st.innerText = proxy.type === "reader" ? "Loaded in reader mode. Some interactive features may not work." : `Loaded through ${proxy.label}.`;
      }
      if (loader) loader.style.display='none';
      return; // Break out entirely on successful render
    } catch(e) {
      errors.push(`${proxy.label}: ${e.name === "AbortError" ? "timed out" : e.message || "failed"}`);
      console.warn("Proxy source failed", proxy.label, e);
    }
  }

  if (st) {
    st.innerHTML = `No more Browser sources to try. `;
    // &nbsp;<button onclick="switchTab('links')" style="background:var(--accent);color:#fff;border:none;border-radius:6px;padding:3px 10px;font-family:'Fredoka',sans-serif;font-size:12px;cursor:pointer;">Try Proxy Links →</button>
    st.title = errors.join("\n");
  }
  if (loader) loader.style.display = 'none';
}

function switchBrowserProxy() {
  const td = tabs.find(t => t.id === activeTabId);
  if (!td || !td.url) {
    // Falls back to standard alert if showToast isn't in scope
    if (typeof showToast === "function") showToast("Open a website first before switching proxies!");
    else alert("Open a website first before switching proxies!");
    return;
  }

  // Grab the tab's current proxy index (default to 0 if undefined) and increment it
  const currentIdx = td.currentProxyIndex !== undefined ? td.currentProxyIndex : 0;
  const nextProxyIndex = (currentIdx + 1) % PROXY_SOURCES.length;

  // IMMEDIATELY update the tab's proxy index cache. 
  // This ensures that if the manual proxy switch fails, clicking the button again 
  // will correctly advance to the *next* proxy instead of getting stuck.
  td.currentProxyIndex = nextProxyIndex;

  // Force load using ONLY the next proxy in line
  loadUrlInActiveTab(td.url, nextProxyIndex);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderReaderPage(target, text) {
  const escaped = escapeHtml(text);
  return `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <base href="${target}">
        <style>
          body{margin:0;background:#f8fafc;color:#111827;font-family:system-ui,-apple-system,Segoe UI,sans-serif;line-height:1.55}
          main{max-width:860px;margin:0 auto;padding:28px 22px 60px}
          .reader-bar{position:sticky;top:0;background:#111827;color:#fff;padding:10px 16px;font-size:13px}
          a{color:#2563eb}
          pre{white-space:pre-wrap;font:inherit}
        </style>
      </head>
      <body>
        <div class="reader-bar">Reader mode: ${escapeHtml(target)}</div>
        <main><pre>${escaped}</pre></main>
      </body>
    </html>`;
}

function refreshActiveTab() {
  const td = tabs.find(t => t.id === activeTabId);
  if (td && td.url) loadUrlInActiveTab(td.url);
}

function loadFromBigSearch() {
  const v = document.getElementById('big-browser-url').value;
  document.getElementById('browser-url').value = v;
  loadUrlInActiveTab(v);
}

function toggleFullScreen() {
  const app = document.getElementById('view-browser');
  if (!document.fullscreenElement) (app.requestFullscreen||app.webkitRequestFullscreen||app.msRequestFullscreen).call(app);
  else (document.exitFullscreen||document.webkitExitFullscreen).call(document);
}

document.getElementById('browser-go').addEventListener('click', () => loadUrlInActiveTab(document.getElementById('browser-url').value));
document.getElementById('browser-url').addEventListener('keypress', e => { if (e.key==='Enter') loadUrlInActiveTab(e.target.value); });
document.getElementById('big-browser-url').addEventListener('keypress', e => { if (e.key==='Enter') loadFromBigSearch(); });

document.addEventListener("DOMContentLoaded", () => { createNewTab(); buildShortcuts(); });
