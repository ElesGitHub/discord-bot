import { Collection } from "discord.js";
import path from "node:path";
import fs from "node:fs"

import Command from "../types/command";

const COMMANDS_FOLDER = path.join(__dirname, "../discord/commands");

export async function loadCommands() {
    const commands = new Collection<string, Command>();

    const commandSubFolders = fs.readdirSync(COMMANDS_FOLDER);
    for (const folder of commandSubFolders) {
        const folderPath = path.join(COMMANDS_FOLDER, folder);

        const commandLoadPromises = fs
            .readdirSync(folderPath)
            .filter(filename => filename.endsWith(".ts"))
            .map(async filename => {
                const filePath = path.join(folderPath, filename);
                const command = await loadCommand(filePath);
                if (command) {
                    commands.set(command.data.name, command);
                }
            })
        
        await Promise.all(commandLoadPromises);
    }

    return commands;
}

async function loadCommand(path: string) {
    const command = await import(path);

    if (!command.data) {
        console.log(`[WARNING] The command at ${path} is missing a required "data" property`);
        return null;
    } else if (!command.execute) {
        console.log(`[WARNING] The command at ${path} is missing a required "execute" property`);
        return null;
    }

    return command as Command;
}