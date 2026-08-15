<template>
  <div id="app">
    <router-view v-if="$route.path !== '/' && $route.path !== '/mobile'" />
    <template v-else-if="$route.path === '/mobile'">
      <StartMenu v-if="!gameStarted" @start="startGame" />
      <Suspense v-else>
        <SiheyuanSceneMobile :is-new-game="isNewGame" :show-intro="isNewGame" @exit="exitGame" />
        <template #fallback>
          <div class="scene-loading">
            <div class="scene-loading-content">
              <div class="scene-loading-hint">{{ t('loadingHint1') }}</div>
              <div class="scene-loading-bar">
                <div class="scene-loading-fill"></div>
              </div>
            </div>
          </div>
        </template>
      </Suspense>
    </template>
    <template v-else>
      <StartMenu v-if="!gameStarted" @start="startGame" />
      <Suspense v-else>
        <SiheyuanScene :is-new-game="isNewGame" :show-intro="isNewGame" @exit="exitGame" />
        <template #fallback>
          <div class="scene-loading">
            <div class="scene-loading-content">
              <div class="scene-loading-hint">{{ t('loadingHint1') }}</div>
              <div class="scene-loading-bar">
                <div class="scene-loading-fill"></div>
              </div>
            </div>
          </div>
        </template>
      </Suspense>
    </template>
  </div>
</template>


<script>
import { defineAsyncComponent } from 'vue'
import StartMenu from './components/StartMenu.vue'
import { i18n } from './utils/i18n.js'

// 两个场景都很大（含 three.js / Rapier 物理引擎），改为按需异步加载：
// 移动端首屏不再下载整个游戏代码，只在点击「开始」后按设备加载对应场景
const SiheyuanScene = defineAsyncComponent(() => import('./components/SiheyuanScene.vue'))
const SiheyuanSceneMobile = defineAsyncComponent(() => import('./components/SiheyuanSceneMobile.vue'))

export default {
  name: 'App',
  components: {
    SiheyuanScene,
    SiheyuanSceneMobile,
    StartMenu
  },
  data() {
    return {
      gameStarted: false,
      isNewGame: true
    };
  },
  computed: {
    t() {
      return i18n.t.bind(i18n);
    }
  },
  mounted() {
    // 主菜单显示时，后台预取当前设备对应的场景代码，
    // 用户点击「开始游戏」时无需再等待下载
    const isMobile = /Android|iPhone|iPad|iPod|Mobile|Silk/i.test(navigator.userAgent)
    const prefetch = () => (
      isMobile
        ? import('./components/SiheyuanSceneMobile.vue')
        : import('./components/SiheyuanScene.vue')
    ).catch(() => {})

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(prefetch, { timeout: 2500 })
    } else {
      setTimeout(prefetch, 1500)
    }
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

/* 场景异步加载期间的占位（避免点击开始后黑屏），
   样式与游戏内 0-100% 加载界面保持一致 */
.scene-loading {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  backdrop-filter: blur(10px);
}

.scene-loading-content {
  text-align: center;
  background: white;
  padding: 40px 60px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  min-width: 320px;
}

.scene-loading-hint {
  color: #666;
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 25px;
  min-height: 24px;
}

.scene-loading-bar {
  width: 300px;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin: 0 auto;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
}

.scene-loading-fill {
  height: 100%;
  width: 100px;
  background: linear-gradient(90deg, #4a9eff, #67b5ff);
  border-radius: 4px;
  box-shadow: 0 0 8px rgba(74, 158, 255, 0.4);
  animation: scene-loading-slide 1.2s ease-in-out infinite alternate;
}

@keyframes scene-loading-slide {
  0% { transform: translateX(0); }
  100% { transform: translateX(200px); }
}
</style>
