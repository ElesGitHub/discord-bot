import {
  AudioResource,
  createAudioPlayer,
  createAudioResource,
  entersState,
  getVoiceConnection,
  StreamType,
  VoiceConnectionStatus,
} from "@discordjs/voice";
import { Guild } from "discord.js";
import { spawn } from "node:child_process";

export async function playAudioResource(resource: AudioResource, guild: Guild) {
  const connection = getVoiceConnection(guild.id);
  if (!connection) return;
  try {
    await entersState(connection, VoiceConnectionStatus.Ready, 10_000);

    const player = createAudioPlayer();
    const subscription = connection.subscribe(player);
    if (!subscription) return;

    player.play(resource);
  } catch (error) {
    console.error(error);
  }
}

// Expects a valid youtube url
export function createAudioResourceFromYoutube(url: string) {
  const ytdlp = spawn("yt-dlp", ["-f", "bestaudio", "-o", "-", url], {
    stdio: ["ignore", "pipe", "ignore"],
  });
  const ffmpeg = spawn(
    "ffmpeg",
    ["-i", "pipe:0", "-f", "s16le", "-ar", "48000", "-ac", "2", "pipe:1"],
    { stdio: ["pipe", "pipe", "ignore"] }
  );

  ytdlp.stdout.pipe(ffmpeg.stdin);
  return createAudioResource(ffmpeg.stdout, {
    inputType: StreamType.Raw,
  });
}
