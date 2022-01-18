const {container, Command} = require('@sapphire/framework');

class ScrimmerCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'scrimmer',
            description: 'Assign scrimmer role',
        })
    }

    async chatInputRun(interaction) {
        var scrimmerRole = interaction.guild.roles.cache.find(r => r.name == "Scrimmer")

        if (!interaction.member.roles.cache.has(scrimmerRole.id)) {
            interaction.member.roles.add(scrimmerRole)
            return interaction.reply({content: `You were assigned the <@&${scrimmerRole.id}> role.`, ephemeral: true})
        } else {
            return interaction.reply({content: `You already have the <@&${scrimmerRole.id}> role.`, ephemeral: true})
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
    ScrimmerCommand
}