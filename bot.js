/* eslint-disable no-console */
const commando = require('discord.js-commando');
const path = require('path');
const sqlite = require('sqlite');
const sqlite3 = require('sqlite3')
const token = require('./auth.json').token;

const WebAdmin = require('./webadmin.js')
const Galaxy = require('./galaxy.js')
const Status = require('./status.js')

const servers = require('./servers.json')
const config = require('./config.json')

const client = new commando.Client({
	owner: config.owner,
	commandPrefix: config.prefix
})

client.on('error', console.error)
	.on('warn', console.warn)
	.on('debug', console.log)
	.on('ready', () => console.log(`Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`))
	.on('disconnect', () => console.warn('Disconnected!'))
	.on('reconnecting', () => console.warn('Reconnecting...'))

client.setProvider(
	sqlite.open({'filename': './database.sqlite3', driver: sqlite3.Database})
		.then(db => new commando.SQLiteProvider(db))
).catch(console.error);

client.registry
	.registerDefaultTypes()
    .registerDefaultGroups()
    .registerDefaultCommands({unknownCommand: false})
	.registerGroup('swbf2', 'SWBF2')
	.registerGroup('discord', 'Discord')
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.servers = servers.map(s => new WebAdmin(s.url, s.username, s.password))
client.galaxy = new Galaxy(config.steam_ticket)
client.status = new Status(client)

client.login(token)