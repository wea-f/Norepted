var DELAYa = prompt("Directions: \n 1. Enter CPS \n 2. Click an element \n 3. Click the same spot to stop. \n \n Enter the CPS (clicks per second). Enter 0 to cancel: "); 
var shouldRun = true;
if (DELAYa == 0) {
	shouldRun = false;
}
var DELAY = 1000 / DELAYa;

var autoClickerStyleElement = document.createElement("style");
autoClickerStyleElement.innerHTML = "*{cursor: crosshair !important;}";
document.body.appendChild(autoClickerStyleElement);

function addClicker(e) {
	if (!e.isTrusted || !shouldRun) {
		return;
	}
	
	// Remove crosshair cursor and event listener
	document.body.removeChild(autoClickerStyleElement);
	document.body.removeEventListener("click", addClicker);
	e.preventDefault();
	
	e.target.classList.add("auto-clicker-target");
	
	// Add click listener to the target element for starting/stopping
	e.target.addEventListener("click", function(clickEvent) {
		if (!clickEvent.isTrusted) {
			return;
		}
		
		if (e.target.classList.contains("auto-clicker-active")) {
			// Stop autoclicking
			e.target.classList.remove("auto-clicker-active");
		} else {
			// Start autoclicking
			e.target.classList.add("auto-clicker-active");
			autoClick(e.target);
		}
		clickEvent.preventDefault();
	});
	
	
}

function autoClick(element) {
	if (element.classList.contains("auto-clicker-active")) {
		element.click();
		setTimeout(function() {
			autoClick(element);
		}, DELAY);
	}
}

document.body.addEventListener("click", addClicker, 0);


