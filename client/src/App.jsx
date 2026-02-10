import React from "react";
import HomePage from "./pages/HomePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StreamingPage from "./pages/StreamingPage.js";
import Navbar from "./components/Navbar.jsx";
import DetailsPage from "./pages/DetailsPage.jsx";
import ArticlePage from "./pages/ArticlePage.jsx";

const App = () => {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/stream/:id" element={<StreamingPage />} />
          <Route path="/details/:id" element={<DetailsPage />} />
          <Route path="/news/:slug" element={<ArticlePage />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
