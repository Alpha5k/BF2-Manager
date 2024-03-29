const {Precondition} = require('@sapphire/framework')
const {isOwner} = require('../utils.js')

class OwnerPrecondition extends Precondition {
    async chatInputRun(interaction) {
        if (await isOwner(interaction)) {
            return this.ok()
        } else {
            return this.error({
                message: 'You do not have permission to use this command.',
                context: {silent: false}
            })
        }
    }
}

module.exports = {
    OwnerPrecondition
}