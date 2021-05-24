/* eslint-disable no-console */
const commando = require('discord.js-commando')
const path = require('path')
const sqlite = require('sqlite')
const sqlite3 = require('sqlite3')

const WebAdmin = require('./webadmin.js')
const Galaxy = require('./galaxy.js')
const Status = require('./status.js')

const servers = require('./servers.json')
const config = require('./config.json')

const client = new commando.Client({
	owner: config.owner,
	commandPrefix: config.prefix,
    intents: 13824
})

client.on('error', console.error)
client.on('warn', console.warn)
client.on('debug', console.log)
client.on('ready', () => console.log(`Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`))
client.on('disconnect', () => console.warn('Disconnected!'))
client.on('reconnecting', () => console.warn('Reconnecting...'))

client.setProvider(sqlite.open({'filename': './database.sqlite3', driver: sqlite3.Database}).then(db => new commando.SQLiteProvider(db)))

client.registry.registerDefaultTypes()
client.registry.registerDefaultGroups()
client.registry.registerDefaultCommands({unknownCommand: false})
client.registry.registerGroup('swbf2', 'SWBF2')
client.registry.registerGroup('discord', 'Discord')
client.registry.registerCommandsIn(path.join(__dirname, 'commands'));

client.servers = servers.map(s => new WebAdmin(...Object.values(s)))
client.galaxy = new Galaxy(config.steam_ticket)
client.status = new Status(client)

client.login(config.discord_token)