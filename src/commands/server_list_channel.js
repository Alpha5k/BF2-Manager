const {container, Command} = require('@sapphire/framework');

class ServerListChannelCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'server_list_channel',
            description: 'Set the channel to post GOG server list',
            preconditions: ['GlobalAdmin']
        })
    }

    async chatInputRun(interaction) {
        var channel = interaction.options.getChannel('channel')
        await container.db.push("/channels/server_list", channel.id)
        interaction.reply(`GOG server list will be posted to <#${channel.id}>`)
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
    ServerListChannelCommand
}