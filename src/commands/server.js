const {Command} = require('@sapphire/framework');

const servers = require('../webadmin.js')
const {isAdmin, createStatusEmbed} = require('../utils.js')

class ServerCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'server',
            description: 'Server info',
        })
    }

    async chatInputRun(interaction) {
        var server_num = interaction.options.getInteger('server')

        var server = servers[server_num]
        var embed = await createStatusEmbed(server)
        delete embed.description

        var disabled = !isAdmin(interaction, server_num)
        var components = [
            {type: 2, custom_id: "start", style: 3, label: "Start", disabled},
            {type: 2, custom_id: "stop", style: 4, label: "Stop", disabled},
            {type: 2, custom_id: "restart", style: 1, label: "Restart", disabled},
            {type: 2, custom_id: "endgame", style: 2, label: "End Game", disabled},
        ]

        interaction.reply({embeds: [embed], components: [{type: 1, components}]})
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
    ServerCommand
}