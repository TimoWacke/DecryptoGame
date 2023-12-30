const Protocol = require('./protocolClass')
const { generateWords } = require('../utils')

class Team {
    constructor(game, id) {
        this.id = id
        this.game = game
        this.members = []
        this.secret_words = []
        this.words_length = game.words_length
        
        this.current_author = 0
        this.aggreed_on_guess = {
            internal: false,
            opponent: false,
        }

        this.players_aggreed = {
            internal: [],
            opponent: [],
        }
    }

    initOpponent() {
        this.opponent = this.game.teams[(this.id + 1) % 2]
        this.protocol = new Protocol(this, this.opponent, this.words_length)
    }

    didAllPlayersAggree(is_own) {
        agreed_list = is_own ? this.players_aggreed.internal : this.players_aggreed.opponent
        if (agreed_list.length != this.members.length) {
            return false
        }
        for (var i = 0; i < this.members.length; i++) {
            if (!agreed_list.includes(this.members[i].id)) {
                return false
            }
        }
        if (is_own) {
            this.aggreed_on_guess.internal = true
            result = this.protocol.submit_own_guess()
            this.game.scoreboard.update(this.id, { result })
        }
        else {
            this.aggreed_on_guess.opponent = true
            result = this.protocol.receive_opponent_code()
            this.game.scoreboard.update(this.id, { result })
        }
        
    }

    isRoundFinished() {
        if (this.aggreed_on_guess.internal && this.aggreed_on_guess.opponent) {
            this.protocol.newRound()
        }
    }

    playerAggreed(playerId, is_own) {
        if (is_own) {
            if (!this.players_aggreed.internal.includes(playerId)) {            
                this.players_aggreed.internal.push(playerId)
                this.allPlayersAggreed(is_own)
            }
        } else {
            if (!this.players_aggreed.opponent.includes(playerId)) {
                this.players_aggreed.opponent.push(playerId)
                this.allPlayersAggreed(is_own)
            }
        }
    }

    newRound() {
        this.protocol.newRound()
        this.aggreed_on_guess.internal = false
        this.aggreed_on_guess.opponent = false
        this.current_author = (this.current_author + 1) % 2
    }

    getCurrentAuthor() {
        return this.members[this.current_author]
    }

    addOwnCommunication(words) {
        this.protocol.addCommunication(words, true)
        this.opponent.addOpponentCommunication(words)
    }

    addOpponentCommunication(words) {
        this.protocol.addCommunication(words, false)
    }

    addMember(player) {
        if (this.started)
            return false
        if (this.members.length < 5) {
            this.members.push(player)
            return true
        }
        return false
    }

    removeMember(player) {
        if (this.started)
            return false
        for (var m in this.members) {
            if (player.id == this.members[m].id) {
                this.members.splice(m, 1)
                return true
            }
        }
        return false
    }

    generateWords() {
        this.secret_words = []
        for (var i = 0; i < this.words_length; i++) {
            this.secret_words.push(makecode())
        }
    }

    toJSON() {
        return {
            players: this.members.map((member) => member.name),
        }
    }
}

module.exports = Team