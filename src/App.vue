<template>
  <div id="app">
    <StartMenu v-if="!gameStarted" @start="startGame" />
    <SiheyuanScene v-else />
  </div>
</template>


<script>
import SiheyuanScene from './components/SiheyuanScene.vue'
import StartMenu from './components/StartMenu.vue'

export default {
  name: 'App',
  components: {
    SiheyuanScene,
    StartMenu
  },
  data() {
    return {
      gameStarted: false
    };
  },
  methods: {
    startGame() {
      this.gameStarted = true;
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
