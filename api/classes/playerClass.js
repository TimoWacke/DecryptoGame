const { makeid } = require("../utils")
const { games } = require("../services/storage")

class Player {
    constructor(name) {
        this.name = name
        this.id = makeid(24)
        this.remover = null
    }

    changeName(newName) {
        this.name = newName
    }

    inactivityRemover(gameId, team) {
        clearTimeout(this.remover)
        var me = this
        this.remover = setTimeout(function () {
            try {
                games.get(gameId).teams[team].removeMember(me.id)
            } catch {}
        }, 10000)
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name
        }
    }
}

module.exports = Player