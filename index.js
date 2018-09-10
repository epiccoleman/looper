var record = document.querySelector("#record");
var play = document.querySelector("#play");
var player = document.querySelector("#player");
var stop = document.querySelector("#stop");

stop.disabled = true;

var audioCtx = new window.AudioContext;

if (navigator.mediaDevices.getUserMedia){  // i guess pretty much everything happens in here
    console.log("media");

    var constraints = { audio: true };
    var chunks = [];

    var onSuccess = (stream) => {
        var mediaRecorder = new MediaRecorder(stream);

        record.onclick = () => {
            mediaRecorder.start();
            console.log(mediaRecorder.state);
            console.log("recorder started");

            stop.disabled = false;
            record.disabled = true;
        };

        stop.onclick = () => {
            mediaRecorder.stop();
            console.log(mediaRecorder.state);
            console.log("recorder stopped");

            stop.disabled = true;
            record.disabled = false;
        };

        play.onclick = () => {
            player.play();
        };

        mediaRecorder.onstop = () => {
            console.log("stopped");
            var blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus'} );
            chunks = [];
            var audioURL = window.URL.createObjectURL(blob);
            player.src = audioURL;
        };

        mediaRecorder.ondataavailable = (e) => {
            chunks.push(e.data);
        };

    };

    var onError = () => {
        console.log("nope");
    };

    navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);

};
