const {container, Command} = require('@sapphire/framework');

const {createPlayerTable} = require('../utils.js')
const servers = require('../webadmin.js')

class PlayerListCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'player_list',
            description: 'List of players in a server',
        })
    }

    async chatInputRun(interaction) {
        var server_num = interaction.options.getInteger('server')

        var server = servers[server_num]
        var players = await server.getPlayers()

        var table = createPlayerTable(players)
        return interaction.reply("```" + table + "```")
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
    PlayerListCommand
}