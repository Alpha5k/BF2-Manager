const commando = require('discord.js-commando')

module.exports = class ActiveCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'active',
            memberName: 'active',
            group: 'discord',
            aliases: ['scrimmer'],
            description: 'Assign Scrimmer Role',
            args: []
        })
    }

    async run(msg, args) {
        var activeRole = msg.guild.roles.cache.find(r => r.name == "Scrimmer")
        var inactiveRole = msg.guild.roles.cache.find(r => r.name == "Non Scrimmer")

        if (inactiveRole) {
            msg.member.roles.remove(inactiveRole)
        }

        msg.member.roles.add(activeRole)
        msg.react("✅")
    }
}