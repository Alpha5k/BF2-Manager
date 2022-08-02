const {InteractionHandler, InteractionHandlerTypes} = require('@sapphire/framework');
const {decode} = require('html-entities');

const {isGlobalAdmin} = require('../utils.js');
const servers = require('../webadmin.js')

class PromoteButton extends InteractionHandler {
	constructor(ctx) {
		super(ctx, {
			interactionHandlerType: InteractionHandlerTypes.Button,
		})
	}

	async run(interaction, {player_name, server_name}) {
		var originalInteraction = interaction.message.interaction
		if (interaction.user.id != originalInteraction.user.id) {
			return interaction.reply({content: "You are not the original user to run this command.", ephemeral: true})
		}

		var server = servers.find(s => s.name == server_name)
		if (!server) {
			return interaction.reply(`Server ${server_name} could not be found.`)
		}

		await interaction.deferReply()

		if (isGlobalAdmin(interaction)) {
			await server.sendChat(`!putgroup ${player_name} Admin`)
		} else {
			await server.sendChat(`!putgroup ${player_name} Moderator`)
		}

		var chat = await server.getChat()
		var {Message} = chat.find(m => m.IsSystem)
		return interaction.editReply(decode(Message))
	}

	async parse(interaction) {
		if (interaction.customId != 'promote') return this.none()
		var embed = interaction.message.embeds[0]
		var player_name = embed.title
		var server_name = embed.description
		return this.some({player_name, server_name})
	}
};

module.exports = {
    PromoteButton
}