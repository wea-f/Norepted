// ─── SHORTS SCROLLER ──────────────────────────────────
let shortsQueue   = [];
let shortsIndex   = 0;
let shortsPaused  = false;
let shortsPointerInScrollArea = false;
// Shorts start muted by default (browsers block un-muted autoplay, and it
// avoids surprising the user with sudden audio). The overlay that catches
// scroll/click for navigation also blocks reaching YouTube's native mute
// button, so we expose our own toggle instead.
let shortsMuted   = true;

let currentShortsSrcIdx = 0;

let lastScrollTime = 0;
const SCROLL_COOLDOWN = 750; // adjust?

function buildShortsFrame(videoId, autoplay = false) {
  const wrap = document.getElementById('shortsFrameWrap');
  if (!wrap) return;
  wrap.querySelectorAll('iframe').forEach(f => f.remove());
  wrap.classList.add('has-content');
  shortsPaused = !autoplay;
  const iframe = document.createElement('iframe');

  const auto = autoplay ? "1" : "0";
  const mute = shortsMuted ? "&mute=1" : "";

  const sources = getShortsSourcesPool(videoId, auto, mute);
  iframe.src = sources[currentShortsSrcIdx];
  // iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${auto}${mute}&rel=0&playsinline=1&loop=1&playlist=${videoId}&origin=${window.location.origin}`;


  // Explicitly allow autoplay
  iframe.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
  iframe.setAttribute("allowfullscreen","true");
  iframe.style.cssText = "width:100%;height:100%;border:none;";

  wrap.appendChild(iframe);

  const emptyMsg = document.getElementById('shortsEmpty');
  if (emptyMsg) emptyMsg.style.display = 'none';

  const pauseBtn = document.getElementById('shortsPause');
  if (pauseBtn) pauseBtn.textContent = autoplay ? "Pause" : "Play";
  updateShortsMuteBtn();
  updateShortsCounter();
}

function toggleShortsMute() {
  if (shortsQueue.length === 0) return;
  shortsMuted = !shortsMuted;
  updateShortsMuteBtn();
  // Rebuild the current video with the new mute state applied. YouTube's
  // embed API requires a fresh src (with/without &mute=1) since the overlay
  // that enables scroll-navigation prevents clicking YouTube's own controls.
  currentShortsSrcIdx = 0;
  buildShortsFrame(shortsQueue[shortsIndex], true);
}

function updateShortsMuteBtn() {
  const btn = document.getElementById('shortsMute');
  if (!btn) return;
  btn.textContent = shortsMuted ? "🔇 Unmute" : "🔊 Mute";
  btn.title = shortsMuted ? "Unmute video" : "Mute video";
}
// Shorts poool v1.7
function getShortsSourcesPool(id, auto, mute) {
  const originUrl = encodeURIComponent(window.location.origin);
  const basePool = [
    `https://www.youtube-nocookie.com/embed/${id}?autoplay=${auto}${mute}&rel=0&playsinline=1&loop=1&playlist=${id}&origin=${originUrl}`,
    `https://www.youtube.com/embed/${id}?autoplay=${auto}${mute}&rel=0&playsinline=1&loop=1&playlist=${id}&origin=${originUrl}`
  ];

  // Inject live API instances if they exist
  if (typeof liveEmbedSources !== 'undefined' && liveEmbedSources.length > 0) {
    liveEmbedSources.forEach(instanceFn => {
      // Clean up base structure to fit specific instance formatting
      const sampleUrl = instanceFn(id);
      const host = sampleUrl.split('/embed/')[0];
      basePool.push(`${host}/embed/${id}?loop=1&playlist=${id}`);
    });
  }

  return basePool;
}
function updateShortsCounter() {
  const el = document.getElementById('shortsCounter');
  if (el) el.textContent = `${shortsIndex + 1} / ${shortsQueue.length}`;
}

