const fetch = require('node-fetch');
const {decode} = require('html-entities');

const servers = require('../servers.json')

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class WebAdmin {
    constructor(name, url, username, password, restart = true) {
        this.name = name
        this.url = url
        this.auth = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
        this.restart = restart
    }

    async getStatus() {
        var status = await fetch(`${this.url}/live/dashboard`, {
            method: 'POST',
            body: "{'action': 'status_get'}",
            headers: {'Authorization': this.auth}
        })
        status = await status.json()
        status.ServerName = decode(status.ServerName)
        if (status.ServerName == " - ") {
            status.ServerName = this.name
            status.CurrentMap = null
            status.MaxPlayers = 0
        }
        return status
    }

    async getPlayers() {
        var players = await fetch(`${this.url}/live/players`, {
            method: 'POST',
            body: "{'Action': 'players_update'}",
            headers: {'Authorization': this.auth}
        })
        players = await players.json()
        players.forEach(p => p.Name = decode(p.Name))
        return players
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
            body: `{'Action': 'chat_send', 'Message': '${msg}'}`,
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
            body: `{'Action': 'players_kick', 'PlayerId': ${id}}`,
            headers: {'Authorization': this.auth}
        })
        return await response.json()
    }

    async banPlayer(id) {
        var response = await fetch (`${this.url}/live/players`, {
            method: 'POST',
            body: `{'Action': 'players_ban', 'BanDuration': -1, 'BanTypeId': '0', 'PlayerId': ${id}}`,
            headers: {'Authorization': this.auth}
        })
        return await response.json()
    }

    async swapPlayer(id) {
        var response = await fetch (`${this.url}/live/players`, {
            method: 'POST',
            body: `{'Action': 'players_swap', 'PlayerId': ${id}}`,
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

var clients = servers.map(s => new WebAdmin(s.name, s.url, s.username, s.password, s.restart))

module.exports = clients