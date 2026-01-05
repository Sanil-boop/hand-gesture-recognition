const API = "http://127.0.0.1:5000/predict";

const GESTURE_ICONS = {
  palm: "🖐",
  fist: "✊",
  ok: "👌",
  index: "☝️",
  thumb: "👍",
  l: "🫸",
  blank: "❔"
};

const historyList = document.getElementById("historyList");
const preview = document.getElementById("preview");

document.getElementById("upload").addEventListener("change", function() {
  preview.src = URL.createObjectURL(this.files[0]);
  preview.style.display = "block";
});


// ---------- IMAGE PREDICTION ----------
async function predictGesture() {

  const file = document.getElementById("upload").files[0];
  if (!file) return alert("Upload an image first");

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(API, { method: "POST", body: formData });
  const data = await res.json();

  showResult(data.prediction, data.confidence);
}


// ---------- DISPLAY RESULT ----------
function showResult(label, conf) {

  const confidence = Math.round(conf * 100);
  const icon = GESTURE_ICONS[label] || "🤖";

  document.getElementById("result-card").style.display = "block";
  document.getElementById("gestureIcon").innerHTML = icon;
  document.getElementById("predictionText").innerHTML =
    `Prediction: <b>${label.toUpperCase()}</b>`;

  document.getElementById("confidenceBar").style.width = confidence + "%";
  document.getElementById("confidenceText").innerHTML =
    `Confidence: ${confidence}%`;

  const li = document.createElement("li");
  li.innerHTML = `${icon} ${label} — ${confidence}%`;
  historyList.prepend(li);
}


// ---------- WEBCAM MODE ----------
let cam = document.getElementById("cam");
let canvas = document.getElementById("frameGrab");
let camActive = false;
let stream;

async function toggleWebcam() {

  if (camActive) {
    stream.getTracks().forEach(t => t.stop());
    cam.style.display = "none";
    camActive = false;
    return;
  }

  stream = await navigator.mediaDevices.getUserMedia({ video: true });
  cam.srcObject = stream;
  cam.style.display = "block";
  camActive = true;

  startLivePrediction();
}


// ---------- LIVE FRAME PREDICTION ----------
async function startLivePrediction() {

  const ctx = canvas.getContext("2d");

  setInterval(async () => {

    if (!camActive) return;

    canvas.width = 64;
    canvas.height = 64;

    ctx.drawImage(cam, 0, 0, 64, 64);

    canvas.toBlob(async blob => {

      const formData = new FormData();
      formData.append("file", blob, "frame.jpg");

      const res = await fetch(API, { method: "POST", body: formData });
      const data = await res.json();

      showResult(data.prediction, data.confidence);
    });

  }, 900);
}
