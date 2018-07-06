var timeBase = 100
var baseNote = 35 //49 = A
var baseKey = 0
var baseChord = []

//cross browser support
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playMusic(){
    var composer1 = new composer(1)
  //  var composer2 = new composer(8)
    var t = setInterval(composer1.nextSection,100);
   // var t = setInterval(composer2.nextSection,800);
}

function composer(pace){
    var myPace = pace
    var myOSC = new OSC(440, 0.0001,0.001)
    var melody = []
    var rhythm = []
    var volume = []
    var m = 0
    // Initialize base Key if required
    if (baseKey == 0){
        baseKey = keyPicker()
        console.log(baseKey)
    }
    // Initialize base Chord if required
    if (baseChord.length == 0){
        baseChord = chordPicker(baseKey)
        console.log(baseChord)
    }
    var timeStamp = myOSC.begin()

    this.nextSection =function(){
        myOSC.tone(Math.round(Math.pow(2,((baseChord[Math.round(Math.random()*7)]-49)/12))*440),pace,0.2)
        if (Math.random() > 0.9){
            baseChord = chordPicker(baseKey)
            console.log(baseChord)
        }
    }
}

function keyPicker(){
    ///returns a random position on the circle of fifths
    //0 to 12
    return (Math.round((Math.random()*11)))
}

function chordPicker(Key){
    //M = Major, m = minor, dim = diminished, () = input 
    //[M][(M)][M][m][m][m][dim]
    var nullChord = 40 //middle C = 261.6256 Hz
    var position = Math.round(Math.random()*6)-1
    var chord = []
    if (position<2){
        //majorChord
        chord[0] = (position*7)%12 + nullChord
        chord[1] = chord[0]+2
        chord[2] = chord[1]+2
        chord[3] = chord[2]+1
        chord[4] = chord[3]+2
        chord[5] = chord[4]+2
        chord[6] = chord[5]+2
        chord[7] = chord[6]+1
    } else{
        //minorChord
        chord[0] = (position*7)%12+ nullChord
        chord[1] = chord[0]+2
        chord[2] = chord[1]+1
        chord[3] = chord[2]+2
        chord[4] = chord[3]+2
        chord[5] = chord[4]+1
        chord[6] = chord[5]+2
        chord[7] = chord[6]+2
    }
    return (chord)
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