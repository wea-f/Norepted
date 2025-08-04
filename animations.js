// Wait for DOM to be ready before initializing
document.addEventListener('DOMContentLoaded', () => {
    const fadeInElems = document.querySelectorAll('.fade-in');

    // Intersection Observer Constraints
    const observerOptions = {
        root: null,
        rootMargin: '0px', 
        threshold: 0.0
    };

    const fadeInObserver = new IntersectionObserver((entries) => {
        // Use requestAnimationFrame to batch DOM updates
        requestAnimationFrame(() => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                } else {
                    entry.target.classList.remove('active');
                }
            });
        });
    }, observerOptions);

    // Initialize observer and visible elements
    fadeInElems.forEach(elem => {
        fadeInObserver.observe(elem);

        // Check if initially visible
        const rect = elem.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        if (isVisible) {
            elem.classList.add('active');
        }
    });

    window.fadeInObserver = fadeInObserver;
});

// keyboard shortcuts
document.addEventListener('keyup', function(e) {
  switch(e.key) {
    case "Enter":
      if (window.launch) window.launch.click();
      break;
    case "0":
      e.preventDefault();
      e.stopPropagation();
      window.location.replace("https://www.google.com/webhp?igu=1");
      break;
    case "1":
      e.preventDefault();
      e.stopPropagation();
      document.title = "My Drive - Google Drive";
      if (window.setFavicons) {
        setFavicons("https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png");
      }
      break;
  }
}, { passive: false });
