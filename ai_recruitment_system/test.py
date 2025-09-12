import sounddevice as sd
import queue
from vosk import Model, KaldiRecognizer
import json
import sys

model_path = "models/vosk-model-small-en-us-0.15"   
model = Model(model_path)

device_info = sd.query_devices(None, 'input')
print(device_info)
samplerate = int(device_info['default_samplerate'])
q = queue.Queue()

def callback(indata, frames, time, status):
    if status:
        print(status, file=sys.stderr)
    q.put(bytes(indata))
 
recognizer = KaldiRecognizer(model, samplerate)

try:
    with sd.RawInputStream(samplerate=samplerate, blocksize=8000, device=None, dtype='int16',
                            channels=1, callback=callback):
        print('#' * 80)
        print('Press Ctrl+C to stop the recording')
        print('#' * 80)

        while True:
            data = q.get()
            if recognizer.AcceptWaveform(data):
                result = json.loads(recognizer.Result())
                print("Recognized:", result["text"])
            else:
                partial_result = json.loads(recognizer.PartialResult())
                print("Partial:", partial_result["partial"])

except KeyboardInterrupt:
    print('\nDone')
except Exception as e:
    print(type(e).__name__ + ': ' + str(e))