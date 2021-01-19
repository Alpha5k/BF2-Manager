const commando = require('discord.js-commando')
const table = require('table')

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
    "Vil": "Villains"
}

module.exports = class PlayersCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'players',
            memberName: 'players',
            group: 'swbf2',
            aliases: ["player_list"],
            description: 'Player List',
            examples: ["players 1"],
            args: [
                {
                    key: 'server',
                    prompt: 'Server number',
                    type: 'integer',
                    default: 0
                }
            ]
        })
    }

    async run(msg, args) {
        if (!args.server) {
            var servers = await Promise.all(this.client.servers.map(s => s.getStatus()))
            var servers = servers.map((s,i) => `${i + 1}. ${s.ServerName.trim()}`).join("\n")
            return msg.reply(`Please select a server from the list\`\`\`md\n${servers}\`\`\``)
        }

        var server = this.client.servers[parseInt(args.server) - 1]

        var players = await server.getPlayers()
        players = players.map(p => [p.Slot, p.Name, teams[p.Team], p.Score, p.Kills, p.Deaths, p.Ping])
        players.unshift(["Slot", "Name", "Team", "Score", "Kills", "Deaths", "Ping"])

        var list = table.table(players, {
            border: table.getBorderCharacters("norc"),
            drawHorizontalLine: (i,s) => i == 0 || i == 1 || i == s
        }).split("\n", players.length + 3)

        msg.channel.send(`\`\`\`${list.join("\n")}\`\`\``)
    }
}