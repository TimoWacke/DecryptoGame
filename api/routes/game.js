/*
    router file for /game using express and router (module.exports = router)
    - createGame
    - getGame
    - joinGame
    - startGame
*/

const express = require('express')
const router = express.Router()
const { players, games } = require('../services/storage')

// import classes
const Game = require('../classes/gameClass')

router.post('/create', (req, res) => {
    try {
        const player = players.get(req.body.userId)
        if (!player) {
            res.sendStatus(403)
            return
        }
        const newGame = new Game(player)
        games.set(newGame.id, newGame)
        res.send(newGame.toJSON(req.body.userId))
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

router.post('/info/:id', (req, res) => {
    try {
        const foundGame = games.get(req.params.id)
        if (foundGame) {
            if (req.body.user) {
                res.send(foundGame.toJSON(req.body.user))
            } else {
                res.send(foundGame.toJSON())
            }
            return
        }
        res.sendStatus(404)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

router.post('/start', (req, res) => {
     try {
         const foundPlayer = players.get(req.body.user)
         const foundGame = games.get(req.body.game)
         if (foundPlayer && foundGame) {
            console.log("start game:", foundGame.id)
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

router.post('/join', (req, res) => {
    try {
        const myGame = games.get(req.body.game)
        const player = players.get(req.body.user)
        if (req.body.team != 0 && req.body.team != 1) {
            res.sendStatus(400)
            return
        }
        let didJoin = myGame.teams[req.body.team].addMember(player)
        console.log("join game:", myGame.id)
        if (!didJoin) {
            res.send({ "msg": "team is already full" })
            return
        }
        //need to be send with toJSON to ensure words are hidden
        res.send(myGame.toJSON())
    } catch (err) {
        res.sendStatus(500)
    }
})

router.post('/leave', (req, res) => {
    try {
        const myGame = games.get(req.body.game)
        const player = players.get(req.body.user)
        var didLeave = false
        
        if (req.body.team != 0 && req.body.team != 1) {
            res.sendStatus(500)
            return
        }

        didLeave = myGame.teams[req.body.team].removeMember(player)

        if (!didLeave) {
            res.send({ "msg": "leaving failed" })
            return
        }
        res.send(myGame.toJSON(req.body.user))
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

module.exports = router