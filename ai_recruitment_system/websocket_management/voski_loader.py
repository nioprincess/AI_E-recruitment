from vosk import Model
import os

MODEL_PATH = "models/vosk-model-small-en-us-0.15"   

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Vosk model not found at {MODEL_PATH}")

model = None

def load_model():
    global model 
    model=  Model(MODEL_PATH)
def get_vosk_model():
    return model
