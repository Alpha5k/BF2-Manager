const commando = require('discord.js-commando')

module.exports = class BanCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'endgame',
            memberName: 'endgame',
            group: 'swbf2',
            description: 'End the current game',
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

        var roles = msg.member.roles.cache
        var admins = this.client.provider.get(msg.guild, "admins", [])
        var admin_roles = this.client.provider.get(msg.guild, "admin_roles", [])
        
        if (admins.includes(msg.member.id) || roles.some(r => admin_roles.includes(r.id))) {
            await server.sendChat(`!endgame`)
            var chat = await server.getChat()
            msg.channel.send(entities.decode(chat.filter(c => c.IsSystem)[0].Message))
        } else {
            msg.react("❌")
        }
    }
}