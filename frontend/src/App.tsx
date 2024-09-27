import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TutorialPage from "./pages/TutorialPage";
import PlaylistPage from "./pages/PlaylistPage";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import Preferences from "./components/Preferences";

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedPreference = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedPreference);
  }, []);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tutorial/:fileName" element={<TutorialPage />} />
        <Route path="/playlists" element={<PlaylistPage />} />
        <Route
          path="/preferences"
          element={<Preferences setDarkMode={setDarkMode} />}
        />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
