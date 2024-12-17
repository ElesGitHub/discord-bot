import config from "./config/config";
import { initClient } from "./discord/client";

async function main() {
    const client = await initClient();
    client.login(config.DISCORD_TOKEN);
}

main().catch(console.error);