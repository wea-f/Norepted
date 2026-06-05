# Norepted v1.7
#### Full Media & Unblocker Hub

Norepted is a school-proof media hub designed to watch YouTube and browse the web where both are blocked. v1.7 is the biggest expansion yet — it rebuilds Norepted into a full single-page app with a new landing page, built-in YouTube search, a Shorts scroller, multi-source video fallback, and a multi-tab proxy browser, while keeping everything that worked in v1.6.2.

---

### 🌟 New in v1.7

* **🏠 Landing Page:** New home screen with quick-access cards and privacy shortcuts front and center.
* **🔍 YouTube Search:** Search for any video directly inside the Watch page — no URL needed.
* **📱 Shorts Scroller:** A full TikTok-style Shorts viewer. Search, paste a URL, scroll with arrow keys or mouse wheel.
* **🌐 Multi-Tab Browser:** Built-in proxy browser with multiple tabs, Google/Bing search toggle, refresh, fullscreen, and tab cloaking from the toolbar.
* **🔁 Multi-Source Fallback:** Videos that don't load on one embed source can be retried on another with one button click.
* **↩ Undo Close:** Accidentally closed a video? Undo it from the toast notification.
* **🔗 Improved Link Loading:** The Proxy Links page now tries jsDelivr before raw GitHub, which is more reliable on managed networks.

---

## ✨ Key Features

* **🚫 Zero Ads:** Embeds via `youtube-nocookie.com` — no YouTube ads, no interface.
* **🔍 Search & Watch:** Find videos without ever going to youtube.com.
* **📱 Shorts Scroller:** Scroll through Shorts with keyboard or mouse wheel.
* **🌐 Proxy Browser:** Multi-tab browser that routes requests through CORS proxies.
* **🔗 200+ Proxy Links:** Curated proxy directory, bulk-selectable and one-click openable.
* **🙈 History Wipe:** Press `-` to redirect to Google and wipe Norepted from your session history.
* **🎭 Tab Cloaking:** Disguise the tab as "Google Drive" from the landing page or browser toolbar.
* **💾 Session Save:** Open videos restore automatically on next visit.
* **🖥️ Multi-Video:** Embed multiple videos at once, resize each one independently.
* **⚡ Low Performance Mode:** Toggle in the Watch page to disable animations and particles for slower Chromebooks.

---

## 🚀 How to Access

| Platform | Link |
| --- | --- |
| **Vercel** | [norepted-delta.vercel.app](https://norepted-delta.vercel.app/) |
| **Netlify** | [norepted.netlify.app](https://norepted.netlify.app/) |
| **Cloudflare** | [norepted.norepted.workers.dev](https://norepted.norepted.workers.dev/) |
| **CodeSandbox** | [gzhhqm.csb.app](https://gzhhqm.csb.app) |
| **Playcode** | [norepted.playcode.io](https://norepted.playcode.io/) *(Press "SKIP INTRO")* |
| **Playcode (2)** | [2650852.playcode.io](https://2650852.playcode.io/) *(Press "SKIP INTRO")* |
| **GitHub Pages** | [wea-f.github.io/Norepted](https://wea-f.github.io/Norepted) |
| **CodePen** | [codepen.io/weaF_z/full/RwJVywE](https://codepen.io/weaF_z/full/RwJVywE) |
| **Google Sites** | [sites.google.com/view/n0repted](https://sites.google.com/view/n0repted/home) |
| **Google Sites (2)** | [sites.google.com/view/norepted-mirror/home](https://sites.google.com/view/norepted-mirror/home) |
| **Edgeone** | [norepted.edgeone.app](https://norepted.edgeone.app/) |

*Want to run it locally? [Check the Wiki.](https://github.com/wea-f/Norepted/wiki/Run-Norepted-Locally-with-Terminal)*

---

## 🎮 Controls & Usage

### Watching Videos

1. **Search:** Type any video title in the search bar and click **Search**, or:
2. **Paste:** Drop a YouTube URL into the link box and press **Enter** or **Launch**.
3. **Manage:**
   * **+** / **−** to resize. **↺** to reset size.
   * **⟳** (retry button) to try the next embed source if a video is restricted.
   * **X** to close a video. An **Undo** toast appears for 5 seconds.
   * Purple copy icon to copy and open the direct embed link for bookmarking.
   * **Clear all videos** to remove everything at once.

### Shorts Scroller

1. Type a topic in the Shorts search bar and click **Find Shorts**, or paste a Shorts URL and click **Add**.
2. Navigate with **↑ ↓ arrow keys**, **mouse wheel**, or the on-screen buttons.

### Proxy Browser

1. Click **Browser** in the navbar.
2. Type a URL or search term and press **Enter** or **Go**.
3. Use the **+** tab button for new tabs. The **G / B** pills switch between Google and Bing search.
4. If all proxies fail, a **Try Proxy Links** button appears — use it to find a working proxy from the Links page.

> **Note:** The proxy browser routes requests through third-party CORS proxies. These may be blocked on heavily managed school networks. If the browser fails, the Links page is the better option.

### Privacy Shortcuts

| Shortcut | Action |
| --- | --- |
| `-` (hyphen) | **Panic mode.** Redirects to Google immediately. Norepted won't appear in `chrome://history`. |
| `` ` `` (backtick) | **Tab cloak.** Changes tab title and icon to look like Google Drive. Refresh to undo. |
| **about:blank** button | Opens Norepted inside an `about:blank` window so the URL bar shows nothing. |

---

## 🔗 Proxy Links Page

> [!WARNING]
> I do not guarantee all links are safe or working. I am not responsible for any consequences from using these sites. Use at your own risk.

* **Bulk Testing:** Select multiple links and open them all at once to find one that works on your network.
* **Live Updates:** Fetches the latest list directly from GitHub (tries jsDelivr first for better compatibility on filtered networks).
* **Custom Load:** Choose how many links to load at a time.

---

## ⚙️ How It Works

Norepted works the same way a teacher embeds a video in Google Slides.

1. The site extracts the **Video ID** from your YouTube link.
2. It creates an `<iframe>` pointing to `youtube-nocookie.com/embed/[ID]`.
3. Because this is a different domain from `youtube.com`, it often bypasses network filters and strips ads.
4. If that source is restricted, the **⟳ retry button** cycles through alternate embed sources.

---

## ⚠️ Disclaimer

**I am NOT responsible for how you use Norepted.** It is YOUR device and YOU control it.
