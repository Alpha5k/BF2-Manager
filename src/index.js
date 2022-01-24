const {container, LogLevel, SapphireClient} = require('@sapphire/framework')
const {updateStatusEmbeds, updateServerList, restartServers, bridgeChats} = require('./tick.js')

const {JsonDB} = require('node-json-db')
const {Config} = require('node-json-db/dist/lib/JsonDBConfig')

const config = require('../config.json')

class ManagerClient extends SapphireClient {
    constructor() {
        super({
            intents: ['GUILDS', 'GUILD_MESSAGES'],
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

setTimeout(() => updateStatusEmbeds(), 30000)
setTimeout(() => updateServerList(), 30000)
setTimeout(() => restartServers(), 300000)

setTimeout(() => bridgeChats(), 30000)