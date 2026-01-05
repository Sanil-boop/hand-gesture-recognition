from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import cv2
import json
# Support both environments
# Use tflite-runtime on Render | TensorFlow locally
try:
    import tflite_runtime.interpreter as tflite
except ImportError:
    from tensorflow import lite as tflite



IMG_SIZE = 64

# Load TFLite model
interpreter = tflite.Interpreter(model_path="gesture_model.tflite")
interpreter.allocate_tensors()

input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

# Load label map
with open("label_map.json") as f:
    label_map = json.load(f)


# --- Clean dataset folder labels into readable gesture names ---
def clean_label(raw):
    raw = raw.replace("leapGestRecog", "")
    raw = raw.replace("\\", " ")
    raw = raw.replace("/", " ")
    raw = raw.replace("_", " ")
    raw = raw.strip()

    parts = raw.split()
    return parts[-1].lower() if parts else raw


reverse_map = {v: clean_label(k) for k, v in label_map.items()}

# Flask App
app = Flask(__name__)
CORS(app)


@app.route("/predict", methods=["POST"])
def predict():

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "Empty file"}), 400

    # Read & decode image
    img_bytes = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(img_bytes, cv2.IMREAD_GRAYSCALE)

    if img is None:
        return jsonify({"error": "Invalid image format"}), 400

    # Preprocess
    img = cv2.resize(img, (IMG_SIZE, IMG_SIZE)).reshape(1, IMG_SIZE, IMG_SIZE, 1)
    img = img.astype("float32")

    # Run inference
    interpreter.set_tensor(input_details[0]["index"], img)
    interpreter.invoke()

    pred = interpreter.get_tensor(output_details[0]["index"])
    label_index = int(np.argmax(pred))
    label = reverse_map[label_index]
    confidence = float(np.max(pred))

    return jsonify({
        "prediction": label,
        "confidence": confidence
    })


@app.route("/")
def home():
    return "Gesture Recognition API Running"


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
