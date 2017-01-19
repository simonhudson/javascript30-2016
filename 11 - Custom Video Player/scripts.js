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
const togglePlay = () => video[(video.paused ? 'play' : 'pause')]();
const updateButton = () => toggle.textContent = this.paused ? '►' : '❚ ❚';
const handleProgress = () => progressBar.style.flexBasis = `${(video.currentTime / video.duration) * 100}%`;
const scrub = (e) => video.currentTime = (e.offsetX / progress.offsetWidth) * video.duration;
const setDuration = () => timeDuration.textContent = formattedTime(video.duration);
const setElapsed = () => timeElapsed.textContent = formattedTime(video.currentTime);
const toggleMute = () => video.muted = !video.muted;
const strPadLeft = (string, pad, length) => (new Array(length+1).join(pad)+string).slice(-length);
const setFullScreen = () => {

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

function skip() {
	video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
	video[this.name] = parseFloat(this.value);
}

const formattedTime = (time) => {
	time = Math.floor(time);
	const minutes = Math.floor(time / 60);
	const seconds = time - minutes * 60;
	return strPadLeft(minutes, '0', 2) + ':' + strPadLeft(seconds, '0', 2);
};

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
