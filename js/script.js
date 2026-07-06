// ─── NAVIGATION ───────────────────────────────────────
function switchTab(tabName) {
  // Map the tab names from your buttons to their respective clean routes
  const routes = {
    'landing': '/',
    'watch': '/watch',
    'shorts': '/shorts',
    'browser': '/browser',
    'about': '/about'
  };
  
  const targetUrl = routes[tabName];
  
  if (targetUrl) {
    // Navigate to the new page (e.g., website/about without the .html)
    window.location.assign(targetUrl);
  } else {
    console.warn(`Route not defined for tab: ${tabName}`);
  }
//   document.querySelectorAll('.spa-section').forEach(el => el.classList.remove('active-section'));

//   const target = document.getElementById('view-' + tabName);
//   if (!target) return;
//   target.classList.add('active-section');

//   // Show / hide site chrome for browser mode
//   const navbar  = document.getElementById('site-navbar');
//   const footer  = document.getElementById('site-footer');
//   if (tabName === 'browser') {
//     if (navbar) navbar.style.display = 'none';
//     if (footer) footer.style.display = 'none';
//   } else {
//     if (navbar) navbar.style.display = '';
//     if (footer) footer.style.display = '';
//     // Only scroll to top when NOT adding a video from search
//     window.scrollTo(0, 0);
//   }

//   // Update active nav highlight
//   document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active-nav'));
//   const activeBtn = document.getElementById('nav-' + tabName);
//   if (activeBtn) activeBtn.classList.add('active-nav');

// // Retrigger fade-ins for newly shown section
//  ,if (window.fadeInObserver) {
//     target.querySelectorAll('.fade-in:not(.active)').forEach(el => window.fadeInObserver.observe(el));
//   }

//   // Pause shorts when navigating away, restore when coming back
//   const shortsWrap = document.getElementById('shortsFrameWrap');
//   if (shortsWrap) {
//     if (tabName !== 'shorts') {
//       shortsWrap.querySelectorAll('iframe').forEach(f => {
//         if (f.src) { f.dataset.savedSrc = f.src; f.src = ''; }
//       });
//     } else {
//       if (shortsQueue.length > 0) buildShortsFrame(shortsQueue[shortsIndex], false);
//     }
//   }
}


// ─── ENTER KEY — context-aware ─────────────────────────
// Triggers search if cursor is in search box, launches if cursor is in link box
document.addEventListener("keyup", function(e) {
  if (e.key !== "Enter") return;

  // Do nothing inside the browser section
  const browserView = document.getElementById('view-browser');
  if (browserView && browserView.classList.contains('active-section')) return;

  const focused = document.activeElement;

  if (focused && focused.id === 'ytSearchInput') {
    document.getElementById('ytSearchBtn')?.click();
  } else if (focused && focused.id === 'shortsSearchInput') {
    document.getElementById('shortsSearchBtn')?.click();
  } else if (focused && focused.id === 'shortsPasteInput') {
    addShortsFromUrl();
  } else {
    // Default: launch video
    const launchBtn = document.getElementById("launch");
    if (launchBtn && !launchBtn.disabled) launchBtn.click();
  }
}, { passive: false });

// ─── EXTRACT SHORTS ID (shared: used on Watch and Shorts pages) ──
function extractShortsId(url) {
  const shortsMatch = url.match(/shorts\/([\w-]{11})/);
  if (shortsMatch) return shortsMatch[1];

  if (/playlist|\/channel\/|\/@/.test(url)) return null;
  const fallbackPatterns = [
    /youtu\.be\/([\w-]{11})/,
    /[?&]v=([\w-]{11})/,
    /embed\/([\w-]{11})/,
    /googleusercontent\.com\/youtube\.com\/5\/([\w-]{11})/,
  ];
  for (const p of fallbackPatterns) {
    const m = url.match(p);
    if (m && m[1]) return m[1];
  }
  return null;
}

function setFavicons(favImg) {
  const link = document.createElement("link");
  link.setAttribute("rel", "shortcut icon");
  link.setAttribute("href", favImg);
  document.head.appendChild(link);
}

// ─── MAIN INIT ────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  // ── changelog modal ──────────────────────────────────
  const CHANGELOG_VERSION = '1.7';
  const modal = document.getElementById('changelog-modal');
  if (modal) {
    if (localStorage.getItem('cl_seen') !== CHANGELOG_VERSION) {
      // show it
      modal.classList.remove('hidden');
      document.body.classList.add("modal-open");
    }
    document.getElementById('cl-dismiss').addEventListener('click', () => {
      modal.classList.add('hidden');
      document.body.classList.remove("modal-open");
      localStorage.setItem('cl_seen', CHANGELOG_VERSION);
    });
  }
  // ─────────────────────────────────────────────────────
  // Fetch api
  if (typeof initializeLiveSources === "function") {
    initializeLiveSources();
  }
  //-------------
  const saved = localStorage.getItem("optimizedMode");
  const savedMode = saved === null ? shouldDefaultToOptimized() : saved === "true";
  const toggle = document.getElementById("optToggle");
  if (toggle) {
    toggle.checked = savedMode;
    const st = document.getElementById("optStatusText");
    if (savedMode) {
      if (st) { st.textContent = "On"; st.className = "status-indicator enabled"; }
      document.body.classList.add("optimized");
      const pC = document.getElementById("particles-js");
      if (pC) pC.style.display = "none";
    }
  }
  initParticles();
  if (typeof loadSavedVideos === "function") {
    loadSavedVideos();
  }
  const pageToNavId = {
    '/': 'nav-landing',
    '/watch': 'nav-home',
    '/shorts': 'nav-shorts',
    '/about': 'nav-about',
    '/browser': 'nav-browser',
  };
  const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
  const activeNavId = pageToNavId[currentPath];
  document.querySelectorAll('.nav-btn').forEach((btn) => btn.classList.remove('active-nav'));
  if (activeNavId) {
    const activeBtn = document.getElementById(activeNavId);
    if (activeBtn) activeBtn.classList.add('active-nav');
  }
});

