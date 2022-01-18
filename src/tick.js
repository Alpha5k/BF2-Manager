const {container} = require('@sapphire/framework');
const {createStatusEmbed, createServerTable} = require('./utils.js')

const GOG = require('./galaxy.js')
const servers = require('./webadmin.js')

const config = require('../config.json')

async function updateStatusEmbeds() {
    try {
        var channel_id = container.db.getData("/channels/status")
        var channel = container.client.channels.cache.get(channel_id)
    } catch (e) {
        return
    }

    try {
        var message_ids = container.db.getData("/messages/status")
    } catch (e) {
        var message_ids = []
    }

    for (var i = 0; i < servers.length; i++) {
        var server = servers[i]
        var message_id = message_ids.find(m => m.server == i).id

        try {
            var embed = await createStatusEmbed(server)
    
            if (message_id) {
                var message = await channel.messages.fetch(message_id)
                await message.edit({embeds: [embed]})
            } else {
                var {id} = await channel.send({embeds: [embed]})
                container.db.push("/messages/status[]", {id, server: i})
            }
        } catch (e) {
            console.error(`Error updating status message for ${server.name}: ${e.message}`)
        }
    }
}

async function updateServerList() {
    try {
        var channel_id = container.db.getData("/channels/server_list")
        var channel = container.client.channels.cache.get(channel_id)
    } catch (e) {
        return
    }

    try {
        var server_list = await GOG.getServers()
        server_list = server_list.items.map(s => s.matchmaking)
        server_list = server_list.filter(s => s.fgd_str_map_name.endsWith("eli")) //Hero Assault

        var table = createServerTable(server_list)

        try {
            var message_id = container.db.getData("/messages/server_list")
            var message = await channel.messages.fetch(message_id)
        } catch (e) {
            var message = null
        }

        if (message) {
            await message.edit("```" + table + "```")
        } else {
            var {id} = await channel.send("```" + table + "```")
            container.db.push("/messages/server_list", id)
        }
    } catch (e) {
        console.error(`Error updating server list message: ${e.message}`)
    }
}

async function restartServers() {
    var server_list = await GOG.getServers()
    server_list = server_list.items.map(s => s.matchmaking.fgd_str_host_name)

    for (var server of servers) {
        try {
            var server_name = (await server.getStatus()).ServerName
        } catch (e) {
            console.error(`Error retrieving status for ${server.name}: ${e.message}`)
            continue
        }

        if (!server_list.includes(server_name)) {
            var players = await server.getPlayers()
            if (!players.length) {
                await server.restartServer()

                try {
                    var channel_id = container.db.getData("/channels/logs")
                    var channel = container.client.channels.cache.get(channel_id)
                    await channel.send(`Server offline for 5 minutes. Restarting ${server_name.trim()}`)
                } catch (e) {
                    continue
                }

                console.log(`Server offline for 5 minutes. Restarting ${server_name.trim()}`)
            }
        }
    }
}

function formatMessage(chat) {
    var date = new Date()
    var time = date.toLocaleTimeString('en-US', {hour12: false, timeZoneName: 'short'})
    return "```" + `[${time}] ${chat.PlayerName}: ${chat.Message}` + "```"
}

async function bridgeChats() {
    try {
        var channels = container.db.getData("/channels/chat")
    } catch (e) {
        var channels = []
    }

    for (var {server, channel} of channels) {
        try {
            server = servers[server]
            channel = container.client.channels.cache.get(channel)
    
            var chats = await server.getChat()
            for (var chat of chats) {
                if (chat.IsSystem) continue
                await channel.send(formatMessage(chat))
            }
        } catch (e) {
            continue
        }
    }

    setTimeout(bridgeChats, config.chat_update || 1000)
}

module.exports = {
    updateStatusEmbeds,
    updateServerList,
    restartServers,
    bridgeChats
}