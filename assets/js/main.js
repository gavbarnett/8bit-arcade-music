var timeBase = 200
var baseNote = 35 //49 = A
var baseKey = 0
var baseChords = []
var syncTime = -1
//cross browser support
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playMusic(){
    var composer1 = new composer(0)
    //var composer2 = new composer(3.5)
    var t1 = setInterval(composer1.nextSection,1000);
    //var t2 = setInterval(composer2.nextSection,1000);
}
function conductor(){

}
function composer(pace){
    var myPace = pace
    var myOSC = new OSC(440, 0.0001,0.001)
    var volume = []
    var m = 0
    var melody = []
    var rhythm = []
    var fullMelody = []
    // Initialize base Key if required
    if (baseKey == 0){
        baseKey = keyPicker()
        console.log(baseKey)
    }
    // Initialize base Chord if required
    if (baseChords.length == 0){
       // baseChords = []
        baseChords = chordPattern(baseKey)
        console.log(baseChords)
    }
    if (melody.length == 0){
        // baseChords = []
        fullMelody = melodyWriter(baseChords, myPace)
        console.log(fullMelody)
        rhythm = fullMelody[0]
        melody = fullMelody[1]
        volume = fullMelody[2]
     } 

    //timestamp is used to tell the composer is the song is almost finished
    //and if so then write more music!
    var timeStamp = myOSC.begin()
    this.nextSection =function(){
        syncTime = myOSC.sync(syncTime)
        //console.log (syncTime)
        if (timeStamp < 10){
            for (var k=0;k<4;k++){
                for (var i=0;i<melody.length;i++){
                    timeStamp = myOSC.tone(melody[i]/(Math.pow(2,myPace/3)),rhythm[i],0.2)//volume[i])
                }
            }
            fullMelody = melodyWriter(baseChords, myPace)
            console.log(fullMelody)
            rhythm = fullMelody[0]
            melody = fullMelody[1]
            volume = fullMelody[2]
            if (Math.random()<0.2){
                 baseChords = chordPattern(baseKey)
            }
            //console.log ("composing")
        } else {
            timeStamp -= 1 //should equal setInterval time in seconds)
            // console.log ("resting")
        }
    }
}
function melodyWriter (chords, pace) {
    //8 bars
    //2 beats per bar
    //4 bars per phrase
    var melody = []
    var rhythm = []
    var volume = []
    var beats = 4
    var tempBeats = 0
    var bar = []
    var note = 1
    var barCount = 0
    //fixed 1st bar
    melody[0] = chords[0][0]
    rhythm[0] = 2
    volume[0] = 0.2
    bar[0] = []
    bar[0][0] =  rhythm[0] 
    //1st phrase
    for (var i = 1; i<4;i++){
        //for each bar
        bar[i] = []
        tempBeats = beats // beats in a bar
        barCount = 0
        do {
            rhythm[note] = ((1/(4-pace))+Math.round(Math.random()*(tempBeats-(1/(4-pace)))*(4-pace))/(4-pace))
            tempBeats -= rhythm[note]
            melody[note]=chords[i][Math.round(Math.round(Math.random()*5)/2)]
            bar[i][barCount] = rhythm[note]
            volume[note] = 0.2 * Math.round(Math.random())
            note +=1
            barCount+=1
        } while (tempBeats > 0)
    }
     //2st phrase
     for (var i = 0; i<4;i++){
        //for each bar
        if (Math.random()<0.5){
            tempBeats = beats // beats in a bar
            do {
                rhythm[note] = ((1/(4-pace))+Math.round(Math.random()*(tempBeats-(1/(4-pace)))*(4-pace))/(4-pace))
                tempBeats -= rhythm[note]
                melody[note] = chords[i+3][Math.round(Math.round(Math.random()*4)/2)]
                volume[note] = 0.2 * Math.round(Math.random())
                note +=1
            } while (tempBeats > 0)
        } else {
            for (var j=0;j<bar[i].length;j++){
                rhythm[note] = bar[i][j]
                melody[note]=chords[4+3][0]
                volume[note] = 0.2 * Math.round(Math.random())
                note +=1
            }
        }
        melody[note-1]=chords[i+3][Math.round(Math.round(Math.random()*4)/2)]
        volume[note-1] = 0.2
    }
    for (var i = 0; i<melody.length;i++){
        melody[i] = Math.round(Math.pow(2,((melody[i]-49)/12))*440)
    } 
    return [rhythm,melody,volume]
}

function keyPicker(){
    ///returns a random position on the circle of fifths
    //0 to 12
    return (7)//Math.round((Math.random()*11)))
}

function chordPattern(key){
    //randomly orders the available chords into a chord progression
    var chords = []
    for (var i=0;i<10;i++){
        chords[i] = chordPicker(key)
    }
    return chords
}

function chordPicker(Key){
    //M = Major, m = minor, dim = diminished, () = input 
    //[M][(M)][M][m][m][m][dim]
    var nullChord = 40 //middle C = 261.6256 Hz
    var position = Math.round(Math.random()*2)-1 //6
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
        return(0)
    }
    this.sync = function(timeIn){
        if(timeIn>this.timeStamp){
            this.timeStamp = timeIn  
            //console.log("synced")
        } else {
           // console.log("good")
        }
        return (this.timeStamp)
    }
    this.tone = function(tone,beats,volume){
        this.gainNode.gain.setValueAtTime(volume, this.timeStamp);
        this.oscillator.frequency.setValueAtTime(tone, this.timeStamp);
        this.timeStamp += (beats*timeBase/1000-0.015)//-0.015
        this.gainNode.gain.setTargetAtTime(0, this.timeStamp, 0.015);
        return (this.timeStamp-audioCtx.currentTime)
    }

}