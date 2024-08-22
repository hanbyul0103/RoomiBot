module.exports = {
    name: '노래신청',
    description: '노래 신청을 받을 채널을 선택합니다.',
    devOnly: true,
    testOnly: true,
    deleted: false,
    options: [
        {
            name: '채널',
            description: '등록할 채널의 이름',
            required: true,
            type: ApplicationCommandOptionType.Channel,
        },
    ],

    callback: async (client, interaction) => {
        const channelId = interaction.options.get("채널")?.value;

        await interaction.reply(`<#${channelId}> 채널로 설정되었습니다.`);
    }
}