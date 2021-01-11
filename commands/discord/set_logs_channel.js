const commando = require('discord.js-commando')

module.exports = class SetLogsChannelCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'set_logs_channel',
            memberName: 'set_logs_channel',
            group: 'discord',
            description: 'Set Logs Channel',
            args: [
                {
                    key: 'channel',
                    prompt: 'Channel to set',
                    type: 'channel'
                }
            ]
        })
    }

    async run(msg, args) {
        var channel = args.channel.id
        this.client.provider.set('global', 'logs', channel)
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