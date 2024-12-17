import { GatewayIntentBits, Events, Collection } from "discord.js";

import Client from "../types/client";
import Command from "../types/command"

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

    return client;
}