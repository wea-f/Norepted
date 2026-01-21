const urlInput = document.getElementById("link");
const launch = document.getElementById("launch");
const feedbackMessage = document.getElementById("feedbackMessage");
const videoPlayersContainer = document.getElementById("videoPlayersContainer");
const loadStatus = document.getElementById("loadStatus");
const unhelpfulText = document.getElementById("offtext");

// --- CONSTANTS ---
const INITIAL_VIDEO_WIDTH = 688;
const INITIAL_VIDEO_HEIGHT = 387;
const RESIZE_STEP = 0.10;
const ASPECT_RATIO = 0.5625;

function showToast(message, isError = false) {
    const toast = document.createElement("div");
    toast.className = "toast-notification";
    if (isError) toast.style.borderColor = "#D73939"; // Red border for errors
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 10);
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

function extractVideoId(url) {
    if (/playlist|\/channel\/|\/@/.test(url)) return null;
    const patterns = [
        /youtu\.be\/([\w-]{11})/,
        /[?&]v=([\w-]{11})/,
        /embed\/([\w-]{11})/,
        /shorts\/([\w-]{11})/,
        /googleusercontent\.com\/youtube\.com\/5\/([\w-]{11})/,
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) return match[1];
    }
    return null;
}

function preflightCheck(videoId) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        let done = false;
        img.onload = () => {
            if (!done) {
                done = true;
                resolve();
            }
        };
        img.onerror = () => {
            if (!done) {
                done = true;
                reject("This video is unavailable or blocked.");
            }
        };
        img.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
        setTimeout(() => {
            if (!done) {
                done = true;
                reject("Network blocked video access.");
            }
        }, 1500);
    });
}

// --- PERSISTENCE UTILS ---
function saveOpenVideos() {
    const videos = [];
    const wrappers = videoPlayersContainer.querySelectorAll(
        ".video-unit-wrapper",
    );
    wrappers.forEach((wrapper) => {
        if (wrapper.dataset.videoId) {
            videos.push(wrapper.dataset.videoId);
        }
    });
    localStorage.setItem("savedVideos", JSON.stringify(videos));
}

function loadSavedVideos() {
    const saved = localStorage.getItem("savedVideos");
    if (saved) {
        try {
            const videoIds = JSON.parse(saved);
            [...videoIds].reverse().forEach((videoId) => {
                addVideoPlayer(videoId, false);
            });
        } catch (e) {
            console.error("Failed to load saved videos", e);
        }
    }
}

// --- VIDEO PLAYER LOGIC ---
function addVideoPlayer(videoId, showLoadedFeedback = true) {
    if (unhelpfulText) {
        unhelpfulText.classList.remove("active");
        unhelpfulText.style.display = "none";
    }

    if (!videoId) return showToast("Invalid YouTube URL.", true);

    const videoUnitWrapper = document.createElement("div");
    videoUnitWrapper.classList.add("video-unit-wrapper", "fade-in");
    videoUnitWrapper.dataset.videoId = videoId;

    // --- OPTIMIZED ATTRIBUTES ---
    const iframe = document.createElement("iframe");
    const origin = window.location.origin;
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?origin=${origin}`;

    iframe.setAttribute("frameborder", "0");
    iframe.loading = "lazy";
    iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.borderRadius = "8px";

    // Spinner load
    const loadingOverlay = document.createElement("div");
    loadingOverlay.className = "video-loading-overlay";
    const spinner = document.createElement("div");
    spinner.className = "spinner";
    loadingOverlay.appendChild(spinner);

    iframe.onload = () => {
        loadingOverlay.classList.add("hidden");
        setTimeout(() => loadingOverlay.remove(), 300);
    };

    const videoDisplay = document.createElement("div");
    videoDisplay.classList.add("video-display");
    videoDisplay.style.width = `${INITIAL_VIDEO_WIDTH}px`;
    videoDisplay.style.height = `${INITIAL_VIDEO_HEIGHT}px`;
    videoDisplay.dataset.initialWidth = INITIAL_VIDEO_WIDTH;
    videoDisplay.dataset.initialHeight = INITIAL_VIDEO_HEIGHT;

    const closeButton = document.createElement("button");
    closeButton.textContent = "X";
    closeButton.title = "Close Video";
    closeButton.classList.add("close-video-button");
    closeButton.addEventListener("click", () => {
        videoUnitWrapper.remove();
        saveOpenVideos();
        if (videoPlayersContainer.children.length === 0 && unhelpfulText) {
            unhelpfulText.classList.add("active");
            unhelpfulText.style.display = "block";
        }
    });

    videoDisplay.appendChild(loadingOverlay);
    videoDisplay.appendChild(iframe);
    videoDisplay.appendChild(closeButton);

    // --- CONTROLS SIDEBAR ---
    const sizeControls = document.createElement("div");
    sizeControls.classList.add("video-size-controls");

    const createCtrlBtn = (text, cls, title, action) => {
        const btn = document.createElement("button");
        btn.innerHTML = text;
        btn.className = `size-button ${cls}`;
        btn.title = title;
        btn.addEventListener("click", action);
        return btn;
    };

    // Plus
    sizeControls.appendChild(
        createCtrlBtn("+", "plus", "Increase Size", () => {
            const w = videoDisplay.offsetWidth * (1 + RESIZE_STEP);
            resizeVideoElement(videoDisplay, w);
        }),
    );

    // Minus
    sizeControls.appendChild(
        createCtrlBtn("\u2212", "minus", "Decrease Size", () => {
            const w = videoDisplay.offsetWidth * (1 - RESIZE_STEP);
            resizeVideoElement(videoDisplay, w);
        }),
    );

    // Reset
    sizeControls.appendChild(
        createCtrlBtn("\u21BA", "default", "Reset Size", () => {
            const w = parseInt(videoDisplay.dataset.initialWidth);
            resizeVideoElement(videoDisplay, w);
        }),
    );

    // Copy Button (SVG)
    const copySvg = `<svg viewBox="0 0 24 24" width="16" height="16" fill="white"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>`;
    const copyBtn = createCtrlBtn(
        copySvg,
        "copy-mini",
        "Copy Video Link",
        () => {
            const finalLink = `https://www.youtube-nocookie.com/embed/${videoId}`;
            window.open(finalLink, '_blank').focus();
            navigator.clipboard.writeText(finalLink);
            showToast("Video Link Copied and Opened!");
        },
    );
    copyBtn.style.marginTop = "10px";
    copyBtn.style.backgroundColor = "#AB47BC";

    sizeControls.appendChild(copyBtn);

    videoUnitWrapper.appendChild(videoDisplay);
    videoUnitWrapper.appendChild(sizeControls);
    videoPlayersContainer.prepend(videoUnitWrapper);

    if (typeof fadeInObserver !== "undefined")
        fadeInObserver.observe(videoUnitWrapper);

    if (showLoadedFeedback) {
        showToast("Video Loaded Successfully!");
    }
    saveOpenVideos();
}

