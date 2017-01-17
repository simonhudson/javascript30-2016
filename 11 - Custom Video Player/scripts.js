/* Get Our Elements */
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const timeElapsed = player.querySelector('.player__elapsed');
const timeDuration = player.querySelector('.player__duration');
const mute = player.querySelector('.player__mute');
const fullScreen = player.querySelector('.player__fullscreen');

/* Build functions */
function togglePlay() {
	const method = video.paused ? 'play' : 'pause';
	video[method]();
}

function updateButton() {
	const icon = this.paused ? '►' : '❚ ❚';
	toggle.textContent = icon;
}

function skip() {
	video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
	video[this.name] = parseFloat(this.value);
}

function handleProgress() {
	const percent = (video.currentTime / video.duration) * 100;
	progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
	const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
	video.currentTime = scrubTime;
}

function strPadLeft(string, pad, length) {
	return (new Array(length+1).join(pad)+string).slice(-length);
}

function formattedTime(time) {
	time = Math.floor(time);
	const minutes = Math.floor(time / 60);
	const seconds = time - minutes * 60;

	return strPadLeft(minutes, '0', 2) + ':' + strPadLeft(seconds, '0', 2);
}

function setDuration() {
	timeDuration.textContent = formattedTime(video.duration);
}

function setElapsed() {
	timeElapsed.textContent = formattedTime(video.currentTime);
}

function toggleMute() {
	video.muted = !video.muted;
}

function setFullScreen() {

	// Need vendor prefixes as browser support is flaky at the moment
	if (video.requestFullscreen)
		video.requestFullscreen();
	if (video.webkitRequestFullscreen)
		video.webkitRequestFullscreen();
	if (video.mozRequestFullScreen)
		video.mozRequestFullScreen();
	if (video.msRequestFullscreen)
		video.msRequestFullscreen();

}

/* Hook up event listeners */
video.addEventListener('loadedmetadata', setDuration);
video.addEventListener('loadedmetadata', setElapsed);

video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);
video.addEventListener('timeupdate', setElapsed);

toggle.addEventListener('click', togglePlay);

mute.addEventListener('click', toggleMute);
fullScreen.addEventListener('click', setFullScreen);

skipButtons.forEach(button => button.addEventListener('click', skip));

ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));

let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);
