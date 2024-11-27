import React from "react";
import { Typography, Box, Grid2, Button } from "@mui/material";

import { useDarkMode } from "../context/DarkModeContext";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  const { nightMode } = useDarkMode();
  return (
    <Box sx={{ padding: 4, backgroundColor: nightMode ? "#333" : "#1976d2",
          color: nightMode ? "#fff" : "#fff", }}>
      <Grid2 container spacing={4} alignItems="center" justifyContent="center">
        <Grid2 textAlign="center">
          <Typography variant="h3" gutterBottom>
            Welcome to Guitar Tutorials!
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            Click the menu icon to explore a variety of guitar tutorials and
            start learning today.
          </Typography>
          <Button
            component={Link}
            to="/tutorials"
            variant="contained"
            color="primary"
            size="large"
            sx={{ marginTop: 2 }}
          >
            Explore Tutorials
          </Button>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default HomePage;
