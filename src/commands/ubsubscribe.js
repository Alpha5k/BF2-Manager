const {container, Command} = require('@sapphire/framework');

const servers = require('../webadmin.js')

class UnsubscribeCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'unsubscribe',
            description: 'Unsubscribe from server pings',
        })
    }

    async chatInputRun(interaction) {
        var server_num = interaction.options.getInteger('server')

        var server = servers[server_num]
        var user_id = interaction.user.id

        container.db.delete(`/subscriptions/${server.id}/${user_id}`)

        return interaction.reply(`You will no longer be pinged for ${server.name}`)
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
    UnsubscribeCommand
}