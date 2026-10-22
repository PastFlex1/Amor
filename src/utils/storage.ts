import { LoveStory } from '../types';

/**
 * Generates direct share URL (All data is loaded in real-time from Firebase Cloud)
 */
export function generateShareUrl(_story?: LoveStory): string {
  try {
    if (typeof window !== 'undefined') {
      return window.location.origin + window.location.pathname;
    }
    return '';
  } catch {
    return '';
  }
}

/**
 * Download backup JSON if requested by the user
 */
export function exportStoryAsJson(story: LoveStory): void {
  try {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(story, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `libro_amor_${story.receiverName.toLowerCase().replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  } catch (err) {
    console.warn('Could not export story JSON:', err);
  }
}
