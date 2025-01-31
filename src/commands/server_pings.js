const {container, Command} = require('@sapphire/framework');

class ServerPingsChannelCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'server_pings_channel',
            description: 'Set the channel to post server pings',
            preconditions: ['GlobalAdmin']
        })
    }

    async chatInputRun(interaction) {
        var channel = interaction.options.getChannel('channel')
        await container.db.push("/channels/server_pings", channel.id)
        interaction.reply(`Server pings will be posted to <#${channel.id}>`)
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
    ServerPingsChannelCommand
}