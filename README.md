# 🧮 Object Stack Counter (Computer Vision + Web)
===============================================

This project detects and counts stacked objects (such as pipes, boxes, or bricks) from a **single image** using a trained computer vision model. It is designed as a **decoupled system**, where:

-   The **ML inference backend** can be run locally or on the cloud

-   The **web frontend** consumes the cloud API and works from anywhere

The repository is divided into **two main folders**: 

object-counter/

├── backend_test/

└── web_app/


## 🌐 1. web_app (Production Web Frontend)
---------------------------------------

This folder contains the **fully working frontend website**.

⚠️ **Important:** The backend is **not running locally** for this frontend.

Instead, the backend (model inference API) is deployed on **Hugging Face Spaces**.

### ☁️ Cloud Backend (Already Deployed)

The live inference API is available here:

<https://shashanklambat-counter.hf.space/count>

-   The frontend sends images to this endpoint

-   The backend processes the image

-   The response includes:
    -   Object count
    -   Processed image data

### 🚀 How to Use the Frontend

1.  Clone **only the web_app folder**
2.  Install frontend dependencies:
    - npm i
    - npm audit fix --force (optional to fix vulnerabilities)
    - npm run dev
3.  Run the frontend locally
👉 The frontend will **automatically connect** to the Hugging Face backend.

### ⏳ First-Time Behavior

-   If the Hugging Face Space is **inactive**, the first request may take some time
-   This is normal (cold start)
-   Once the Space is running, responses will be **fast and direct**


## 📁 2. backend_test (Local Backend Testing)
------------------------------------------

This folder contains the **backend logic and local testing utilities** for the object counter model.

### 🔧 Installation
Create a virtual environment (recommended) and install dependencies from requirements.txt 
cd web_app
pip install -r requirements.txt

### 📦 Dependencies

The backend uses the following Python libraries:
fastapi
uvicorn
opencv-python
ultralytics
python-multipart
numpy

### 📄 Files in backend_test

#### 1️⃣ test_image.py

-   Used to **test the model with an image from local storage**
-   Uploads a single image
-   The backend processes the imag
-   Returns:
    -   Total number of detected objects
    -   Processed image with bounding boxes and serial numbers

**Use case:** When you want to verify model accuracy on saved images.

#### 2️⃣ camera_test.py

-   Uses the **system camera**
-   Captures **one single photo**
-   Processes that photo using the trained model

-   Displays:
    -   The detected image
    -   Bounding boxes
    -   Sequential numbering of objects
    -   Total object count

**How to use:**
1.  Run the script
2.  Camera window opens
3.  Press **SPACEBAR** to capture the image
4.  The processed result and count will be shown

**Use case:** Quick real-world testing without saving images manually.
