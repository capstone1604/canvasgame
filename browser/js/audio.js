//load any audio
var moneyFoundSound = new Audio("audio/money-found-snd.wav");

var attackSound = new Audio('audio/marinegogogo.wav');

var cancelSound = new Audio("/audio/cancel.wav");
var buildingSound = new Audio("/audio/building-sound.mp3");


//use this function to play a sound
function playSoundOnEvent(snd) {
    if (!snd.paused) {
        snd.load();
        snd.play();
    } else {
        snd.play();
    }
}