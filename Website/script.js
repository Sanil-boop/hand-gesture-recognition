// ================= API URL =================
// LOCAL TESTING
// const API = "http://127.0.0.1:5000/predict";

// RENDER DEPLOYED API
const API = "https://hand-gesture-recognition-3.onrender.com/predict";


// ================= ICON MAP =================
const GESTURE_ICONS = {
  palm: "🖐",
  fist: "✊",
  ok: "👌",
  index: "☝️",
  thumb: "👍",
  l: "🫸",
  blank: "❔"
};


// ================= DOM ELEMENTS =================
const historyList = document.getElementById("historyList");
const preview = document.getElementById("preview");
const resultCard = document.getElementById("result-card");
const gestureIcon = document.getElementById("gestureIcon");
const predictionText = document.getElementById("predictionText");
const confidenceBar = document.getElementById("confidenceBar");
const confidenceText = document.getElementById("confidenceText");


// ================= IMAGE PREVIEW =================
document.getElementById("upload").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  preview.src = URL.createObjectURL(file);
  preview.style.display = "block";
});


// ================= PREDICT IMAGE =================
async function predictGesture() {

  const file = document.getElementById("upload").files[0];
  if (!file) return alert("⚠ Please upload an image first");

  const formData = new FormData();
  formData.append("file", file);

  showProcessing("Processing image…");

  try {
    const res = await fetch(API, { method: "POST", body: formData });
    const data = await res.json();

    showResult(data.prediction, data.confidence);

  } catch (err) {
    showError("API unreachable — try again or restart backend");
  }
}


// ================= SHOW RESULT =================
function showResult(label, conf) {

  const confidence = Math.round(conf * 100);
  const icon = GESTURE_ICONS[label] || "🤖";

  resultCard.style.display = "block";
  gestureIcon.innerHTML = icon;

  predictionText.innerHTML = `Prediction: <b>${label.toUpperCase()}</b>`;
  confidenceBar.style.width = confidence + "%";
  confidenceText.innerHTML = `Confidence: ${confidence}%`;

  // --- Save to History (top insert, max 5 entries)
  const li = document.createElement("li");
  li.innerHTML = `${icon} ${label} — ${confidence}%`;

  historyList.prepend(li);

  if (historyList.childElementCount > 5) {
    historyList.removeChild(historyList.lastChild);
  }
}


// ================= STATUS MESSAGES =================
function showProcessing(msg) {
  resultCard.style.display = "block";
  gestureIcon.innerHTML = "⚙️";
  predictionText.innerHTML = msg;
  confidenceBar.style.width = "0%";
  confidenceText.innerHTML = "";
}

function showError(msg) {
  resultCard.style.display = "block";
  gestureIcon.innerHTML = "❌";
  predictionText.innerHTML = msg;
  confidenceBar.style.width = "0%";
  confidenceText.innerHTML = "";
}


// ================= WEBCAM MODE =================
let cam = document.getElementById("cam");
let canvas = document.getElementById("frameGrab");

let camActive = false;
let stream;
let livePredictRunning = false;


async function toggleWebcam() {

  if (camActive) {
    stopWebcam();
    return;
  }

  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });

    cam.srcObject = stream;
    cam.style.display = "block";
    camActive = true;

    startLivePrediction();

  } catch {
    alert("Camera permission required");
  }
}


function stopWebcam() {
  stream.getTracks().forEach(t => t.stop());
  cam.style.display = "none";
  camActive = false;
  livePredictRunning = false;
}


// ================= LIVE PREDICTION =================
async function startLivePrediction() {

  if (livePredictRunning) return;
  livePredictRunning = true;

  const ctx = canvas.getContext("2d");

  showProcessing("Live mode: Detecting…");

  const loop = async () => {

    if (!camActive) return;

    canvas.width = 64;
    canvas.height = 64;

    ctx.drawImage(cam, 0, 0, 64, 64);

    const blob = await new Promise(resolve =>
      canvas.toBlob(resolve, "image/jpeg")
    );

    const formData = new FormData();
    formData.append("file", blob, "frame.jpg");

    try {
      const res = await fetch(API, { method: "POST", body: formData });
      const data = await res.json();

      showResult(data.prediction, data.confidence);

    } catch {
      showError("Live stream connection lost");
    }

    setTimeout(loop, 800); // throttle 1 frame / 0.8s
  };

  loop();
}
