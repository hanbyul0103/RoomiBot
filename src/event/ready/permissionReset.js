const cron = require("node-cron");
const songChannel = require("../../../data/suggestionSong");

module.exports = async (client) => {
    cron.schedule("0 0 * * *", async () => {
        const channelId = songChannel.getSuggestionSongChannel();
        const channel = client.channels.cache.get(channelId);
        const guild = channel.guild;

        for (const overwrite of channel.permissionOverwrites.cache.values()) {
            const isRole = guild.roles.cache.has(overwrite.id);
            if (!isRole) {
                await channel.permissionOverwrites.delete(overwrite.id)
                    .then(() => console.log(`유저 권한 삭제: ${overwrite.id}`))
                    .catch(console.error);
            }
        }
    });

    cron.schedule("0 0 * * *", async () => {
        const day = new Date().getDay();

        if (day === 1 || day === 3 || day === 5) {
            console.log("재학생 채팅 입력 권한 켬");
            songChannel.openChannel(client);
        }
        else if (day === 0 || day === 2 || day === 4 || day === 6) {
            console.log("재학생 채팅 입력 권한 끔");
            songChannel.closeChannel(client);
        }

        console.log(`Roomi Day!!!!!!!!!!!------- ${day}`);
    })
};