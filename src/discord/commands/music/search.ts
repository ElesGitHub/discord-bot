import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "discord.js";
import { searchYoutube } from "../../../network/youtube";

export const data = new SlashCommandBuilder()
  .setName("search")
  .setDescription("Searches for a video.")
  .addStringOption(
    new SlashCommandStringOption()
      .setName("query")
      .setDescription("The query for the search")
      .setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) return;

  const url = await searchYoutube(interaction.options.getString("query", true));
  if (!url) await interaction.reply("Unable to find results.");
  else await interaction.reply(url);
}
