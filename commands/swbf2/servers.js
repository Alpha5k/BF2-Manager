const commando = require('discord.js-commando')

module.exports = class ServersCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'servers',
            memberName: 'servers',
            group: 'swbf2',
            aliases: ['server_list'],
            description: 'Server List',
            examples: ["servers", "servers map:tat2", "servers mode:eli"],
            args: [
                {
                    key: 'filter',
                    prompt: 'Filter String',
                    type: 'string',
                    default: ""
                }
            ]
        })
    }

    async run(msg, args) {
        var servers = await this.client.galaxy.getServers()
        servers = servers.items.map(s => s.matchmaking)

        if (args.filter) {
            var filter = args.filter.split(":")
            switch (filter[0]) {
                case "map":
                    servers = servers.filter(s => s.fgd_str_map_name.startsWith(filter[1]))
                    break
                case "mode":
                    servers = servers.filter(s => s.fgd_str_map_name.endsWith(filter[1]))
                    break
                case "era":
                    servers = servers.filter(s => s.fgd_str_map_name.split("_")[0].endsWith(filter[1]))
                    break
            }
        }

        var list = await this.client.status.createServerList(servers)
        
        for (var i = 0; i < list.length; i += 20) {
            await msg.channel.send(`\`\`\`${list.slice(i, i + 20).join("\n")}\`\`\``)
        }
    }
}