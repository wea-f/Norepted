
document.addEventListener("DOMContentLoaded", () => {
  const fadeInElems = document.querySelectorAll(".fade-in");

  const observerOptions = {
    root: null,
    rootMargin: "0px", 
    threshold: 0.0
  };

  const fadeInObserver = new IntersectionObserver((entries) => {
    requestAnimationFrame(() => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        } else {
          entry.target.classList.remove("active");
        }
      });
    });
  }, observerOptions);

  fadeInElems.forEach(elem => {
    fadeInObserver.observe(elem);
    const rect = elem.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (isVisible) {
      elem.classList.add("active");
    }
  });

  window.fadeInObserver = fadeInObserver;
});

document.addEventListener("keyup", function(e) {
  switch(e.key) {
  case "Enter":
    const launchBtn = document.getElementById("launch");
    if (launchBtn) launchBtn.click();
    break;
  case "-":
    e.preventDefault();
    e.stopPropagation();
    window.location.replace("https://www.google.com/webhp?igu=1");
    break;
  case "``":
    e.preventDefault();
    e.stopPropagation();
    document.title = "My Drive - Google Drive";
    if (typeof setFavicons === "function") {
      setFavicons("https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png");
    }
    break;
  }
}, { passive: false });

function setFavicons(favImg) {
  let headTitle = document.querySelector("head");
  let setFavicon = document.createElement("link");
  setFavicon.setAttribute("rel", "shortcut icon");
  setFavicon.setAttribute("href", favImg);
  headTitle.appendChild(setFavicon);
}

