import { useEffect } from "react";
import Webcam from "react-webcam";
import { useFaceDetection } from "react-use-face-detection";
import FaceDetection from "@mediapipe/face_detection";
import { Camera } from "@mediapipe/camera_utils";
import { v4 as uuidv4 } from "uuid";

const width = 500;
const height = 500;

export default function WebcamDemo({
  socket,
  setSocket,
  connectWebSocket,
  isAnalyzing,
  setIsAnalyzing,
  analyzingId,
  setAnalyzingId,
  isAiTalking,
  speechStatus,
  lastFaceMessageTime,
  setLastFaceMessageTime,
  setTextToSpeak,
}) {
  const { webcamRef, boundingBox, isLoading, detected, facesDetected } =
    useFaceDetection({
      faceDetectionOptions: { model: "short" },
      faceDetection: new FaceDetection.FaceDetection({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
      }),
      camera: ({ mediaSrc, onFrame }) =>
        new Camera(mediaSrc, { onFrame, width, height }),
    });

  // Capture webcam and send to socket
  useEffect(() => {
    if (!webcamRef.current) return;

    if (!socket) {
      setSocket(connectWebSocket("/ws/observation/"));
    }

    const captureInterval = setInterval(() => {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc && !isAnalyzing) {
        const id = uuidv4();
        setIsAnalyzing(true);
        setAnalyzingId(id);
        // socket.send(JSON.stringify({ image_data: imageSrc, id }));
      }
    }, 2000);

    return () => {
      clearInterval(captureInterval);
      socket?.close();
    };
  }, [
    socket,
    connectWebSocket,
    setSocket,
    webcamRef,
    isAnalyzing,
    setIsAnalyzing,
    setAnalyzingId,
  ]);

  // Show warning if no face detected
  useEffect(() => {
    const now = Date.now();
    const cooldownPeriod = 10000;

    if (
      facesDetected === 0  &&
      !isLoading &&
      speechStatus !== "started" &&
      now - lastFaceMessageTime > cooldownPeriod
    ) {
      setTextToSpeak(" ");
      setTimeout(() => {
        setTextToSpeak("Please show your face clearly in the camera!");
        setLastFaceMessageTime(now);
      }, 50);
    }
  }, [
    detected,
    facesDetected,
    isLoading,
    lastFaceMessageTime,
    isAiTalking,
    speechStatus,
    setTextToSpeak,
    setLastFaceMessageTime,
  ]);

  return (
    <div>
       
      <div style={{ width, height, position: "relative" }}>
        {boundingBox.map((box, index) => (
          <div
          className="border-success"
            key={index}
            style={{
              border: "4px solid ",
              position: "absolute",
              top: `${box.yCenter * 100}%`,
              left: `${box.xCenter * 100}%`,
              width: `${box.width * 100}%`,
              height: `${box.height * 100}%`,
              zIndex: 1,
            }}
          />
        ))}
        <Webcam
        className="rounded-md"
          ref={webcamRef}
          forceScreenshotSourceSize
          style={{ height, width, position: "absolute" }}
        />
      </div>
    </div>
  );
}
