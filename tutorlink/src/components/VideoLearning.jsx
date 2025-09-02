import Header from "./Header.jsx";
import React, { useEffect, useMemo, useRef, useState } from "react";

export default function VideoLearning() {
  const videoRef = React.useRef(null);
  const [question, setQuestion] = React.useState(null);
  const askedRef = React.useRef({});

  const quizzes = React.useMemo(
    () => [
      {
        time: 5,
        q: "What is P(at least one green) when drawing 2 without replacement?",
        options: [
          "1 - P(no green)",
          "P(green on first only)",
          "P(green on second only)",
        ],
        correct: 0,
      },
      {
        time: 12,
        q: "Independent vs Dependent? Removing a card is...",
        options: ["Independent", "Dependent"],
        correct: 1,
      },
    ],
    []
  );

  React.useEffect(() => {
    const v = videoRef.current;
    const onTime = () => {
      const t = Math.floor(v.currentTime);
      for (const quiz of quizzes) {
        if (t >= quiz.time && !askedRef.current[quiz.time]) {
          askedRef.current[quiz.time] = true;
          v.pause();
          setQuestion(quiz);
          break;
        }
      }
    };
    v.addEventListener("timeupdate", onTime);
    return () => v.removeEventListener("timeupdate", onTime);
  }, [quizzes]);

  const answer = (i) => {
    const correct = i === question.correct;
    alert(correct ? "✅ Correct!" : "❌ Try again next time.");
    setQuestion(null);
    videoRef.current.play();
  };

  return (
    <section className="p-4 max-w-4xl">
      <Header
        title="Interactive Video"
        subtitle="Auto-pauses for quick comprehension checks."
      />
      <video
        ref={videoRef}
        className="w-full rounded-2xl border"
        controls
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
      {question && (
        <div className="fixed inset-0 bg-black/60 grid place-items-center">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow">
            <div className="font-semibold mb-2">Quick Check</div>
            <div className="mb-3">{question.q}</div>
            <div className="grid gap-2">
              {question.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => answer(idx)}
                  className="text-left px-3 py-2 rounded-xl border hover:bg-gray-50"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="text-sm text-gray-500 mt-2">
        Video pauses at checkpoints; answer to continue.
      </div>
    </section>
  );
}
