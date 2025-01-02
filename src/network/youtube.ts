import config from "../config/config";
import { extractYoutubeVideoId } from "./urls";

export async function isValidYoutubeUrl(url: string) {
  const videoId = extractYoutubeVideoId(url);

  const apiUrl =
    "https://www.googleapis.com/youtube/v3/videos?" +
    "part=snippet&" +
    `id=${videoId}&` +
    `key=${config.GOOGLE_CLOUD_API_KEY}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.items && data.items.length > 0) return true;

    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function searchYoutube(query: string): Promise<string | null> {
  const url =
    "https://www.googleapis.com/youtube/v3/search?" +
    "part=snippet&" +
    "type=video&" +
    `q=${encodeURIComponent(query)}&` +
    `key=${config.GOOGLE_CLOUD_API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  try {
    return `https://youtube.com/watch?v=${data.items[0].id.videoId}`;
  } catch (error) {
    console.error(error);
    return null;
  }
}
