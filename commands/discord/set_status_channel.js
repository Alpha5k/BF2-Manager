const commando = require('discord.js-commando')

module.exports = class SetStatusChannelCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'set_status_channel',
            memberName: 'set_status_channel',
            group: 'discord',
            description: 'Set Status Channel',
            args: [
                {
                    key: 'channel',
                    prompt: 'Channel to set',
                    type: 'channel'
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
            return msg.reply(`Please select a server from the list\n\`\`\`md\n${servers}\n\`\`\``)
        }

        var server = parseInt(args.server) - 1
        var channel = args.channel.id
        
        var statuses = this.client.provider.get('global', 'statuses', [])
        var i = statuses.findIndex(s => s.server == server)
        if (i < 0) {
            statuses.push({server, channel})
        } else {
            statuses[i].channel = channel
            delete statuses[i].message
        }
        this.client.provider.set('global', 'statuses', statuses)
        msg.react("✅")
    }

    hasPermission(msg) {
        var roles = msg.member.roles.cache
        var admins = this.client.provider.get(msg.guild, "admins", [])
        var admin_roles = this.client.provider.get(msg.guild, "admin_roles", [])
        if (!admins.includes(msg.member.id) && !roles.some(r => admin_roles.includes(r.id))) {
            msg.react("❌")
            return false
        }
        return true
    }
}