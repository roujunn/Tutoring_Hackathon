import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Tutors from "./components/Tutors.jsx"; // student: tutors list | tutor: students list
import ChatMeeting from "./components/ChatMeeting.jsx";
import Notes from "./components/Notes.jsx";
import VideoLearning from "./components/VideoLearning.jsx";
import Recorder from "./components/Recorder.jsx";
import Homework from "./components/Homework.jsx";
import Resources from "./components/Resources.jsx";
import SubjectRequests from "./components/SubjectRequests.jsx";
import Profile from "./components/Profile.jsx";
import Auth from "./auth/Auth.jsx";
import { LS } from "./lib/storage.js";

export default function App() {
  const [session, setSession] = useState(null);
  const [current, setCurrent] = useState("tutors"); // tabs: tutors/chat/notes/video/record/progress/resources/subjects/profile
  const [peer, setPeer] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem(LS.session);
    if (raw) setSession(JSON.parse(raw));
  }, []);

  if (!session) return <Auth onAuthed={setSession} />;

  const logout = () => {
    localStorage.removeItem(LS.session);
    window.location.reload();
  };

  return (
    <div className="min-h-screen grid md:grid-cols-[16rem,1fr]">
      <Navbar
        current={current}
        setCurrent={setCurrent}
        user={session}
        onLogout={logout}
      />
      <main className="min-h-screen bg-[radial-gradient(50%_60%_at_50%_0%,rgba(16,24,40,0.06),rgba(255,255,255,0)_70%)]">
        {current === "tutors" && (
          <Tutors
            user={session}
            onConnect={(p) => {
              setPeer(p);
              setCurrent("chat");
            }}
          />
        )}
        {current === "chat" && <ChatMeeting user={session} peer={peer} />}
        {current === "notes" && <Notes user={session} />}
        {current === "video" && <VideoLearning />}
        {current === "record" && <Recorder />}
        {current === "progress" && <Homework user={session} />}
        {current === "resources" && <Resources />}
        {current === "subjects" && <SubjectRequests user={session} />}
        {current === "profile" && (
          <Profile user={session} onUpdate={setSession} />
        )}

        <footer className="p-4 text-xs text-gray-500">
          <hr className="my-4" />
          <div>
            <b>Roadmap:</b> real auth, file uploads, AI summaries, WebRTC, push
            notifications, Drive whiteboard.
          </div>
        </footer>
      </main>
    </div>
  );
}
