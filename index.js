var record = document.querySelector("#record");
var play = document.querySelector("#play");
var pause = document.querySelector("#pause");
var stop = document.querySelector("#stop");

var audioCtx = new window.AudioContext;
var loops = { 1: {}, 2: {}}

function storeRecordedAudio(buffers, bufferId){
    var newBuffer = audioCtx.createBuffer( 2, buffers[0].length, audioCtx.sampleRate );
    newBuffer.getChannelData(0).set(buffers[0]);
    newBuffer.getChannelData(1).set(buffers[1]);

    loops[bufferId].buffer = newBuffer;
}

function bufferSourceNode(buffer){
    var newSource = audioCtx.createBufferSource();
    newSource.buffer = buffer;
    return newSource;
}

function stopBuffer(rec, index){
    console.log(index)
    rec.stop()
    recordedBuffer = rec.getBuffer(( buffers ) => {
        storeRecordedAudio(buffers, index) })
    rec.clear()
}

function loop(recorder, id){  //depends on a global
    let container = document.createElement("div")
    container.class = "loop"
    
    let recButton = document.createElement("button")
    container.appendChild(recButton)
    recButton.innerHTML = "record"
    recButton.onclick = () => {
        recorder.record()
    }

    let stopButton = document.createElement("button")
    container.appendChild(stopButton)
    stopButton.innerHTML = "stop"
    stopButton.onclick = () => {
        recorder.stop()
        recorder.getBuffer(( buffers ) => {
            storeRecordedAudio(buffers, id) })
        recorder.clear()
    }

    let playButton = document.createElement("button")
    container.appendChild(playButton)
    playButton.innerHTML = "play"
    playButton.onclick = () => {
        bufferSource = bufferSourceNode(loops[id].buffer)
        bufferSource.connect(audioCtx.destination)
        bufferSource.loop = true
        bufferSource.start(0)
    }

    let pauseButton = document.createElement("button")
    pauseButton.innerHTML = "stop loop"
    container.appendChild(pauseButton)
    pauseButton.onclick = () => {
        bufferSource.stop(0)
    }

    return container
}

navigator.mediaDevices.getUserMedia({ audio: true }).
    then(stream => {
        let microphoneSourceNode = audioCtx.createMediaStreamSource(stream)
        var rec = new Recorder(microphoneSourceNode)
        var recordedBuffer

        let bufferSource
        let bufferSource2

        record.onclick = (e) => {
            rec.record()
        }
        stop.onclick = (e) => {
            rec.stop()
            rec.getBuffer(( buffers ) => {
                storeRecordedAudio(buffers, 1) })
            rec.clear()
        }
        play.onclick = () => {
            bufferSource = bufferSourceNode(loops[1].buffer)
            bufferSource.connect(audioCtx.destination)
            bufferSource.loop = true
            bufferSource.start(0)
        }
        pause.onclick = () => {
            bufferSource.stop(0)
        }

        document.getElementById("looplist").
                 appendChild(
                     loop(rec, 2))
        
    })
