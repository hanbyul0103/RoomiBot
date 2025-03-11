module.exports = async (member, client) => {
    const channelID = '1265224199509901374';

    let channel = client.channels.cache.get(channelID);
    if (!channel) {
        console.log("채널이 없어요");
        return;
    }

    if (channel) {
        await channel.send(`${member}\n안녕하세요! 닉네임을 \`본명 (학년)\`으로 바꿔주세요.`);
    }

    const classRole = member.guild.roles.cache.find(role => role.name === '1학년');
    const studentRole = member.guild.roles.cache.find(role => role.name === "재학생");

    if (classRole && studentRole) {
        try {
            await member.roles.add(classRole);
            await member.roles.add(studentRole);
        } catch (error) {
            console.error(`역할 추가 중 오류 발생: ${error}`);
        }
    }
};