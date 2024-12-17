import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js"

export default interface Command {
    data: SlashCommandBuilder;
    execute: (interaction: ChatInputCommandInteraction) => void;
}