// ─── TIME AGO HELPER ──────────────────────────────────
function timeAgo(isoString) {
  const diff = (Date.now() - new Date(isoString)) / 1000;
  if (diff < 60)     return 'just now';
  if (diff < 3600)   return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400)  return `${Math.floor(diff/3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff/86400)}d ago`;
  if (diff < 2592000)return `${Math.floor(diff/604800)}w ago`;
  if (diff < 31536000)return`${Math.floor(diff/2592000)} mo ago`;
  return `${Math.floor(diff/31536000)}y ago`;
}

// ─── YOUTUBE SEARCH ───────────────────────────────────
async function searchYouTube(query, forShorts = false) {
  const WORKER_URL = 'https://roj32.norepted.workers.dev';

  const params = new URLSearchParams({ q: query, shorts: forShorts });

  try {
    const res = await fetch(`${WORKER_URL}?${params}`);
    const data = await res.json();

    if (!res.ok || data.error) {
      const message = data.error || `Server returned status ${res.status}`;
      console.error("Proxy error details:", data);
      showToast("YouTube search failed: " + message, true);
      return null;
    }

    return data.items || [];
  } catch(e) {
    console.error("YouTube search request failed", e);
    showToast("Search failed. Check console or network connections.", true);
    return null;
  }
}
function renderSearchResults(items) {
  const container = document.getElementById("ytSearchResults");
  const clearBtn  = document.getElementById("clearSearchBtn");
  if (!container) return;
  container.innerHTML = ""; container.style.display = "grid";
  if (clearBtn) clearBtn.style.display = "inline-flex";

  if (!items || items.length === 0) {
    container.innerHTML = `<p style="color:var(--text-muted);grid-column:1/-1;text-align:center;padding:20px;">No results found.</p>`;
    return;
  }

  items.forEach(video => {
    const videoId = video.id && video.id.videoId;
    if (!videoId) return;
    const sn    = video.snippet || {};
    const title = sn.title || "Untitled";
    const channel = sn.channelTitle || "";
    const thumb = ((sn.thumbnails||{}).medium || (sn.thumbnails||{}).default || {}).url
                  || `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
    const dateStr = sn.publishedAt ? timeAgo(sn.publishedAt) : '';

    const card = document.createElement("div");
    card.className = "search-result-card";
    card.innerHTML = `
      <div class="search-thumb-wrap">
        <img src="${thumb}" alt="" loading="lazy">
      </div>
      <div class="search-card-info">
        <p class="search-card-title">${title}</p>
        <p class="search-card-channel">${channel}</p>
        ${dateStr ? `<p class="search-card-date">${dateStr}</p>` : ''}
      </div>`;
    card.addEventListener("click", () => {
      // Stay on page — no switchTab call — just add and scroll down
      addVideoPlayer(videoId);
      showToast("Video added!");
      const vs = document.getElementById("videoPlayersContainer");
      if (vs) setTimeout(() => vs.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
    });
    container.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const searchBtn   = document.getElementById("ytSearchBtn");
  const searchInput = document.getElementById("ytSearchInput");
  if (!searchBtn || !searchInput) return;

  async function doSearch() {
    const q = searchInput.value.trim(); if (!q) return;
    searchBtn.disabled = true; searchBtn.textContent = "Searching…";
    const r = document.getElementById("ytSearchResults");
    if (r) { r.style.display = "grid"; r.innerHTML = `<p style="color:var(--text-muted);grid-column:1/-1;text-align:center;padding:20px;">Loading…</p>`; }
    const cb = document.getElementById("clearSearchBtn"); if (cb) cb.style.display = "inline-flex";
    renderSearchResults(await searchYouTube(q));
    searchBtn.disabled = false; searchBtn.textContent = "Search";
  }
  searchBtn.addEventListener("click", doSearch);
  searchInput.addEventListener("keypress", e => { if (e.key === "Enter") doSearch(); });
});



// Keyboard shortcuts
document.addEventListener("keyup", e => {
  if (e.code === "Backslash") {
      e.preventDefault();
      e.stopPropagation();
      document.title = "My Drive - Google Drive";
      if (typeof setFavicons === "function") {
        setFavicons("https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png");
      }
      console.log("Pressed Backslash and tab successfully changed.");
  }
  if (e.code =="Minus") {
      e.preventDefault();
      e.stopPropagation();
      window.location.replace("https://www.google.com/webhp?igu=1");
  }
});
