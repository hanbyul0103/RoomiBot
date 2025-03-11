const { testServer } = require('../../config/config.json');
const areCommandsDifferent = require('../../utils/areCommandsDifferent');
const getApplicationCommands = require('../../utils/getApplicationCommands');
const getLocalCommands = require('../../utils/getLocalCommands');

module.exports = async (client) => {
    try {
        const localCommands = getLocalCommands();
        const applicationCommands = await getApplicationCommands(client, testServer);

        for (const localCommand of localCommands) {
            const { name, description, options } = localCommand;

            if (!name || typeof name !== "string") {
                console.error(`[X] Invalid command name detected:`, localCommand);
                continue;
            }

            const existingCommand = applicationCommands.cache.find(cmd => cmd.name === name);

            if (existingCommand) {
                if (localCommand.deleted) {
                    await applicationCommands.delete(existingCommand.id);
                    console.log(`[D] Deleted command "${name}".`);
                    continue;
                }

                if (areCommandsDifferent(existingCommand, localCommand)) {
                    await applicationCommands.edit(existingCommand.id, {
                        name, // 기존 코드에는 없던 `name` 추가
                        description: description || "No description provided",
                        options: options || [], // `options`가 없으면 빈 배열 전달
                    });

                    console.log(`[E] Edited command "${name}"`);
                }
            } else {
                if (localCommand.deleted) {
                    console.log(`[S] Skipping registration of command "${name}" as it's set to delete.`);
                    continue;
                }

                await applicationCommands.create({
                    name,
                    description: description || "No description provided",
                    options: options || [],
                });

                console.log(`[R] Registered command "${name}".`);
            }
        }

    } catch (error) {
        console.error(`[X] There was an error:`, error);
    }
};