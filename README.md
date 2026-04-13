# Norepted v1.6.2
#### YouTube Watcher 

Norepted is a YouTube embedder designed to watch Youtube videos where youtube.com is inaccessible, focused on privacy, ease, and convienience. Version 1.6.2 introduces a complete UI overhaul and the highly requested **Links Page,** filled with 200+ links to proxies.

### 🌟 New in v1.6.2

* **🔗 Links Page:** A massive new directory featuring working proxies.
* **🎨 UI Polish:** Added header icons, updated particle effects, and updated overall theme.
* **🔖 Save:** Pre-existing launched videos are now saved after exiting the site.
* **🧹 Optimized Code:** Added "low performance mode" for slower chromebooks, as well as removing unnecessary code.

## ✨ Key Features

* **🚫 Zero Ads:** Norepted strips all ads from videos for uninterrupted viewing.
* **🙈 History Hiding:** Redirect to Google to scrub your current session from history (Press "-").
* **🎭 Tab Cloaking:** Disguise your tab as "Google Drive" (Press "`").
* **💾 Save & Bookmark:** Use the "Copy" button on the side panel to save and share direct links to videos.
* **🖥️ Multi-Video Support:** Open multiple videos at once and resize them individually.

---

## 🚀 How to Access

You can access Norepted through these mirrors:

| Platform | Link |
| --- | --- |
| **Vercel** | [norepted-delta.vercel.app](https://norepted-delta.vercel.app/) |
| **Netlify** | [norepted.netlify.app](https://norepted.netlify.app/) |
| **Cloudflare** | [https://norepted.norepted.workers.dev/](https://norepted.norepted.workers.dev/) | 
| **CodeSandbox** | [gzhhqm.csb.app](https://gzhhqm.csb.app) |
| **Playcode** | [norepted.playcode.io](https://norepted.playcode.io/) (Press "SKIP INTRO") |
| **Playcode (2)** | [https://2650852.playcode.io/](https://2650852.playcode.io/) (Press "SKIP INTRO") |
| **GitHub Pages** | [wea-f.github.io/Norepted](http://wea-f.github.io/Norepted) |
| **CodePen** | [codepen.io/weaF_z/full/RwJVywE](https://codepen.io/weaF_z/full/RwJVywE) |
| **Google Sites** | [sites.google.com/view/n0repted](https://sites.google.com/view/n0repted/home) |
| **Google Sites (2)** | [https://sites.google.com/view/norepted-mirror/home](https://sites.google.com/view/norepted-mirror/home) |
| **Edgeone** | [https://norepted.edgeone.app/](https://norepted.edgeone.app/) |

*Want to run it locally? [Check the Wiki.*](https://github.com/wea-f/Norepted/wiki/Run-Norepted-Locally-with-Terminal)

---

## 🎮 Controls & Usage

### Watching Videos

1. **Paste:** Copy a YouTube link (e.g., `https://www.youtube.com/watch?v=...`) into the orange box.
2. **Launch:** Press **Enter** or click the green **LAUNCH** button.
3. **Manage:**
* Use the **+** / **-** buttons next to the video to resize.
* Click **X** to remove a video.
* Click the **Purple Copy Icon** to copy the unblocked link for bookmarking.
* Press Clear All Videos button to clear all your videos (so you do not have to cancel them out individually).

### Privacy Shortcuts (Hotkeys)

* **`-` (Hyphen/Dash):** **Panic Mode.** Immediately exits Norepted and redirects to Google. Norepted will not be on your `chrome://history`.
* **``` (Backtick):** **Tab Cloak.** Disguises the tab icon and title as "Google Drive." Refresh the page to undo.
* **Open in about:blank:** Click the button in the "Instructions" panel to open Norepted with the url as `about:blank`

---

## 🔗 The Links Page (New v1.6.2)
> ![WARNING]
> I do not guarantee all the links are safe or are working. I am not responsible for any consequences regarding how you use these websites. Use at your own risk.

* **Bulk Testing:** Select multiple proxy links and open them all at once to find one that works on your network.
* **Live Updates:** Fetches the latest links directly from GitHub.

## 🔖 Bookmarklets

The **Bookmarklets** page offers tools you can drag to your browser's bookmarks bar to use on *other* websites:

---

## ⚙️ How it Works

Norepted functions similarly to how a teacher embeds a video into Google Slides.

1. The site extracts the **Video ID** from your YouTube link.
2. It creates an iframe pointing to `youtube-nocookie.com/embed/[ID]`.
3. Because this domain is distinct from the main YouTube site, it often bypasses network filters and ad servers.

---

## ⚠️ Disclaimer

> **I am NOT responsible for how you use Norepted.** It is YOUR device and YOU control it.
