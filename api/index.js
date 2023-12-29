const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());


var games = {}
var players = {}



class Round {
    constructor(usedcodes1, usedcodes2) {
        var randomcode = makecode()
        while (usedcodes1.includes(randomcode) || usedcodes1.length >= 4 * 3 * 2) {
            this.code1 = randomcode
        }
        this.communicated1 = []
        this.understood1 = []
        this.guess1 = []

        randomcode = makecode()
        while (usedcodes2.includes(randomcode) || usedcodes2.length >= 4 * 3 * 2) {
            this.code1 = randomcode
        }

        this.communicated2 = []
        this.understood2 = []
        this.guess2 = []

    }
}


app.post('/createGame', (req, res) => {
    try {
        const player = players[req.body.userId]
        if (!player) {
            res.sendStatus(403)
            return
        }
        const newGame = new Game(player)
        games[newGame.id] = newGame
        res.send(newGame.toJSON())
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }

})

app.get('/game/:id', (req, res) => {
    try {
        const foundGame = games[req.params.id]
        res.send(foundGame.toJSON())
    } catch (err) {
        res.sendStatus(404)
    }
})

app.post('/createPlayer', (req, res) => {
    try {
        const newPlayer = new Player(req.body.name)
        players[newPlayer.id] = newPlayer
        res.send(newPlayer.toJSON())
    } catch (err) {
        res.sendStatus(500)
    }
})

app.get('/user/:id', (req, res) => {
    try {
        const foundPlayer = players[req.body.user]
        res.send(foundPlayer.toJSON())
    } catch (err) {
        res.sendStatus(404)
    }
})


app.post('/startGame', (req, res) => {
   console.log("startGame")
    try {
        const foundPlayer = players[req.body.user]
        const foundGame = games[req.body.game]
        if (foundPlayer && foundGame) {
            const team = foundGame.teamOfPlayerId(foundPlayer.id)
            if (team) {
                foundGame.startGame()
                res.send({ msg: "started" })
                return
            }
        }
        res.sendStatus(403)
    } catch (err) {
        res.sendStatus(500)
    }
})

app.post('/teamOf', (req, res) => {
    try {
        const foundPlayer = players[req.body.user]
        const foundGame = games[req.body.game]
        if (foundPlayer && foundGame) {
            const team = foundGame.teamOfPlayerId(foundPlayer.id)
            res.send({ team: team })
            return
        }
        res.sendStatus(404)
    } catch (err) {
        res.sendStatus(500)
    }
})

