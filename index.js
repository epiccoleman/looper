var record = document.querySelector("#record");
var play = document.querySelector("#play");
var pause = document.querySelector("#pause");
var stop = document.querySelector("#stop");

var record2 = document.querySelector("#record2");
var play2 = document.querySelector("#play2");
var pause2 = document.querySelector("#pause2");
var stop2 = document.querySelector("#stop2");

/* stop.disabled = true; */

var audioCtx = new window.AudioContext;
var microphoneSourceNode
var bufferSource
var bufferSource2

function getBufferSource(buffers){
    console.log('get')
    var newSource = audioCtx.createBufferSource();
    var newBuffer = audioCtx.createBuffer( 2, buffers[0].length, audioCtx.sampleRate );
    newBuffer.getChannelData(0).set(buffers[0]);
    newBuffer.getChannelData(1).set(buffers[1]);
    newSource.buffer = newBuffer;

    console.log(newSource)

    bufferSource = newSource
    console.log(bufferSource)
}

function getBufferSource2(buffers){
    console.log('get')
    var newSource = audioCtx.createBufferSource();
    var newBuffer = audioCtx.createBuffer( 2, buffers[0].length, audioCtx.sampleRate );
    newBuffer.getChannelData(0).set(buffers[0]);
    newBuffer.getChannelData(1).set(buffers[1]);
    newSource.buffer = newBuffer;

    console.log(newSource)

    bufferSource2 = newSource
    console.log(bufferSource)
}

navigator.mediaDevices.getUserMedia({ audio: true }).
    then(stream => {
        microphoneSourceNode = audioCtx.createMediaStreamSource(stream)
        var rec = new Recorder(microphoneSourceNode)
        var recordedBuffer

        record.onclick = (e) => {
            console.log('recording')
            rec.record()
        }
        stop.onclick = (e) => {
            console.log('stopping')
            rec.stop()
            recordedBuffer = rec.getBuffer(( buffer ) => {
                getBufferSource(buffer) })
            rec.clear()
        }
        play.onclick = () => {
            bufferSource.connect(audioCtx.destination)
            bufferSource.loop = true
            bufferSource.start(0)
        }
        pause.onclick = () => {
            bufferSource.stop(0)
        }

        record2.onclick = (e) => {
            console.log('recording')
            rec.record()
        }
        stop2.onclick = (e) => {
            console.log('stopping')
            rec.stop()
            recordedBuffer = rec.getBuffer(( buffer ) => {
                getBufferSource2(buffer) })
            rec.clear()
        }
        play2.onclick = () => {
            bufferSource2.connect(audioCtx.destination)
            bufferSource2.loop = true
            bufferSource2.start(0)
        }
        pause2.onclick = () => {
            bufferSource2.stop(0)
        }

    })
/* } */

