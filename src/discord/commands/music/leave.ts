import { getVoiceConnection } from "@discordjs/voice";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Leaves the current voice channel");

export async function execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guildId) return;

    const connection = getVoiceConnection(interaction.guildId);
    if (!connection) {
        interaction.reply("I am not in any voice channel.")
        return;
    }

    try {
        connection.destroy();
        interaction.reply("Succesfully left the voice channel.");
    } catch (error) {
        console.error(error);
        interaction.reply("Something went wrong while trying to disconnect from the voice channel.");
    }
}