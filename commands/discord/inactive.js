const commando = require('discord.js-commando')

module.exports = class InactiveCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'inactive',
            memberName: 'inactive',
            group: 'discord',
            description: 'Assign Non-Scrimmer Role',
            args: []
        })
    }

    async run(msg, args) {
        var activeRole = msg.guild.roles.cache.find(r => r.name == "Scrimmer")
        var inactiveRole = msg.guild.roles.cache.find(r => r.name == "Non Scrimmer")
        var freeplayRole = msg.guild.roles.cache.find(r => r.name == "Freeplay")

        if (msg.member.roles.cache.has(activeRole.id)) {
            msg.member.roles.remove(activeRole)
        }
        if (msg.member.roles.cache.has(freeplayRole.id)) {
            msg.member.roles.remove(freeplayRole)
        }
        if (!msg.member.roles.cache.has(inactiveRole.id)) {
            msg.member.roles.add(inactiveRole)
            msg.react("✅")
        }
    }
}