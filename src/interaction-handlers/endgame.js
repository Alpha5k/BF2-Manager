const {InteractionHandler, InteractionHandlerTypes} = require('@sapphire/framework');
const {decode} = require('html-entities');

const servers = require('../webadmin.js')

class EndGameButton extends InteractionHandler {
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
		await server.sendChat(`!endgame`)

		var chat = await server.getChat()
		var {Message} = chat.find(m => m.IsSystem)
		return interaction.editReply(decode(Message))
	}

	async parse(interaction) {
		if (interaction.customId != 'endgame') return this.none()
		var embed = interaction.message.embeds[0]
		var server_name = embed.title
		return this.some({server_name})
	}
};

module.exports = {
    EndGameButton
}