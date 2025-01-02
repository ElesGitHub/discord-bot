import config from "../config/config";

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
