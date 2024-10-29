/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { Comment, Playlist } from "../types/types";

// Use environment variable for the baseURL
// const apiURL = import.meta.env.VITE_API_URL;

// console.log("VITE_API_URL:", apiURL);

// Check if the environment variable is set correctly
// if (!apiURL) {
//   throw new Error("VITE_API_URL is not defined. Check your .env file.");
// }

// Create axios instance with simplified baseURL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api" // Proxy will route to backend on port 80
});

// Debugging the axios instance baseURL
console.log("Axios baseURL:", api.defaults.baseURL);

// Fetch list of file names (tutorials) from the backend
export const getTutorials = async (): Promise<string[]> => {
  const response = await api.get("/tutorials/");
  return response.data;
};

// Utility function to URL-encode the file name
const encodeFileName = (fileName: string) => encodeURIComponent(fileName);

// Fetch MP4 file URL
export const getVideoUrl = (fileName: string): string => {
  return `${api.defaults.baseURL}/tutorials/${encodeFileName(fileName)}/mp4`;
};

// Fetch SRT file URL
export const getSubtitleUrl = async (
  fileName: string
): Promise<string | null> => {
  try {
    return `${api.defaults.baseURL}/tutorials/${encodeFileName(fileName)}/srt`;
  } catch (error) {
    console.error("Subtitle file not found:", error);
    return null;
  }
};

// Fetch PDF tablature URL
export const getTablatureUrl = async (
  fileName: string
): Promise<string | null> => {
  try {
    return `${api.defaults.baseURL}/tutorials/${encodeFileName(fileName)}/pdf`;
  } catch (error) {
    console.error("Tablature file not found:", error);
    return null;
  }
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

// Post a new annotation (highlight)
export const postAnnotation = async (
  tutorialId: string,
  content: any,
  position: any,
  comment: { text: string; emoji: string }
): Promise<void> => {
  await api.post("/annotations/", {
    tutorialId,
    content,
    position,
    comment,
  });
};

// Delete an annotation by its ID
export const deleteAnnotation = async (annotationId: string): Promise<void> => {
  await api.delete(`/annotations/${annotationId}`);
};
