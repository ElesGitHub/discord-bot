import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("gpt")
  .setDescription("Asks something to GPT")
  .addStringOption(
    new SlashCommandStringOption()
      .setName("model")
      .setDescription("The gpt model you want to interact with")
      .setRequired(false)
      .setChoices(
        { name: "GPT-4o Mini", value: "gpt-4o-mini" },
        { name: "GPT-4o", value: "gpt-4o" },
        { name: "GPT-3.5 Turbo", value: "gpt-3.5-turbo" }
      )
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.reply("Pong!");
}
