const { makecode } = require("../utils.js")

class Protocol {
    constructor(own_team, enemy_team, code_length) {
        this.own_round = new Round(true, code_length)
        this.own_team = own_team
        this.enemy_round = new Round(false, code_length)
        this.enemy_team = enemy_team
        this.strikes = 0
        this.points = 0
        this.own_words_used = {}
        this.opponent_words_used = {}

        this.code_length = code_length
    }  

    newRound(is_own) {
        if (is_own) {
            this.own_round = Round(is_own, this.code_length)
        } else {
            this.enemy_round = Round(is_own, this.code_length)
        }
    }

    addCommunication(words, is_own) {
        if (is_own) {
            this.own_round.addCommunication(words)
        } else {
            this.enemy_round.addCommunication(words)
        }
    }

    add_guess(guess, is_own) {
        if (is_own) {
                this.own_round.addInternalGuess(guess)
                this.own_round.aggreed_on_guess.internal = false
            } else {
            this.own_round.addOpponentGuess(guess)
            this.own_round.aggreed_on_guess.opponent = false
        }
        return {
            strikes: this.strikes,
            points: this.points,
        }
    }

    submit_own_guess() {
        this.strikes +=
            this.own_round.compareInternalGuess(this.own_words_used)
        return {
            strikes: this.strikes,
            points: this.points,
        }
    }

    receive_opponent_code() {
        opponent_code = this.enemy_round.shareCode(this.own_round.opponent_guess)
        this.points +=
            this.own_round.compareOpponentGuess(opponent_code, this.own_words_used)
        return {
            strikes: this.strikes,
            points: this.points,
        }
    } 

    toJSON() {
        let round = this.own_round.toJSON()
        round["opponent_communicated"] = this.enemy_round.communicated
        return {
            secret_words: this.own_team.secret_words,
            round: round,
            strikes: this.strikes,
            points: this.points,
            own_words_used: this.own_words_used,
            opponent_words_used: this.opponent_words_used,
        }
    }

}

class Round {
    constructor(is_own, code_length) {
        this.code = null
        if (is_own) {
            this.code = makecode(code_length)
        }
        this.communicated = []
        this.internal_guess = []
        this.opponent_guess = []
        this.what_opponent_thinks = []
    }

    shareCode(what_opponent_thinks) {
        if (this.what_opponent_thinks.length != 0) {
            return false // code has already been shared
        }
        this.what_opponent_thinks = what_opponent_thinks
        return this.code
    }

    addInternalGuess(guess) {
        this.internal_guess = guess
    }

    compareInternalGuess(used_words) {
        if (this.isCorrect(this.internal_guess, used_words))
            return 0 // no strike
        else
            return 1 // strike
    }

    addOpponentGuess(guess) {
        // assert this.code is unknown when guessing
        if (this.code != null) {
            return false
        }
        this.opponent_guess = guess
    }

    compareOpponentGuess(code, used_words) {
        if (this.opponent_guess.length == 0) {
            return false
        }
        this.code = code
        if (this.isCorrect(this.opponent_guess, used_words))
            return 1 // point
        else
            return 0 // no point
    }

    isCorrect(guess, used_words) {
        if (this.code == null) {
            return false
        }
        // check if this.code is equal to guess
        for (var i = 0; i < code.length; i++) {
            c = code[i]
            if (!used_words[c]) {
                used_words[c] = []
            }
            used_words[c].push(this.communicated[i])
        }

        if (this.code.length != guess.length) {
            return false
        }
        for (var i = 0; i < this.code.length; i++) {
            if (this.code[i] != guess[i]) {
                return false
            }
        }
        return true
    }

    toJSON() {
        return {
            code: this.code,
            communicated: this.communicated,
            internal_guess: this.internal_guess,
            opponent_guess: this.opponent_guess,
            what_opponent_thinks: this.what_opponent_thinks,
        }
    }
}

module.exports = Protocol