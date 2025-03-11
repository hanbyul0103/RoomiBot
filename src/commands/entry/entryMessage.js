module.exports = {
    name: "entry-message",
    description: "입장 메시지를 보낼 채널을 선택합니다",
    devOnly: true,
    testOnly: false,
    deleted: false,
    options: [
        {
            name: "채널",
            description: "입장 메시지를 보낼 채널",
            required: true,
            type: 7,
        },
    ],

    callback: async (client, interaction) => {
        const channelId = interaction.options.getChannel("채널")?.id;
        const channel = client.channels.cache.get(channelId) || await client.channels.fetch(channelId);

        await interaction.reply({ content: `<#${channelId}> 채널로 설정되었습니다.`, ephemeral: true });

        await channel.send(`<@${interaction.user.id}>`);
    },
};
