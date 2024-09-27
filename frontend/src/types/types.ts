export interface Tutorial {
  id: number;
  videoFileName: string;
  subtitleFileName: string | null;
  tablatureFileName: string | null;
}

export interface Comment {
  id: number;
  tutorialId: number;
  username: string;
  text: string;
  timestamp: string;
}

export interface Playlist {
  id: number;
  name: string;
  username: string;
  tutorialIds: number[];
}
