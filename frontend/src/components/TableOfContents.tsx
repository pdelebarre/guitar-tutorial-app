import React, { useEffect, useState } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  CircularProgress,
  Alert,

} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { getTutorials } from "../api/api";
import { useDarkMode } from "../context/DarkModeContext";

interface TutorialDTO {
  name: string;
  type: string;
  size: number;
  duration: number;
}

const TableOfContents: React.FC = () => {
  const [tutorials, setTutorials] = useState<TutorialDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

    const { nightMode } = useDarkMode();

  useEffect(() => {
    setLoading(true);
    getTutorials()
      .then((data) => {
        console.log("Fetched Tutorials:", data); // Debugging step
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
      {/* <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" gutterBottom>
          Guitar Tutorials
        </Typography>

      </Box> */}

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : tutorials.length > 0 ? (
        <List>
          {tutorials.map((tutorial) => (
            <ListItem key={tutorial.name}>
              <ListItemText
                primary={
                  <Typography component="span" variant="body1">
                    <RouterLink
                      to={`/tutorial/${encodeURIComponent(tutorial.name)}`}
                      style={{
                        textDecoration: "none",
                        color: nightMode ? "#90caf9" : "inherit",
                      }}
                    >
                      {tutorial.name.replace(/_/g, " ")}.{tutorial.type}
                    </RouterLink>
                  </Typography>
                }
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color={nightMode ? "#b0bec5" : "textSecondary"}
                    >
                      Type: {tutorial.type.toUpperCase()}
                    </Typography>
                    <br />
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
