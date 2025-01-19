import dotenv from "dotenv";

dotenv.config();

const {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  //  DISCORD_GUILD_ID,
  GOOGLE_CLOUD_API_KEY,
} = process.env;

if (
  !DISCORD_TOKEN ||
  !DISCORD_CLIENT_ID ||
  //  !DISCORD_GUILD_ID ||
  !GOOGLE_CLOUD_API_KEY
) {
  throw new Error("Missing enviroment variables");
}

export default {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  //  DISCORD_GUILD_ID,
  GOOGLE_CLOUD_API_KEY,
};
