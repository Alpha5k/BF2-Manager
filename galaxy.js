const fetch = require('node-fetch');

const CLIENT_ID = "48393168095086872"
const CLIENT_SECRET = "2eb6e8e813464e74a4854c94648b12f07c4a2e2446dfcac4bd83d782c580b31a"

class Galaxy {
    constructor(steam_ticket) {
        this.steam_ticket = steam_ticket
    }

    async refreshToken() {
        var response = await fetch(`https://auth.gog.com/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=steam_ticket&steam_ticket=${this.steam_ticket}`, {method: 'GET'})
        var response = await response.json()

        this.access_token = response.access_token
        this.token_expiration = new Date(Date.now() + (response.expires_in * 1000 / 2))
    }

    async getServers() {
        if (!this.access_token || new Date() >= this.token_expiration) {
            await this.refreshToken()
        }

        var response = await fetch(`https://multiplayer.gog.com/lobbies/matchmaking`, {
            method: 'POST',
            body: '{"filters":[{"key":"galaxy_lobby_cancelled","type":"ne","value":"1"}]}',
            headers: {
                'Authorization': `Bearer ${this.access_token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'User-Agent': 'GOGGalaxySDK/1.112.1.0 (Windows_32bit) GOGGalaxyMultiplayerProtocol/1'
            }
        })

        try {
            return await response.json()
        } catch (e) {
            console.error(`Error: ${e.message}`)
            return {items: {}}
        }
    }
}

module.exports = Galaxy