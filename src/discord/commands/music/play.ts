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
import { isUrl } from "../../../network/urls";
import { isValidYoutubeUrl, searchYoutube } from "../../../network/youtube";

export const data = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Joins your voice chat and plays the given video.")
  .addStringOption(
    new SlashCommandStringOption()
      .setName("input")
      .setDescription("The name or url of the video you want to play.")
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

  const input = interaction.options.getString("input", true);
  let url;

  if (!isUrl(input)) url = await searchYoutube(input);
  else if (!(await isValidYoutubeUrl(input))) url = null;
  else url = input;

  if (!url) {
    await interaction.reply("Could not find the video");
    return;
  }
  await interaction.reply(`Playing ${url}`);

  const resource = createAudioResourceFromYoutube(url);
  playAudioResource(resource, interaction.guild);
}
