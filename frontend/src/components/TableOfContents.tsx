import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { getTutorials } from "../api/api"; // API call to fetch file names

const TutorialTableOfContents: React.FC = () => {
  const [tutorials, setTutorials] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tutorials (file names) on component mount
  useEffect(() => {
    setLoading(true);
    getTutorials()
      .then((data) => {
        setTutorials(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to fetch tutorials:", err);
        setError("Unable to load tutorials. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Guitar Tutorials
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : tutorials.length > 0 ? (
        <List>
          {tutorials.map((tutorialName) => (
            <ListItemButton
              component={RouterLink}
              to={`/tutorial/${tutorialName}`} // Link to the tutorial page by file name
              key={tutorialName}
            >
              <ListItemText primary={tutorialName} />
            </ListItemButton>
          ))}
        </List>
      ) : (
        <Typography>No tutorials available</Typography>
      )}
    </Box>
  );
};

export default TutorialTableOfContents;
