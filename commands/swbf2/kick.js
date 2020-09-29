const commando = require('discord.js-commando')

module.exports = class KickCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'kick',
            memberName: 'kick',
            group: 'swbf2',
            description: 'Kick Player',
            args: [
                {
                    key: 'player',
                    prompt: 'Player to kick',
                    type: 'string'
                },
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
            var player = (await server.getPlayers()).find(p => new RegExp(args.player, 'i').test(p.Name))
            if (player) {
                var response = await server.kickPlayer(player.Slot)
                msg.react(response.Ok ? "✅" : "❌")
            } else {
                msg.react("❌")
            }
        } else {
            msg.react("❌")
        }
    }
}