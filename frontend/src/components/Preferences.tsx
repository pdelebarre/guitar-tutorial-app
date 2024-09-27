import React from "react";
import { Switch, Typography, Container, FormControlLabel } from "@mui/material";

interface PreferencesProps {
  setDarkMode: (enabled: boolean) => void;
}

const Preferences: React.FC<PreferencesProps> = ({ setDarkMode }) => {
  const handleDarkModeToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isEnabled = event.target.checked;
    setDarkMode(isEnabled);
    localStorage.setItem("darkMode", isEnabled.toString());
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        User Preferences
      </Typography>
      <FormControlLabel
        control={<Switch onChange={handleDarkModeToggle} />}
        label="Dark Mode"
      />
    </Container>
  );
};

export default Preferences;
