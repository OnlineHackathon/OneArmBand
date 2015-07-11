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

function getOctave(){
    var range = UpperBound-LowerBound;
    var tmp = datas.x;
    tmp -= LowerBound;
    //console.log("testdat:", range, tmp);
    return Math.ceil(3 * (tmp / range));
}

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
	/*console.log(new Date(), 'gyroscope',
                data.x);*/
    note = 60 + (data.x) * 67;
    if(note > 127){
        note = 127;   
    }
    //sendNote(note); 
});

// Play a note when fist
var UpperBound = -1;
var LowerBound = -1;
var state = 0;
myMyo.on('fist', function(edge) {
    if(edge){
        if(state == 0){
            LowerBound = datas.x;
            state = 1;
            console.log("LOWER BOUND: " + LowerBound);
        }else if(state == 1){
            UpperBound = datas.x;
            state = 2;
            console.log("UPPER BOUND: " + UpperBound);
        }
    }
  /*  if(edge){
        console.log(new Date(), 'fist', edge);
        console.log(new Date(), 'gyroscope',
                datas.x,
                Math.ceil(datas.y));
        note = 60 + datas.y * 67;
        if(note > 127) {
            note = 127;
        }
        sendNote(note); 
    }*/

});

// Other events
myMyo.on('thumb_to_pinky', function(edge){
    console.log(new Date(), 'thumb_to_pinky', edge);
});

myMyo.on('double_tap', function (edge) {
    console.log(new Date(), 'double_tap', edge);
});
// UDP
var PORT = 33333;
var HOST = '10.0.1.51';

var dgram = require('dgram');
var server = dgram.createSocket('udp4');

server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) {

    if(message[1] == 1){
    console.log(typeof message);
    console.log(remote.address + ':' + remote.port +' - Column: ' + message[0] +' - State: ' + message[1]);
    

    var play = 12 * getOctave() + message[0] + 60;
    console.log("Playing: "  + play);
    sendNote(play);
    }
});

server.bind(PORT, HOST);


// DEBUGGING:

// Print the Ports open
var printp = function() {
    console.log("====== new section =======")
    for(var i = 0; i < input.getPortCount(); i++) {
        console.log(input.getPortName(i));
    }
}