app.post('/wordsFor', (req, res) => {
    try {
        const foundPlayer = players[req.body.user]
        const foundGame = games[req.body.game]
        if (foundPlayer && foundGame) {
            const words = foundGame.wordsForPlayerId(foundPlayer.id)
            res.send({ words: words })
            return
        }
        res.sendStatus(404)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

app.post('/joinTeam', (req, res) => {
    try {
        const myGame = games[req.body.game]
        const player = players[req.body.user]
        var tooFull = false
        if (req.body.team == 1) {
            tooFull = myGame.team1.addMember(player)
        } else if (req.body.team == 2) {
            tooFull = myGame.team2.addMember(player)
        }
        if (tooFull) {
            res.send({ "msg": "team is already full" })
            return
        }
        //need to be send with toJSON to ensure words are hidden
        res.send(myGame.toJSON())
    } catch (err) {
        res.sendStatus(500)
    }
})

app.post('/leaveTeam', (req, res) => {
    try {
        const myGame = games[req.body.game]
        const player = players[req.body.user]
        var didLeave = false
        if (req.body.team == 1) {
            didLeave = myGame.team1.leaveTeam(player)
        } else if (req.body.team == 2) {
            didLeave = myGame.team2.leaveTeam(player)
        }
        if (!didLeave) {
            res.send({ "msg": "leaving failed" })
            return
        }
        res.send(myGame.toJSON())
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

class Game {
    constructor(player) {
        this.id = makeid(8)
        this.team1 = new Team()
        this.team1.addMember(player)
        this.team2 = new Team()

        this.winner = false
        this.started = false

        this.rounds = []
    }
    //while users can change teams, the words need to be undecided
    startGame() {
        this.started = true
        this.team1.words = generateRandomWords()
        this.team2.words = generateRandomWords()
    }

    isWon() {
        if (this.team1.points >= 2 && this.team2.points < this.team1.points) {
            this.winner = "team1"
            return true
        }
        if (this.team2.points >= 2 && this.team1.points < this.team2.points) {
            this.winner = "team2"
            return true
        }
        if (this.team1.strikes >= 2 && this.team2.strikes < this.team1.strikes) {
            this.winner = "team2"
            return true
        }
        if (this.team2.strikes >= 2 && this.team1.strikes < this.team2.strikes) {
            this.winner = "team1"
            return true
        }
        return false
    }

    toJSON() {
        this.isWon()
        return {
            id: this.id,
            team1: this.team1.toJSON(),
            team2: this.team2.toJSON(),
            winner: this.winner,
            started: this.started,
        }
    }

    wordsForPlayerId(playerId) {
        const team = this.teamOfPlayerId(playerId);
        if (!team) return false;
        return this.wordsForTeam(team)
    }

    wordsForTeam(team) {

        if (team == 1 || team == "team1") {
            return this.team1.words
        }

        if (team == 2 || team == "team2") {
            return this.team2.words
        }

        return false
    }

    teamOfPlayerId(playerId) {
        for (var player of this.team1.members) {
            if (player.id == playerId) {
                player.tracker(this.id, 1)
                return "1"
            }
        }
        for (var player of this.team2.members) {
            if (player.id == playerId) {
                player.tracker(this.id, 2)
                return "2"
            }
        }
        
        return false
    }
}

class Team {
    constructor() {
        this.members = []
        this.points = 0
        this.strikes = 0
        this.usedcodes = []
        this.words = []
    }

    addMember(player) {
        if (this.started)
            return false
        if (this.members.length < 2) {
            this.members.push(player)
            return false
        }
        return true
    }

    leaveTeam(player) {
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

    toJSON() {
        return {
            points: this.points,
            strikes: this.strikes,
            players: this.members.map((member) => member.name),
            usedcodes: this.usedcodes,
        }
    }
}

app.get('/login', (req, res) => {
    var ply = getPlayerById(req.body.id)
    if (!ply)
        res.send({ msg: "no player found for id" })
    res.send(ply.toJSON())
})


class Player {
    constructor(name) {
        this.name = name
        this.id = makeid(24)
        this.remover = null
    }

    changeName(newName) {
        this.name = newName
    }

    tracker(gameId, team) {
        clearTimeout(this.remover)
        var me = this
        this.remover = setTimeout(function () {
            try {
                if(team == 1)
                    games[gameId].team1.leaveTeam(me)
                if(team == 2)
                    games[gameId].team2.leaveTeam(me)
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





function makeid(length) {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() *
            characters.length)));
    }
    return result.join('');
}

function makecode(length = 3) {
    var characters = '1234';
    var length = min(length, characters.length)
    var result = [];
    for (var i = 0; i < length; i++) {
        var index = Math.floor(Math.random() *
            characters.length)
        result.push(characters.charAt(index));
        characters.splice(index, 1)

    }
    return result
}

function generateRandomWords(length = 4) {
    var result = [];
    var words = ["Pferd", "Blau", "Blut", "Eule", "Krone", "Stuhl", "Wissenschaft", "Comic", "Schnurrbart", "Nacht", "Wagen", "Trommel", "Golf", "Keks"];
    for (var i = 0; i < length; i++) {
        result.push(words[Math.floor(Math.random() *
            words.length)]);
    }
    return result;
}


const port = 1234
app.listen(port, () => console.log('Decrypto API is running on port: ' + port));

