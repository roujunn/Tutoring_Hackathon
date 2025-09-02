import React, { useRef, useState } from "react";
import Header from "./Header.jsx";
import { LS } from "../lib/storage.js";

export default function Recorder() {
  const [recordings, setRecordings] = useState(() =>
    JSON.parse(localStorage.getItem(LS.recordings) || "[]")
  );
  const videoRef = useRef(null);
  const mediaRef = useRef({ stream: null, rec: null, chunks: [] });
  const [status, setStatus] = useState("idle");
  const [err, setErr] = useState("");

  const start = async () => {
    setErr("");
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setErr("getUserMedia not supported in this browser.");
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      videoRef.current.srcObject = stream;

      const mime = MediaRecorder.isTypeSupported?.("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : MediaRecorder.isTypeSupported?.("video/webm;codecs=vp8")
        ? "video/webm;codecs=vp8"
        : "video/webm";

      const rec = new MediaRecorder(stream, { mimeType: mime });
      mediaRef.current = { stream, rec, chunks: [] };

      rec.ondataavailable = (e) =>
        e.data && mediaRef.current.chunks.push(e.data);
      rec.onerror = (e) =>
        setErr(`Recorder error: ${e.error?.message || e.message || e}`);

      rec.onstop = () => {
        try {
          const blob = new Blob(mediaRef.current.chunks, { type: mime });
          const url = URL.createObjectURL(blob);
          const next = [
            { id: safeUUID(), url, at: Date.now() },
            ...recordings,
          ];
          setRecordings(next);
          localStorage.setItem(LS.recordings, JSON.stringify(next));
        } finally {
          mediaRef.current.stream?.getTracks()?.forEach((t) => t.stop());
          mediaRef.current = { stream: null, rec: null, chunks: [] };
          setStatus("idle");
        }
      };

      rec.start(250); // collect data every 250ms
      setStatus("recording");
    } catch (e) {
      setErr(e?.message || String(e));
      setStatus("idle");
    }
  };

  const stop = () => {
    try {
      mediaRef.current.rec?.state === "recording" &&
        mediaRef.current.rec.stop();
    } catch (e) {
      setErr(e?.message || String(e));
    }
  };

  return (
    <section className="p-4 max-w-4xl">
      <Header
        title="Record a Session"
        subtitle="Saved locally for review or sharing."
      />
      {err && <div className="mb-2 text-sm text-red-600">Error: {err}</div>}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="border rounded-2xl p-4 bg-white">
          <div className="flex items-center justify-between">
            <div className="font-medium">Camera Preview</div>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                status === "recording"
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {status}
            </span>
          </div>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full rounded-xl bg-black mt-2"
          />
          <div className="flex gap-2 mt-2">
            {status !== "recording" ? (
              <button
                onClick={start}
                className="px-4 py-2 rounded-xl bg-black text-white"
              >
                Start Recording
              </button>
            ) : (
              <button
                onClick={stop}
                className="px-4 py-2 rounded-xl bg-red-600 text-white"
              >
                Stop
              </button>
            )}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Tip: allow camera/mic. Works on http://localhost in Chrome/Edge.
            Safari may require different codecs.
          </div>
        </div>
        <div className="border rounded-2xl p-4 bg-white">
          <div className="font-semibold mb-2">My Recordings</div>
          <div className="grid gap-2 max-h-80 overflow-auto">
            {recordings.map((r) => (
              <div key={r.id} className="border rounded-xl p-2 bg-white">
                <div className="text-xs text-gray-500">
                  {new Date(r.at).toLocaleString()}
                </div>
                <video
                  controls
                  className="w-full mt-1 rounded-lg"
                  src={r.url}
                />
                <a
                  href={r.url}
                  download={`recording_${r.id}.webm`}
                  className="text-sm text-blue-600 underline"
                >
                  Download
                </a>
              </div>
            ))}
            {recordings.length === 0 && (
              <div className="text-sm text-gray-500">No recordings yet.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
