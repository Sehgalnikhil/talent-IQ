import React, { Suspense, useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate, Route, Routes, useLocation } from "react-router";
import { Toaster } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";

// Lazy-loaded pages
const HomePage = React.lazy(() => import("./pages/HomePage"));
const DashboardPage = React.lazy(() => import("./pages/DashboardPage"));
const ProblemPage = React.lazy(() => import("./pages/ProblemPage"));
const ProblemsPage = React.lazy(() => import("./pages/ProblemsPage"));
const SessionPage = React.lazy(() => import("./pages/SessionPage"));
const LeaderboardPage = React.lazy(() => import("./pages/LeaderboardPage"));
const SpeedrunPage = React.lazy(() => import("./pages/SpeedrunPage"));
const StudyTracksPage = React.lazy(() => import("./pages/StudyTracksPage"));
const WhiteboardPage = React.lazy(() => import("./pages/WhiteboardPage"));
const PlaygroundPage = React.lazy(() => import("./pages/PlaygroundPage"));
const InterviewPage = React.lazy(() => import("./pages/InterviewPage"));
const TrackPage = React.lazy(() => import("./pages/TrackPage"));
const OnboardingPage = React.lazy(() => import("./pages/OnboardingPage"));
const GeneratePage = React.lazy(() => import("./pages/GeneratePage"));
const FlashcardPage = React.lazy(() => import("./pages/FlashcardPage"));
const VoiceInterviewPage = React.lazy(() => import("./pages/VoiceInterviewPage"));
const BehavioralInterviewPage = React.lazy(() => import("./pages/BehavioralInterviewPage"));
const CompanyMockPage = React.lazy(() => import("./pages/CompanyMockPage"));
const PublicProfilePage = React.lazy(() => import("./pages/PublicProfilePage"));
const FullMockInterviewPage = React.lazy(() => import("./pages/FullMockInterviewPage"));
const InterviewReplayPage = React.lazy(() => import("./pages/InterviewReplayPage"));
const DossierPage = React.lazy(() => import("./pages/DossierPage"));
const PricingPage = React.lazy(() => import("./pages/PricingPage"));
import CommandPalette from "./components/CommandPalette";


import ClerkAxiosInterceptor from "./components/ClerkAxiosInterceptor";
import PageTransition from "./components/PageTransition";
import UserSync from "./components/UserSync";

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
        <UserSync />
        <AnimatePresence mode="wait">
          <Suspense fallback={
            <div className="fixed inset-0 z-[200] bg-base-100 flex flex-col items-center justify-center gap-4">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="size-16 rounded-3xl bg-primary/10 flex items-center justify-center"
              >
                <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              </motion.div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 animate-pulse">Initializing Neural Interface...</p>
            </div>
          }>
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
              <Route path="/replay/:sessionId" element={isSignedIn ? <PageTransition><InterviewReplayPage /></PageTransition> : <Navigate to={"/"} />} />
              <Route path="/dossier/:sessionId" element={<DossierPage />} />
              <Route path="/pricing" element={isSignedIn ? <PageTransition><PricingPage /></PageTransition> : <Navigate to={"/"} />} />
              <Route path="/u/:username" element={<PageTransition><PublicProfilePage /></PageTransition>} />


            </Routes>
          </Suspense>
        </AnimatePresence>
      </ClerkAxiosInterceptor>

      <Toaster toastOptions={{ duration: 3000 }} />
      <CommandPalette />
    </>
  );
}

export default App;

