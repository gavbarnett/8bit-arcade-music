var timeBase = 100

//cross browser support
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playMusic(){
    var composer1 = new composer()
    var t = setInterval(composer1.nextSection,1000);
}

function composer(OSCin){
    var myOSC = new OSC(440, 0.0001,0.2)
    var previousNote = 220
    var previousBeat = 0
    var baseNote = 35 //49 = A
    var majorChord = []
    var melody = []
    var rhythm = []
    var volume = []
    var m = 0
    // Initialize Minor chord
    majorChord[0] = 0
    majorChord[1] = 2
    majorChord[2] = 3
    majorChord[3] = 5
    majorChord[4] = 7
    majorChord[5] = 8
    majorChord[6] = 10
    majorChord[7] = 12
    // Initialize melody & rhythm
    melody[0] = 0
    rhythm[0] = Math.round(Math.random()*7)+1
    volume[0] = 0.2
    for (var i = 1; i <16; i++){
        melody[i] = majorChord[i%7]
        rhythm[i] = Math.round(Math.random()*7)+1/2
        volume[i] = 0.2*Math.round(Math.random()*1.2)
    }
    var timeStamp = myOSC.begin()
    this.nextSection =function(){
        if (timeStamp<10){
                for (var i = 0; i <16; i++){
                    timeStamp = myOSC.tone(Math.pow(2,((baseNote + melody[i]-49)/12))*440,rhythm[i],volume[i])    
                } 
                for (var i = 0; i <16; i++){
                    if (Math.random()>0.9){
                        melody[i] = majorChord[Math.round(Math.random()*7)]
                    }
                    if (Math.random()>0.9){
                        rhythm[i]  = Math.round(Math.random()*3)+1
                    }
                    if (Math.random()>0.9){
                        //volume[i] = 0.2*Math.round(Math.random()*1.2)
                    }
                }
              
                if (Math.random()>0.7){
                    baseNote = Math.min(59,baseNote + majorChord[5]-Math.round(Math.random())*12)
                }
        }else{
            timeStamp -= 1
        }
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
    var timeStamp = 0;
    this.begin = function(){
        oscillator.start();
        timeStamp = audioCtx.currentTime
        return(timeStamp)
    }
    this.tone = function(tone,beats,volume){
        gainNode.gain.setValueAtTime(volume, timeStamp);
        oscillator.frequency.setValueAtTime(tone, timeStamp);
        timeStamp += (beats*timeBase/1000)-0.015
        gainNode.gain.setTargetAtTime(0, timeStamp, 0.015);
        return (timeStamp-audioCtx.currentTime)
    }

}