function resizeVideoElement(elementToResize, newWidth) {
    const newHeight = newWidth * ASPECT_RATIO;
    elementToResize.style.width = `${Math.round(newWidth)}px`;
    elementToResize.style.height = `${Math.round(newHeight)}px`;
}

// --- LAUNCH HANDLER ---
if (launch) {
    launch.addEventListener("click", async () => {
        const url = urlInput.value.trim();
        if (!url) return showToast("Please paste a YouTube link first.");

        const videoId = extractVideoId(url);
        if (!videoId)
            return showToast("That doesn't look like a valid YouTube link.");

        launch.disabled = true;
        showToast("Checking availability...");

        try {
            await preflightCheck(videoId);
            addVideoPlayer(videoId);
            urlInput.value = "";
        } catch (err) {
            showToast(err);
        } finally {
            launch.disabled = false;
        }
    });
}

// --- Button Functions ---
function toggleOptimization() {
    const toggle = document.getElementById("optToggle");
    const statusText = document.getElementById("optStatusText");
    const isOpt = toggle.checked;

    localStorage.setItem("optimizedMode", isOpt);

    // Update Text UI
    if (isOpt) {
        statusText.textContent = "Enabled";
        statusText.classList.remove("disabled");
        statusText.classList.add("enabled");
        document.body.classList.add("optimized");
    } else {
        statusText.textContent = "Disabled";
        statusText.classList.remove("enabled");
        statusText.classList.add("disabled");
        document.body.classList.remove("optimized");
    }

    // Handle Particles visibility
    const pContainer = document.getElementById("particles-js");
    if (pContainer) pContainer.style.display = isOpt ? "none" : "block";
}

function clearAllVideos() {
    videoPlayersContainer.innerHTML = "";
    if (unhelpfulText) {
        unhelpfulText.classList.add("active");
        unhelpfulText.style.display = "block";
    }
    localStorage.removeItem("savedVideos");
}

// --- MAIN INIT ---
document.addEventListener("DOMContentLoaded", () => {
    // Check saved mode
    const savedMode = localStorage.getItem("optimizedMode") === "true";
    const toggle = document.getElementById("optToggle");

    // Set initial UI state
    if (toggle) {
        toggle.checked = savedMode;
        const statusText = document.getElementById("optStatusText");
        if (savedMode) {
            statusText.textContent = "Enabled";
            statusText.classList.add("enabled");
            document.body.classList.add("optimized");
            const pContainer = document.getElementById("particles-js");
            if (pContainer) pContainer.style.display = "none";
        } else {
            statusText.classList.add("disabled");
        }
    }

    loadSavedVideos();
});

// Toggle Instructions
const instBox = document.getElementById("instructions");
const settingsBox = document.getElementById("settings");
const hideBtn = document.querySelector(".hide-button");
const showBtn = document.querySelector(".show-button");

if (hideBtn && showBtn && instBox && settingsBox) {
    hideBtn.onclick = () => {
        instBox.style.display = "none";
        settingsBox.style.display = "none";
        showBtn.style.display = "block";
    };
    showBtn.onclick = () => {
        instBox.style.display = "block";
        settingsBox.style.display = "block";
        showBtn.style.display = "none";
    };
}
