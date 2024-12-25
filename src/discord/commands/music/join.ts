import { joinVoiceChannel } from "@discordjs/voice";
import { ChannelType, ChatInputCommandInteraction, GuildMember, SlashCommandBuilder, SlashCommandChannelOption, VoiceBasedChannel } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("join")
    .setDescription("Joins your voice channel")
    .addChannelOption(
        new SlashCommandChannelOption()
            .setName("channel")
            .setDescription("The channel you want the bot to join.")
            .setRequired(false)
            .addChannelTypes(ChannelType.GuildVoice)
    )

export async function execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guildId) return;

    const channel =
        interaction.options.getChannel<ChannelType.GuildVoice>("channel")  
        || (interaction.member as GuildMember)?.voice.channel;
    
    if (!channel) {
        await interaction.reply("You must be connected to a voice channel or specify one to use this command.");
        return;
    }

    try {
        joinVoiceChannel({
            channelId: channel.id,
            guildId: interaction.guildId,
            adapterCreator: channel.guild.voiceAdapterCreator
        });
        interaction.reply(`Successfully joined ${channel.name}`);
    } catch (error) {
        console.error(error);
        await interaction.reply("Something went wrong while trying to connect to your channel.");
    }
}