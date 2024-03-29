const Team = require('./teamClass')
const ScoreBoard = require('./scoreBoardClass')
const { makeid } = require('../utils')

class Game {
    constructor(player) {
        this.id = makeid(4)
        this.teams = [new Team(this, 0), new Team(this, 1)]
        this.teams[0].initOpponent()
        this.teams[1].initOpponent()
        this.teams[0].addMember(player)

        this.winner = null
        this.started = false

        this.words_length = 4
        this.code_length = 3

        this.scoreBoard = new ScoreBoard()
    }
    //while users can change teams, the words need to be undecided
    startGame() {
        this.started = true
    }

    newRound() {
        this.team1.newRound()
        this.team2.newRound()
    }

    getProtocolForPlayerId(playerId) {
        const team = this.teamOfPlayerId(playerId);
        if (!team) return false;
        let protocol = team.protocol.toJSON()
        // if code is not shared yet, drop it
        if (playerId != team.members[team.current_author].id && team.aggreed_on_guess.internal) {
            // drop protocol.code
            protocol.code = null
        }
        return protocol
    }

    addOwnCommunicationForPlayerId(playerId, words) {
        const team = this.teamOfPlayerId(playerId);
        if (!team) return false;
        if (team.current_author.id != playerId) return false;
        this.addOwnCommunicationForTeam(team, words)
    }

    addOpponentCommunicationForPlayerId(playerId, words) {
        const team = this.teamOfPlayerId(playerId);
        if (!team) return false;
        team.addOpponentCommunication(words)
    }


    isWon() {
        if (this.teams[0].points >= 2 && this.teams[1].points < this.teams[0].points) {
            this.winner = "team1"
            return true
        }
        if (this.teams[1].points >= 2 && this.teams[0].points < this.teams[1].points) {
            this.winner = "team2"
            return true
        }
        if (this.teams[0].strikes >= 2 && this.teams[1].strikes < this.teams[0].strikes) {
            this.winner = "team2"
            return true
        }
        if (this.teams[1].strikes >= 2 && this.teams[0].strikes < this.teams[1].strikes) {
            this.winner = "team1"
            return true
        }
        return false
    }

    toJSON(playerId = null) {
        this.isWon()
        if (playerId == null || !this.started || this.winner)
            return {
                id: this.id,
                team1: this.teams[0].toJSON(),
                team2: this.teams[1].toJSON(),
                winner: this.winner,
                started: this.started,
            }
        let your_team = this.teamOfPlayerId(playerId)
        console.log("your team:", your_team)
        let enemy_team_id = your_team.id == 0 ? 1 : 0
        return {
            id: this.id,
            your_team: your_team.toJSON(),
            enemy_team: this.teams[enemy_team_id].toJSON(),
            protocol: playerId != null ? (this.getProtocolForPlayerId(playerId)) : null,
            winner: this.winner,
            started: this.started,
        }
    }

    wordsForPlayerId(playerId) {
        const team = this.teamOfPlayerId(playerId);
        if (!team) return false;
        return team.secret_words
    }

    teamOfPlayerId(playerId) {
        for (var team of this.teams) {
            for (var member of team.members) {
                if (member.id == playerId) {
                    return team
                }
            }
        }
        return null
    }
}

// export the class
module.exports = Game