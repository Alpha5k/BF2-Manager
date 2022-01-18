const {InteractionHandler, InteractionHandlerTypes} = require('@sapphire/framework');

const servers = require('../webadmin.js')

class StopButton extends InteractionHandler {
	constructor(ctx) {
		super(ctx, {
			interactionHandlerType: InteractionHandlerTypes.Button,
		})
	}

	async run(interaction, {server_name}) {
		var originalInteraction = interaction.message.interaction
		if (interaction.user.id != originalInteraction.user.id) {
			return interaction.reply({content: "You are not the original user to run this command.", ephemeral: true})
		}

		var server = servers.find(s => s.name == server_name)
		if (!server) {
			return interaction.reply(`Server ${server_name} could not be found.`)
		}

		await interaction.deferReply()
		await server.stopServer()
		return interaction.editReply(`${server_name} was stopped by <@${interaction.user.id}>`)
	}

	async parse(interaction) {
		if (interaction.customId != 'stop') return this.none()
		var embed = interaction.message.embeds[0]
		var server_name = embed.title
		return this.some({server_name})
	}
};

module.exports = {
    StopButton
}