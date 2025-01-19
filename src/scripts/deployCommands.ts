import { Client, REST, Routes } from "discord.js";
import { loadCommands } from "../utils/files";
import config from "../config/config";
import { initClient } from "../discord/client";
import { RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord.js";

async function update() {
  const commandCollection = await loadCommands();
  const commands = commandCollection.map((command) => command.data.toJSON());

  const rest = new REST().setToken(config.DISCORD_TOKEN);

  const client = await initClient();
  client.on("ready", async () => {
    await deployCommands(client, rest, commands);
    client.destroy();
  });
  client.login(config.DISCORD_TOKEN);
}

async function deployCommands(
  client: Client,
  rest: REST,
  commands: RESTPostAPIChatInputApplicationCommandsJSONBody[]
) {
  const guilds = client.guilds.cache.map((guild) => guild.id);
  console.log(
    `[INFO] Updating ${commands.length} commands for ${guilds.length} guilds.`
  );
  const promises = guilds.map((guild) => {
    rest.put(Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, guild), {
      body: commands,
    });
  });
  await Promise.all(promises);
  console.log("[INFO] Succesfully updated commands.");
}

update();
