var audioCtx = new window.AudioContext;
var loops = { }

function storeRecordedAudio(buffers, bufferId){
    var newBuffer = audioCtx.createBuffer( 2, buffers[0].length, audioCtx.sampleRate );
    newBuffer.getChannelData(0).set(buffers[0]);
    newBuffer.getChannelData(1).set(buffers[1]);

    loops[bufferId] = {}
    loops[bufferId].buffer = newBuffer;
    loops[bufferId].playing = false;
}

function bufferSourceNode(buffer){
    var newSource = audioCtx.createBufferSource();
    newSource.buffer = buffer;
    return newSource;
}

function playLoop(id){
    bufferSource = bufferSourceNode(loops[id].buffer)
    bufferSource.connect(audioCtx.destination)
    bufferSource.loop = true
    loops[id].playing = true
    loops[id].source = bufferSource
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
        if(!loops[id].playing){
            playLoop(id)
        }
    }

    let pauseButton = document.createElement("button")
    pauseButton.innerHTML = "stop loop"
    container.appendChild(pauseButton)
    pauseButton.onclick = () => {
        loops[id].playing = false
        loops[id].source.stop()
    }

    return container
}

// main
navigator.mediaDevices.getUserMedia({ audio: true }).
    then(stream => {
        let microphoneSourceNode = audioCtx.createMediaStreamSource(stream)
        let recorder = new Recorder(microphoneSourceNode)

        let loopId = 0

        let stopallButton = document.getElementById("stopall")

        document.getElementById("loopall").onclick = () => {
        }

        let loopList = document.getElementById("looplist")
        document.getElementById("newloop").onclick = () => {
            loopList.appendChild(
                loop(recorder, loopId++)
            )
        }
    })
