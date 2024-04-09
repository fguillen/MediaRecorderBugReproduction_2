let fullStream;
let counter = 0;
const startButton = document.querySelegetElementByIdctor("start-button");
const requestDataButton = document.getElementById("request-data-button");

async function initFullStream() {
  // Video Track
  const videoTrack = getVideoTrack();


  // Audio Track
  const audioCtx = new AudioContext();
  const audioDestination = audioCtx.createMediaStreamDestination();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  gainNode.gain.value = 0;

  oscillator.connect(gainNode);
  gainNode.connect(audioDestination);

  const audioTrack = audioDestination.stream.getAudioTracks()[0];

  // Full Stream
  fullStream = new MediaStream();
  fullStream.addTrack(videoTrack);
  fullStream.addTrack(audioTrack); // If I comment this line the recording works good
}

function getVideoTrack() {
  const ctx = document.createElement("canvas").getContext("2d");
  const img = new ImageData(300, 150);
  const arr = new Uint32Array(img.data.buffer);
  draw();
  return ctx.canvas.captureStream().getVideoTracks()[0];

  function draw() {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = Math.random() * 0xFFFFFF + 0xFF000000;
    }
    ctx.putImageData(img, 0, 0);
    requestAnimationFrame(draw);
  }
}

function record() {
  console.log("Start recording");

  // Set up MediaRecorder
  const recordedChunks = [];
  const mediaRecorder = new MediaRecorder(fullStream);
  mediaRecorder.ondataavailable = (event) => {
    console.log(`MediaRecorder.ondataavailable().data.size (${counter}): ${event.data.size}`);
    counter++;
  };

  mediaRecorder.start(1000); // ondataavailable each 1 seconds
}

async function startRecording() {
  startButton.setAttribute("disabled", true);
  await initFullStream();
  record();
}

function requestData() {
  recorder.requestData();
}

startButton.addEventListener("click", () => {
  startRecording();
});

requestDataButton.addEventListener("click", () => {
  requestData();
});
