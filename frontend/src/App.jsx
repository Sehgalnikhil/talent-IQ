import { useUser } from "@clerk/clerk-react";
import { Navigate, Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";

import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import ProblemPage from "./pages/ProblemPage";
import ProblemsPage from "./pages/ProblemsPage";
import SessionPage from "./pages/SessionPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import SpeedrunPage from "./pages/SpeedrunPage";
import StudyTracksPage from "./pages/StudyTracksPage";
import WhiteboardPage from "./pages/WhiteboardPage";
import PlaygroundPage from "./pages/PlaygroundPage";
import InterviewPage from "./pages/InterviewPage";
import TrackPage from "./pages/TrackPage";

function App() {
  const { isSignedIn, isLoaded } = useUser();

  // this will get rid of the flickering effect
  if (!isLoaded) return null;

  return (
    <>
      <Routes>
        <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to={"/dashboard"} />} />
        <Route path="/dashboard" element={isSignedIn ? <DashboardPage /> : <Navigate to={"/"} />} />

        <Route path="/problems" element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />} />
        <Route path="/problem/:id" element={isSignedIn ? <ProblemPage /> : <Navigate to={"/"} />} />
        <Route path="/session/:id" element={isSignedIn ? <SessionPage /> : <Navigate to={"/"} />} />

        <Route path="/leaderboard" element={isSignedIn ? <LeaderboardPage /> : <Navigate to={"/"} />} />
        <Route path="/speedrun" element={isSignedIn ? <SpeedrunPage /> : <Navigate to={"/"} />} />
        <Route path="/curated" element={isSignedIn ? <StudyTracksPage /> : <Navigate to={"/"} />} />
        <Route path="/curated/:trackId" element={isSignedIn ? <TrackPage /> : <Navigate to={"/"} />} />
        <Route path="/whiteboard" element={isSignedIn ? <WhiteboardPage /> : <Navigate to={"/"} />} />
        <Route path="/playground" element={isSignedIn ? <PlaygroundPage /> : <Navigate to={"/"} />} />
        <Route path="/interview" element={isSignedIn ? <InterviewPage /> : <Navigate to={"/"} />} />
      </Routes>

      <Toaster toastOptions={{ duration: 3000 }} />
    </>
  );
}

export default App;
