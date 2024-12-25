import {
  ChannelType,
  ChatInputCommandInteraction,
  GuildMember,
  SlashCommandBuilder,
  SlashCommandChannelOption,
  SlashCommandStringOption,
  VoiceChannel,
} from "discord.js";
import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  entersState,
  getVoiceConnection,
  joinVoiceChannel,
  StreamType,
  VoiceConnectionStatus,
} from "@discordjs/voice";
import { spawn } from "node:child_process";

export const data = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Joins your voice chat and plays the given video.")
  .addStringOption(
    new SlashCommandStringOption()
      .setName("url")
      .setDescription("The video you want to play.")
      .setRequired(true)
      .setAutocomplete(false)
  )
  .addChannelOption(
    new SlashCommandChannelOption()
      .setName("channel")
      .setDescription("The channel you want me to play this on.")
      .setRequired(false)
      .addChannelTypes(ChannelType.GuildVoice)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  console.log("[COMMAND: PLAY] Starting command execution");

  if (!interaction.guild) return;

  const channel = await joinChannel(interaction);
  if (!channel) return;

  const me = interaction.guild.members.me;
  if (!me) {
    console.error(
      `[COMMAND: PLAY] Bot member not found for guild ${interaction.guild.name}`
    );
    return;
  }
  const permissions = channel.permissionsFor(me);
  if (!permissions.has("Speak")) {
    await interaction.reply("I need permission to speak in your voice channel");
    return;
  }

  const url = interaction.options.getString("url", true);
  await interaction.reply(`Playing ${url}`);

  const audioStream = createAudioStream(url);
  const resource = createAudioResource(audioStream, {
    inputType: StreamType.Raw,
  });

  console.log("[COMMAND: PLAY] Audio resource created");

  const connection = getVoiceConnection(interaction.guild.id);
  if (!connection) {
    console.error("[COMMAND: PLAY] No connection found");
    return;
  }
  try {
    await entersState(connection, VoiceConnectionStatus.Ready, 20_000);

    const player = createAudioPlayer();
    const subscription = connection?.subscribe(player);

    if (!subscription) {
      console.error("[COMMAND: PLAY] Failed to subscribe to the connection");
      return;
    }

    player.on(AudioPlayerStatus.Playing, () =>
      console.log("[COMMAND: PLAY] AudioPlayer is now playing")
    );
    player.on(AudioPlayerStatus.Idle, () =>
      console.log("[COMMAND: PLAY] AudioPlayer is now idle")
    );
    player.on(AudioPlayerStatus.AutoPaused, () =>
      console.log("[COMMAND: PLAY] AudioPlayer has been auto paused")
    );
    player.on("error", (error) =>
      console.error(`[COMMAND: PLAY] AudioPlayer error: ${error}`)
    );
    player.play(resource);

    console.log("[COMMAND: PLAY] Playing audio resource");
  } catch (error) {
    console.error(`[COMMAND: PLAY] ${error}`);
  }
}

async function joinChannel(
  interaction: ChatInputCommandInteraction
): Promise<VoiceChannel | null> {
  if (!interaction.guild) return null;

  const currentChannel = interaction.guild.members.me?.voice.channel;
  const targetChannel =
    (interaction.options.getChannel("channel") as VoiceChannel) ||
    ((interaction.member as GuildMember)?.voice.channel as VoiceChannel);

  if (!currentChannel && !targetChannel) {
    await interaction.reply(
      "You must be connected to a voice channel or specify one to use this command."
    );
    return null;
  }

  if (targetChannel)
    try {
      joinVoiceChannel({
        channelId: targetChannel.id,
        guildId: interaction.guild.id,
        selfDeaf: true,
        selfMute: false,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply(
        "Something went wrong while trying to connect to your channel."
      );
      return null;
    }

  return targetChannel || currentChannel;
}

function createAudioStream(url: string) {
  const ytdlp = spawn("yt-dlp", ["-f", "bestaudio", "-o", "-", url], {
    stdio: ["ignore", "pipe", "ignore"],
  });
  const ffmpeg = spawn(
    "ffmpeg",
    ["-i", "pipe:0", "-f", "s16le", "-ar", "48000", "-ac", "2", "pipe:1"],
    { stdio: ["pipe", "pipe", "ignore"] }
  );

  ytdlp.on("error", (error) => console.error(`[YT-DLP ERROR] ${error}`));
  ffmpeg.on("error", (error) => console.error(`[FFMPEG ERROR] ${error}`));

  ytdlp.stdout.pipe(ffmpeg.stdin);
  return ffmpeg.stdout;
}
