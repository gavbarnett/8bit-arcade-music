var timeBase = 1

//cross browser support
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playMusic(){
    var OSC1 = new OSC(440, 0.0001,0.2)
    var composer1 = new composer(OSC1)
    OSC1.begin()
    var t = setInterval(composer1.nextNote,100);

}

function composer(OSCin){
    var myOSC = OSCin
    this.nextNote =function(){
        myOSC.tone(0.0001+Math.random()*1000,(0.1+Math.random()),0.2)
       // console.log("test") 
    }
}

function OSC(tone, beats, volume){
    oscillator = audioCtx.createOscillator();
    gainNode = audioCtx.createGain();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(tone, audioCtx.currentTime); // value in hertz
    oscillator.connect(gainNode);
    gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
    gainNode.connect(audioCtx.destination);
    this.begin = function(){
        oscillator.start();
    }
    this.tone = function(tone,beats,volume){
        var now = audioCtx.currentTime
        oscillator.frequency.setValueAtTime(tone, now);
        gainNode.gain.setValueAtTime(volume, now);
        gainNode.gain.setTargetAtTime(0, now+beats*timeBase, 0.015);
    }

}