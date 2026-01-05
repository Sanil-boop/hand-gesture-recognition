✋ Hand Gesture Recognition — Deep Learning Web App

This project is a Hand Gesture Recognition System that uses a trained Deep Learning model to classify hand gestures from images and a live webcam feed.

The backend is deployed on Render using a TensorFlow Lite model, and the frontend is hosted on GitHub Pages.

🌍 Live Demo

🔗 Website (Frontend UI)
👉 https://sanil-boop.github.io/gesture-ai-website/

🚀 API (Backend Running on Render)

🔗 Gesture Recognition API
👉 https://hand-gesture-recognition-3.onrender.com/

🧠 Features

✔ Upload an image to detect gesture
✔ Live Webcam prediction
✔ Confidence percentage bar
✔ Gesture emoji output
✔ Prediction history log
✔ Responsive modern UI
✔ TensorFlow Lite optimized backend

🧩 Supported Gestures
| Gesture    | Label |
| ---------- | ----- |
| 🖐 Palm    | palm  |
| ✊ Fist     | fist  |
| ☝ Index    | index |
| 👍 Thumb   | thumb |
| 👌 OK      | ok    |
| 🫸 L-shape | l     |
| ❔ Blank    | blank |


🏗 Tech Stack
🎯 Frontend

HTML, CSS, JavaScript

Webcam Streaming

Fetch API

🤖 Backend

Flask

TensorFlow Lite

OpenCV

NumPy

☁ Deployment

Render (API Hosting)

GitHub Pages (Frontend Hosting)



📂 Project Structure
/Website
 ├── index.html
 ├── style.css
 ├── script.js

Backend
 ├── app.py
 ├── gesture_model.tflite
 ├── label_map.json
 ├── requirements.txt
 ├── runtime.txt
 ├── Procfile

▶ Running Locally
1️⃣ Install dependencies
pip install -r requirements.txt

2️⃣ Start Flask server
python app.py


API runs at:

http://127.0.0.1:5000/

🌐 Deployment Overview
Backend (Render)

✔ Uses tflite-runtime
✔ Python runtime pinned
✔ Gunicorn server

Frontend (GitHub Pages)

✔ Static hosting
✔ Works with external API
✔ No framework required

🧑‍💻 Author

👤 Sanil Maurya
📍 Pune, Maharashtra
📧 sanilmaurya674@gmail.com

🔗 LinkedIn — https://www.linkedin.com/in/sanil-maurya-45944a370/
