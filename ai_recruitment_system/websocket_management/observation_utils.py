import base64
import cv2
import numpy as np
import torch
import json
import os
import asyncio
from concurrent.futures import ThreadPoolExecutor
from facenet_pytorch import MTCNN
from emotiefflib.facial_analysis import EmotiEffLibRecognizer, get_model_list
from .gesture import GestureRecognizer
from transformers import AutoImageProcessor, AutoModelForObjectDetection, AutoConfig
from examination_management.models import InterviewObservation, ApplicationExam

# -------------------- Global Setup (Run once) --------------------

# Use GPU if available
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {device}")

# Initialize models once (not on every import)
_models_initialized = False
_mtcnn = None
_fer = None
_fashion_processor = None
_fashion_model = None
_gesture_recognizer = None


def initialize_models():
    """Initialize models once to avoid reloading"""
    global _models_initialized, _mtcnn, _fer, _fashion_processor, _fashion_model, _gesture_recognizer

    if _models_initialized:
        return

    print("Initializing models...")

    # Emotion detection
    model_name = get_model_list()[0]
    _mtcnn = MTCNN(keep_all=True, device=device)
    _fer = EmotiEffLibRecognizer(engine="onnx", model_name=model_name, device=device)

    # Fashion detection
    MODEL_DIR = r"yolos-fashionpedia"
    MODEL_PATH = os.path.join(MODEL_DIR, "pytorch_model.bin")

    _fashion_processor = AutoImageProcessor.from_pretrained(MODEL_DIR)
    config = AutoConfig.from_pretrained(MODEL_DIR)
    _fashion_model = AutoModelForObjectDetection.from_config(config)
    _fashion_model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
    _fashion_model.to(device)
    _fashion_model.eval()

    # Gesture recognition
    _gesture_recognizer = GestureRecognizer()

    _models_initialized = True
    print("Models initialized successfully")


# Initialize models on import
initialize_models()

FASHION_CATEGORIES = [
    "shirt, blouse",
    "top, t-shirt, sweatshirt",
    "sweater",
    "cardigan",
    "jacket",
    "vest",
    "pants",
    "shorts",
    "skirt",
    "coat",
    "dress",
    "jumpsuit",
    "cape",
    "glasses",
    "hat",
    "headband, head covering, hair accessory",
    "tie",
    "glove",
    "watch",
    "belt",
    "leg warmer",
    "tights, stockings",
    "sock",
    "shoe",
    "bag, wallet",
    "scarf",
    "umbrella",
    "hood",
    "collar",
    "lapel",
    "epaulette",
    "sleeve",
    "pocket",
    "neckline",
    "buckle",
    "zipper",
    "applique",
    "bead",
    "bow",
    "flower",
    "fringe",
    "ribbon",
    "rivet",
    "ruffle",
    "sequin",
    "tassel",
]

# Thread pool for parallel execution
_thread_pool = ThreadPoolExecutor(max_workers=3)

# -------------------- Optimized Helper Functions --------------------


