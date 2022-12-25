<template>
  <div class="ingame">
    <h1>Decrypto</h1>
    <h3 v-if="!game.started">Game code: {{ game.id }}</h3>
    <div v-if="game && !game.started" class="teamselect">
      <div v-if="!userid">
        <h3>Choose your username</h3>
        <input type="text" placeholder="Sherlock" v-model="setUserName">
        <button type="submit" class="invert" @click="createPlayer()">join</button>
      </div>
      <div v-else>
        <div class="teamwrapper" id="team1">
          <h4>Team 1</h4>
          <button v-if="game.team1.players.length < 2 && !myTeam" @click="joinTeam(1)">join</button>
          <button v-if="myTeam == 1" @click="leaveTeam(1)">leave</button>
          <div class="userwrapper">
            <div class="user" v-for="name in game.team1.players">{{ name }}</div>
          </div>
        </div>
        <div class="teamwrapper" id="team2">
          <h4>Team 2</h4>
          <button v-if="game.team2.players.length < 2 && !myTeam" @click="joinTeam(2)">join</button>
          <button v-if="myTeam == 2" @click="leaveTeam(2)">leave</button>
          <div class="userwrapper">
            <div class="user" v-for="name in game.team2.players">{{ name }}</div>
          </div>
        </div>
        <button v-if="true || !game.started && game.team1.players.length == 2 && game.team2.players.length == 2"
          @click="startGame()">
          start
        </button>
      </div>
    </div>
    <Words v-if="game.started" :game="game"></Words>
  </div>
</template>


<script>
import axios from 'axios'
import vars from "../assets/vars"
import router from "../router";

import Words from "../../src/components/Words.vue"

export default {
  data() {
    return {
      game: false,
      myTeam: false,
      myWords: [],
      userid: false,
      setUserName: ""
    }

  },
  mounted() {
    this.userid = $cookies.get("user-id")
    this.updateGame()
    setInterval(this.updateGame, 2000)

  },
  methods: {
    async updateGame() {
      var me = this
      await axios.get(vars.backend + '/game/' + this.$route.params.gameId).then((response) => {
        me.game = response.data
      }).catch((error) => {
        router.push({ name: "Lobby" })
      })
      axios.post(vars.backend + '/teamOf', { user: me.userid, game: me.game.id }).then((response) => {
        me.myTeam = response.data.team
      })
      axios.post(vars.backend + '/wordsFor', { user: me.userid, game: me.game.id }).then((response) => {
        me.myWords = response.data.words
      })
    },
    joinTeam(team) {
      var me = this
      axios.post(vars.backend + '/joinTeam', { user: me.userid, game: me.game.id, team: team }).then((response) => {
        this.updateGame()
      })

    },
    leaveTeam(team) {
      var me = this
      axios.post(vars.backend + '/leaveTeam', { user: me.userid, game: me.game.id, team: team }).then((response) => {
        this.updateGame()
      })
    },
    startGame() {
      var me = this
      axios.post(vars.backend + '/startGame', { user: me.userid, game: me.game.id }).then((response) => {
        this.updateGame()
      })
    },
    createPlayer() {
      var me = this
      axios.post(vars.backend + '/createPlayer', { name: me.setUserName }).then((response) => {
        me.userid = response.data.id
        $cookies.set("user-id", me.userid)
      })
    },
  },
  components: [Words]
}
</script>

<style>

</style>
