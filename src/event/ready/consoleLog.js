const { ActivityType } = require("discord.js");

module.exports = (client) => {
    console.log(`[!] ${client.user.tag} is ready`);

    client.user.setPresence({
        activities: [{ name: "요청", type: ActivityType.Listening }],
        status: 'online'
    });
};