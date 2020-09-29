const commando = require('discord.js-commando')

module.exports = class RemoveAdminRoleCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'remove_admin_role',
            memberName: 'remove_admin_role',
            group: 'discord',
            description: 'Remove Admin Role',
            args: [
                {
                    key: 'role',
                    prompt: 'Role to remove',
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
            var index = admin_roles.indexOf(args.role.id)
            if (index > -1) {
                roles.splice(index, 1)
                this.client.provider.set(msg.guild, "admin_roles", admin_roles)
                msg.react("✅")
            } else {
                msg.react("❌")
            }
        } else {
            msg.react("❌")
        }
    }
}