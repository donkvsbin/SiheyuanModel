<template>
  <div class="start-menu" :class="{ 'loaded': pageLoaded }">
    <!-- 优先加载 WebP，不支持则回退到 PNG -->
    <picture>
      <source srcset="/photo/cover.webp" type="image/webp">
      <img src="/photo/cover.png" class="background-image" alt="四合院虚拟现实游戏" @load="onImageLoad" />
    </picture>
    
    <div class="button-main">
      <button class="btn-main" @click="startNewGame">
        <span class="btn-text-main">{{ t('newGame') }}</span>
      </button>
      <button class="btn-main" :class="{ disabled: !hasSave }" @click="continueGame" :disabled="!hasSave">
        <span class="btn-text-main">{{ t('continueGame') }}</span>
      </button>
      <button class="btn-main btn-guide" @click="viewGuide">
        <span class="btn-text-main">{{ t('gameGuide') }}</span>
      </button>
    </div>

    <button class="lang-switch-btn" @click="toggleLanguage">
      {{ locale === 'zh' ? 'English' : '中文' }}
    </button>

    <div v-if="showGuide" class="modal-overlay" @click="closeGuide">
      <div class="modal-content guide-modal" @click.stop>
        <h2>{{ t('guideTitle') }}</h2>
        <div class="guide-text">
          <div class="guide-section">
            <p class="section-title"><strong>{{ t('movementControls') }}</strong></p>
            <ul>
              <li><span class="key">W/A/S/D</span> {{ t('wasd') }}</li>
              <li><span class="key">鼠标</span> {{ t('mouse') }}</li>
              <li><span class="key">空格</span> {{ t('space') }}</li>
              <li><span class="key">Shift</span> {{ t('sprint') }}</li>
            </ul>
          </div>
          <div class="guide-section">
            <p class="section-title"><strong>{{ t('interactionControls') }}</strong></p>
            <ul>
              <li><span class="key">F</span> {{ t('interact') }}</li>
              <li><span class="key">K</span> {{ t('questPanel') }}</li>
              <li><span class="key">L</span> {{ t('collectionLog') }}</li>
              <li><span class="key">H</span> {{ t('aiChat') }}</li>
            </ul>
          </div>
          <div class="guide-section">
            <p class="section-title"><strong>{{ t('systemControls') }}</strong></p>
            <ul>
              <li><span class="key">ESC</span> {{ t('escMenu') }}</li>
              <li><span class="key">G</span> {{ t('flyMode') }}</li>
              <li><span class="key">点击</span> {{ t('clickLock') }}</li>
            </ul>
          </div>
        </div>
        <button class="btn-close" @click="closeGuide">{{ t('close') }}</button>
      </div>
    </div>

    <div v-if="showAbout" class="modal-overlay" @click="closeAbout">
      <div class="modal-content" @click.stop>
        <h2>{{ t('aboutTitle') }}</h2>
        <div class="about-text">
          <p>{{ t('aboutDesc') }}</p>
        </div>
        <button class="btn-close" @click="closeAbout">{{ t('close') }}</button>
      </div>
    </div>

    <div v-if="showSettings" class="modal-overlay" @click="closeSettings">
      <div class="modal-content" @click.stop>
        <h2>{{ t('settingsTitle') }}</h2>
        <div class="settings-content">
          <p>{{ t('settingsDesc') }}</p>
          <div class="lang-switch">
            <span>{{ t('language') }}:</span>
            <button class="lang-option" :class="{ active: locale === 'zh' }" @click.stop="toggleLanguage">
              {{ t('zhLang') }}
            </button>
            <button class="lang-option" :class="{ active: locale === 'en' }" @click.stop="toggleLanguage">
              {{ t('enLang') }}
            </button>
          </div>
        </div>
        <button class="btn-close" @click="closeSettings">{{ t('close') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import { i18n } from '../utils/i18n.js';

export default {
  name: 'StartMenu',
  data() {
    return {
      showGuide: false,
      showAbout: false,
      showSettings: false,
      pageLoaded: false,
      locale: i18n.getLocale(),
      hasSave: false
    };
  },
  mounted() {
    this.checkSave();
  },
  computed: {
    t() {
      return i18n.t.bind(i18n);
    }
  },
  methods: {
    onImageLoad() {
      // 图片加载完成后触发入场动画
      setTimeout(() => {
        this.pageLoaded = true;
      }, 100);
    },
    checkSave() {
      const saveData = localStorage.getItem('siheyuan-save');
      this.hasSave = !!saveData;
    },
    startNewGame() {
      localStorage.removeItem('siheyuan-save');
      this.$emit('start', { newGame: true });
    },
    continueGame() {
      this.$emit('start', { newGame: false });
    },
    viewGuide() {
      this.showGuide = true;
    },
    closeGuide() {
      this.showGuide = false;
    },
    settings() {
      this.showSettings = true;
    },
    closeSettings() {
      this.showSettings = false;
    },
    about() {
      this.showAbout = true;
    },
    closeAbout() {
      this.showAbout = false;
    },
    exit() {
      if (confirm('确定要退出吗？')) {
        window.close();
      }
    },
    help() {
      this.viewGuide();
    },
    toggleLanguage() {
      const newLocale = this.locale === 'zh' ? 'en' : 'zh';
      i18n.setLocale(newLocale);
      this.locale = newLocale;
    }
  }
};
</script>

<style scoped>
.start-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100dvh;
  overflow: hidden;
}

/* 背景图片入场动画 */
.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
  opacity: 0;
  transform: scale(1.1);
  transition: opacity 2.5s ease, transform 3s ease;
}

