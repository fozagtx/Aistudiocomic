export type Orientation = 'landscape' | 'portrait';

export interface ComicPanel {
  id: string;
  url: string;
  prompt: string;
  orientation: Orientation;
  timestamp: number;
}

export interface ComicNodeData {
  url?: string;
  prompt: string;
  orientation: Orientation;
  isLoading?: boolean;
}

export interface DecartError {
  error: string;
  message: string;
}
