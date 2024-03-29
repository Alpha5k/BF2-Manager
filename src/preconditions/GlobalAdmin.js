const {Precondition} = require('@sapphire/framework')
const {isAdmin} = require('../utils.js')

class GlobalAdminPrecondition extends Precondition {
    async chatInputRun(interaction) {
        if (await isAdmin(interaction)) {
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
    GlobalAdminPrecondition
}