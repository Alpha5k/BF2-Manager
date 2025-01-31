const {container, LogLevel, SapphireClient} = require('@sapphire/framework')
const {GatewayIntentBits} = require('discord.js')
const {updateStatusEmbeds, sendServerPings, updateServerList, restartServers, bridgeChats} = require('./tick.js')

const {JsonDB} = require('node-json-db')
const {Config} = require('node-json-db/dist/lib/JsonDBConfig')

const config = require('../config.json')

class ManagerClient extends SapphireClient {
    constructor() {
        super({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
            logger: {level: LogLevel.Debug}
        })
    }
  
    async login(token) {
        container.default_guild = config.guild

        container.db = new JsonDB(new Config("db.json", true))
        container.db.load()
        
        return super.login(token)
    }
  
    async destroy() {
        container.db.save()

        return super.destroy()
    }
}

const client = new ManagerClient()

client.login(config.discord_token)

setTimeout(() => {
    //updateStatusEmbeds - 60 seconds
    setInterval(() => updateStatusEmbeds("gog"), 60000)
    setInterval(() => updateStatusEmbeds("cc"), 60000)

    //sendServerPings - 60 seconds
    setInterval(() => sendServerPings(), 60000)

    //updateServerList - 30 seconds
    setInterval(() => updateServerList(), 30000)
    //restartServers - 5 minutes
    setInterval(() => restartServers(), 300000)

    //bridgeChats - 60 seconds (default)
    setInterval(() => bridgeChats(), config.chat_update)
}, 30000)