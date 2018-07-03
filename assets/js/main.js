var timeBase = 500

//cross browser support
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playMusic(){
    var OSC1 = new OSC(440, 0.0001,0.2)
    var composer1 = new composer(OSC1)
    OSC1.begin()
    var t = setInterval(composer1.nextNote,timeBase);
}

function composer(OSCin){
    var myOSC = OSCin
    var previousNote = 220
    var previousBeat = 0
    var baseNote = 220
    var melody = []
    var rhythm = []
    var m = 0
    for (var i = 0; i <8; i++){
        melody[i] = baseNote * (Math.round(1+Math.random()*3))/(1+Math.round(Math.random()*3))
        rhythm[i] = 4/(Math.pow(2,Math.round(Math.random()*8)))
    }
    console.log(melody)
    this.nextNote =function(){
        if (previousBeat<=1){
            var nextNote = melody[m]
            nextNote = Math.min(nextNote,12000)
            nextNote = Math.max(nextNote,40)
            nextBeat = rhythm[m]
            myOSC.tone(nextNote,nextBeat,0.2)//*Math.round(Math.random()))
            previousBeat = nextBeat
            previousNote = nextNote
           // console.log(nextNote) 
            m++
            if (m==8){m=0}
        }else{
            previousBeat=previousBeat-1
        }
    }
}

function OSC(tone, beats, volume){
    oscillator = audioCtx.createOscillator();
    gainNode = audioCtx.createGain();
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(tone, audioCtx.currentTime); // value in hertz
    oscillator.connect(gainNode);
    gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
    gainNode.connect(audioCtx.destination);
    this.begin = function(){
        oscillator.start();
    }
    this.tone = function(tone,beats,volume){
        var now = audioCtx.currentTime
        gainNode.gain.setValueAtTime(volume, now);
        oscillator.frequency.setValueAtTime(tone, now);
        gainNode.gain.setTargetAtTime(0, now+beats*timeBase-0.015, 0.015);
    }

}