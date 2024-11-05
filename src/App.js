import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Header from "./components/header";
import "./App.css";

function App() {
  // Aktifkan Service Worker saat komponen di-mount


  return (
    <div className="App">
      <Header />
      <Router>
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
        </Routes>
      </Router>
    </div>
  );
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then((registration) => {
      console.log("Service Worker registered with scope:", registration.scope);
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
}
export default App;
