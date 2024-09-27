import axios from "axios";
import { Comment, Playlist, Tutorial } from "../types/types";

// Get the API URL from the environment variable
const apiBaseUrl = import.meta.env.VITE_API_URL;

console.log("apiBaseUrl :>> ", apiBaseUrl);

// Check if the environment variable is set correctly
if (!apiBaseUrl) {
  throw new Error("VITE_API_URL is not defined. Check your .env file.");
}

// Create axios instance with base URL
const api = axios.create({
  baseURL: apiBaseUrl,
});

// Fetch list of file names (tutorials) from the backend
export const getTutorials = async (): Promise<string[]> => {
  const response = await api.get("/tutorials/");
  return response.data;
};

// Fetch details for a specific tutorial
export const getTutorial = async (fileName: string): Promise<Tutorial> => {
  const response = await api.get(`/tutorials/${fileName}`);
  return response.data;
};

// Fetch comments for a specific tutorial
export const getComments = async (tutorialId: number): Promise<Comment[]> => {
  const response = await api.get(`/comments/tutorial/${tutorialId}`);
  return response.data;
};

// Post a comment for a specific tutorial
export const postComment = async (
  tutorialId: number,
  text: string
): Promise<void> => {
  await api.post("/comments", { tutorialId, text });
};

// Fetch all playlists
export const getPlaylists = async (): Promise<Playlist[]> => {
  const response = await api.get("/playlists");
  return response.data;
};

// Create a new playlist
export const createPlaylist = async (name: string): Promise<void> => {
  await api.post("/playlists", { name });
};
