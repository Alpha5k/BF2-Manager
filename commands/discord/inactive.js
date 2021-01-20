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

        if (activeRole) {
            msg.member.roles.remove(inactiveRole)
        }

        msg.member.roles.add(inactiveRole)
        msg.react("✅")
    }
}