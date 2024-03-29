const {container, Command} = require('@sapphire/framework');

const servers = require('../webadmin.js')
const {isAdmin} = require('../utils.js')

const teams = {
    "CIS": "CIS",
    "Emp": "Empire",
    "Ewo": "Ewoks",
    "Gun": "Gungan",
    "Her": "Heroes",
    "Jaw": "Jawas",
    "Reb": "Rebels",
    "Rep": "Republic",
    "Tus": "Tusken",
    "Wam": "Wampas",
    "Woo": "Wookies",
    "Vil": "Villains",
    "Non": "None"
}

class PlayerCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'player',
            description: 'Player info',
        })
    }

    async chatInputRun(interaction) {
        var server_num = interaction.options.getInteger('server')
        var player_name = interaction.options.getString('player')
        var player_slot = interaction.options.getInteger('slot')

        var server = servers[server_num]
        var players = await server.getPlayers()

        if (player_name) {
            var player = players.find(p => new RegExp(player_name, 'i').test(p.Name))
            if (!player) return interaction.reply(`No player matching ${player_name} could be found.`)
        } else if (player_slot) {
            var player = players.find(p => p.Slot == player_slot)
            if (!player) return interaction.reply(`No player with slot ${player_slot} could be found.`)
        } else {
            return interaction.reply("You must specify either a player name or slot.")
        }


        var status = await server.getStatus()
        var embed = {
            "color": 10921638,
            "title": player.Name,
            "description": status.ServerName.trim(),
            "thumbnail": {
                "url": "https://i.imgur.com/QdnYTeA.png"
            },
            "fields": [
                {
                    "name": "Slot",
                    "value": player.Slot.toString(),
                    "inline": true
                },
                {
                    "name": "Team",
                    "value": teams[player.Team],
                    "inline": true
                },
                {
                    "name": "Ping",
                    "value": `${player.Ping}ms`,
                    "inline": true
                },
                {
                    "name": "Score",
                    "value": player.Score.toString(),
                    "inline": true
                },
                {
                    "name": "Kills",
                    "value": player.Kills.toString(),
                    "inline": true
                },
                {
                    "name": "Deaths",
                    "value": player.Deaths.toString(),
                    "inline": true
                }
            ],
            "timestamp": new Date(),
            "footer": {
                "text": "SWBF2Admin"
            }
        }

        var disabled = !(await isAdmin(interaction, server_num))
        var components = [
            {type: 2, custom_id: "swap", style: 2, label: "Swap", disabled},
            {type: 2, custom_id: "kick", style: 1, label: "Kick", disabled},
            {type: 2, custom_id: "ban", style: 4, label: "Ban", disabled},
            {type: 2, custom_id: "promote", style: 3, label: "Promote", disabled}
        ]

        interaction.reply({embeds: [embed], components: [{type: 1, components}]})
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
                    name: "player",
                    description: "Player name",
                    type: 3
                },
                {
                    name: "slot",
                    description: "Player slot",
                    type: 4
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
    PlayerCommand
}