function navigateShort(dir) {
  if (shortsQueue.length === 0) return;
  currentShortsSrcIdx = 0; // Reset source index for new video
  shortsIndex = (shortsIndex + dir + shortsQueue.length) % shortsQueue.length;
  buildShortsFrame(shortsQueue[shortsIndex], true);
}
// =====================
function initShortsControls() {
  const wrap = document.getElementById('shortsFrameWrap');
  if (!wrap) return;

  // Track hover states safely using parent delegation container
  wrap.addEventListener("mouseenter", () => { shortsPointerInScrollArea = true; });
  wrap.addEventListener("mouseleave", () => { shortsPointerInScrollArea = false; });

  // Handle wheel events smoothly on parent layout
  wrap.addEventListener("wheel", e => {
    const sv = document.getElementById('view-shorts');
    if (!sv || !sv.classList.contains('active-section')) return;

    // Always prevent default to stop the page from scrolling while hovering the iframe
    e.preventDefault(); 

    if (Math.abs(e.deltaY) < 30) return; 

    // THROTTLE: Check if enough time has passed since the last successful scroll
    const now = Date.now();
    if (now - lastScrollTime < SCROLL_COOLDOWN) return;

    lastScrollTime = now;
    navigateShort(e.deltaY > 0 ? 1 : -1);
  }, { passive: false });
  // Handle click (so user can start the first video)
  wrap.addEventListener("click", (e) => {
  // Prevent click from double-firing if they clicked the nav buttons
  if (e.target.tagName.toLowerCase() === 'button') return; 
  toggleShortPlayback();
});
}
// ===========================
function addShortsFromUrl() {
  const input = document.getElementById('shortsPasteInput');
  if (!input) return;
  const url = input.value.trim();
  const id  = extractShortsId(url);
  if (!id) { showToast("Couldn't find 11 character video ID in that URL. (e.g. MIVI3W6svw8)", true); return; }
  shortsQueue.push(id);
  shortsIndex = shortsQueue.length - 1;
  buildShortsFrame(id, false);
  input.value = '';
  showToast("Short added!");
}

function toggleShortPlayback() {
  if (shortsQueue.length === 0) return;
  const wrap = document.getElementById('shortsFrameWrap');
  const pauseBtn = document.getElementById('shortsPause');
  if (!wrap) return;
  const iframe = wrap.querySelector('iframe');

  if (!shortsPaused && iframe) {
    iframe.dataset.savedSrc = iframe.src;
    iframe.src = '';
    shortsPaused = true;
    if (pauseBtn) pauseBtn.textContent = "Play";
  } else {
    buildShortsFrame(shortsQueue[shortsIndex], true);

  }
}

// Shorts fall back function
function tryNextShortsSource() {
  // 1. Don't do anything if the queue is empty
  if (shortsQueue.length === 0) {
    if (typeof showToast === "function") showToast("No short loaded to swap.", true);
    return;
  }

  const videoId = shortsQueue[shortsIndex];
  const wrap = document.getElementById('shortsFrameWrap');
  const iframe = wrap ? wrap.querySelector('iframe') : null;

  if (!iframe) return;

  // 2. We want autoplay to be true when they manually switch mirrors,
  // keeping whatever mute state the user currently has set
  const auto = "1";
  const mute = shortsMuted ? "&mute=1" : "";
  const sources = getShortsSourcesPool(videoId, auto, mute);

  // 3. Increment our global tracker
  currentShortsSrcIdx++;

  // 4. If we hit the end of the pool, loop back to the beginning so the button doesn't permanently die
  if (currentShortsSrcIdx >= sources.length) {
    currentShortsSrcIdx = 0;
    if (typeof showToast === "function") showToast("No more mirrors. Looping back to primary source.");
  } else {
    if (typeof showToast === "function") showToast(`Routing to mirror ${currentShortsSrcIdx + 1} of ${sources.length}...`);
  }

  // 5. Swap the source on the existing iframe
  iframe.src = sources[currentShortsSrcIdx];

  // 6. Reset the pause state just in case they were paused when they clicked the button
  shortsPaused = false;
  const pauseBtn = document.getElementById('shortsPause');
  if (pauseBtn) pauseBtn.textContent = "Pause";
}


// Global Keydown monitoring safely managed outside the iframe
document.addEventListener("keydown", e => {
  const sv = document.getElementById('view-shorts');
  if (!sv || !sv.classList.contains('active-section')) return;
  if (!shortsPointerInScrollArea) return;

  if (e.key === 'ArrowUp')   { e.preventDefault(); navigateShort(-1); }
  if (e.key === 'ArrowDown') { e.preventDefault(); navigateShort(1); }
});

// Ensure setup runs cleanly after DOM hydration completes
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initShortsControls);
} else {
  initShortsControls();
}


document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById('shortsSearchBtn');
  const inp = document.getElementById('shortsSearchInput');
  if (!btn || !inp) return;

  async function doShortsSearch() {
    const q = inp.value.trim(); if (!q) return;
    btn.disabled = true; btn.textContent = "Searching…";
    const items = await searchYouTube(q, true);
    if (items && items.length > 0) {
      shortsQueue = items.map(i => i.id && i.id.videoId).filter(Boolean);
      shortsIndex = 0;
      buildShortsFrame(shortsQueue[0], false);
      showToast(`Loaded ${shortsQueue.length} shorts!`);
    } else {
      showToast("No shorts found.", true);
    }
    btn.disabled = false; btn.textContent = "Find Shorts";
  }

  btn.addEventListener("click", doShortsSearch);
  inp.addEventListener("keypress", e => { if (e.key === "Enter") doShortsSearch(); });
});

