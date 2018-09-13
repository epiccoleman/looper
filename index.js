var record = document.querySelector("#record");
var play = document.querySelector("#play");
var pause = document.querySelector("#pause");
var stop = document.querySelector("#stop");

var audioCtx = new window.AudioContext;
var loops = { }

function storeRecordedAudio(buffers, bufferId){
    var newBuffer = audioCtx.createBuffer( 2, buffers[0].length, audioCtx.sampleRate );
    newBuffer.getChannelData(0).set(buffers[0]);
    newBuffer.getChannelData(1).set(buffers[1]);

    loops[bufferId] = {}
    loops[bufferId].buffer = newBuffer;
}

function bufferSourceNode(buffer){
    var newSource = audioCtx.createBufferSource();
    newSource.buffer = buffer;
    return newSource;
}

/* function stopBuffer(rec, index){
 *     console.log(index)
 *     rec.stop()
 *     recordedBuffer = rec.getBuffer(( buffers ) => {
 *         storeRecordedAudio(buffers, index) })
 *     rec.clear()
 * } */

function playLoop(id){
    bufferSource = bufferSourceNode(loops[id].buffer)
    bufferSource.connect(audioCtx.destination)
    bufferSource.loop = true
    bufferSource.start(0)
}

function loop(recorder, id){  //depends on a global
    let container = document.createElement("div")
    container.classList.add("loop")
    
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
        playLoop(id)
    }

    let pauseButton = document.createElement("button")
    pauseButton.innerHTML = "stop loop"
    container.appendChild(pauseButton)
    pauseButton.onclick = () => {
        bufferSource.stop(0)
    }

    return container
}

// main
navigator.mediaDevices.getUserMedia({ audio: true }).
    then(stream => {
        let microphoneSourceNode = audioCtx.createMediaStreamSource(stream)
        var recorder = new Recorder(microphoneSourceNode)
        var recordedBuffer

        var loopList = document.getElementById("looplist")
        var loopId = 0

        document.getElementById("newloop").onclick = () => {
            loopList.appendChild(
                loop(recorder, loopId++)
            )
        }
    })
