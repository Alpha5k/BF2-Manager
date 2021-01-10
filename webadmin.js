const fetch = require('node-fetch');

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class WebAdmin {
    constructor(name, url, username, password) {
        this.name = name
        this.url = url
        this.auth = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
    }

    async getStatus() {
        var status = await fetch(`${this.url}/live/dashboard`, {
            method: 'POST',
            body: "{'action': 'status_get'}",
            headers: {'Authorization': this.auth}
        })
        return await status.json()
    }

    async getPlayers() {
        var players = await fetch(`${this.url}/live/players`, {
            method: 'POST',
            body: "{'Action': 'players_update'}",
            headers: {'Authorization': this.auth}
        })
        return await players.json()
    }

    async getChat() {
        var chat = await fetch(`${this.url}/live/chat`, {
            method: 'POST',
            body: "{'Action': 'chat_update'}",
            headers: {'Authorization': this.auth, 'cookie': this.cookie}
        })
        if (!this.cookie) {
            this.cookie = chat.headers.raw()['set-cookie']
        }
        return await chat.json()
    }

    async sendChat(msg) {
        var chat = await fetch (`${this.url}/live/chat`, {
            method: 'POST',
            body: `{'Action':'chat_send', 'Message':'${msg}'}`,
            headers: {'Authorization': this.auth, 'cookie': this.cookie}
        })
        if (!this.cookie) {
            this.cookie = chat.headers.raw()['set-cookie']
        }
        return await chat.json()
    }

    async kickPlayer(id) {
        var response = await fetch (`${this.url}/live/players`, {
            method: 'POST',
            body: `{'Action':'players_kick', 'PlayerId':${id}}`,
            headers: {'Authorization': this.auth}
        })
        return await response.json()
    }

    async banPlayer(id) {
        var response = await fetch (`${this.url}/live/players`, {
            method: 'POST',
            body: `{'Action':'players_ban', 'BanDuration':-1, 'BanTypeId':'0', 'PlayerId':${id}}`,
            headers: {'Authorization': this.auth}
        })
        return await response.json()
    }

    async swapPlayer(id) {
        var response = await fetch (`${this.url}/live/players`, {
            method: 'POST',
            body: `{'Action':'players_swap', 'PlayerId':${id}}`,
            headers: {'Authorization': this.auth}
        })
        return await response.json()
    }

    async stopServer() {
        await fetch(`${this.url}/live/dashboard`, {
            method: 'POST',
            body: "{'action': 'status_set', 'NewStatusId': 1}",
            headers: {'Authorization': this.auth}
        })
    }

    async startServer() {
        await fetch(`${this.url}/live/dashboard`, {
            method: 'POST',
            body: "{'action': 'status_set', 'NewStatusId': 0}",
            headers: {'Authorization': this.auth}
        })
    }

    async restartServer() {
        await this.stopServer()
        await timeout(5000)
        await this.startServer()
    }
}

module.exports = WebAdmin