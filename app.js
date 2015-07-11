var Myo = require('myo');
var sleep = require('sleep');
var midi = require('midi');

// Initialize
var myMyo = Myo.create();
var output = new midi.output();
output.openPort(0);
var note = 60;
var datas;
console.log('app.js running');

// Send MIDI note
function sendNote(note) {
    output.sendMessage([144,note,100]);
	setTimeout(function(note) {
	    output.sendMessage([128,note,100]);
    }, 100, note);
}

// Unlock the MYO when connected
myMyo.on('connected', function (evt) {
    console.log(new Date(), 'connected', evt);
    myMyo.setLockingPolicy('none');
});

// Play a note when orientation changes
myMyo.on('orientation', function(data) {
	datas = data;
	console.log(new Date(), 'gyroscope',
                data.x,
                Math.ceil(data.y));
    note = 60 + data.y * 67;
    if(note > 127){
        note = 127;   
    }
    sendNote(note); 
});

// Play a note when fist
myMyo.on('fist', function(edge) {
    if(edge){
        console.log(new Date(), 'fist', edge);
        console.log(new Date(), 'gyroscope',
                datas.x,
                Math.ceil(datas.y));
        note = 60 + datas.y * 67;
        if(note > 127) {
            note = 127;
        }
        sendNote(note); 
    }
});

// Other events
myMyo.on('thumb_to_pinky', function(edge){
    console.log(new Date(), 'thumb_to_pinky', edge);
});

myMyo.on('double_tap', function (edge) {
    console.log(new Date(), 'double_tap', edge);
});

// DEBUGGING:

// Print the Ports open
var printp = function() {
    console.log("====== new section =======")
    for(var i = 0; i < input.getPortCount(); i++) {
        console.log(input.getPortName(i));
    }
}

