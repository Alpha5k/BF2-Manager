const commando = require('discord.js-commando')

module.exports = class AddAdminRoleCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'add_admin_role',
            memberName: 'add_admin_role',
            group: 'discord',
            description: 'Add Admin Role',
            args: [
                {
                    key: 'role',
                    prompt: 'Role to add',
                    type: 'role'
                }
            ]
        })
    }

    async run(msg, args) {
        var roles = msg.member.roles.cache
        var admins = this.client.provider.get(msg.guild, "admins", [])
        var admin_roles = this.client.provider.get(msg.guild, "admin_roles", [])
        
        if (admins.includes(msg.member.id) || roles.some(r => admin_roles.includes(r.id))) {
            admin_roles.push(args.role.id)
            this.client.provider.set(msg.guild, "admin_roles", admin_roles)
            msg.react("✅")
        } else {
            msg.react("❌")
        }
    }
}