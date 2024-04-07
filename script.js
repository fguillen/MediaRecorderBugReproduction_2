let fullStream;
let counter = 0;
const videoElement = document.querySelector("#video-wrapper video");
const startButton = document.querySelector("#start-recording-button");

async function initFullStream() {
  // fullStream = new MediaStream();

  // Getting screenStream
  const screenStream =
    await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });

  // Screen Stream
  // const videoTrack = getVideoTrack();
  const videoTrack = screenStream.getVideoTracks()[0];


  // Silenced AudioStream
  const audioCtx = new AudioContext();
  const audioDestination = audioCtx.createMediaStreamDestination();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  gainNode.gain.value = 0;

  oscillator.connect(gainNode);
  gainNode.connect(audioDestination);

  const audioTrack = audioDestination.stream.getAudioTracks()[0];

  // Add tracks
  // fullStream = new MediaStream([videoTrack, audioTrack]);

  fullStream = new MediaStream();
  fullStream.addTrack(videoTrack);
  fullStream.addTrack(audioTrack); // If I comment this line the recording works good
}

function playStream() {
  videoElement.srcObject = fullStream;
  videoElement.play();
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
  const mediaRecorder = new MediaRecorder(fullStream, { mimeType: "video/webm" });
  mediaRecorder.ondataavailable = (event) => {
    console.log(`MediaRecorder.ondataavailable().data.size (${counter}): ${event.data.size}`);
    counter++;
  };

  mediaRecorder.start(1000); // ondataavailable each 1 seconds
}

startButton.addEventListener("click", () => {
  startRecording();
});

async function startRecording() {
  startButton.setAttribute("disabled", true);
  await initFullStream();
  playStream();
  record();
}
