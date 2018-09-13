var record = document.querySelector("#record");
var play = document.querySelector("#play");
var pause = document.querySelector("#pause");
var stop = document.querySelector("#stop");

var audioCtx = new window.AudioContext;
var microphoneSourceNode
var bufferSource

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


    })
