const commando = require('discord.js-commando')

module.exports = class ActiveCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'inactive',
            memberName: 'inactive',
            group: 'discord',
            description: 'Remove Freeplay Role',
            args: []
        })
    }

    async run(msg, args) {
        var freeplayRole = msg.guild.roles.cache.find(r => r.name == "Freeplay")

        if (msg.member.roles.cache.has(freeplayRole.id)) {
            msg.member.roles.remove(freeplayRole)
            msg.react("✅")
        }
    }
}