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
        var roles = msg.member.roles.cache
        var admins = this.client.provider.get(msg.guild, "admins", [])
        var admin_roles = this.client.provider.get(msg.guild, "admin_roles", [])
        
        if (admins.includes(msg.member.id) || roles.some(r => admin_roles.includes(r.id))) {
            admins.push(args.user.id)
            this.client.provider.set(msg.guild, "admins", admins)
            msg.react("✅")
        } else {
            msg.react("❌")
        }
    }
}