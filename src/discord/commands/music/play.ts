import {
  ChannelType,
  ChatInputCommandInteraction,
  GuildMember,
  SlashCommandBuilder,
  SlashCommandChannelOption,
  SlashCommandStringOption,
  VoiceChannel,
} from "discord.js";
import { getCurrentChannel, joinChannel } from "../../actions/channels";
import {
  createAudioResourceFromYoutube,
  playAudioResource,
} from "../../actions/audio";

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
  if (!interaction.guild) return;

  const targetChannel =
    (interaction.options.getChannel("channel") as VoiceChannel) ||
    ((interaction.member as GuildMember).voice.channel as VoiceChannel);

  if (!joinChannel(targetChannel)) {
    await interaction.reply(
      "You must be connected to a voice channel or specify one to use this command."
    );
    return;
  }

  const url = interaction.options.getString("url", true);
  await interaction.reply(`Playing ${url}`);

  console.log("About to play audio");

  const resource = createAudioResourceFromYoutube(url);
  playAudioResource(resource, interaction.guild);
}
