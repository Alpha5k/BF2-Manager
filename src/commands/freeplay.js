const {container, Command} = require('@sapphire/framework');

class FreeplayCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'freeplay',
            description: 'Assign freeplay role',
        })
    }

    async chatInputRun(interaction) {
        var freeplayRole = interaction.guild.roles.cache.find(r => r.name == "Freeplay")

        if (!interaction.member.roles.cache.has(freeplayRole.id)) {
            interaction.member.roles.add(freeplayRole)
            return interaction.reply({content: `You were assigned the <@&${freeplayRole.id}> role.`, ephemeral: true})
        } else {
            return interaction.reply({content: `You already have the <@&${freeplayRole.id}> role.`, ephemeral: true})
        }
    }

    async registerApplicationCommands(registry) {
        registry.registerChatInputCommand({
            name: this.name,
            description: this.description,
            options: []
        }, {
            guildIds: [container.default_guild],
            idHints: [],
            behaviorWhenNotIdentical: 'OVERWRITE'
        })
    }
}

module.exports = {
    FreeplayCommand
}