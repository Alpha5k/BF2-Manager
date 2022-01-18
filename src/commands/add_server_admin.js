const {container, Command} = require('@sapphire/framework');

const servers = require('../webadmin.js')

class AddServerAdminCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'add_server_admin',
            description: 'Add a server admin role',
            preconditions: ['GlobalAdmin']
        })
    }

    async chatInputRun(interaction) {
        var role = interaction.options.getRole('role')
        var server_num = interaction.options.getInteger('server')

        container.db.push("/server_admins[]", {role: role.id, server: server_num})

        var server = servers[server_num]
        interaction.reply(`<@&${role.id}> added as an admin for ${server.name}.`)
    }

    async registerApplicationCommands(registry) {
        registry.registerChatInputCommand({
            name: this.name,
            description: this.description,
            options: [
                {
                    name: "server",
                    description: "Server number",
                    type: 4,
                    required: true,
                    choices: servers.map((s,i) => ({name: s.name, value: i}))
                },
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
    AddServerAdminCommand
}