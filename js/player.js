// ─── CONSTANTS (video player) ────────────────────────────────────────
const urlInput              = document.getElementById("link");
const launch                = document.getElementById("launch");
const videoPlayersContainer = document.getElementById("videoPlayersContainer");
const unhelpfulText         = document.getElementById("offtext");

const INITIAL_VIDEO_WIDTH  = 688;
const INITIAL_VIDEO_HEIGHT = 387;
const RESIZE_STEP          = 0.10;
const ASPECT_RATIO         = 0.5625;

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.addEventListener('beforeunload', () => window.scrollTo(0, 0));
window.onload = () => setTimeout(() => window.scrollTo(0, 0), 10);



// ─── EXTRACT VIDEO ID ─────────────────────────────────
function extractVideoId(url) {
  if (/playlist|\/channel\/|\/@/.test(url)) return null;
  const patterns = [
    /youtu\.be\/([\w-]{11})/,
    /[?&]v=([\w-]{11})/,
    /embed\/([\w-]{11})/,
    /shorts\/([\w-]{11})/,
    /googleusercontent\.com\/youtube\.com\/5\/([\w-]{11})/,
  ];
  for (const p of patterns) { const m = url.match(p); if (m && m[1]) return m[1]; }
  return null;
}

// ─── UNDO ─────────────────────────────────────────────
let lastClosedVideo = null;

// ─── PERSISTENCE ──────────────────────────────────────
function saveOpenVideos() {
  const ids = [];
  videoPlayersContainer.querySelectorAll(".video-unit-wrapper").forEach(w => {
    if (w.dataset.videoId) ids.push(w.dataset.videoId);
  });
  localStorage.setItem("savedVideos", JSON.stringify(ids));
}

function loadSavedVideos() {
  try {
    const saved = localStorage.getItem("savedVideos");
    if (!saved) return;
    JSON.parse(saved).reverse().forEach(id => addVideoPlayer(id, false));
  } catch(e) { console.error("Failed to load saved videos", e); }
}

// ─── VIDEO PLAYER ─────────────────────────────────────

//  Fetch embed sources live
let liveEmbedSources = [];

async function initializeLiveSources() {
  try {
    const response = await fetch("https://api.invidious.io/instances.json?sort_by=health");
    if (!response.ok) {
      throw new Error(`sources http: ${response.status}`);
    }

    const invidiousData = await response.ok ? await response.json() : [];
    const dynamicSources = [];

    if (Array.isArray(invidiousData)) {
      invidiousData.forEach(([name, details]) => {
        // Correcting the schema path to details.monitor.uptime
        if (
          details.type === "https" && 
          details.uri && 
          details.monitor && 
          details.monitor.uptime > 95 &&
          details.monitor.last_status === 200
        ) {
          dynamicSources.push(id => `${details.uri}/embed/${id}`);
        }
      });
    }

    // Shuffle the dynamic instances to spread out user traffic
    liveEmbedSources = dynamicSources.sort(() => Math.random() - 0.5);

    // Telemetry logs to verify it works in DevTools
    console.log(`Loaded ${liveEmbedSources.length} good fallback urls.`);

    for (let i = 0; i < liveEmbedSources.length; i++) {
      console.log(`Mirror ${i + 1}:`, liveEmbedSources[i]("test_id"));
    }

  } catch (error) {
    console.error("Some error when loading instances:", error);
  }
}

//---------------
const EMBED_SOURCES = [
  id => `https://www.youtube-nocookie.com/embed/${id}?autoplay=0&rel=0&playsinline=1&origin=${window.location.origin}`,
  id => `https://www.youtube.com/embed/${id}?autoplay=0&rel=0&playsinline=1&origin=${window.location.origin}`
];

// Add live sources to the pool after fetching
function getEmbedSourcesPool() {
  return [...EMBED_SOURCES, ...liveEmbedSources];
}

