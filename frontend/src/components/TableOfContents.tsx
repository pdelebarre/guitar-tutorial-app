import React, { useEffect, useState } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { getTutorials, TutorialDTO } from "../api/api";
import { useDarkMode } from "../context/DarkModeContext";
import { Link } from 'react-router-dom';

const TableOfContents: React.FC = () => {
  const [tutorials, setTutorials] = useState<TutorialDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { nightMode } = useDarkMode();

  useEffect(() => {
    setLoading(true);
    getTutorials()
      .then((data) => {
        setTutorials(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to fetch tutorials:", err.message);
        setError("Unable to load tutorials. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: nightMode ? "#121212" : "#fff",
        color: nightMode ? "#fff" : "#000",
        minHeight: "100vh",
        padding: "20px",
        transition: "background-color 0.3s, color 0.3s",
      }}
    >
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : tutorials.length > 0 ? (
        <List>
          {tutorials.map((tutorial) => (
            <ListItem key={tutorial.name} sx={{ flexDirection: "column", alignItems: "flex-start" }}>
              <ListItemText
                primary={
                  <Typography component="span" variant="h6">
                    {tutorial.name.replace(/_/g, " ")}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color={nightMode ? "#b0bec5" : "textSecondary"}
                    >
                      Size: {(tutorial.size / 1024).toFixed(2)} KB
                    </Typography>
                    {tutorial.duration > 0 && (
                      <>
                        <br />
                        <Typography
                          component="span"
                          variant="body2"
                          color={nightMode ? "#b0bec5" : "textSecondary"}
                        >
                          Duration: {Math.floor(tutorial.duration / 60)}m{" "}
                          {tutorial.duration % 60}s
                        </Typography>
                      </>
                    )}
                  </>
                }
              />
              <Box sx={{ display: "flex", gap: 1, marginTop: 1 }}>
                {tutorial.videoUrl && (
                  <Button
                    component={Link}
                    to={`/tutorial/${encodeURIComponent(tutorial.name.replace(/[|｜[\]]/g, '').trim())}`}
                    variant="contained"
                    color="primary"
                  >
                    Watch Video
                  </Button>
                )}
                {tutorial.subtitleUrl && (
                  <Button
                    href={tutorial.subtitleUrl}
                    target="_blank"
                    variant="contained"
                    color="secondary"
                  >
                    Download Subtitles
                  </Button>
                )}
                {tutorial.tablatureUrl && (
                  <Button
                    href={tutorial.tablatureUrl}
                    target="_blank"
                    variant="contained"
                    color="success"
                  >
                    View Tablature
                  </Button>
                )}
              </Box>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No tutorials available</Typography>
      )}
    </Box>
  );
};

export default TableOfContents;
