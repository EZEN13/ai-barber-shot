/**
 * TypeScript interfaces for generation history
 */

export interface GenerationHistoryItem {
  id: string; // UUID
  timestamp: number; // Date.now()
  clientPhoto: string; // base64 compressed (~1MB)
  resultPhoto: string; // URL from API
  resultPhotoBase64: string; // base64 compressed (~1MB)
  clientThumbnail: string; // base64 compressed (~50KB)
  resultThumbnail: string; // base64 compressed (~50KB)
  hairstyle: {
    id: string;
    name: string;
    nameRu: string;
  } | null;
  beard: {
    id: string;
    name: string;
    nameRu: string;
  } | null;
  modifications: string;
}

export interface ImageData {
  clientPhoto: string;
  resultPhotoBase64: string;
  clientThumbnail: string;
  resultThumbnail: string;
}

export interface HistoryMetadata {
  id: string;
  timestamp: number;
  resultPhoto: string;
  hairstyle: GenerationHistoryItem['hairstyle'];
  beard: GenerationHistoryItem['beard'];
  modifications: string;
}
