function AudioPlayer() {
};

AudioPlayer.prototype.play = function(url) {
	console.log("[Plugin] Playing audio file");
	cordova.exec(null, null, "AudioPlayer", "playAudio", [url]);
};

/**
 * Load VideoPlayer
 */

if(!window.plugins) {
    window.plugins = {};
}
if (!window.plugins.audioPlayer) {
    window.plugins.audioPlayer = new AudioPlayer();
}