/*
    router file for /user using express and router (module.exports = router)
*/

const express = require('express')
const router = express.Router()
const { players, games } = require('../services/storage')

const Player = require('../classes/playerClass')

router.post('/create', (req, res) => {
    const newPlayer = new Player(req.body.name)
    players.set(newPlayer.id, newPlayer)
    res.send(newPlayer.toJSON())
})

router.get('/:id', (req, res) => {
    try {
        const foundPlayer = players[req.body.user]
        res.send(foundPlayer.toJSON())
    } catch (err) {
        res.sendStatus(404)
    }
})

router.get('/login', (req, res) => {
    var ply = getPlayerById(req.body.id)
    if (!ply)
        res.send({ msg: "no player found for id" })
    res.send(ply.toJSON())
})

module.exports = router