const urlInput = document.getElementById("link");
const launch = document.getElementById('launch');
const feedbackMessage = document.getElementById('feedbackMessage');
const videoPlayersContainer = document.getElementById('videoPlayersContainer');
let lastVideoWrapper = null;
const unhelpfulText = document.getElementById("offtext");

// Add video will show below text
if (videoPlayersContainer.children.length === 0) {
		unhelpfulText.classList.add('active');
}
showFeedback("","");

// Resizing Video
const INITIAL_VIDEO_WIDTH = 688;
const INITIAL_VIDEO_HEIGHT = 387;
const RESIZE_STEP = 0.09;
const ASPECT_RATIO = 0.5625;

// Add frame to container
function addVideoPlayer(videoId) {
	unhelpfulText.classList.remove('active');
	unhelpfulText.style.display = 'none';

	if (!videoId) {
			console.error("Invalid video ID.");
			return;
	}

	const videoUnitWrapper = document.createElement('div'); 
	videoUnitWrapper.classList.add('video-unit-wrapper', 'fade-in');
	videoUnitWrapper.style.position = 'relative'; // Anchor it. Needed for absolute positioning of controls

	// The video display (iframe + close button) div - center
	const videoDisplay = document.createElement('div');
	videoDisplay.classList.add('video-display');

	// Store default size on videoDisplay, as this is the element whose size changes
	videoDisplay.style.width = `${INITIAL_VIDEO_WIDTH}px`;
	videoDisplay.style.height = `${INITIAL_VIDEO_HEIGHT}px`;
	videoDisplay.dataset.initialWidth = INITIAL_VIDEO_WIDTH;
	videoDisplay.dataset.initialHeight = INITIAL_VIDEO_HEIGHT;

	// Video iframe
	const iframe = document.createElement('iframe');
	iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}`;
	iframe.setAttribute('frameborder', '0');
	iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
	iframe.allowFullscreen = true;
	iframe.style.width = '100%';
	iframe.style.height = '100%';
	iframe.style.borderRadius = '8px';

	// "X" button
	const closeButton = document.createElement('button');
	closeButton.textContent = 'X';
	closeButton.title = "Close Video";
	closeButton.classList.add('close-video-button');
	closeButton.addEventListener('click', () => {
			videoUnitWrapper.remove(); // Remove the entire unit
			if (videoPlayersContainer.children.length === 0) {
					unhelpfulText.classList.add('active');
					unhelpfulText.style.display = 'block';
			}
	});

	videoDisplay.appendChild(iframe);
	videoDisplay.appendChild(closeButton);

	// Size controls - abs pos, side of display
	const sizeControls = document.createElement('div');
	sizeControls.classList.add('video-size-controls');

	const minusButton = document.createElement('button');
	minusButton.textContent = '\u2212';
	minusButton.classList.add('size-button', 'minus');
	minusButton.title = "Decrease Size";
	minusButton.addEventListener('click', () => {
			const currentWidth = videoDisplay.offsetWidth; // Resize videoDisplay
			const newWidth = currentWidth * (1 - RESIZE_STEP);
			resizeVideoElement(videoDisplay, newWidth); // Pass videoDisplay
	});

	const plusButton = document.createElement('button');
	plusButton.textContent = '+';
	plusButton.title = "Increase Size";
	plusButton.classList.add('size-button', 'plus');
	plusButton.addEventListener('click', () => {
			const currentWidth = videoDisplay.offsetWidth; // Resize videoDisplay
			const newWidth = currentWidth * (1 + RESIZE_STEP);
			resizeVideoElement(videoDisplay, newWidth); // Pass videoDisplay
	});

	const defaultButton = document.createElement('button');
	defaultButton.textContent = '\u21BA'; // Reset icon
	defaultButton.title = "Reset Size";
	defaultButton.classList.add('size-button', 'default');
	defaultButton.addEventListener('click', () => {
			const initialWidth = parseInt(videoDisplay.dataset.initialWidth); // Use dataset from videoDisplay
			resizeVideoElement(videoDisplay, initialWidth); // Pass videoDisplay
	});

	sizeControls.appendChild(plusButton);
	sizeControls.appendChild(minusButton);
	sizeControls.appendChild(defaultButton);

	// Append videoDisplay and sizeControls to the videoUnitWrapper
	videoUnitWrapper.appendChild(videoDisplay);
	videoUnitWrapper.appendChild(sizeControls);

	// Update lastVideoWrapper to point to videoDisplay, for each size control
	lastVideoWrapper = videoDisplay;

	// Add the new video unit to the container
	videoPlayersContainer.insertBefore(videoUnitWrapper, videoPlayersContainer.firstChild);
	fadeInObserver.observe(videoUnitWrapper); // Observe the top-level unit wrapper
	
	console.log(iframe.src);
}

// Launch
launch.addEventListener('click', async () => {
	const url = urlInput.value.trim();

	if (url) {
		showFeedback('Loading video...', 'orange');
		launch.disabled = true;
		try {
			const videoId = extractVideoId(url);
			if (videoId) {
				addVideoPlayer(videoId);
				showFeedback('Video succesfully loaded!', 'green');

				// Delay, remove feedback message
				setTimeout(() => {
					showFeedback('', '');
				}, 3000);

				urlInput.value = '';
			} else {
				showFeedback('Invalid YouTube URL.', 'red');
			}
		} catch (error) {
			showFeedback(`Error: ${error.message}`, 'red');
			console.error("Error:", error);

		} finally {
			launch.disabled = false; // re-enable the button
		}
	} else {
		showFeedback('Please enter a YouTube URL.', '#D73939');
		setTimeout(() => {
						showFeedback('', '');
				}, 3000);
	}

	if (videoPlayersContainer.children.length === 0) {
		unhelpfulText.classList.add('active');
		unhelpfulText.style.display = 'block';
	}
});
// Feedback Message
function showFeedback(message, color) {
	feedbackMessage.textContent = message;
	feedbackMessage.style.color = color;

	if (message) {
		feedbackMessage.classList.add('active');
	} else {
		feedbackMessage.classList.remove('active');
	}
}

document.addEventListener('DOMContentLoaded', () => {
		showFeedback('', ''); 
});

function extractVideoId(url) {
	const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
	const googleusercontentRegex = /http:\/\/googleusercontent\.com\/youtube\.com\/5\/([\w-]{11})/i;

	let match = url.match(youtubeRegex);
	if (match && match[1]) {
		return match[1];
	}

	match = url.match(googleusercontentRegex);
	if (match && match[1]) {
		return match[1];
	}

	return null; // No valid ID found
}

// Video Size Controls
function decreaseSize() {
	if (lastVideoWrapper) {
			const currentWidth = lastVideoWrapper.offsetWidth;
			const newWidth = currentWidth * (1 - RESIZE_STEP);
			resizeVideoElement(lastVideoWrapper, newWidth);
	}
}

function increaseSize() {
	if (lastVideoWrapper) {
			const currentWidth = lastVideoWrapper.offsetWidth;
			const newWidth = currentWidth * (1 + RESIZE_STEP);
			resizeVideoElement(lastVideoWrapper, newWidth);
	}
}

function defaultSize() {
	if (lastVideoWrapper) {
			const initialWidth = parseInt(lastVideoWrapper.dataset.initialWidth);
			resizeVideoElement(lastVideoWrapper, initialWidth);
	}
}

function resizeVideoElement(elementToResize, newWidth) {
		const initialWidth = parseInt(elementToResize.dataset.initialWidth);
		const initialHeight = parseInt(elementToResize.dataset.initialHeight);

		const newHeight = newWidth * ASPECT_RATIO;

		elementToResize.style.width = `${Math.round(newWidth)}px`;
		elementToResize.style.height = `${Math.round(newHeight)}px`;
}


// Hide/Show Instructions
const hideButton = document.querySelector('.hide-button');
const showButton = document.querySelector('.show-button');
const instructionsDiv = document.getElementById('instructions');

hideButton.addEventListener('click', () => {
	instructionsDiv.classList.remove('active');
	instructionsDiv.querySelectorAll('.fade-in').forEach(elem => {
		elem.classList.remove('active');
	});
	instructionsDiv.style.display = 'none';

	hideButton.classList.remove("active");
	showButton.classList.add("active");
	
	hideButton.style.display = 'none';
	showButton.style.display = 'block';
});

showButton.addEventListener('click', () => {
	instructionsDiv.style.display = 'block';
	instructionsDiv.classList.add('active');

	showButton.classList.remove("active");
	hideButton.classList.add("active");
	
	showButton.style.display = 'none';
	hideButton.style.display = 'block';

});


// Copy link
function copy_link() {
	var link = document.getElementById("link").value;
	var video_id = extractVideoId(link);

	if (video_id) {
		var final_link = "https://www.youtube-nocookie.com/embed/" + video_id;
		navigator.clipboard.writeText(final_link);
		showFeedback('Link copied!', 'green');
		setTimeout(() => showFeedback('', ''), 2000);
	} else {
		showFeedback('Please enter a valid YouTube URL to copy.', 'red');
	}
}



