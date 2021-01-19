const commando = require('discord.js-commando')

module.exports = class RemoveAdminCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'remove_admin',
            memberName: 'remove_admin',
            group: 'discord',
            description: 'Remove Admin User',
            args: [
                {
                    key: 'user',
                    prompt: 'User to remove',
                    type: 'user'
                }
            ]
        })
    }

    async run(msg, args) {
        var admins = this.client.provider.get(msg.guild, "admins", [])
        var index = admins.indexOf(args.user.id)
        if (index > -1) {
            admins.splice(index, 1)
            this.client.provider.set(msg.guild, "admins", admins)
            msg.react("✅")
        } else {
            msg.react("❌")
        }
    }

    hasPermission(msg) {
        if (!this.client.isOwner(msg.member)) {
            return false
        }
        return true
    }
}