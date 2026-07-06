# Norepted v1.7
#### Watch Youtube without entering to youtube.com

Norepted is your media hub for watching YouTube without ever directly going to youtube.com. v1.7 is the biggest expansion yet — rebuilt with a new look, built-inYouTube search for videos, a Youtube Shorts scroller, multi-source fallback, and a multi-tab proxy browser. You can also download the [html file](https://github.com/wea-f/Norepted/blob/master/onepagenorepted.html) for yourself if the [links](##-how-to-access) don't work!

<!-- > **Before you start:** What works for you depends entirely on your school's network. Some features require access to external APIs or proxy servers that your school may block. This is normal — see the [Network Compatibility](#-network-compatibility) section below.
-->

---

### 🌟 New in v1.7

* **🔍 YouTube In-App Search** — Search for videos directly inside the Watch page, showing thumbnail, title, channel, and date! 
* **📱 Shorts Scroller** — TikTok-style Shorts viewer. Search, paste a URL, wheel/arrow-key scroller, pause/play, and "try another source" mirror button.
* **🌐 Multi-Tab Browser** — Built-in external CORS proxy browser with tabs, URL bar, Google/Bing toggle, and fullscreen.
* **🔁 Source Fallback** — When a video is restricted, the refresh button cycles through alternate embed hosts.
* **↩️ Undo Close** — Accidentally closed a video? Undo it from the toast notification.
* **🏠 Landing Page** — New home screen with quick-access cards and privacy shortcuts.
* **⚡️Auto-Performance Mode** - Checks your specs and deteremines if it should be on or off.
* **🔑 Keybinds** - New keybinds - \ (backslash) for tab cloaking.

### ❌ Removals in v1.7
* **🔖Bookmarklets** - Most schools have blocked these already. 
* **🔗 Links page** - If you want proxy links, [this is a better source](https://github.com/wea-f/ByePassHub/blob/main/mainUnblockers.md) to start.

---

## ✨ Key Features (not mentioned aboved)
* Previously played videos automatically restore on your next visit.
* Multiple videos is supported and resize each one.

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

*Want to run it locally? [Check the Wiki.](https://github.com/wea-f/Norepted/wiki/Run-Norepted-Locally-with-Terminal)*
*Links don't work? Download the [onepagenorepted.html](https://github.com/wea-f/Norepted/blob/master/onepagenorepted.html) file and view it yourself!*

---

## 🎮 Controls & Usage

### Watching Videos

1. **Search:** Type a title in the search bar and click **Search**, or:
2. **Paste:** Drop a YouTube URL into the link box and press **Enter** or **Launch**.
3. **Manage:**
   * **+** / **−** to resize. **↺** to reset.
   * If a video shows a restriction error, click **Try next source** to cycle through alternate embed hosts.
   * **X** to close. An **Undo** toast appears for 5 seconds.
   * Purple copy icon to copy and open the direct embed link for bookmarking.
   * **Clear all videos** removes everything at once.
   * Clicking the shuffle button re-embeds the video on a different source. Use this if it says its blocked.

### Shorts Scroller

1. Search for a topic, or paste a Shorts URL and click **Add**.
2. Navigate with **↑ ↓ arrow keys**, **mouse wheel** (while hovering the player), or the on-screen buttons.

### Proxy Browser

1. Click **Browser** in the navbar.
2. Type a URL or search query and press **Enter** or **Go**.
3. If all proxies fail, click **Try Proxy Links** to find a working proxy from the Links page.

> The proxy browser routes through third-party CORS proxies. These are frequently blocked on managed school networks. If it doesn't work, the **Proxy Links page** is the more reliable option.

### Privacy Shortcuts

| Action | How |
| --- | --- |
| **History Wipe** | - or button on landing page. Redirects to Google — Norepted won't appear in `chrome://history`. |
| **Tab Cloak** | Press \.  Changes title and icon to Google Drive. |
| **about:blank** | Click the button on the landing page or Watch page to open Norepted inside an `about:blank` window. |

---

## ⚙️ How It Works

Norepted works the same way a teacher embeds a video in Google Slides.

1. It extracts the **Video ID** from your YouTube link.
2. It creates an `<iframe>` pointing to `youtube-nocookie.com/embed/[ID]`.
3. Because this is a different domain from `youtube.com`, it often bypasses network filters and strips the YouTube UI and ads.
4. If that source is restricted, the **Try next source** button cycles through Invidious and Piped as alternate embed hosts.

---

## 🌐 Network Compatibility
This is a quick note on some of Norepted's features. It works on most school networks because it uses the same embed method teachers use in Google Slides (using  `youtube-nocookie.com`). However, this depends on your network of your managed device.

| Feature | How it works | Doesn't work if your school blocks... |
| --- | --- | --- |
| **YouTube embed** | `youtube-nocookie.com` iframe | ✅ Usually works |
| **YouTube search** | Google YouTube Data API | ❌ `googleapis.com` blocked |
| **Shorts search** | Same API | ❌ `googleapis.com` blocked |
| **Proxy Browser** | CORS proxy servers | ❌ Proxy domains blocked |
| **Source fallback** | Invidious / Piped embed | ⚠️ Depends on instance |

**If a feature doesn't work, it's your network.**

---

## ⚠️ Disclaimer

**I am NOT responsible for how you use Norepted and the issues it may arise for you.** It is YOUR device and YOU control it.
