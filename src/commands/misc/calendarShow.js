module.exports = {
    name: '캘린더',
    description: '현재 달(UTC+9 기준)의 일정을 보여줍니다.',
    devOnly: false,
    testOnly: true,
    deleted: false,
    //options: ,

    callback: async (client, interaction) => {
        await interaction.reply("캘린더");
    },
};