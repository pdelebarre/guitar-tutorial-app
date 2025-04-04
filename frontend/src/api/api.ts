/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { Comment, Playlist } from "../types/types";

// Create axios instance with simplified baseURL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "", // to manage dev (var in .env.development) vs prod
  withCredentials: true
});


// Debugging the axios instance baseURL
console.log("Axios baseURL:", api.defaults.baseURL);

// Fetch list of file names (tutorials) from the backend

export interface TutorialDTO {
  name: string; // Name of the tutorial
  videoUrl: string | null; // URL for the video file
  subtitleUrl: string | null; // URL for the subtitle file
  tablatureUrl: string | null; // URL for the tablature file
  size: number; // File size in bytes
  duration: number; // Duration in seconds, or 0 if not applicable
}

/**
 * Fetch the list of tutorials from the backend.
 * @returns {Promise<TutorialDTO[]>} A promise that resolves to an array of TutorialDTO objects.
 */
export const getTutorials = async (): Promise<TutorialDTO[]> => {
  try {
    const response = await api.get<TutorialDTO[]>("/api/tutorials/");
    // console.log('response :>> ', response);

    // Ensure all tutorials have the expected structure
    return response.data.map((tutorial) => ({
      name: tutorial.name || "Untitled",
      videoUrl: tutorial.videoUrl || null,
      subtitleUrl: tutorial.subtitleUrl || null,
      tablatureUrl: tutorial.tablatureUrl || null,
      size: tutorial.size || 0,
      duration: tutorial.duration || 0,
    }));
  } catch (error) {
    console.error("Error fetching tutorials:", error);
    throw new Error("Unable to fetch tutorials. Please try again later.");
  }
};



// Utility function to URL-encode the file name
const encodeFileName = (fileName: string) => encodeURIComponent(fileName).replace(/\+/g, '%20');

// Fetch MP4 file URL
export const getVideoUrl = (fileName: string): string => {
  return `${api.defaults.baseURL}/api/tutorials/${encodeFileName(fileName)}/mp4`;
};

// Fetch SRT file URL
export const getSubtitleUrl = async (
  fileName: string
): Promise<string | null> => {
  try {
    return `${api.defaults.baseURL}/api/tutorials/${encodeFileName(
      fileName
    )}/srt`;
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
    return `${api.defaults.baseURL}/api/tutorials/${encodeFileName(fileName)}/pdf`;
  } catch (error) {
    console.error("Tablature file not found:", error);
    return null;
  }
};

// Fetch comments for a specific tutorial
export const getComments = async (tutorialId: number): Promise<Comment[]> => {
  const response = await api.get(`/api/comments/tutorial/${tutorialId}`);
  return response.data;
};

// Post a comment for a specific tutorial
export const postComment = async (
  tutorialId: number,
  text: string
): Promise<void> => {
  await api.post("/api/comments", { tutorialId, text });
};

// Fetch all playlists
export const getPlaylists = async (): Promise<Playlist[]> => {
  const response = await api.get("/api/playlists");
  return response.data;
};

// Create a new playlist
export const createPlaylist = async (name: string): Promise<void> => {
  await api.post("/api/playlists", { name });
};

// Post a new annotation (highlight)
export const postAnnotation = async (
  tutorialId: string,
  content: any,
  position: any,
  comment: { text: string; emoji: string }
): Promise<void> => {
  await api.post("/api/annotations/", {
    tutorialId,
    content,
    position,
    comment,
  });
};

// Delete an annotation by its ID
export const deleteAnnotation = async (annotationId: string): Promise<void> => {
  await api.delete(`/api/annotations/${annotationId}`);
};
