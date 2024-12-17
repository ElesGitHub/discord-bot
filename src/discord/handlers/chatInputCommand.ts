import { ChatInputCommandInteraction } from "discord.js";

import MyClient from "../../types/client";

export async function handleChatInputCommand(interaction: ChatInputCommandInteraction) {
    const client = interaction.client as MyClient;
    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching "${interaction.commandName}" was found`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
    }
}