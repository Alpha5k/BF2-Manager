const {container, Command} = require('@sapphire/framework');

class InactiveCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'inactive',
            description: 'Remove scrimmer and freeplay roles',
        })
    }

    async chatInputRun(interaction) {
        var scrimmerRole = interaction.guild.roles.cache.find(r => r.name == "Scrimmer")
        var freeplayRole = interaction.guild.roles.cache.find(r => r.name == "Freeplay")

        if (interaction.member.roles.cache.has(freeplayRole.id)) {
            interaction.member.roles.remove(freeplayRole)
        }
        if (interaction.member.roles.cache.has(scrimmerRole.id)) {
            interaction.member.roles.remove(scrimmerRole)
        }

        return interaction.reply({content: `<@&${scrimmerRole.id}> and <@&${freeplayRole.id}> roles removed.`, ephemeral: true})
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
    InactiveCommand
}