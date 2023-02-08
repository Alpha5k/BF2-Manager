const {container, Command} = require('@sapphire/framework');

class LogsChannel extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'logs_channel',
            description: 'Set the channel to post bot logs',
            preconditions: ['GlobalAdmin']
        })
    }

    async chatInputRun(interaction) {
        var channel = interaction.options.getChannel('channel')
        await container.db.push("/channels/logs", channel.id)
        interaction.reply(`Bot logs will be posted to <#${channel.id}>`)
    }

    async registerApplicationCommands(registry) {
        registry.registerChatInputCommand({
            name: this.name,
            description: this.description,
            options: [
                {
                    name: "channel",
                    description: "Discord channel",
                    type: 7,
                    required: true,
                }
            ]
        }, {
            guildIds: [container.default_guild],
            idHints: [],
            behaviorWhenNotIdentical: 'OVERWRITE'
        })
    }
}

module.exports = {
    LogsChannel
}