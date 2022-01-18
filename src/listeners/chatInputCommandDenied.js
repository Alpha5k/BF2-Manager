const {Listener} = require('@sapphire/framework')

class CommandDeniedListener extends Listener {
    run(error, {interaction}) {
        if (error.context.silent) return
        return interaction.reply({content: error.message, ephemeral: true})
    }
}

module.exports = {
    CommandDeniedListener
}