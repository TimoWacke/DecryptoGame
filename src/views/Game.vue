<template>
  <div>
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
          <button v-if="game.team1.players.length < 2 && myTeam == null" @click="joinTeam(0)">join</button>
          <button v-if="myTeam == 0" @click="leaveTeam(0)">leave</button>
          <div class="userwrapper">
            <div class="user" v-for="name in game.team1.players">{{ name }}</div>
          </div>
        </div>
        <div class="teamwrapper" id="team2">
          <h4>Team 2</h4>
          <button v-if="game.team2.players.length < 2 && myTeam == null" @click="joinTeam(1)">join</button>
          <button v-if="myTeam == 1" @click="leaveTeam(1)">leave</button>
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
  </div>
</template>


<script>
import axios from 'axios'
import vars from "../assets/vars"
import router from "../router";

export default {
  data() {
    return {
      game: false,
      myTeam: null,
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
      await axios.post(vars.backend + '/game/' + this.$route.params.gameId, {user: me.userid}).then((response) => {
        me.game = response.data
      }).catch((error) => {
        router.push({ name: "Lobby" })
      })
    },
    joinTeam(team) {
      var me = this
      axios.post(vars.backend + '/game/join', { user: me.userid, game: me.game.id, team: team }).then((response) => {
        this.updateGame()
      })

    },
    leaveTeam(team) {
      var me = this
      axios.post(vars.backend + '/game/leave', { user: me.userid, game: me.game.id, team: team }).then((response) => {
        this.updateGame()
      })
    },
    startGame() {
      var me = this
      axios.post(vars.backend + '/game/start', { user: me.userid, game: me.game.id }).then((response) => {
        this.updateGame()
      })
    },
    createPlayer() {
      var me = this
      axios.post(vars.backend + '/user/create', { name: me.setUserName }).then((response) => {
        me.userid = response.data.id
        $cookies.set("user-id", me.userid)
      })
    },
  },
  components: []
}
</script>

<style>

</style>
