<template>
  <div class="lobby">
    <h1>Decrypto</h1>
    <div v-if="!user">
      <h3>Choose your username</h3>
      <input type="text" placeholder="Sherlock" v-model="setUserName">
      <button type="submit" class="invert" @click="createPlayer()">start</button>
    </div>
    <div v-if="user">
      <h3>Welcome {{ user.name }}</h3>
      <button @click="createGame()">New Game</button>
      <div>
        <input type="text" v-model="joinGameId" placeHolder="1A2b3C4d">
        <button @click="joinGame()">Join Game</button>
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
      user: false,
      setUserName: "",
      joinGameId: "",
    }
  },
  mounted() {
    const userid = $cookies.get("user-id")
    if (userid) {
      var username;
      axios.get(vars.backend + '/user/' + userid).then((response) => {
        username = response.data.name
        if (userid && username) {
          this.user = { id: userid, name: username }
        }
      })
    }
  },
  methods: {
    createPlayer() {
      var me = this
      axios.post(vars.backend + '/user/create', { name: me.setUserName }).then((response) => {
        me.user = response.data
        $cookies.set("user-id", me.user.id)
      })
    },
    createGame() {
      var me = this
      axios.post(vars.backend + '/game/create', { userId: me.user.id }).then((response) => {
        const newGame = response.data
        console.log(newGame.id)
        router.push({ name: 'Game', params: { gameId: newGame.id } })
      }).catch(() => {
        $cookies.remove("user-id")
        me.user = false
      })
    },
    joinGame() {
      const gameId = this.joinGameId
      axios.post(vars.backend + '/game/info/' + gameId).then((response) => {
        router.push({ name: 'Game', params: { gameId: gameId } })
      })
    }
  }
}
</script>

<style>

</style>
