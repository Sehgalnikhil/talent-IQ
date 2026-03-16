import { useUser } from "@clerk/clerk-react";
import { Navigate, Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";

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
import OnboardingPage from "./pages/OnboardingPage";
import GeneratePage from "./pages/GeneratePage";
import FlashcardPage from "./pages/FlashcardPage";
import CodeAnalyzerPage from "./pages/CodeAnalyzerPage";
import CommandPalette from "./components/CommandPalette";

function App() {
  const { isSignedIn, isLoaded } = useUser();

  // ✅ Use React state so route re-evaluates correctly after onboarding completes
  const [onboardingDone, setOnboardingDone] = useState(
    () => !!localStorage.getItem("onboardingComplete")
  );

  // Listen for the custom event fired by OnboardingPage on completion
  useEffect(() => {
    const handler = () => setOnboardingDone(true);
    window.addEventListener("onboarding-complete", handler);
    return () => window.removeEventListener("onboarding-complete", handler);
  }, []);

  if (!isLoaded) return null;

  return (
    <>
      <Routes>
        <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to={"/dashboard"} />} />
        <Route path="/onboarding" element={isSignedIn ? <OnboardingPage /> : <Navigate to={"/"} />} />
        <Route
          path="/dashboard"
          element={
            isSignedIn
              ? onboardingDone
                ? <DashboardPage />
                : <Navigate to="/onboarding" />
              : <Navigate to={"/"} />
          }
        />

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
        <Route path="/generate" element={isSignedIn ? <GeneratePage /> : <Navigate to={"/"} />} />
        <Route path="/flashcards" element={isSignedIn ? <FlashcardPage /> : <Navigate to={"/"} />} />
        <Route path="/analyzer" element={isSignedIn ? <CodeAnalyzerPage /> : <Navigate to={"/"} />} />
      </Routes>

      <Toaster toastOptions={{ duration: 3000 }} />
      <CommandPalette />
    </>
  );
}

export default App;