def decode_base64_image(base64_str):
    """Optimized base64 decoding without resizing"""
    try:
        if "," in base64_str:
            base64_str = base64_str.split(",")[1]
        base64_str = base64_str.strip().replace("\n", "").replace("\r", "")

        # Use numpy for faster decoding
        image_data = base64.b64decode(base64_str)
        np_arr = np.frombuffer(image_data, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        return frame
    except Exception as e:
        print(f"Error decoding image: {e}")
        return None


def detect_emotion(frame):
    """Optimized emotion detection"""
    if frame is None:
        return []

    try:
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        boxes, _ = _mtcnn.detect(frame_rgb)
        detections = []

        if boxes is not None:
            for box in boxes:
                x1, y1, x2, y2 = [int(b) for b in box]
                # Skip very small faces
                if (x2 - x1) < 20 or (y2 - y1) < 20:
                    continue

                face_img = frame_rgb[y1:y2, x1:x2]
                if face_img.size == 0:
                    continue
                try:
                    emotion, _ = _fer.predict_emotions(face_img, logits=True)
                    detections.append({"label": emotion[0], "bbox": [x1, y1, x2, y2]})
                except Exception:
                    continue
        return detections
    except Exception as e:
        print(f"Emotion detection error: {e}")
        return []


def detect_fashion(frame):
    """Optimized fashion detection"""
    if frame is None:
        return []

    try:
        image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        inputs = _fashion_processor(images=image_rgb, return_tensors="pt")
        inputs = {k: v.to(device) for k, v in inputs.items()}

        with torch.no_grad():
            outputs = _fashion_model(**inputs)

        target_sizes = torch.tensor([image_rgb.shape[:2]]).to(device)
        results = _fashion_processor.post_process_object_detection(
            outputs, threshold=0.5, target_sizes=target_sizes
        )[0]

        detections = []
        for score, label, box in zip(
            results["scores"], results["labels"], results["boxes"]
        ):
            if label < len(FASHION_CATEGORIES) and score > 0.6:
                detections.append(
                    {
                        "label": FASHION_CATEGORIES[label],
                        "confidence": round(score.item(), 3),
                    }
                )
        return detections
    except Exception as e:
        print(f"Fashion detection error: {e}")
        return []


def detect_gestures(frame):
    """Detect hand gestures"""
    if frame is None:
        return []

    try:
        _, gesture_results = _gesture_recognizer.process_frame(frame)
        return gesture_results if gesture_results else []
    except Exception as e:
        print(f"Gesture detection error: {e}")
        return []


# -------------------- Parallel Processing --------------------


def process_base64_image_parallel(base64_str):
    """Process image with parallel model execution"""
    frame = decode_base64_image(base64_str)
    if frame is None:
        return {"error": "Failed to decode image"}

    # Run all detectors in parallel
    with ThreadPoolExecutor(max_workers=3) as executor:
        emotion_future = executor.submit(detect_emotion, frame)
        fashion_future = executor.submit(detect_fashion, frame)
        gesture_future = executor.submit(detect_gestures, frame)

        results = {
            "emotions": emotion_future.result(),
            "clothing": fashion_future.result(),
            # "hand_gestures": gesture_future.result()
        }

    return results


async def process_base64_image_async(base64_str):
    """Async version for web applications"""
    loop = asyncio.get_event_loop()

    frame = decode_base64_image(base64_str)
    if frame is None:
        return {"error": "Failed to decode image"}

    # Run detectors in parallel using thread pool
    emotions_task = loop.run_in_executor(_thread_pool, detect_emotion, frame)
    fashion_task = loop.run_in_executor(_thread_pool, detect_fashion, frame)
    gestures_task = loop.run_in_executor(_thread_pool, detect_gestures, frame)

    emotions, clothing, hand_gestures = await asyncio.gather(
        emotions_task, fashion_task, gestures_task
    )

    return {"emotions": emotions, "clothing": clothing, "hand_gestures": hand_gestures}


def process_base64_image(base64_str, exam_id, parallel=True):
    """Main processing function with option for parallel execution"""
    if parallel:
        return process_base64_image_parallel(base64_str)
    else:
        # Sequential fallback
        frame = decode_base64_image(base64_str)
        if frame is None:
            return {"error": "Failed to decode image"}
        result = {
            "emotions": detect_emotion(frame),
            "clothing": detect_fashion(frame),
        }
        try:
            exam = ApplicationExam(id=exam_id)
            observation=InterviewObservation.objects.get(e=exam)
            currentClothing= json.loads(observation.o_clothing)
            currentEmotions= json.loads(observation.o_face_expressions)
            observation.objects.update(
                e=exam,
                o_clothing=json.dumps(
                    [*currentClothing, {"clothing": result["clothing"], "current_time": exam.current_time}]
                ),
                o_face_expressions=json.dumps([*currentEmotions, {"emotions": result["emotions"], "current_time":exam.current_time}])
            )
        except:
            pass

        return result


# -------------------- Example Usage --------------------

if __name__ == "__main__":
    # Example base64 string (replace with your own)
    base64_img = """data:image/png;base64,iVBORw0KGgoAAAAN""".strip()

    # Parallel processing (recommended)
    detections = process_base64_image(base64_img, parallel=True)
    print(json.dumps(detections, indent=2))

    # Or async version for web apps
    # detections = asyncio.run(process_base64_image_async(base64_img))
