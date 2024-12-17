import { GatewayIntentBits, Events, Collection } from "discord.js";

import Client from "../types/client";
import Command from "../types/command"
import { handleChatInputCommand } from "./handlers/chatInputCommand"

async function loadCommands() {
    return new Collection<string, Command>();
}

export async function initClient() {
    const client = new Client({
        intents: GatewayIntentBits.Guilds
    });

    client.commands = await loadCommands();

    client.once(Events.ClientReady, readyClient => {
        console.log(`Logged in as ${readyClient.user.tag}`);
    });

    client.on(Events.InteractionCreate, interaction => {
        if (interaction.isChatInputCommand()) {
            handleChatInputCommand(interaction);
            return;
        }

        console.log(`Interaction type not supported: ${interaction.type.toString()}`);
    });

    return client;
}