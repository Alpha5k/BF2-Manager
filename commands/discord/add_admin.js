const commando = require('discord.js-commando')

module.exports = class AddAdminCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'add_admin',
            memberName: 'add_admin',
            group: 'discord',
            description: 'Add Admin User',
            args: [
                {
                    key: 'user',
                    prompt: 'User to add',
                    type: 'user'
                }
            ]
        })
    }

    async run(msg, args) {
        var admins = this.client.provider.get(msg.guild, "admins", [])
        admins.push(args.user.id)
        this.client.provider.set(msg.guild, "admins", admins)
        msg.react("✅")
    }

    hasPermission(msg) {
        if (!this.client.isOwner(msg.member)) {
            return false
        }
        return true
    }
}