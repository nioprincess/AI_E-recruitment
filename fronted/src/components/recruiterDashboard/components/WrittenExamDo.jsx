import { useParams } from "react-router-dom";
import useUserAxios from "../../../hooks/useUserAxios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";
import { useRef } from "react";

const settings = {
  bars: 30,
  spacing: 6,
  width: 10,
  height: 50,
};

function WrittenExamDo() {
  const { id, type } = useParams();
  const axios = useUserAxios();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [application, setApplication] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [examStarted, setExamStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState(null);
  const [currentAnswerId, setCurrentAnswerId] = useState(null);
  const [observation, setObservation] = useState(null);
  const refs = useRef([]);
  const volume = useRef(0);
  const volumeRefs = useRef(new Array(settings.bars));
  const [currentVolume, setCurrentVolume] = useState(0);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    browserSupportsContinuousListening,
    isMicrophoneAvailable,
  } = useSpeechRecognition();
  const [error, setError] = useState(null);
  const qId = searchParams.get("qId");

  const getQuestions = async () => {
    try {
      setLoading(true);
      const resp = await axios.get(
        `/api/examination/exam-questions/my-exam-questions?examId=${id}&examType=${type}`
      );
      if (resp.status < 400) {
        if (resp.data.length > 0) {
          const examData = resp.data[0].exam.exam;
          const applicationData = resp.data[0].exam.application;
          const questionsData = [...resp.data.map((q) => q.id)];

          setExamStarted(resp.data[0].exam.exam_started);
          setCurrentQuestionId(resp.data[0].exam.last_question);
          setExam(examData);
          setQuestions(questionsData);
          setApplication(applicationData);
           
          if (examData.e_duration) {
            setTimeLeft((examData.e_duration * 60)-Number(resp.data[0].exam.current_time));
          }

          const currentAnswers = {};
          resp.data.map((q) => {
            if (q?.answer?.a_text?.length > 0) {
              currentAnswers[q.id] = q.answer.a_text;
            }
          });
          setAnswers(currentAnswers);
        }
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const answer = useDebouncedCallback(async () => {
    try {
      await axios.patch(`/api/examination/exam-answers/${currentAnswerId}/`, {
        a_text: currentAnswer,
      });
    } catch (error) {
      console.log(error);
    }
  }, 1000);

  const getCurrentQuestion = async () => {
    try {
      if (qId) {
        const resp = await axios.get(
          `/api/examination/exams/current-question/?qId=${qId}`
        );
        if (resp.data.success) {
          setCurrentQuestion(resp.data.data);
        }
      }
    } catch (error) {
      console.error("Error fetching current question:", error);
    }
  };

  const updateExamQuestionNumber = async () => {
    try {
      const resp = await axios.patch(
        `/api/examination/application-exams/${id}/`,
        { last_question: currentQuestionId }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const startAnswer = async () => {
    try {
      const resp = await axios.post(
        `/api/examination/exam-answers/start_answer/?qId=${currentQuestionId}`
      );
      if (resp.status < 400) {
        setObservation(resp.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
    try {
      const resp = await axios.patch(
        `/api/examination/application-exams/${id}/`,
        { exam_started: true }
      );
      if (resp.status < 400) {
        setExamStarted(true);
        setCurrentQuestionId(questions[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
    setCurrentAnswer(answer);
  };

  const saveAnswer = async (questionId, answer) => {
    try {
      setSaving(true);
      await axios.post("/api/examination/save-answer/", {
        questionId,
        answer,
        examId: id,
      });
    } catch (error) {
      console.error("Error saving answer:", error);
    } finally {
      setSaving(false);
    }
  };

  const saveNoiseInfo = async () => {
    try {
      
      await axios.post(`/api/examination/exam-noise/`, {
        e: id,
        n_level: currentVolume,
        n_timestamp: exam.e_duration*60 - timeLeft,
      });
    } catch (error) {
      console.error("Error saving noise data:", error);
    } 
  };
  const goToNextQuestion = () => {
    const currentIndex = questions.indexOf(currentQuestionId);
    if (currentIndex < questions.length - 1) {
      setCurrentQuestionId(questions[currentIndex + 1]);
    }
  };

  const updateExamTime = async () => {
    try {
      await axios.patch(
        `/api/examination/application-exams/${id}/`,
        { current_time: exam.e_duration*60-timeLeft }
      );
     
    } catch (error) {
      console.log(error);
    }
  };

  const goToPreviousQuestion = () => {
    const currentIndex = questions.indexOf(currentQuestionId);
    if (currentIndex > 0) {
      setCurrentQuestionId(questions[currentIndex - 1]);
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
          answers: answers,
        });
        alert("Exam submitted successfully!");
        // Redirect to results page or home
      } catch (error) {
        console.error("Error submitting exam:", error);
        alert("Error submitting exam. Please try again.");
      }
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

  // Timer effect
  useEffect(() => {
    let timer;
    if (examStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        if (timeLeft % 10 == 0) {
          Promise.all([updateExamTime(),saveNoiseInfo()])
          resetTranscript();
        }
      }, 1000);
    } else if (timeLeft === 0) {
      submitExam();
    }
    return () => clearInterval(timer);
  }, [examStarted, timeLeft]);

  useEffect(() => {
    getQuestions();

    SpeechRecognition.startListening({
      continuous: true,
      language: "en-US",
    });
    return () => {
      SpeechRecognition.stopListening();
    };
  }, []);

  useEffect(() => {
    getCurrentQuestion();
  }, [searchParams]);

  useEffect(() => {
    if (currentQuestionId !== null) {
      const params = new URLSearchParams(searchParams);
      params.set("qId", currentQuestionId);
      params.set("qIdx", questions.indexOf(currentQuestionId));
      setSearchParams(params);
      Promise.all([startAnswer(), updateExamQuestionNumber()]);
    }
  }, [currentQuestionId]);

  useEffect(() => {
    answer();
  }, [currentAnswer]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setObservation((prev) => {
          return { ...prev, o_tab_switches: prev.o_tab_switches + 1 };
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (currentQuestion) {
      setCurrentAnswerId(currentQuestion.answer.id);
      setCurrentAnswer(currentQuestion.answer.a_text);
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: currentQuestion.answer.a_text,
      }));
    }
  }, [currentQuestion]);
  useEffect(() => {
    if (observation) {
      updateObservations();
    }
  }, [observation]);

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

  const renderQuestionContent = () => {
    if (!currentQuestion) return null;

    const { q_type, q_text, q_choices, id: questionId } = currentQuestion;
    const currentAnswer = answers[questionId] || "";

    switch (q_type) {
      case "multiple-choice":
        const choices = JSON.parse(q_choices || "[]");
        return (
          <div className="space-y-3 mt-4">
            {choices.map((choice, index) => (
              <label
                key={index}
                className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-base-200 transition-colors"
              >
                <input
                  type="radio"
                  name={`question-${questionId}`}
                  value={choice}
                  checked={currentAnswer === choice}
                  onChange={(e) => {
                    handleAnswerChange(questionId, e.target.value);
                    saveAnswer(questionId, e.target.value);
                  }}
                  className="radio radio-primary"
                />
                <span className="text-base">{choice}</span>
              </label>
            ))}
          </div>
        );

      case "short-answer":
      case "essay":
        return (
          <div className="mt-4">
            <textarea
              className="textarea textarea-bordered w-full h-32"
              value={currentAnswer}
              onChange={(e) => {
                handleAnswerChange(questionId, e.target.value);
              }}
              placeholder="Type your answer here..."
            />
          </div>
        );

      case "function-implementation":
      case "bug-fixing":
      case "code-review":
      case "algorithm-design":
      case "data-structure-manipulation":
        return (
          <div className="mt-4">
            <Editor
              className="textarea textarea-bordered w-full h-64  textarea-md"
              value={currentAnswer}
              onChange={(e) => {
                handleAnswerChange(questionId, e.target.value);
              }}
              placeholder="Write your code here..."
              spellCheck="false"
              highlight={(code) => highlight(code, languages.js)}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 12,
              }}
            />
            <div className="text-sm text-base-content/70 mt-2">
              {q_type === "function-implementation" &&
                "Write a complete function implementation"}
              {q_type === "bug-fixing" &&
                "Identify and fix the bugs in the code"}
              {q_type === "code-review" &&
                "Provide your code review and suggestions"}
              {q_type === "algorithm-design" &&
                "Design and describe your algorithm"}
              {q_type === "data-structure-manipulation" &&
                "Write your data structure manipulation code"}
            </div>
          </div>
        );

      default:
        return (
          <div className="mt-4">
            <textarea
              className="textarea textarea-bordered w-full h-32"
              value={currentAnswer}
              onChange={(e) => handleAnswerChange(questionId, e.target.value)}
              placeholder="Type your answer here..."
            />
          </div>
        );
    }
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
      <div className="min-h-screen bg-base-200 py-8">
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
                    <div className="stat-title">Questions</div>
                    <div className="stat-value text-secondary">
                      {questions.length}
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
      <div className="bg-base-100 shadow-sm sticky top-0 z-50">
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
                  Saving...
                </div>
              )}
            </div>
            <div
              className={`text-xl font-mono font-bold ${
                timeLeft < 300
                  ? "text-error animate-pulse"
                  : "text-base-content"
              }`}
            >
              {formatTime(timeLeft)}
            </div>

            <button
              className="btn btn-error btn-outline mt-4"
              onClick={submitExam}
            >
              Submit Exam
            </button>
          </div>
        </div>

        <div className="card-actions w-full bg-base-100 shadow-sm  justify-between items-center pb-2 px-2 sticky top-35 z-38">
          <button
            className="btn btn-outline"
            onClick={goToPreviousQuestion}
            disabled={questions.indexOf(currentQuestionId) === 0}
          >
            <ChevronLeft /> Previous
          </button>
          <div className="badge badge-primary badge-lg">
            Question {questions.indexOf(currentQuestionId) + 1} of{" "}
            {questions.length}
          </div>
          <button
            className="btn btn-primary"
            onClick={goToNextQuestion}
            disabled={
              questions.indexOf(currentQuestionId) === questions.length - 1
            }
          >
            Next <ChevronRight />
          </button>
        </div>

        {/* <div class="flex items-center justify-center">{transcript}</div> */}
      </div>

      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center">
          {/* Navigation Panel */}
          {/* <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-lg sticky top-24">
              <div className="card-body">
                <h3 className="card-title">Questions</h3>
                <div className="grid grid-cols-5 lg:grid-cols-3 gap-2 max-h-96 overflow-y-auto">
                  {questions.map((questionId, index) => (
                    <button
                      key={questionId}
                      className={`btn btn-sm ${
                        qId == questionId
                          ? "btn-primary"
                          : answers[questionId]
                          ? "btn-success"
                          : "btn-ghost"
                      }`}
                      onClick={() => goToQuestion(questionId)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <div className="divider"></div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded bg-primary"></div>
                    <span>Current Question</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded bg-success"></div>
                    <span>Answered</span>
                  </div>
                </div>

                <button
                  className="btn btn-error btn-outline mt-4"
                  onClick={submitExam}
                >
                  Submit Exam
                </button>
              </div>
            </div>
          </div> */}

          {/* Question Area */}
          <div className="w-full">
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                {currentQuestion && (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <div className="badge badge-lg {getQuestionTypeBadge(currentQuestion.q_type)}">
                        {currentQuestion.q_type.replace("-", " ").toUpperCase()}
                      </div>
                      <div className="text-sm text-base-content/70">
                        Weight: {currentQuestion.q_score_weight}
                      </div>
                    </div>

                    <h2 className="card-title text-xl mb-4">
                      {currentQuestion.q_text}
                    </h2>

                    {renderQuestionContent()}
                  </>
                )}
                <div className=" bg-base-100 fixed bottom-0.5 right-0 p-2 rounded-md">
                  {createElements()} {currentVolume}{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WrittenExamDo;
