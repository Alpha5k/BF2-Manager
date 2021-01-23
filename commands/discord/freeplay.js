const commando = require('discord.js-commando')

module.exports = class ActiveCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'freeplay',
            memberName: 'freeplay',
            group: 'discord',
            description: 'Assign Freeplay Role',
            args: []
        })
    }

    async run(msg, args) {
        var freeplayRole = msg.guild.roles.cache.find(r => r.name == "Freeplay")

        if (!msg.member.roles.cache.has(freeplayRole.id)) {
            msg.member.roles.add(freeplayRole)
            msg.react("✅")
        }
    }
}