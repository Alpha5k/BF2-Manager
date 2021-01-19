const commando = require('discord.js-commando')

module.exports = class SetServerListChannel extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'set_server_list_channel',
            memberName: 'set_server_list_channel',
            group: 'discord',
            description: 'Set Server List Channel',
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
        this.client.provider.set('global', 'server_list', {
            channel: channel,
            messages: []
        })
        msg.react("✅")
    }

    hasPermission(msg) {
        var roles = msg.member.roles.cache
        var admins = this.client.provider.get(msg.guild, "admins", [])
        var admin_roles = this.client.provider.get(msg.guild, "admin_roles", [])
        if (!admins.includes(msg.member.id) && !roles.some(r => admin_roles.includes(r.id))) {
            return false
        }
        return true
    }
}