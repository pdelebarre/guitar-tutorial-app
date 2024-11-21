import React from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import HomePage from "./pages/HomePage";
import TutorialPage from "./pages/TutorialPage";
import PlaylistPage from "./pages/PlaylistPage";
import Preferences from "./components/Preferences";
import ResponsiveNavbar from "./components/ResponsiveNavbar";
import TableOfContents from "./components/TableOfContents";

const App: React.FC = () => {
  const [darkMode, setDarkMode] = React.useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ResponsiveNavbar setDarkMode={setDarkMode} darkMode={darkMode} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tutorials" element={<TableOfContents />} />
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
