function setFavicons(favImg) {
  let headTitle = document.querySelector("head");
  let setFavicon = document.createElement("link");
  setFavicon.setAttribute("rel", "shortcut icon");
  setFavicon.setAttribute("href", favImg);
  headTitle.appendChild(setFavicon);
}

function fix_link() {
  var link = document.getElementById("link").value
  
  var link2 = link.replace(/ /gi, "")
  var video_id = link.replace("https://www.youtube.com/watch?v=", "")
  video_id = video_id.replace("https://youtu.be/", "")
  //video_id = video_id.replace("&feature=emb_rel_pause", "")
  video_id = video_id.replace("&embeds_euri=https%3A%2F%2Fcdpn.io%2F&feature=emb_rel_end", "")
  var final_link = "https://www.youtube-nocookie.com/embed/" + video_id
  final_link = final_link.replace("&feature=emb_rel_end","")
  document.getElementById("video")
.src = final_link
  document.getElementById("video").style.border = "1px solid white";

}

document.body.onkeyup = function(c) {
  if (c.key == "Enter" ||
      c.code == "Enter" ||      
      c.keyCode == 13      
  ) {
    fix_link()
    
  }
  else if (c.key == "0") {
    c.preventDefault();
    c.stopPropagation();
    window.location.replace("https://www.google.com/webhp?igu=1");
  }
  else if (c.key == "1") {
    c.preventDefault();
    c.stopPropagation();
    document.title = "My Drive - Google Drive";
setFavicons("https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png");
  }
}

function copy_link() {
    var link = document.getElementById("link").value
    var link2 = link.replace(/ /gi, "")
    var video_id = link.replace("https://www.youtube.com/watch?v=", "")
    video_id = video_id.replace("https://youtu.be/", "")
    video_id = video_id.replace("&feature=emb_rel_pause", "")
    video_id = video_id.replace("&embeds_euri=https%3A%2F%2Fcdpn.io%2F&feature=emb_rel_end","")
    var final_link = "https://www.youtube-nocookie.com/embed/" + video_id
    navigator.clipboard.writeText(final_link)
}

function how_it_works() {
    window.open("https://github.com/wea-f/Norepted/tree/master")
}

function aboutblank() {
    let url = window.location.href;
    var w = window.open("about:blank", "_blank");
    w.document.write('<iframe style="position: absolute;top: 0px;bottom: 0px;right: 0px;width: 100%;border: none;margin: 0;padding: 0;overflow: hidden;z-index: 99999;height: 100%;" src="' + url + '"></iframe>');
    window.close('','_parent','');

}
// //SCROLL ANIMATION
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

