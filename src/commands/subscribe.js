const {container, Command} = require('@sapphire/framework');

const servers = require('../webadmin.js')

class SubscribeCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'subscribe',
            description: 'Subscribe to be pinged when a server reaches a certain player count',
        })
    }

    async chatInputRun(interaction) {
        var server_num = interaction.options.getInteger('server')
        var player_count = interaction.options.getInteger('player_count')

        var server = servers[server_num]
        var user_id = interaction.user.id

        container.db.push(`/subscriptions/${server.id}/${user_id}`, {
            "player_count": player_count,
            "last_ping": null
        })

        return interaction.reply(`You will be pinged whenever ${server.name} has ${player_count} or more players`)
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
                    name: "player_count",
                    description: "Player count",
                    type: 4,
                    required: true
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
    SubscribeCommand
}