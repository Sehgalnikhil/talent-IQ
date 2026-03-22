import { useUser } from "@clerk/clerk-react";
import { Navigate, Route, Routes, useLocation } from "react-router";
import { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

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
import VoiceInterviewPage from "./pages/VoiceInterviewPage";
import BehavioralInterviewPage from "./pages/BehavioralInterviewPage";
import CompanyMockPage from "./pages/CompanyMockPage";
import PublicProfilePage from "./pages/PublicProfilePage";
import FullMockInterviewPage from "./pages/FullMockInterviewPage";
import CommandPalette from "./components/CommandPalette";
import ClerkAxiosInterceptor from "./components/ClerkAxiosInterceptor";
import PageTransition from "./components/PageTransition";

function App() {
  const { isSignedIn, isLoaded } = useUser();
  const location = useLocation();

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
      <ClerkAxiosInterceptor>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={!isSignedIn ? <PageTransition><HomePage /></PageTransition> : <Navigate to={"/dashboard"} />} />
            <Route path="/onboarding" element={isSignedIn ? <PageTransition><OnboardingPage /></PageTransition> : <Navigate to={"/"} />} />
            <Route
              path="/dashboard"
              element={
                isSignedIn
                  ? onboardingDone
                    ? <PageTransition><DashboardPage /></PageTransition>
                    : <Navigate to="/onboarding" />
                  : <Navigate to={"/"} />
              }
            />
    
            <Route path="/problems" element={isSignedIn ? <PageTransition><ProblemsPage /></PageTransition> : <Navigate to={"/"} />} />
            <Route path="/problem/:id" element={isSignedIn ? <PageTransition><ProblemPage /></PageTransition> : <Navigate to={"/"} />} />
            <Route path="/session/:id" element={isSignedIn ? <PageTransition><SessionPage /></PageTransition> : <Navigate to={"/"} />} />
    
            <Route path="/leaderboard" element={isSignedIn ? <PageTransition><LeaderboardPage /></PageTransition> : <Navigate to={"/"} />} />
            <Route path="/speedrun" element={isSignedIn ? <PageTransition><SpeedrunPage /></PageTransition> : <Navigate to={"/"} />} />
            <Route path="/curated" element={isSignedIn ? <PageTransition><StudyTracksPage /></PageTransition> : <Navigate to={"/"} />} />
            <Route path="/curated/:trackId" element={isSignedIn ? <PageTransition><TrackPage /></PageTransition> : <Navigate to={"/"} />} />
            <Route path="/whiteboard" element={isSignedIn ? <PageTransition><WhiteboardPage /></PageTransition> : <Navigate to={"/"} />} />
            <Route path="/playground" element={isSignedIn ? <PageTransition><PlaygroundPage /></PageTransition> : <Navigate to={"/"} />} />
            <Route path="/interview" element={isSignedIn ? <PageTransition><InterviewPage /></PageTransition> : <Navigate to={"/"} />} />
            <Route path="/full-gauntlet" element={isSignedIn ? <PageTransition><FullMockInterviewPage /></PageTransition> : <Navigate to={"/"} />} />
            <Route path="/generate" element={isSignedIn ? <PageTransition><GeneratePage /></PageTransition> : <Navigate to={"/"} />} />
            <Route path="/flashcards" element={isSignedIn ? <PageTransition><FlashcardPage /></PageTransition> : <Navigate to={"/"} />} />
            
            {/* New Pro Features */}
            <Route path="/voice-interview" element={isSignedIn ? <PageTransition><VoiceInterviewPage /></PageTransition> : <Navigate to={"/"} />} />
            <Route path="/behavioral" element={isSignedIn ? <PageTransition><BehavioralInterviewPage /></PageTransition> : <Navigate to={"/"} />} />
            <Route path="/company-mock" element={isSignedIn ? <PageTransition><CompanyMockPage /></PageTransition> : <Navigate to={"/"} />} />
            <Route path="/u/:username" element={<PageTransition><PublicProfilePage /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </ClerkAxiosInterceptor>

      <Toaster toastOptions={{ duration: 3000 }} />
      <CommandPalette />
    </>
  );
}

export default App;

