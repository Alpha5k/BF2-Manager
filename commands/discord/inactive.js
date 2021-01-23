const commando = require('discord.js-commando')

module.exports = class InactiveCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'inactive',
            memberName: 'inactive',
            group: 'discord',
            description: 'Remove Scrimmer Role',
            args: []
        })
    }

    async run(msg, args) {
        var activeRole = msg.guild.roles.cache.find(r => r.name == "Scrimmer")
        var freeplayRole = msg.guild.roles.cache.find(r => r.name == "Freeplay")

        if (msg.member.roles.cache.has(activeRole.id)) {
            msg.member.roles.remove(activeRole)
            msg.react("✅")
        }
        if (msg.member.roles.cache.has(freeplayRole.id)) {
            msg.member.roles.remove(freeplayRole)
        }
    }
}