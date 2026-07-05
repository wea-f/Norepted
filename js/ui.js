// ─── TOAST ────────────────────────────────────────────
function showToast(message, isError = false) {
  const toast = document.createElement("div");
  toast.className = "toast-notification";
  if (isError) { toast.style.borderColor = "#ef4444"; toast.style.color = "#f87171"; }
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => { toast.classList.remove("show"); setTimeout(() => toast.remove(), 500); }, 3000);
}

// ─── SETTINGS (ooptimized mode) 
function toggleOptimization() {
  const toggle = document.getElementById("optToggle");
  const statusText = document.getElementById("optStatusText");
  const isOpt = toggle.checked;
  localStorage.setItem("optimizedMode", isOpt);
  statusText.textContent = isOpt ? "On" : "Off";
  statusText.className = `status-indicator ${isOpt ? 'enabled' : 'disabled'}`;
  document.body.classList.toggle("optimized", isOpt);
  const pC = document.getElementById("particles-js");
  if (pC) pC.style.display = isOpt ? "none" : "block";
  if (isOpt) destroyParticles();
  else initParticles();
}

// About:Blank cloaker
function aboutblank() {
  const siteUrl = window.location.href;
  const win = window.open('about:blank', '_blank');
  if (!win || win.closed) { alert('Please allow popups for this feature.'); return; }
  const doc = win.document;
  doc.title = "My Drive";
  const iframe = doc.createElement('iframe');
  Object.assign(iframe.style, { position:'fixed', top:0, bottom:0, left:0, right:0, width:'100%', height:'100%', border:'none', margin:0, padding:0, overflow:'hidden', zIndex:999999 });
  iframe.src = siteUrl;
  doc.body.style.margin = '0';
  doc.body.appendChild(iframe);
}
