import dotenv from "dotenv";

dotenv.config();

const { DISCORD_TOKEN } = process.env;

if (!DISCORD_TOKEN) {
    throw new Error("Missing enviroment variables");
}

export default { DISCORD_TOKEN };