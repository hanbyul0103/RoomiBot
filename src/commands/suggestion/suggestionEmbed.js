const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

const choices = [
    { name: "시설관리부", emoji: "🛠", role: "시설관리부" },
    { name: "생활지도부", emoji: "⏰", role: "생활지도부" },
    { name: "학습관리부", emoji: "💻", role: "학습관리부" },
    { name: "기타", emoji: "🎸", role: "자치회" },
];

const close = [
    { name: "닫기", emoji: "🔒" }
];

module.exports = {
    name: 'ticket',
    description: '티켓을 업로드 할 채널을 선택하고 티켓을 보냅니다.',
    devOnly: true,
    testOnly: true,
    deleted: false,
    options: [
        {
            name: '채널',
            description: '등록할 채널의 이름',
            required: true,
            type: 7,
        },
    ],

    callback: async (client, interaction) => {
        const channelId = interaction.options.get("채널")?.value;
        const channel = await client.channels.fetch(channelId);

        await interaction.reply(`<#${channelId}> 채널로 설정되었습니다.`);

        const ticketEmbed = new EmbedBuilder()
            .setTitle('기숙사 내 파손된 물품 문의 & 건의사항')
            .setDescription('문의 시 시설관리, 학습관리, 생활지도 중 알맞은 버튼을 눌러주세요.\n그 외의 내용은 기타 버튼을 눌러주세요.\n닫기 버튼을 누르면 생성된 채널이 삭제됩니다.')
            .setColor('#FFFFFF');

        const buttons = choices.map(({ name, emoji }) =>
            new ButtonBuilder()
                .setCustomId(name)
                .setLabel(name)
                .setStyle(ButtonStyle.Primary)
                .setEmoji(emoji)
        );

        const row = new ActionRowBuilder().addComponents(buttons);
        await channel.send({ embeds: [ticketEmbed], components: [row] });
    },
};