var timeBase = 50

//cross browser support
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playMusic(){
    var composer1 = new composer()
   // var composer2 = new composer()
    var t = setInterval(composer1.nextSection,1000);
    //var t = setInterval(composer2.nextSection,1000);
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
        rhythm[i] = i%4
        volume[i] = (i%2-1)*0.2
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
    this.oscillator = audioCtx.createOscillator();
    this.gainNode = audioCtx.createGain();
    this.oscillator.type = 'triangle';
    this.oscillator.frequency.setValueAtTime(tone, audioCtx.currentTime); // value in hertz
    this.oscillator.connect(this.gainNode);
    this.gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
    this.gainNode.connect(audioCtx.destination);
    this.timeStamp = 0;
    this.begin = function(){
        this.oscillator.start();
        this.timeStamp = audioCtx.currentTime
        return(this.timeStamp)
    }
    this.tone = function(tone,beats,volume){
        this.gainNode.gain.setValueAtTime(volume, this.timeStamp);
        this.oscillator.frequency.setValueAtTime(tone, this.timeStamp);
        this.timeStamp += (beats*timeBase/1000)-0.015
        this.gainNode.gain.setTargetAtTime(0, this.timeStamp, 0.015);
        return (this.timeStamp-audioCtx.currentTime)
    }

}