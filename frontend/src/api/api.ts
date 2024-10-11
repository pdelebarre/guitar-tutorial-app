/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";

import { Comment, Playlist } from "../types/types";

// Get the API URL from the environment variable
export const apiBaseUrl = import.meta.env.VITE_API_URL;

// Check if the environment variable is set correctly
if (!apiBaseUrl) {
  throw new Error("VITE_API_URL is not defined. Check your .env file.");
}

// Create axios instance with base URL
const api = axios.create({
  baseURL: apiBaseUrl,
});

// Debugging the axios instance baseURL
console.log("Axios baseURL: ", api.defaults.baseURL);

// Fetch list of file names (tutorials) from the backend
export const getTutorials = async (): Promise<string[]> => {
  console.log("API base URL being used: ", api.defaults.baseURL);
  const response = await api.get("/tutorials/");
  return response.data;
};

// Utility function to URL-encode the file name
const encodeFileName = (fileName: string) => {
  return encodeURIComponent(fileName);
};

// Fetch MP4 file URL
export const getVideoUrl = async (fileName: string): Promise<string> => {
  const encodedFileName = encodeFileName(fileName); // Encode the file name
  return `${api.defaults.baseURL}/tutorials/${encodedFileName}/mp4`;  // API path for video file
};

// Fetch SRT file URL
export const getSubtitleUrl = async (fileName: string): Promise<string | null> => {
  try {
    const encodedFileName = encodeFileName(fileName); // Encode the file name
    // const response =
      // await axios.get(`/tutorials/${encodedFileName}/srt`, { responseType: 'blob' });
    return `${api.defaults.baseURL}/tutorials/${encodedFileName}/srt`;  // Return the subtitle URL
  } catch (error) {
    console.error('Subtitle file not found:', error);
    return null;
  }
};

// Fetch PDF tablature URL
export const getTablatureUrl = async (fileName: string): Promise<string | null> => {
  try {
    const encodedFileName = encodeFileName(fileName); // Encode the file name
    // const response =
      // await axios.get(`/tutorials/${encodedFileName}/pdf`, { responseType: 'blob' });
    return `${api.defaults.baseURL}/tutorials/${encodedFileName}/pdf`;  // Return the tablature URL
  } catch (error) {
    console.error('Tablature file not found:', error);
    return null;
  }
};
// Fetch comments for a specific tutorial
export const getComments = async (tutorialId: number): Promise<Comment[]> => {
  console.log("API base URL being used: ", api.defaults.baseURL);
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
