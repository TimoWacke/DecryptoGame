<template>
  <div class="words">
    <div v-if="game.started">
      <h3>Your words are</h3>
      <h3 v-for="(word, i) in myWords" :key="word">{{ i }}: {{ word }}</h3>
    </div>
  </div>
</template>


<script>
import axios from 'axios'
import vars from "../assets/vars"
import router from "../router";

export default {
  props: ["game"],
  data() {
    return {
      myWords: [],
      userid: ""
    }

  },
  mounted() {
    this.userid = $cookies.get("user-id")
  },
  methods: {
    
  },
}
</script>

<style>

</style>
