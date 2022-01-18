const {container, Command} = require('@sapphire/framework');

class AddGlobalAdminCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'add_global_admin',
            description: 'Add a global admin role',
            preconditions: ['Owner']
        })
    }

    async chatInputRun(interaction) {
        var role = interaction.options.getRole('role')

        container.db.push("/global_admins[]", role.id)

        interaction.reply(`<@&${role.id}> added as a global admin.`)
    }

    async registerApplicationCommands(registry) {
        registry.registerChatInputCommand({
            name: this.name,
            description: this.description,
            options: [
                {
                    name: "role",
                    description: "Discord role",
                    type: 8,
                    required: true
                }
            ]
        }, {
            guildIds: [container.default_guild],
            idHints: [],
            behaviorWhenNotIdentical: 'OVERWRITE'
        })
    }
}

module.exports = {
    AddGlobalAdminCommand
}