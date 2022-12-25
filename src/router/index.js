import { createRouter, createWebHistory } from 'vue-router'
import Game from '../views/Game.vue'
import Lobby from '../views/Lobby.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Lobby',
      component: Lobby
    },
    {
      path: '/game/:gameId',
      name: 'Game',
      component: Game
    }
  ]
})

export default router
