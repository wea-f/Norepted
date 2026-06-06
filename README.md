# Norepted v1.7
#### Full Media & Unblocker Hub

Norepted is a school-proof media hub for watching YouTube and bypassing web restrictions where both are blocked. v1.7 is the biggest expansion yet — rebuilt as a full single-page app with a landing page, YouTube search, Shorts scroller, multi-source video fallback, and a multi-tab proxy browser.

> **Before you start:** What works for you depends entirely on your school's network. Some features require access to external APIs or proxy servers that your school may block. This is normal — see the [Network Compatibility](#-network-compatibility) section below.

---

### 🌟 New in v1.7

* **🏠 Landing Page** — New home screen with quick-access cards and privacy shortcuts front and center.
* **🔍 YouTube Search** — Search for videos directly inside the Watch page. *Requires Google API access — may be blocked on some networks.*
* **📱 Shorts Scroller** — TikTok-style Shorts viewer. Search, paste a URL, navigate with arrow keys or scroll wheel.
* **🌐 Multi-Tab Browser** — Built-in proxy browser with tabs, URL bar, Google/Bing toggle, and fullscreen. *Dependent on external CORS proxies — may be blocked on managed devices.*
* **🔁 Source Fallback** — When a video is restricted, a "Try next source" button cycles through alternate embed hosts.
* **↩️ Undo Close** — Accidentally closed a video? Undo it from the toast notification.
* **🔗 Improved Link Loading** — Links page now tries jsDelivr before raw GitHub for better compatibility on filtered networks.

---

## ✨ Key Features

* **🚫 Zero Ads** — Embeds via `youtube-nocookie.com`. No YouTube interface, no ads.
* **🔍 Search & Watch** — Find videos without visiting youtube.com. *(Network-dependent)*
* **📱 Shorts Scroller** — Scroll through Shorts with keyboard or mouse wheel. *(Network-dependent)*
* **🌐 Proxy Browser** — Multi-tab browser that routes requests through CORS proxies. *(Often blocked on managed networks — use Proxy Links as backup)*
* **🔗 200+ Proxy Links** — Curated proxy directory. Bulk-select and open in one click.
* **🙈 History Wipe** — Click the button on the landing page to redirect to Google and wipe Norepted from your session history.
* **🎭 Tab Cloaking** — Disguise your tab as Google Drive from the landing page or browser toolbar.
* **💾 Session Save** — Open videos restore automatically on your next visit.
* **🖥️ Multi-Video** — Embed multiple videos at once and resize each one independently.
* **⚡ Low Performance Mode** — Toggle in the Watch page to disable animations and particles for slower Chromebooks.

---

## 🌐 Network Compatibility

Norepted's core feature — **embedding YouTube videos** — works on most school networks because it uses the same embed method teachers use in Google Slides (`youtube-nocookie.com`). Everything else depends on your network.

| Feature | How it works | Works if your school blocks... |
| --- | --- | --- |
| **YouTube embed** | `youtube-nocookie.com` iframe | ✅ Usually works |
| **YouTube search** | Google YouTube Data API | ❌ `googleapis.com` blocked |
| **Shorts search** | Same API | ❌ `googleapis.com` blocked |
| **Proxy Browser** | CORS proxy servers | ❌ Proxy domains blocked |
| **Proxy Links** | GitHub-hosted list | ❌ `github.com` / `jsdelivr.net` blocked |
| **Source fallback** | Invidious / Piped embed | ⚠️ Depends on instance |

**If a feature doesn't work, it's your network — not a bug.** The embed player itself is the most reliable feature and works for the vast majority of users.

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

1. **Search:** Type a title in the search bar and click **Search** *(requires API access)*, or:
2. **Paste:** Drop a YouTube URL into the link box and press **Enter** or **Launch**.
3. **Manage:**
   * **+** / **−** to resize. **↺** to reset.
   * If a video shows a restriction error, click **Try next source** to cycle through alternate embed hosts.
   * **X** to close. An **Undo** toast appears for 5 seconds.
   * Purple copy icon to copy and open the direct embed link for bookmarking.
   * **Clear all videos** removes everything at once.

### Shorts Scroller

1. Search for a topic *(requires API access)*, or paste a Shorts URL and click **Add**.
2. Navigate with **↑ ↓ arrow keys**, **mouse wheel** (while hovering the player), or the on-screen buttons.

### Proxy Browser

1. Click **Browser** in the navbar.
2. Type a URL or search query and press **Enter** or **Go**.
3. If all proxies fail, click **Try Proxy Links** to find a working proxy from the Links page.

> The proxy browser routes through third-party CORS proxies. These are frequently blocked on managed school networks. If it doesn't work, the **Proxy Links page** is the more reliable option.

### Privacy Shortcuts

| Action | How |
| --- | --- |
| **History Wipe** | Click the button on the landing page. Redirects to Google — Norepted won't appear in `chrome://history`. |
| **Tab Cloak** | Click on the landing page or in the browser toolbar. Changes title and icon to Google Drive. Refresh to undo. |
| **about:blank** | Click the button on the landing page or Watch page to open Norepted inside an `about:blank` window. |

---

## 🔗 Proxy Links Page

> [!WARNING]
> I do not guarantee all links are safe or working. I am not responsible for any consequences from using these sites. Use at your own risk.

* **Bulk Testing:** Select multiple links and open them all at once to find one that works on your network.
* **Live Updates:** Fetches the latest list from GitHub (tries jsDelivr CDN first for better reach on filtered networks).
* **Custom Load:** Choose how many links to load at a time.

---

## ⚙️ How It Works

Norepted works the same way a teacher embeds a video in Google Slides.

1. It extracts the **Video ID** from your YouTube link.
2. It creates an `<iframe>` pointing to `youtube-nocookie.com/embed/[ID]`.
3. Because this is a different domain from `youtube.com`, it often bypasses network filters and strips the YouTube UI and ads.
4. If that source is restricted, the **Try next source** button cycles through Invidious and Piped as alternate embed hosts.

---

## ⚠️ Disclaimer

**I am NOT responsible for how you use Norepted.** It is YOUR device and YOU control it.
