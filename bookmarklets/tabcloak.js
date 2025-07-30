
var l = document.querySelector("link[rel*='icon']") || document.createElement("link");
l.type = "image/x-icon";
l.rel = "shortcut icon";

var c = prompt("Select a tab cloak\n1. Canvas dashboard\n2. Google Drive\n3. New Tab");
if (c == 1) {
  l.href = "https://harrisonburg.instructure.com/favicon.ico";
  document.title = "Dashboard";
} else if (c == 2) {
  l.href = "https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png";
  document.title = "My Drive - Google Drive";
} else if (c == 3) {
  l.href = "https://raw.githubusercontent.com/chromium/chromium/refs/heads/main/chrome/browser/resources/new_tab_page/icons/generic_globe.svg"; // base64 favicon
  document.title = "New Tab";
}

if (!l.parentNode) {
  document.getElementsByTagName("head")[0].appendChild(l);
}
