var Myo = require('myo');
var sleep = require('sleep');
var midi = require('midi');
var HashMap = require('hashmap');


var printp = function() {
    console.log("====== new section =======")
    for(var i = 0; i < output.getPortCount(); i++) {
        console.log(output.getPortName(i));
    }
}


// Initialize
var myMyo = Myo.create();
var output = new midi.output();
output.openPort(0);
printp();
var note = 60;
var datas;
var keyMap = new HashMap();
console.log('app.js running');

function getOctave(){
    var range = UpperBound-LowerBound;
    var tmp = datas.y;
    tmp -= LowerBound;
    //console.log("testdat:", range, tmp);
    return Math.ceil(3 * (tmp / range));
}

// Send MIDI note
function sendNote(note) {
    output.sendMessage([144,note,100]);
}

function closeNote(note){
    output.sendMessage([128,note,100]);
}

// Unlock the MYO when connected
myMyo.on('connected', function (evt) {
    console.log(new Date(), 'connected', evt);
    myMyo.setLockingPolicy('none');
});

// Play a note when orientation changes
myMyo.on('orientation', function(data) {
	datas = data;
	if(state != 2) console.log(new Date(), 'gyroscope',
                data.y);
    note = -10 + (data.y) * 67;
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
            LowerBound = datas.y;
            state = 1;
            console.log("LOWER BOUND: " + LowerBound);
        }else if(state == 1){
            UpperBound = datas.y;
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
var HOST = '10.0.1.55';

var dgram = require('dgram');
var server = dgram.createSocket('udp4');

server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) {

    if(message[1] == 0){

    var play = 8 * getOctave() + message[0] + 30;
    console.log("Playing: "  + play);
    keyMap.set(message[0], play);
    sendNote(play);
    }else if(message[1] == 1){
        console.log("Closing", keyMap.get(message[0]));
        closeNote(keyMap.get(message[0]));
        keyMap.remove(message[0]);
    }
});

server.bind(PORT, HOST);


// DEBUGGING:

// Print the Ports open


