var Myo = require('myo');


var note = 60;


var myMyo = Myo.create();

function sendNote(note){
sleep.sleep(1);
output.sendMessage([144,note,100]);
	setTimeout(function(note){
	    output.sendMessage([128,note,100]);}, 100, note);

}
var datas;
console.log('app.js running');

// var events = ['fist', 'gyroscope'];

myMyo.on('fist', function(edge){
	if(edge){
    console.log(new Date(), 'fist', edge);
    console.log(new Date(), 'gyroscope',
                datas.x,
                Math.ceil(datas.y));
    note = 60 + datas.y * 67;
    if(note > 127) note = 127;
    sendNote(note); 
}
});
var cnt = 0;
myMyo.on('orientation', function(data){
	datas = data;
	console.log(new Date(), 'gyroscope',
                data.x,
                Math.ceil(data.y));
    note = 60 + data.y * 67;
    if(note > 127) note = 127;
    sendNote(note); 
});

myMyo.on('thumb_to_pinky', function(edge){
    console.log(new Date(), 'thumb_to_pinky', edge);
});

myMyo.on('connected', function (evt) {
    console.log(new Date(), 'connected', evt);
    myMyo.setLockingPolicy('none');
});

myMyo.on('double_tap', function (edge) {
    console.log(new Date(), 'double_tap', edge);
});




var printp = function(){
console.log("====== new section =======")
for(var i = 0; i < input.getPortCount(); i++){

console.log(input.getPortName(i));
}
}
var sleep = require('sleep');
var midi = require('midi');

var output = new midi.output();

//printp();

output.openPort(0);

