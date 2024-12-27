import { joinVoiceChannel, VoiceConnection } from "@discordjs/voice";
import { Guild, VoiceBasedChannel } from "discord.js";

export function joinChannel(
  channel: VoiceBasedChannel
): VoiceConnection | null {
  try {
    return joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guildId,
      selfDeaf: false,
      selfMute: false,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });
  } catch (error) {
    console.log(error);
    return null;
  }
}

export function getCurrentChannel(guild: Guild) {
  return guild.members.me?.voice.channel;
}
