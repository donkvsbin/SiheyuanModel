<template>
  <div class="start-menu">
    <img src="/photo/cover.png" class="background-image" alt="四合院虚拟现实游戏" />
    
    <div class="title">
      <img src="/photo/font.png" class="title-image" alt="四合院虚拟现实游戏" />
    </div>

    <div class="button-left">
      <button class="btn-main" @click="startNewGame">
        <span class="btn-text-main">{{ t('newGame') }}</span>
      </button>
    </div>

    <div class="button-right">
      <button class="btn-main" :class="{ disabled: !hasSave }" @click="continueGame" :disabled="!hasSave">
        <span class="btn-text-main">{{ t('continueGame') }}</span>
      </button>
    </div>

    <div class="button-bottom">
      <button class="btn-icon" @click="settings">
        <span class="icon">⚙</span>
        <span class="btn-small-text">{{ t('settings') }}</span>
      </button>
      
      <button class="btn-icon" @click="about">
        <span class="icon">ⓘ</span>
        <span class="btn-small-text">{{ t('about') }}</span>
      </button>
      
      <button class="btn-icon" @click="exit">
        <span class="icon">🚪</span>
        <span class="btn-small-text">{{ t('exit') }}</span>
      </button>
      
      <button class="btn-icon" @click="help">
        <span class="icon">❓</span>
        <span class="btn-small-text">{{ t('help') }}</span>
      </button>

      <button class="btn-icon lang-btn" @click="toggleLanguage">
        <span class="icon">🌐</span>
        <span class="btn-small-text">{{ locale === 'zh' ? 'EN' : '中' }}</span>
      </button>
    </div>

    <div v-if="showGuide" class="modal-overlay" @click="closeGuide">
      <div class="modal-content" @click.stop>
        <h2>{{ t('guideTitle') }}</h2>
        <div class="guide-text">
          <p><strong>{{ t('controls') }}</strong></p>
          <ul>
            <li>{{ t('wasd') }}</li>
            <li>{{ t('mouse') }}</li>
            <li>{{ t('space') }}</li>
            <li>{{ t('flyMode') }}</li>
            <li>{{ t('flyControls') }}</li>
          </ul>
          <p><strong>{{ t('otherOps') }}</strong></p>
          <ul>
            <li>{{ t('escMenu') }}</li>
            <li>{{ t('clickLock') }}</li>
          </ul>
        </div>
        <button class="btn-close" @click="closeGuide">{{ t('close') }}</button>
      </div>
    </div>

    <div v-if="showAbout" class="modal-overlay" @click="closeAbout">
      <div class="modal-content" @click.stop>
        <h2>{{ t('aboutTitle') }}</h2>
        <div class="about-text">
          <p><strong>{{ t('appName') }}</strong></p>
          <p>{{ t('subtitle') }}</p>
          <p style="margin-top: 20px;">{{ t('tech') }}</p>
          <p>{{ t('author') }}</p>
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
  height: 100vh;
  overflow: hidden;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
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

.button-left {
  position: absolute;
  bottom: 200px;
  left: 300px;
  z-index: 10;
}

.button-right {
  position: absolute;
  bottom: 200px;
  right: 280px;
  z-index: 10;
}

.btn-main {
  width: 340px;
  height: 90px;
  background: linear-gradient(180deg, #d49a5a 0%, #b87533 45%, #8a4b16 100%);
  border: 5px solid #5b2e0b;
  border-radius: 20px;
  box-shadow: 0 10px 0 #4a2508, 0 16px 24px rgba(0,0,0,0.55);
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
  transform: translateY(-3px);
  box-shadow: 0 13px 0 #4a2508, 0 20px 28px rgba(0,0,0,0.65);
}

.btn-main:active {
  transform: translateY(3px);
  box-shadow: 0 5px 0 #3a1a06, 0 8px 14px rgba(0,0,0,0.45);
}

.btn-main.disabled {
  background: linear-gradient(180deg, #888 0%, #666 45%, #555 100%);
  border-color: #444;
  cursor: not-allowed;
  opacity: 0.7;
}

.btn-main.disabled:hover {
  transform: none;
  box-shadow: 0 10px 0 #4a2508, 0 16px 24px rgba(0,0,0,0.55);
}

.btn-main::before {
  content: '';
  position: absolute;
  inset: 5px;
  border-radius: 14px;
  background: linear-gradient(145deg, rgba(255,255,255,0.35), rgba(255,255,255,0.05));
  mix-blend-mode: soft-light;
  opacity: 0.85;
  pointer-events: none;
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

.button-bottom {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 30px;
  z-index: 10;
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
  font-size: 32px;
  font-weight: 900;
  color: white;
  text-shadow: 3px 3px 0 rgba(0,0,0,0.7),
               0 0 6px rgba(0,0,0,0.6);
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  letter-spacing: 2px;
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
  .button-left, .button-right {
    left: 50%;
    right: auto;
    transform: translateX(-50%);
  }
  .button-left {
    bottom: 320px;
  }
  .button-right {
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
</style>
