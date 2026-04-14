import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import WhyChoose from './components/WhyChoose';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import CodeAnalyzer from './components/CodeAnalyzer';
import BugDetection from './components/BugDetection';
import AICodeReview from './components/AICodeReview';
import Recommendations from './components/Recommendations';
import History from './components/History';
import Profile from './components/Profile';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<Features />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/why-choose" element={<WhyChoose />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analyzer" element={<CodeAnalyzer />} />
        <Route path="/bugs" element={<BugDetection />} />
        <Route path="/ai-review" element={<AICodeReview />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}