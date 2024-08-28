module.exports = {
    name: '플리',
    description: '플레이리스트에 적용합니다.',
    devOnly: true,
    testOnly: true,
    deleted: false,

    callback: async (client, interaction) => {
        interaction.reply("플레이리스트에 적용");
    }
};