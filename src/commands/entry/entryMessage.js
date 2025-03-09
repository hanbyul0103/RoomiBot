const { ApplicationCommandOptionType } = require("discord.js");
const entryData = require("./entry.json");

module.exports = {
    name: "입장 메시지",
    description: "입장 메시지를 보낼 채널을 선택합니다",
    devOnly: true,
    testOnly: false,
    deleted: false,
    options: [
        {
            name: "채널",
            description: "입장 메시지를 보낼 채널",
            required: true,
            type: ApplicationCommandOptionType.Channel,
        },
    ],

    callback: async (client, interaction) => {
        const channelId = interaction.options.get("채널")?.value;
        const channel = await client.channels.fetch(channelId);

        await interaction.reply(`<#${channelId}> 채널로 설정되었습니다.`);

        await channel.send(`<@${interaction}>`);
    },
};