function addVideoPlayer(videoId, showLoadedFeedback = true) {
  if (unhelpfulText) { unhelpfulText.classList.remove("active"); unhelpfulText.style.display = "none"; }
  if (!videoId) return showToast("Input a YouTube video URL.", true);

  const wrapper = document.createElement("div");
  wrapper.classList.add("video-unit-wrapper", "fade-in");
  wrapper.dataset.videoId = videoId;

  const iframe = document.createElement("iframe");
  let srcIdx = 0;
  let fallbackTimer = null;

  const overlay = document.createElement("div");
  overlay.className = "video-loading-overlay";

  function showSpinner() {
    overlay.innerHTML = "";
    overlay.appendChild(Object.assign(document.createElement("div"), {
      className: "spinner"
    }));
  }

  function showEmbedMessage(title, text, showRetry = false) {
    overlay.classList.remove("hidden");
    overlay.innerHTML = "";

    const box = document.createElement("div");
    box.className = "embed-error";

    const strong = document.createElement("strong");
    strong.textContent = title;

    const span = document.createElement("span");
    span.textContent = text;

    box.append(strong, span);

    if (showRetry && srcIdx < EMBED_SOURCES.length) {
      const btn = document.createElement("button");
      btn.className = "ghost-btn";
      btn.type = "button";
      btn.textContent = "Try next source";
      btn.addEventListener("click", tryNext);
      box.appendChild(btn);
    }

    overlay.appendChild(box);
  }

  const sourcesPool = getEmbedSourcesPool(); // Get the combined list

  function tryNext() {
    clearTimeout(fallbackTimer);

    if (srcIdx >= sourcesPool.length) {
      showEmbedMessage(
        "Video unavailable",
        "This video could not be loaded via standard or alternative mirrors."
      );
      showToast("No available embed source worked.", true);
      return;
    }

    showSpinner();
    overlay.classList.remove("hidden");

    iframe.src = sourcesPool[srcIdx](videoId);
    srcIdx++;

    fallbackTimer = setTimeout(() => {
      showEmbedMessage(
        "Still loading?",
        "If the video fails to load, try a different mirror (click the bottom shuffle button).",
        true
      );
    }, 4500);
  }

  iframe.setAttribute("frameborder", "0");
  iframe.setAttribute("allowfullscreen", "true");
  iframe.loading = "lazy";
  iframe.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
  iframe.style.cssText = "width:100%;height:100%;border-radius:10px;";

  iframe.onload = () => {
    clearTimeout(fallbackTimer);
    overlay.classList.add("hidden");
  };

  tryNext();

  const display = document.createElement("div");
  display.className = "video-display";
  display.style.cssText = `width:${INITIAL_VIDEO_WIDTH}px;height:${INITIAL_VIDEO_HEIGHT}px;`;
  display.dataset.initialWidth  = INITIAL_VIDEO_WIDTH;
  display.dataset.initialHeight = INITIAL_VIDEO_HEIGHT;

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "X"; closeBtn.title = "Close"; closeBtn.className = "close-video-button";
  closeBtn.addEventListener("click", () => {
    lastClosedVideo = videoId; wrapper.remove(); saveOpenVideos(); showUndoToast(videoId);
    if (videoPlayersContainer.children.length === 0 && unhelpfulText) {
      unhelpfulText.classList.add("active"); unhelpfulText.style.display = "block";
    }
  });

  display.append(overlay, iframe, closeBtn);

  const controls = document.createElement("div");
  controls.className = "video-size-controls";
  const mkBtn = (html, cls, title, fn) => {
    const b = document.createElement("button");
    b.innerHTML = html; b.className = `size-button ${cls}`; b.title = title;
    b.addEventListener("click", fn); return b;
  };
  controls.append(
    mkBtn("+","plus","Bigger", () => resizeEl(display, display.offsetWidth * (1 + RESIZE_STEP))),
    mkBtn("−","minus","Smaller", () => resizeEl(display, display.offsetWidth * (1 - RESIZE_STEP))),
    mkBtn("↺","default","Reset", () => resizeEl(display, parseInt(display.dataset.initialWidth)))
  );
  const copySvg = `<svg viewBox="0 0 24 24" width="15" height="15" fill="white"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>`;
  const copyBtn = mkBtn(copySvg,"copy-mini","Copy & Open", () => {
    const l = `https://www.youtube-nocookie.com/embed/${videoId}`;
    window.open(l,'_blank'); navigator.clipboard.writeText(l).catch(()=>{});
    showToast("Link copied and opened!");
  });
  controls.append(copyBtn);
// Fall back button
  const fallbackSvg = `
<svg viewBox="0 0 24 24" width="15" height="15" fill="white">
  <path d="M12 6V3L8 7l4 4V8c2.76 0 5 2.24 5 5
           0 .34-.03.67-.1 1h2.02c.05-.33.08-.66.08-1
           0-3.87-3.13-7-7-7zm-5.9 4C6.05 10.33 6 10.66
           6 11c0 3.87 3.13 7 7 7v3l4-4-4-4v3
           c-2.76 0-5-2.24-5-5 0-.34.03-.67.1-1H6.1z"/>
</svg>`;

const fallbackBtn = mkBtn(
  fallbackSvg,
  "fallback-mini",
  "Try another source",
  () => {
    if (srcIdx < sourcesPool.length) {
      showToast(`Routing to mirror ${srcIdx + 1} of ${sourcesPool.length}...`);
      tryNext();
    } else {
      showToast("No more mirrors available.", true);
    }
  }
);

controls.append(fallbackBtn);

  wrapper.append(display, controls);
  videoPlayersContainer.prepend(wrapper);
  if (window.fadeInObserver) window.fadeInObserver.observe(wrapper);
  if (showLoadedFeedback) showToast("Video loaded!");
  saveOpenVideos();
}

