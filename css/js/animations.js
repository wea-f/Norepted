// ─── PARTICLES (performance optimizations v1.7) ─
function shouldDefaultToOptimized() {
// debug:
  console.log(
    "[Optimization]",
    {
      reduceMotion:
        window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      cores: navigator.hardwareConcurrency,
      ram: navigator.deviceMemory
    }
  );

  return (
    navigator.hardwareConcurrency <= 4 ||
    navigator.deviceMemory <= 4

  );
}

function destroyParticles() {
  try {
    const dom = window.pJSDom?.[0];
    if (dom?.pJS?.fn?.vendors?.destroy) dom.pJS.fn.vendors.destroy();
    window.pJSDom = [];
  } catch(e) {}
}

function initParticles() {
  if (document.body.classList.contains("optimized")) return;
  if (!window.particlesJS || window.pJSDom?.length) return;
//   Reduce value
  particlesJS("particles-js", {
     particles: {
       number: { value: 43, density: { enable: true, value_area: 1100 } },
       color: { value: ["#ffffff", "#F5A27A", "#F57C00"] },
       shape: { type: "circle" },
       opacity: { value: 0.45, random: true, anim: { enable: false } },
       size: { value: 2.4, random: true, anim: { enable: false } },
       line_linked: { enable: false },
       move: {
         enable: true,
         speed: 1.4,
         direction: "top",
         random: true,
         straight: false,
         out_mode: "out",
         bounce: false
       }
     },
     interactivity: {
       detect_on: "canvas",
       events: { onhover: { enable: false }, onclick: { enable: false }, resize: false }
     },
     retina_detect: false
   });
 }

document.addEventListener("visibilitychange", () => {
  try {
    const pJS = window.pJSDom?.[0]?.pJS;
    if (pJS) pJS.particles.move.enable = !document.hidden;
  } catch (e) {}
})

// ─── FADE-IN domcl ─────────────────
document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.0 });

  document.querySelectorAll(".fade-in").forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight) {
      el.classList.add("active");
    } else {
      observer.observe(el);
    }
  });
  window.fadeInObserver = observer;
});
// Nav button highlighting is handled once in script.js (DOMContentLoaded)
