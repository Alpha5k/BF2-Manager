const table = require('table')

const status_ids = [
    "Running",
    "Stopped",
    "Starting",
    "Stopping"
]

const maps = {
    "cor1": "Coruscant",
    "dag1": "Dagobah",
    "dea1": "Death Star",
    "end1": "Endor",
    "fel1": "Felucia",
    "geo1": "Geonosis",
    "hot1": "Hoth",
    "tat3": "Jabba's Palace",
    "kam1": "Kamino",
    "kas2": "Kashyyyk",
    "tat2": "Mos Eisley",
    "mus1": "Mustafar",
    "myg1": "Mygeeto",
    "nab2": "Naboo",
    "pol1": "Polis Massa",
    "spa1": "Space Yavin",
    "spa2": "Space Coruscant",
    "spa3": "Space Kashyyyk",
    "spa4": "Space Mustafar",
    "spa6": "Space Mygeeto",
    "spa7": "Space Felucia",
    "spa8": "Space Hoth",
    "spa9": "Space Tatooine",
    "tan1": "Tantive IV",
    "uta1": "Utapau",
    "yav1": "Yavin 4",
    "PTC": "Patch 2.0"
}
const modes = {
    "1flag": "1-flag CTF",
    "ass": "Space Assault",
    "c": "Campaign",
    "con": "Conquest",
    "ctf": "2-flag CTF",
    "eli": "Hero Assault",
    "hunt": "Hunt",
    "xl": "XL",
    "tdm": "Team DM",
    "gay": "Hero CTF"
}
const eras = {
    "c": "CW",
    "g": "GCW"
}

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

function parseMap(map) {
    if (!map) {
        return ["None", "", ""]
    }
    var match = map.match(/^(\w+)([a-z])_(\w+)$/i)
    if (!match) {
        return [map]
    }
    var map = match[1] in maps ? maps[match[1]] : match[0]
    var mode = match[3].toLowerCase() in modes ? modes[match[3]] : ""
    var era = match[2].toLowerCase() in eras ? eras[match[2]] : ""
    return [map, mode, era]
}

class Status {
    constructor(client) {
        this.client = client
        setInterval(() => this.updateStatuses(), 30000)
        setInterval(() => this.updateServerList(), 300000)
        setInterval(() => this.restartServers(), 300000)
    }

    async createStatus(server) {
        try {
            var status = await server.getStatus()
            var players = await server.getPlayers()
        } catch (e) {
            console.error(`Error retrieving status for ${server.name}: ${e.message}`)
            var status = {ServerName: server.name, Status: 1, MaxPlayers: 0}
            var players = []
        }

        var [map, mode, era] = parseMap(status.CurrentMap)

        var embed = {
            "color": 10921638,
            "title": status.ServerName,
            "description": "Updates every 30 seconds",
            "thumbnail": {
                "url": "https://i.imgur.com/QdnYTeA.png"
            },
            "fields": [
                {
                    "name": "Status",
                    "value": status_ids[status.Status],
                    "inline": true
                },
                {
                    "name": "Players",
                    "value": `${players.length} / ${status.MaxPlayers}`,
                    "inline": true
                },
                {
                    "name": "Current Map",
                    "value": mode ? `${map} - ${mode}` : map,
                    "inline": true
                }
            ],
            "timestamp": Date.now(),
            "footer": {
                "text": "SWBF2Admin"
            }
        }
    
        for (var team in teams) {
            var team_players = players.filter(p => p.Team == team)
            if (team_players.length) {
                embed.fields.push({
                    "name": teams[team],
                    "value": team_players.map(p => `\`${p.Name}\` - ${p.Score} Points`),
                    "inline": true
                })
            }
        }
    
        return embed
    }

    async updateStatuses() {
        var statuses = this.client.provider.get('global', 'statuses', [])
        for (var i = 0; i < statuses.length; i++) {
            try {
                var server = this.client.servers[statuses[i].server]
                var embed = await this.createStatus(server)
                var channel = this.client.channels.cache.get(statuses[i].channel)
                if (statuses[i].message) {
                    await (await channel.messages.fetch(statuses[i].message)).edit({embed})
                } else {
                    statuses[i].message = (await channel.send({embed})).id
                }
            } catch (e) {
                console.error(`Error updating status for ${server.name}: ${e.message}`)
            }
        }
        this.client.provider.set('global', 'statuses', statuses)
    }
    
    createServerList(servers) {
        servers.forEach(s => s.fgd_str_host_name = s.fgd_str_host_name.replace(/[^\x20-\x7F]/g, "").replace("discord.gg", "discord(.)gg").slice(0,32).trim())
        servers = servers.sort((a,b) => parseInt(b.fgd_int_numPlayers) - parseInt(a.fgd_int_numPlayers) || a.fgd_str_host_name.localeCompare(b.fgd_str_host_name))
        servers = servers.map(s => [s.fgd_str_host_name, `${s.fgd_int_numPlayers} / ${s.fgd_int_netPlayerLimit}`, ...parseMap(s.fgd_str_map_name), s.fgd_bool_has_password == "1" ? "Yes" : "No"])
        servers.unshift(["Game Name", "In/Max", "Map", "Mode", "Era", "Pass"])
    
        var list = table.table(servers, {
            border: table.getBorderCharacters("norc"),
            drawHorizontalLine: (i,s) => i == 0 || i == 1 || i == s
        }).split("\n", servers.length + 3)
    
        return list
    }

    async updateServerList() {
        var server_list = this.client.provider.get('global', 'server_list', {})
        if (server_list.channel) {
            try {
                var channel = this.client.channels.cache.get(server_list.channel)

                for (var message of server_list.messages) {
                    await (await channel.messages.fetch(message)).delete()
                }
                server_list.messages = []
                    
                var servers = await this.client.galaxy.getServers()
                servers = servers.items.map(s => s.matchmaking)
                servers = servers.filter(s => s.fgd_str_map_name.endsWith("eli")) //Hero Assault
    
                var list = this.createServerList(servers)
    
                for (var i = 0; i < list.length; i += 20) {
                    server_list.messages.push((await channel.send(`\`\`\`${list.slice(i, i + 20).join("\n")}\`\`\``)).id)
                }
            } catch (e) {
                console.error(e.stack)
            }
        }
        this.client.provider.set('global', 'server_list', server_list)
    }

    async restartServers() {
        var servers = await this.client.galaxy.getServers()
        servers = servers.items.map(s => s.matchmaking.fgd_str_host_name)
        for (var server of this.client.servers) {
            try {
                var name = (await server.getStatus()).ServerName
            } catch (e) {
                console.error(`Error retrieving status for ${server.name}: ${e.message}`)
                continue
            }

            if (!servers.includes(name)) {
                var players = await server.getPlayers()
                if (!players.length) {
                    await server.restartServer()
                    var log_channel = this.client.provider.get('global', 'logs')
                    if (log_channel) {
                        var channel = this.client.channels.cache.get(log_channel)
                        await channel.send(`Server offline for 5 minutes. Restarting ${name.trim()}`)
                    }
                    console.log(`Server offline for 5 minutes. Restarting ${name.trim()}`)
                }
            }
        }
    }
}

module.exports = Status