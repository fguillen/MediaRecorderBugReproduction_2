let fullStream;
let counter = 0;
const videoElement = document.querySelector("#video-wrapper video");
const startButton = document.querySelector("#start-recording-button");

async function initFullStream() {
  fullStream = new MediaStream();

  // Getting screenStream
  const screenStream =
    await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });

  // Screen Stream
  const screenTrack = screenStream.getVideoTracks()[0]

  // Silenced AudioStream
  const audioCtx = new AudioContext();
  const audioDestination = audioCtx.createMediaStreamDestination();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  gainNode.gain.value = 0;

  oscillator.connect(gainNode);
  gainNode.connect(audioDestination);

  const silencedAudioTrack = audioDestination.stream.getAudioTracks()[0];

  // Add tracks
  fullStream.addTrack(screenTrack);
  fullStream.addTrack(silencedAudioTrack); // If I comment this line the recording works good
}

function playStream() {
  videoElement.srcObject = fullStream;
  videoElement.play();
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
