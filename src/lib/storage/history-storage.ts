/**
 * localStorage wrapper for generation history metadata
 */

import type { GenerationHistoryItem, HistoryMetadata, ImageData } from './types';
import { saveImages, getImages, deleteImages, clearAllImages } from './image-storage';

const MAX_HISTORY_ITEMS = 5;
const STORAGE_KEY = 'ai-barber-history-meta';

/**
 * Get history metadata from localStorage
 */
export function getHistoryMetadata(): HistoryMetadata[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load history metadata:', error);
    return [];
  }
}

/**
 * Save history metadata to localStorage
 */
function saveHistoryMetadata(metadata: HistoryMetadata[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(metadata));
  } catch (error) {
    console.error('Failed to save history metadata:', error);
  }
}

/**
 * Get full history (metadata + images)
 */
export async function getHistory(): Promise<GenerationHistoryItem[]> {
  const metadata = getHistoryMetadata();
  const items: GenerationHistoryItem[] = [];

  for (const meta of metadata) {
    try {
      const images = await getImages(meta.id);
      if (images) {
        items.push({
          ...meta,
          ...images,
        });
      }
    } catch (error) {
      console.error(`Failed to load images for ${meta.id}:`, error);
    }
  }

  return items;
}

/**
 * Add item to history
 * Auto-deletes oldest if exceeds MAX_HISTORY_ITEMS
 */
export async function addHistoryItem(item: GenerationHistoryItem): Promise<void> {
  try {
    // Save images to IndexedDB
    const images: ImageData = {
      clientPhoto: item.clientPhoto,
      resultPhotoBase64: item.resultPhotoBase64,
      clientThumbnail: item.clientThumbnail,
      resultThumbnail: item.resultThumbnail,
    };
    await saveImages(item.id, images);

    // Get current metadata
    let metadata = getHistoryMetadata();

    // Add new item metadata
    const newMetadata: HistoryMetadata = {
      id: item.id,
      timestamp: item.timestamp,
      resultPhoto: item.resultPhoto,
      hairstyle: item.hairstyle,
      beard: item.beard,
      modifications: item.modifications,
    };
    metadata.unshift(newMetadata); // Add to beginning

    // Remove oldest if exceeds limit
    if (metadata.length > MAX_HISTORY_ITEMS) {
      const removed = metadata.splice(MAX_HISTORY_ITEMS);
      // Delete images for removed items
      for (const item of removed) {
        await deleteImages(item.id).catch(console.error);
      }
    }

    // Save updated metadata
    saveHistoryMetadata(metadata);
  } catch (error) {
    console.error('Failed to add history item:', error);
    throw error;
  }
}

/**
 * Delete item from history
 */
export async function deleteHistoryItem(id: string): Promise<void> {
  try {
    // Delete images
    await deleteImages(id);

    // Remove from metadata
    const metadata = getHistoryMetadata();
    const filtered = metadata.filter((item) => item.id !== id);
    saveHistoryMetadata(filtered);
  } catch (error) {
    console.error('Failed to delete history item:', error);
    throw error;
  }
}

/**
 * Clear all history
 */
export async function clearHistory(): Promise<void> {
  try {
    await clearAllImages();
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear history:', error);
    throw error;
  }
}
