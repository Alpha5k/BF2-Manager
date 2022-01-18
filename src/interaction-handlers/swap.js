const {InteractionHandler, InteractionHandlerTypes} = require('@sapphire/framework');

const servers = require('../webadmin.js')

class SwapButton extends InteractionHandler {
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

		var players = await server.getPlayers()
		var player = players.find(p => p.Name == player_name)

		if (!player) {
			return interaction.reply(`Player ${player_name} could not be found.`)
		}

		var response = await server.swapPlayer(player.Slot)
		if (response.Ok) {
			return interaction.reply(`${player.Name} was swapped by <@${interaction.user.id}>`)
		}

		return interaction.reply(`Server ${server_name} could not be found.`)
	}

	async parse(interaction) {
		if (interaction.customId != 'swap') return this.none()
		var embed = interaction.message.embeds[0]
		var player_name = embed.title
		var server_name = embed.description
		return this.some({player_name, server_name})
	}
};

module.exports = {
    SwapButton
}