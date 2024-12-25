import { GatewayIntentBits, Events } from "discord.js";

import Client from "../types/client";

import { loadCommands } from "../utils/files";
import { handleChatInputCommand } from "./handlers/chatInputCommand";

export async function initClient() {
  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
  });

  client.commands = await loadCommands();

  client.once(Events.ClientReady, (readyClient) => {
    console.log(`Logged in as ${readyClient.user.tag}`);
  });

  client.on(Events.InteractionCreate, (interaction) => {
    if (interaction.isChatInputCommand()) {
      handleChatInputCommand(interaction);
      return;
    }

    console.log(
      `Interaction type not supported: ${interaction.type.toString()}`
    );
  });

  return client;
}
