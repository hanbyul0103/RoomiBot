const { ActivityType } = require("discord.js");

let status = [
    {
        name: "요청",
        type: ActivityType.Listening
    },
    {
        name: "명령어",
        type: ActivityType.Watching
    },
    {
        name: "안녕하세요, 루미입니다."
    },
    {
        name: "도와드릴까요?"
    },
    {
        name: "루미봇"
    },
    {
        name: "기타 문의는 DM으로 부탁드려요."
    }
]

module.exports = (client) => {
    console.log(`[!] ${client.user.tag} is ready`);

    client.user.setPresence({
        activities: [{
            name: "요청",
            type: ActivityType.Listening
        }],
        status: 'online'
    });
};