import { REST, Routes } from "discord.js";
import { loadCommands } from "../utils/files";
import config from "../config/config";

async function deploy() {
    const commandCollection = await loadCommands();
    const commands = commandCollection.map(command => command.data.toJSON());

    const rest = new REST().setToken(config.DISCORD_TOKEN);

    try {
        console.log(`Re-uploading ${commands.length} commands`);

        await rest.put(
            Routes.applicationGuildCommands(
                config.DISCORD_CLIENT_ID,
                config.DISCORD_GUILD_ID
            ),
            { body: commands }
        );

        console.log(`Successfully re-uploaded ${commands.length} commands`);
    } catch (error) {
        console.error
    }
}

deploy();