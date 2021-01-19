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
        var admin_roles = this.client.provider.get(msg.guild, "admin_roles", [])
        var index = admin_roles.indexOf(args.role.id)
        if (index > -1) {
            admin_roles.splice(index, 1)
            this.client.provider.set(msg.guild, "admin_roles", admin_roles)
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