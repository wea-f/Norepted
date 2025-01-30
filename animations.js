// Fading in elements when scrolling
const fadeInElems = document.querySelectorAll('.fade-in');

const debounce = (fn) => {
  let frame;
  return (...params) => {
    if (frame) {
      cancelAnimationFrame(frame);
    }
    frame = requestAnimationFrame(() => {
      fn(...params);
    });
  }
};

const handleScroll = debounce(() => {
  const windowHeight = window.innerHeight;
  const scrollTop = window.scrollY;
  const scrollBottom = scrollTop + windowHeight;

  fadeInElems.forEach(elem => {
    const top = elem.offsetTop;
    const height = elem.offsetHeight;
    const bottom = top + height;
    const isBeforeBottom = bottom - scrollTop > 0;
    const isAfterTop = top < scrollBottom;

    if (isBeforeBottom && isAfterTop) {
      elem.classList.add('active');
    } else {
      elem.classList.remove('active');
    }
  });
});

document.addEventListener('scroll', handleScroll);


//Fade in elements on load
fadeInElems.forEach(elem => {
  const isVisible = (elem.offsetTop - window.scrollY) < window.innerHeight;
  if (isVisible) {
    elem.classList.add('active');
  } else {
    elem.classList.remove('active');
  }
});


