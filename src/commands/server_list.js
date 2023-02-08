const {container, Command} = require('@sapphire/framework');
const {AttachmentBuilder} = require('discord.js')

const GOG = require('../galaxy.js')
const {createServerTable} = require('../utils.js')

class ServerListCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'server_list',
            description: 'Server list from GOG',
        })
    }

    async chatInputRun(interaction) {
        var map = interaction.options.getString('map')
        var mode = interaction.options.getString('mode')
        var era = interaction.options.getString('era')

        var servers = await GOG.getServers()
        servers = servers.items.map(s => s.matchmaking)

        if (map) {
            servers = servers.filter(s => s.fgd_str_map_name.startsWith(map))
        }
        if (mode) {
            servers = servers.filter(s => s.fgd_str_map_name.endsWith(mode))
        }
        if (era) {
            servers = servers.filter(s => s.fgd_str_map_name.split("_")[0].endsWith(era))
        }

        var table = createServerTable(servers)
        if (servers.length > 15) {
            var file = new AttachmentBuilder(Buffer.from(table, 'utf8'), {name: 'servers.txt'})
            await interaction.reply({files: [file]})
        } else {
            await interaction.reply("```" + table + "```")
        }
    }

    async registerApplicationCommands(registry) {
        registry.registerChatInputCommand({
            name: this.name,
            description: this.description,
            options: [
                {
                    name: "map",
                    description: "Server map",
                    type: 3,
                },
                {
                    name: "mode",
                    description: "Server mode",
                    type: 3,
                },
                {
                    name: "era",
                    description: "Server era",
                    type: 3,
                },
            ]
        }, {
            guildIds: [container.default_guild],
            idHints: [],
            behaviorWhenNotIdentical: 'OVERWRITE'
        })
    }
}

module.exports = {
    ServerListCommand
}