.start-menu.loaded .background-image {
  opacity: 1;
  transform: scale(1);
}

.title {
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

.title-image {
  max-width: 800px;
  width: 100vw;
  height: auto;
  filter: drop-shadow(0 8px 16px rgba(0,0,0,0.4));
}

.button-main {
  position: absolute;
  bottom: 120px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 按钮入场动画 */
.btn-main {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 1.2s ease, transform 1.2s ease, all 0.15s;
}

.start-menu.loaded .btn-main:nth-child(1) {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.8s;
}

.start-menu.loaded .btn-main:nth-child(2) {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 1.1s;
}

.start-menu.loaded .btn-main:nth-child(3) {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 1.4s;
}

.btn-main {
  width: 320px;
  height: 70px;
  background: linear-gradient(180deg, #f5e6c8 0%, #e8d4a8 100%);
  border: 4px solid #8b6f47;
  border-radius: 12px;
  box-shadow: 0 6px 0 #6b5537, 0 8px 16px rgba(0,0,0,0.4);
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  position: relative;
  overflow: hidden;
}

.btn-main:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 0 #6b5537, 0 12px 20px rgba(0,0,0,0.5);
}

.btn-main:active {
  transform: translateY(4px);
  box-shadow: 0 2px 0 #5a4528, 0 4px 8px rgba(0,0,0,0.3);
}

.btn-main.disabled {
  background: linear-gradient(180deg, #c4b8a0 0%, #a89880 100%);
  border-color: #7a6a52;
  cursor: not-allowed;
  opacity: 0.7;
}

.btn-main.disabled:hover {
  transform: none;
  box-shadow: 0 6px 0 #6b5537, 0 8px 16px rgba(0,0,0,0.4);
}

.btn-text-zh {
  font-size: 32px;
  font-weight: 900;
  color: white;
  text-shadow: 3px 3px 0 rgba(0,0,0,0.7),
               0 0 6px rgba(0,0,0,0.6);
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  letter-spacing: 2px;
}

.btn-text-en {
  font-size: 18px;
  font-weight: 700;
  color: white;
  text-shadow: 2px 2px 0 rgba(0,0,0,0.6);
  font-family: Arial, sans-serif;
  letter-spacing: 1px;
}

.btn-icon {
  width: 160px;
  height: 75px;
  background: linear-gradient(180deg, #555 0%, #333 100%);
  border: 3px solid #222;
  border-radius: 10px;
  box-shadow: 0 5px 0 #111, 0 8px 15px rgba(0,0,0,0.5);
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 10px;
}

.btn-icon:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 0 #111, 0 12px 20px rgba(0,0,0,0.6);
  background: linear-gradient(180deg, #666 0%, #444 100%);
}

.btn-icon:active {
  transform: translateY(2px);
  box-shadow: 0 3px 0 #111, 0 5px 10px rgba(0,0,0,0.4);
}

.icon {
  font-size: 28px;
  filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.5));
}

.btn-small-text-zh {
  font-size: 16px;
  font-weight: 700;
  color: white;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  display: block;
}

.btn-small-text {
  font-size: 14px;
  font-weight: 700;
  color: white;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  display: block;
}

.btn-text-main {
  font-size: 28px;
  font-weight: 700;
  color: #5a3d2b;
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  letter-spacing: 4px;
}

.lang-switch-btn {
  position: absolute;
  bottom: 30px;
  left: 30px;
  padding: 12px 24px;
  opacity: 0;
  transform: translateX(-20px);
  transition: opacity 1.2s ease, transform 1.2s ease, all 0.15s;
}

.start-menu.loaded .lang-switch-btn {
  opacity: 1;
  transform: translateX(0);
  transition-delay: 1.8s;
}

.lang-switch-btn {
  background: linear-gradient(180deg, #f5e6c8 0%, #e8d4a8 100%);
  border: 3px solid #8b6f47;
  border-radius: 10px;
  box-shadow: 0 4px 0 #6b5537, 0 6px 12px rgba(0,0,0,0.4);
  color: #5a3d2b;
  font-size: 16px;
  font-weight: 700;
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  letter-spacing: 2px;
  cursor: pointer;
  z-index: 10;
}

.lang-switch-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 0 #6b5537, 0 10px 16px rgba(0,0,0,0.5);
}

.lang-switch-btn:active {
  transform: translateY(2px);
  box-shadow: 0 2px 0 #5a4528, 0 4px 8px rgba(0,0,0,0.3);
}

.lang-btn {
  background: linear-gradient(180deg, #4a9eff 0%, #2a6ecc 100%);
  border-color: #1a4e9c;
}

.lang-btn:hover {
  background: linear-gradient(180deg, #5aaeff 0%, #3a7edc 100%);
}

.lang-switch {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
}

.lang-option {
  padding: 8px 16px;
  background: rgba(255,255,255,0.1);
  border: 2px solid rgba(255,255,255,0.3);
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.lang-option.active {
  background: rgba(90, 158, 255, 0.5);
  border-color: rgba(90, 158, 255, 0.8);
}

.lang-option:hover {
  background: rgba(255,255,255,0.2);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-content {
  background: rgba(30, 30, 40, 0.98);
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 40px 50px;
  max-width: 600px;
  backdrop-filter: blur(12px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.7);
}

.modal-content h2 {
  margin: 0 0 24px 0;
  color: #fff;
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.guide-text, .about-text, .settings-content {
  color: rgba(255,255,255,0.95);
  font-size: 16px;
  line-height: 1.8;
  margin-bottom: 24px;
}

.guide-modal {
  max-width: 700px;
  max-height: 80vh;
  overflow-y: auto;
}

.guide-section {
  margin-bottom: 20px;
}

.section-title {
  color: #ff9933;
  font-size: 18px;
  margin-bottom: 10px;
  border-bottom: 1px solid rgba(255, 153, 51, 0.3);
  padding-bottom: 5px;
}

.guide-text .key {
  display: inline-block;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  padding: 2px 10px;
  margin-right: 8px;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  color: #ffcc66;
  min-width: 50px;
  text-align: center;
}

.btn-guide {
  background: linear-gradient(180deg, #6b8e6b 0%, #4a6a4a 100%);
  border-color: #3a5a3a;
}

.btn-guide:hover {
  background: linear-gradient(180deg, #7b9e7b 0%, #5a7a5a 100%);
}

.guide-text ul, .about-text ul {
  list-style: none;
  padding-left: 0;
}

.guide-text li, .about-text li {
  margin: 8px 0;
  padding-left: 20px;
  position: relative;
}

.guide-text li:before {
  content: '▸';
  position: absolute;
  left: 0;
  color: #ff9933;
}

.btn-close {
  display: block;
  width: 100%;
  padding: 12px;
  background: rgba(90, 158, 255, 0.35);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
}

.btn-close:hover {
  background: rgba(90, 158, 255, 0.5);
}

@media (max-width: 1024px) {
  .title-image {
    width: 100vw;
  }
  .button-main {
    left: 50%;
    transform: translateX(-50%);
    bottom: 180px;
  }
  .btn-main {
    width: 280px;
    height: 80px;
  }
  .btn-text-zh {
    font-size: 26px;
  }
  .btn-text-en {
    font-size: 16px;
  }
}

/* 横屏或小屏手机：缩小按钮、减少间距 */
@media (max-height: 500px) and (orientation: landscape) {
  .button-main {
    bottom: 24px;
    gap: 8px;
  }
  .btn-main {
    width: 220px;
    height: 44px;
    border-radius: 8px;
    border-width: 3px;
    box-shadow: 0 4px 0 #6b5537, 0 6px 12px rgba(0,0,0,0.4);
  }
  .btn-main:hover {
    box-shadow: 0 5px 0 #6b5537, 0 8px 14px rgba(0,0,0,0.5);
  }
  .btn-main:active {
    box-shadow: 0 2px 0 #5a4528, 0 3px 6px rgba(0,0,0,0.3);
  }
  .btn-text-main {
    font-size: 20px;
    letter-spacing: 2px;
  }
  .lang-switch-btn {
    bottom: 12px;
    left: 12px;
    padding: 8px 16px;
    font-size: 14px;
  }
}
</style>
