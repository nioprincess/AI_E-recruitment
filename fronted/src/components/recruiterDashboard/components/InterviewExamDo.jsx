import { useParams } from "react-router-dom";
import useUserAxios from "../../../hooks/useUserAxios";
import { useEffect, useState } from "react";
import {
  ArrowLeftRight,
  AudioLines,
  CameraIcon,
  Loader2,
  Mic,
  Speech,
} from "lucide-react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";
import { useRef } from "react";
import { useCallback } from "react";
import useUser from "../../../hooks/useUser";
import useInterviewMessages from "../../../hooks/useInterviewContext";
import { useSpeech } from "react-text-to-speech";
import useObservations from "../../../hooks/useObservation";
import useSocket from "../../../hooks/useSockets";
import { useFaceDetection } from "react-use-face-detection";
import FaceDetection from "@mediapipe/face_detection";
import { Camera } from "@mediapipe/camera_utils";
import WebcamDemo from "./WebcamDemo";
const settings = {
  bars: 30,
  spacing: 6,
  width: 10,
  height: 50,
};

const FACING_MODE_USER = "user";
const FACING_MODE_ENVIRONMENT = "environment";

function InterviewExamDo() {
  const { id } = useParams();
  const axios = useUserAxios();
  const [exam, setExam] = useState(null);
  const [application, setApplication] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [examStarted, setExamStarted] = useState(false);
  const [examEnded, setExamEnded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [deviceNo, setDeviceNo] = useState(0);
  const [deviceId, setDeviceId] = useState("");
  const [devices, setDevices] = useState([]);
  const [observation, setObservation] = useState(null);
  const refs = useRef([]);
  const volume = useRef(0);
  const volumeRefs = useRef(new Array(settings.bars));
  const [currentVolume, setCurrentVolume] = useState(0);
  const { messages, setMessages } = useInterviewMessages();
  const { socket, observations, setObservations, setSocket } =
    useObservations();
  const { connectWebSocket } = useSocket();
  const user = useUser();
  const [textToSpeak, setTextToSpeak] = useState("");
  const [lastSpokenTime, setLastSpokenTime] = useState(Date.now());
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAiTalking, setIsAiTalking] = useState(false);
  const [processingLasttime, setProcessingLastTime] = useState(Date.now());
  const [newAnswerId, setNewAnswerId] = useState(null);
  const [faceLocation, setFaceLocation] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingId, setAnalyzingId] = useState(null);
  const [lastFaceMessageTime, setLastFaceMessageTime] = useState(0);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const waitingTime = 60 * 60 * 1000;
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,

    isMicrophoneAvailable,
  } = useSpeechRecognition();

  const faceDetectionConfig = {
    faceDetection: new FaceDetection.FaceDetection({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
    }),
    camera: ({ mediaSrc, onFrame }) =>
      new Camera(mediaSrc, { onFrame, width: 160, height: 120 }),
    faceDetectionOptions: { model: "short", minDetectionConfidence: 0.5 },
  };

  const { webcamRef, boundingBox, isLoading, detected, facesDetected } =
    useFaceDetection(faceDetectionConfig);

  const { Text, speechStatus, isInQueue, start, pause, stop } = useSpeech({
    text: textToSpeak,
    highlightText: true,
    showOnlyHighlightedText: false,
    highlightMode: "word",
    highlightProps: { style: { color: "white", backgroundColor: "blue" } },
  });

  const [error, setError] = useState(null);
  const [captions, setCaptions] = useState([]);
  const [liveCaption, setLiveCaption] = useState("");

  const getExamInfo = async () => {
    try {
      setLoading(true);
      const resp = await axios.get(`/api/examination/application-exams/${id}`);

      if (resp.status < 400) {
        const examData = resp.data.exam;
        const applicationData = resp.data.application;

        setExamStarted(resp.data.exam_started);
        setExamEnded(resp.data.exam_ended);

        setExam(examData);

        setApplication(applicationData);

        if (examData.e_duration) {
          setTimeLeft(
            examData.e_duration * 60 - Number(resp.data.current_time)
          );
        }
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDevices = useCallback(
    (mediaDevices) =>
      setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
    [setDevices]
  );

  const [facingMode, setFacingMode] = useState(FACING_MODE_ENVIRONMENT);
  const handleClick = useCallback(() => {
    setFacingMode((prevState) =>
      prevState === FACING_MODE_USER
        ? FACING_MODE_ENVIRONMENT
        : FACING_MODE_USER
    );
  }, []);

  const updateObservations = async () => {
    try {
      await axios.patch(
        `/api/examination/exam-observations/${observation.id}/`,
        observation
      );
    } catch (error) {
      console.log(error);
    }
  };

  const startExam = async () => {
    setTextToSpeak(
      "Please wait for the interviewer. The session will begin shortly."
    );
    try {
      const resp = await axios.patch(
        `/api/examination/application-exams/${id}/`,
        { exam_started: true }
      );
      if (resp.status < 400) {
        setInterviewStarted(true);
        setExamStarted(true);

        getQuestion();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getQuestion = async () => {
    try {
      const resp = await axios.post(
        `/api/examination/interview-questions/next_question/?examId=${id}`
      );
      if (resp.status < 400) {
        console.log(resp.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveNoiseInfo = async () => {
    if (examEnded) {
      return;
    }
    try {
      await axios.post(`/api/examination/exam-noise/`, {
        e: id,
        n_level: currentVolume,
        n_timestamp: exam.e_duration * 60 - timeLeft,
      });
    } catch (error) {
      console.error("Error saving noise data:", error);
    }
  };

  const updateExamTime = async () => {
    try {
      if (examEnded) {
        return;
      }
      await axios.patch(`/api/examination/application-exams/${id}/`, {
        current_time: exam.e_duration * 60 - timeLeft,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const submitExam = async () => {
    if (
      window.confirm(
        "Are you sure you want to submit the exam? You cannot change your answers after submission."
      )
    ) {
      try {
        await axios.post("/api/examination/submit-exam/", {
          examId: id,
        });
        alert("Exam submitted successfully!");
        // Redirect to results page or home
      } catch (error) {
        console.error("Error submitting exam:", error);
        alert("Error submitting exam. Please try again.");
      }
    }
  };

  const submitAnswer = async () => {
    try {
      if (examEnded) {
        setError("We can't proceed because exam already ended");
        return;
      }
      if (transcript.length <= 0 || !examStarted) return;
      setIsProcessing(true);
      setProcessingLastTime(Date.now());
      if (!newAnswerId) {
        getQuestion();
        return;
      }

      if (currentQuestion) {
        const resp = await axios.patch(
          `/api/examination/interview-responses/${newAnswerId}/`,
          {
            q: currentQuestion.q_id,
            r_text: transcript,
            r_socre: 1,
            current_time: exam.e_duration * 60 - timeLeft,
          }
        );
        if (resp.status < 400) {
          setMessages([]);
          getQuestion();
        }
      } else {
        getQuestion();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getMedia = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);
        analyser.smoothingTimeConstant = 0.4;
        analyser.fftSize = 1024;
        microphone.connect(analyser);
        analyser.connect(javascriptNode);
        javascriptNode.connect(audioContext.destination);
        javascriptNode.onaudioprocess = () => {
          var array = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(array);
          var values = 0;
          var length = array.length;
          for (var i = 0; i < length; i++) {
            values += array[i];
          }
          volume.current = values / length;
        };
      })
      .catch(function (err) {
        /* handle the error */
      });
  };

  const createElements = () => {
    let elements = [];

    for (let i = 0; i < settings.bars; i++) {
      elements.push(
        <div
          ref={(ref) => refs.current.push(ref)}
          key={`vu-${i}`}
          className="bg-sky-300 rounded-full inline-block"
          style={{
            width: `${settings.width}px`,
            height: `${Math.sin((i / settings.bars) * 4) * settings.height}px`,
            marginRight: `${settings.spacing}px`,
          }}
        />
      );
    }

    return <div>{elements}</div>;
  };

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, [handleDevices]);

  useEffect(() => {
    if (devices.length > 0) {
      setDeviceId(devices[deviceNo].deviceId);
    }
  }, [deviceNo]);
  useEffect(getMedia, []);
  useEffect(() => {
    const intervalId = setInterval(() => {
      volumeRefs.current.unshift(volume.current);
      volumeRefs.current.pop();
      for (let i = 0; i < refs.current.length; i++) {
        if (refs.current[i]) {
          const vlm = volumeRefs.current[i] / 100;
          refs.current[i].style.transform = `scaleY(${vlm})`;
          if (!isNaN(vlm)) {
            setCurrentVolume(vlm.toFixed(2));
          }
        }
      }
    }, 20);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (Date.now() - processingLasttime > waitingTime && isProcessing) {
        setIsProcessing(false);
        setError("The interviewer waiting timeout");
      }
    }, 1000);
    return () => {
      clearInterval(intervalId);
    
    };
  }, []);

  useEffect(() => {
    try {
      if (observations.length > 0) {
        const currentObservation = observations[0]?.message;
        const emotions = currentObservation?.emotions[0];
        const clothing = currentObservation?.clothing;

        const face = emotions?.bbox;
        console.log(observations);
        setFaceLocation(face);

        setIsAnalyzing(false);
      }
    } catch (error) {
      console.log(error);
    }
  }, [observations]);

  useEffect(() => {
    let timer;
    if (examStarted && timeLeft > 0 && !examEnded) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        if (timeLeft % 10 == 0) {
          Promise.all([updateExamTime(), saveNoiseInfo()]);
        }
      }, 1000);
    } else if (timeLeft === 0) {
      submitExam();
    }
    return () => clearInterval(timer);
  }, [examStarted, timeLeft]);

  useEffect(() => {
    getExamInfo();
    SpeechRecognition.startListening({
      continuous: true,
      language: "en-US",
      interimResults: true,
    });
    return () => {
      SpeechRecognition.stopListening();
    };
  }, []);
  useEffect(() => {
    if (transcript) {
      if (!isAiTalking || !isProcessing) {
        setLiveCaption(transcript);
        setLastSpokenTime(Date.now());
      }
    }
  }, [transcript]);

  useEffect(() => {
    if (speechStatus == "started") {
      setIsAiTalking(true);
    } else {
      setIsAiTalking(false);
    }
  }, [speechStatus]);

  useEffect(() => {
    let isMounted = true;

    const controlSpeechRecognition = async () => {
      if (!isMounted) return;

      try {
        if ((isAiTalking || isProcessing) && listening) {
          console.log("Stopping speech recognition - AI talking or processing");
          await SpeechRecognition.stopListening();

          // Verify it actually stopped
          setTimeout(() => {
            if (isMounted && listening) {
              console.warn("Speech recognition still listening, forcing stop");
              SpeechRecognition.abortListening();
            }
          }, 500);
        } else if (!isAiTalking && !isProcessing && !listening) {
          console.log(
            "Starting speech recognition - AI silent and not processing"
          );
          await new Promise((resolve) => setTimeout(resolve, 200));
          await SpeechRecognition.startListening({
            continuous: true,
            language: "en-US",
            interimResults: true,
          });
        }
      } catch (error) {
        console.error("Speech recognition control error:", error);
      }
    };

    controlSpeechRecognition();

    return () => {
      isMounted = false;
    };
  }, [isAiTalking, isProcessing, listening]);

  // useEffect(() => {
  //   if (isAiTalking || isProcessing) {
  //     SpeechRecognition.stopListening();
  //   } else {
  //     SpeechRecognition.startListening({
  //       continuous: true,
  //       language: "en-US",
  //       interimResults: true,
  //     });
  //   }
  // }, [isAiTalking, isProcessing]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (observation) {
          setObservation((prev) => {
            return { ...prev, o_tab_switches: prev.o_tab_switches + 1 };
          });
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (examEnded) {
      setError(
        "You are trying to access the exam that is already marked as completed"
      );
    }
  }, [examEnded]);

  useEffect(() => {
    const silenceTimeout = 4000;
    const interval = setInterval(() => {
      if (Date.now() - lastSpokenTime > silenceTimeout && liveCaption.trim()) {
        if (!isProcessing) {
          submitAnswer();
          setLiveCaption("");
          resetTranscript();
        }
        setLastSpokenTime(Date.now());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastSpokenTime, liveCaption]);

  useEffect(() => {
    if (observation) {
      //   updateObservations();
    }
  }, [observation]);

  useEffect(() => {
    const newMessage = messages[0]?.message;
    console.log(newMessage);

    if (newMessage?.n_question?.q_text?.length > 0) {
      setIsProcessing(false);
      setCurrentQuestion(newMessage);
      setNewAnswerId(newMessage?.n_question?.a_id);
      stop();
      setTextToSpeak(newMessage?.n_question?.q_text);
    }
    if (newMessage?.hangup) {
      setExamEnded(true);
    }
  }, [messages]);

  useEffect(() => {
    if (textToSpeak.length > 0) {
      start();
    }
  }, [textToSpeak]);

  useEffect(() => {}, [isProcessing]);

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setError("Your browser doesn't support speech recognition.");
      return;
    }

    if (!isMicrophoneAvailable) {
      setError("Microphone is not available. Please check your permissions.");
    }
  }, [browserSupportsSpeechRecognition, isMicrophoneAvailable]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-lg">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-base-200 py-8 mt-14">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="text-center">
                <h1 className="card-title text-3xl justify-center text-primary mb-4">
                  {exam?.e_title || "Written Exam"}
                </h1>

                <div className="stats shadow mb-6">
                  <div className="stat">
                    <div className="stat-title">Duration</div>
                    <div className="stat-value text-primary">
                      {exam?.e_duration}m
                    </div>
                  </div>

                  <div className="stat">
                    <div className="stat-title">Type</div>
                    <div className="stat-value text-accent">{exam?.e_type}</div>
                  </div>
                </div>

                <div className="text-left space-y-4 mb-6">
                  <div className="bg-base-200 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">
                      Job Information
                    </h3>
                    <p>
                      <strong>Position:</strong> {application?.job?.j_title}
                    </p>
                    <p>
                      <strong>Company:</strong>{" "}
                      {application?.job?.company?.c_name}
                    </p>
                    <p>
                      <strong>Location:</strong> {application?.job?.j_location}
                    </p>
                  </div>
                </div>

                <div className="alert alert-info mb-6">
                  <div className="text-left">
                    <h3 className="font-bold text-lg mb-2">Instructions</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>
                        You have {exam?.e_duration} minutes to complete the exam
                      </li>
                      <li>Answers are saved automatically as you progress</li>
                      <li>
                        Navigate between questions using the question grid
                      </li>
                      <li>Once submitted, you cannot change your answers</li>
                      <li>The exam will auto-submit when time runs out</li>
                    </ul>
                  </div>
                </div>

                <button
                  className="btn btn-primary btn-lg w-full max-w-xs"
                  onClick={startExam}
                >
                  Start Exam
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 mt-14">
      {/* Header */}
      <div className="bg-base-100 shadow-sm sticky top-0 z-100">
        {error && (
          <div
            role="alert"
            className="alert alert-error rounded-none flex justify-center items-center"
          >
            <span>{error}</span>
          </div>
        )}
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-primary">
                {exam?.e_title}
              </h1>

              {saving && (
                <div className="badge badge-ghost badge-lg">
                  <span className="loading loading-spinner loading-xs"></span>
                  <Loader2 className="animate-spin" />
                </div>
              )}
            </div>

            <div className="flex justify-between items-center gap-2">
              <div className="flex justify-between gap-2">
                <Mic
                  className={`${
                    transcript.length > 0 && "animate-ping text-red-500"
                  }`}
                />{" "}
                <span>{user.firstname}</span>{" "}
              </div>
              <ArrowLeftRight className="text-info" />
              <div className="flex justify-between gap-2">
                <span>AI Interviewer </span>{" "}
                <Speech
                  className={`${
                    isAiTalking > 0 && "animate-ping text-red-500"
                  }`}
                />
              </div>
              {/* {JSON.stringify(observations)} */}
            </div>

            {/* <button
              className="btn btn-error btn-outline mt-4"
              onClick={submitExam}
            >
              Submit Exam
            </button> */}
            <div className="flex items-center justify-between gap-2">
              {listening && <AudioLines className="animate-pulse text-info"  />}

              <div
                className={`text-xl font-mono font-bold ${
                  timeLeft < 300
                    ? "text-error animate-pulse"
                    : "text-base-content"
                }`}
              >
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2  flex-col p-5 gap-2   items-center justify-center">
        <div>
          <div className="p-4 space-y-2 absolute top-40 ml-5 flex justify-start items-center w-[500px] wrap-break-word  z-100">
            {liveCaption && (
              <div className="text-sm badge badge-neutral h-auto w-auto mr-2">
                <span className="opacity-100">{liveCaption}</span>
              </div>
            )}
          </div>
          <div>
            <div
              style={{ width: 500, height: 500, position: "relative" }}
              className="px-5"
            >
              <WebcamDemo
                socket={socket}
                setSocket={setSocket}
                connectWebSocket={connectWebSocket}
                isAnalyzing={isAnalyzing}
                setIsAnalyzing={setIsAnalyzing}
                analyzingId={analyzingId}
                setAnalyzingId={setAnalyzingId}
                isAiTalking={isAiTalking}
                speechStatus={speechStatus}
                lastFaceMessageTime={lastFaceMessageTime}
                setLastFaceMessageTime={setLastFaceMessageTime}
                setTextToSpeak={setTextToSpeak}
                examId={id}
              />

              {boundingBox.map((box, index) => (
                <div
                  key={index}
                  style={{
                    position: "absolute",
                    left: `${box.xCenter * 100}%`,
                    top: `${box.yCenter * 100}%`,
                    width: `${box.width * 100}%`,
                    height: `${box.height * 100}%`,
                    border: "3px solid #00ff00",
                    borderRadius: "8px",
                    boxShadow: "0 0 10px rgba(0, 255, 0, 0.5)",
                    zIndex: 10,
                    pointerEvents: "none",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-10">
          {speechStatus == "started" && <Text />}

          <AudioLines
           className= {`w-10 h-10 text-info ${
                    isAiTalking > 0 && "animate-ping text-red-500"
                  }`}
          />
          {isProcessing && <p>Processing ...</p>}
        </div>
      </div>

      <div className=" bg-base-100 fixed bottom-0.5 right-0 p-2 rounded-md flex-col items-center justify-center">
        <div> {createElements()}</div>
        <span>{currentVolume} </span>
      </div>
    </div>
  );
}

export default InterviewExamDo;
