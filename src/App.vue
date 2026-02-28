<template>
  <div id="app">
    <StartMenu v-if="!gameStarted" @start="startGame" />
    <SiheyuanScene v-else :is-new-game="isNewGame" :show-intro="isNewGame" @exit="exitGame" />
  </div>
</template>


<script>
import SiheyuanScene from './components/SiheyuanScene.vue'
import StartMenu from './components/StartMenu.vue'
import StoryIntro from './components/StoryIntro.vue'

export default {
  name: 'App',
  components: {
    SiheyuanScene,
    StartMenu
  },
  data() {
    return {
      gameStarted: false,
      isNewGame: true
    };
  },
  methods: {
    startGame(options) {
      this.isNewGame = options ? options.newGame : true;
      this.gameStarted = true;
    },
    exitGame() {
      this.gameStarted = false;
      this.isNewGame = true;
    }
  }
}
</script>


<style>
html, body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

#app {
  width: 100%;
  height: 100%;
}
</style>
