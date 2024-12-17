import { Client, Collection } from "discord.js";

import { Command } from "./command";

export default class MyClient extends Client {
    commands = new Collection<string, Command>();
}