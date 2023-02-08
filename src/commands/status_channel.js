const {container, Command} = require('@sapphire/framework');

class StatusChannelCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'status_channel',
            description: 'Set the channel to post server status updates',
            preconditions: ['GlobalAdmin']
        })
    }

    async chatInputRun(interaction) {
        var channel = interaction.options.getChannel('channel')
        await container.db.push("/channels/status", channel.id)
        await container.db.push("/messages/status", [])
        interaction.reply(`Server status updates will be posted to <#${channel.id}>`)
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
    StatusChannelCommand
}