function resizeEl(el, w) {
  el.style.width  = `${Math.round(w)}px`;
  el.style.height = `${Math.round(w * ASPECT_RATIO)}px`;
}

// ─── UNDO TOAST ───────────────────────────────────────
function showUndoToast(videoId) {
  document.querySelector('.undo-toast')?.remove();
  const t = document.createElement("div");
  t.className = "toast-notification undo-toast";

  document.body.appendChild(t);

  requestAnimationFrame(() => {
      t.classList.add("show");
  });
  t.style.cssText = "border-color:#FFC107;color:#FFC107;bottom:28px;opacity:1;";
  t.innerHTML = `Video removed. <button onclick="undoClose()">Undo</button>`;
  document.body.appendChild(t);
  const timer = setTimeout(() => { t.style.bottom="-60px"; t.style.opacity="0"; setTimeout(()=>t.remove(),500); }, 5000);
  t.dataset.timer = timer;
}
function undoClose() {
  const t = document.querySelector('.undo-toast');
  if (t) { clearTimeout(parseInt(t.dataset.timer)); t.remove(); }
  if (lastClosedVideo) { addVideoPlayer(lastClosedVideo); lastClosedVideo = null; }
}

// ─── LAUNCH HANDLER ───────────────────────────────────
if (launch) {
  launch.addEventListener("click", () => {
    const url = urlInput.value.trim();
    if (!url) return showToast("Paste a YouTube link first.");
    const videoId = extractVideoId(url);
    if (!videoId) return showToast("Doesn't look like a valid YouTube link.");
    addVideoPlayer(videoId);
    urlInput.value = "";
  });
}



function clearAllVideos() {
  videoPlayersContainer.innerHTML = "";
  if (unhelpfulText) { unhelpfulText.classList.add("active"); unhelpfulText.style.display = "block"; }
  localStorage.removeItem("savedVideos");
}

function clearSearchResults() {
  const r = document.getElementById("ytSearchResults");
  const i = document.getElementById("ytSearchInput");
  const b = document.getElementById("clearSearchBtn");
  if (r) { r.innerHTML = ""; r.style.display = "none"; }
  if (i) i.value = "";
  if (b) b.style.display = "none";
}
