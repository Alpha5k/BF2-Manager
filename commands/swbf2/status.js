const commando = require('discord.js-commando')

module.exports = class StatusCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'status',
            memberName: 'status',
            group: 'swbf2',
            aliases: ["server_status"],
            description: 'Server Status',
            examples: ["status 1"],
            args: [
                {
                    key: 'server',
                    prompt: 'Server number',
                    type: 'integer',
                    default: 0
                }
            ]
        })
    }

    async run(msg, args) {
        if (!args.server) {
            var servers = await Promise.all(this.client.servers.map(s => s.getStatus()))
            var servers = servers.map((s,i) => `${i + 1}. ${s.ServerName.trim()}`).join("\n")
            return msg.reply(`Please select a server from the list\`\`\`md\n${servers}\`\`\``)
        }

        var server = this.client.servers[parseInt(args.server) - 1]
        var embed = await this.client.status.createStatus(server)

        delete embed.description
        msg.channel.send({embed})
    }
}