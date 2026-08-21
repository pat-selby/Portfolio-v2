import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Nav from "./components/Landing/Nav";
import Landing from "./components/Landing/Landing";
import SiteFooter from "./components/Landing/SiteFooter";
import SocialRail from "./components/Landing/SocialRail";
import Resume from "./components/Resume/ResumeNew";
import ProjectDemos from "./components/Projects/ProjectDemos";
import ScrollToTop from "./components/ScrollToTop";
// Bootstrap first so the design system below always wins.
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/theme.css";
import "./styles/landing.css";

function App() {
  return (
    <Router>
      <div className="App">
        <span className="gh-stripe" aria-hidden="true" />
        <Nav />
        <SocialRail />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/demos" element={<ProjectDemos />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <SiteFooter />
      </div>
    </Router>
  );
}

export default App;
