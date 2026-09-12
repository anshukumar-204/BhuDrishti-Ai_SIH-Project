import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home/Home";
import LandExplorer from "./pages/LandExplorer/LandExplorer";
import Analytics from "./pages/Analytics/Analytics";
import ResearchHub from "./pages/ResearchHub/ResearchHub";
import ResearchWorkspace from "./pages/ResearchWorkspace/ResearchWorkspace";
import Datasets from "./pages/Datasets/Datasets";
import LandCheck from "./pages/LandCheck/LandCheck";
import AIInsights from "./pages/AIInsights/AIInsights";
import PolicySimulation from "./pages/PolicySimulation/PolicySimulation";
import Verification from "./pages/Verification/Verification";
import Dashboard from "./pages/Dashboard/Dashboard";
import Profile from "./pages/Profile/Profile";
import Login from "./pages/Auth/Login";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/common/ProtectedRoute";
import LandIntelligence from "./pages/LandIntelligence/LandIntelligence";
import BhuAssistant from "./components/common/BhuAssistant";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/land-explorer" element={<LandExplorer />} />
          <Route path="/land-intelligence" element={<LandIntelligence />} />
          <Route path="/research" element={<ResearchHub />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/land-check" element={<LandCheck />} />
            <Route path="/ai-insights" element={<AIInsights />} />
            <Route path="/policy-simulation" element={<PolicySimulation />} />
            <Route path="/verification" element={<Verification />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route element={<ProtectedRoute roles={["researcher", "admin"]} />}>
            <Route path="/researcher" element={<ResearchHub />} />
            <Route path="/datasets" element={<Datasets />} />
            <Route path="/datasets/:id" element={<Datasets />} />
            <Route
              path="/researcher/workspace/:projectId"
              element={<ResearchWorkspace />}
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <BhuAssistant />
    </div>
  );
}

export default App;
