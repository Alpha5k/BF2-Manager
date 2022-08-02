const {container} = require('@sapphire/framework')
const table = require('table')

const config = require('../config.json')

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

async function createStatusEmbed(server) {
    try {
        var status = await server.getStatus()
        var players = await server.getPlayers()
    } catch (e) {
        console.error(`Error retrieving status for ${server.name}: ${e.message}`)
        var status = {ServerName: server.name, Status: 1, MaxPlayers: 0}
        var players = []
    }

    var [map, mode] = parseMap(status.CurrentMap)

    var embed = {
        "color": 10921638,
        "title": status.ServerName.trim(),
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
            var player_list = team_players.map(p => `\`${p.Name}\` - ${Math.floor(p.Score / 2)} Kills`)
            embed.fields.push({
                "name": teams[team],
                "value": player_list.join("\n"),
                "inline": true
            })
        }
    }

    return embed
}

function createServerTable(servers) {
    servers.forEach(s => s.fgd_str_host_name = s.fgd_str_host_name.replace(/[^\x20-\x7F]/g, "").replace("discord.gg", "discord(.)gg").slice(0,32).trim())
    servers.sort((a,b) => parseInt(b.fgd_int_numPlayers) - parseInt(a.fgd_int_numPlayers) || a.fgd_str_host_name.localeCompare(b.fgd_str_host_name))

    var server_list = servers.map(s => [
        s.fgd_str_host_name,
        `${s.fgd_int_numPlayers} / ${s.fgd_int_netPlayerLimit}`,
        ...parseMap(s.fgd_str_map_name),
        s.fgd_bool_has_password == "1" ? "Yes" : "No"
    ])
    server_list.unshift(["Game Name", "In/Max", "Map", "Mode", "Era", "Pass"])

    var server_table = table.table(server_list, {
        border: table.getBorderCharacters("norc"),
        drawHorizontalLine: (i,s) => i == 0 || i == 1 || i == s
    })

    return server_table
}

function createPlayerTable(players) {
    players = players.map(p => [p.Slot, p.Name, teams[p.Team], p.Score, p.Kills, p.Deaths, p.Ping])
    players.unshift(["Slot", "Name", "Team", "Score", "Kills", "Deaths", "Ping"])

    var player_table = table.table(players, {
        border: table.getBorderCharacters("norc"),
        drawHorizontalLine: (i,s) => i == 0 || i == 1 || i == s
    })

    return player_table
}

function isOwner(interaction) {
    return interaction.user.id == config.owner
}

function isGlobalAdmin(interaction) {
    var roles = interaction.member.roles.cache
    var global_admins = container.db.getData("/global_admins")
    return roles.some(r => global_admins.includes(r.id))
}

function isServerAdmin(interaction, server) {
    var roles = interaction.member.roles.cache
    var server_admins = container.db.filter("/server_admins", (a) => a.server == server).map(a => a.role)
    return roles.some(r => server_admins.includes(r.id))
}

function isAdmin(interaction, server) {
    if (server != null) {
        return isOwner(interaction) || isGlobalAdmin(interaction) || isServerAdmin(interaction, server)
    }

    return isOwner(interaction) || isGlobalAdmin(interaction)
}

module.exports = {
    createStatusEmbed,
    createServerTable,
    createPlayerTable,
    isOwner,
    isAdmin,
    isGlobalAdmin
}