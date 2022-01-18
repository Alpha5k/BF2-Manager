const {container, Command} = require('@sapphire/framework');

const servers = require('../webadmin.js')

class ChatBridgeChannelCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'chat_bridge_channel',
            description: 'Set the channel to bridge chat messages for a server',
            preconditions: ['GlobalAdmin']
        })
    }

    async chatInputRun(interaction) {
        var server_num = interaction.options.getInteger('server')
        var channel = interaction.options.getChannel('channel')

        try {
            var channels = container.db.getData("/channels/chat")
            channels = channels.filter(c => c.server != server_num)
        } catch (e) {
            var channels = []
        }
        
        channels.push({server: server_num, channel: channel.id})
        container.db.push("/channels/chat", channels)

        var server = servers[server_num]
        interaction.reply(`Chat messages for ${server.name} will be bridged to <#${channel.id}>`)
    }

    async registerApplicationCommands(registry) {
        registry.registerChatInputCommand({
            name: this.name,
            description: this.description,
            options: [
                {
                    name: "server",
                    description: "Server number",
                    type: 4,
                    required: true,
                    choices: servers.map((s,i) => ({name: s.name, value: i}))
                },
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
    ChatBridgeChannelCommand
}