<template>
  <div class="start-menu">
    <img src="/photo/cover.png" class="background-image" alt="四合院虚拟现实游游" />
    
    <div class="title">
      <img src="/photo/font.png" class="title-image" alt="四合院虚拟现实游游" />
    </div>

    <div class="button-left">
      <button class="btn-main" @click="startTour">
        <span class="btn-text-zh">开始参观</span>
        <span class="btn-text-en">Start Tour</span>
      </button>
    </div>

    <div class="button-right">
      <button class="btn-main" @click="viewGuide">
        <span class="btn-text-zh">参观指南</span>
        <span class="btn-text-en">View Guide</span>
      </button>
    </div>

    <div class="button-bottom">
      <button class="btn-icon" @click="settings">
        <span class="icon">⚙</span>
        <span class="btn-small-text-zh">设置</span>
        <span class="btn-small-text-en">Settings</span>
      </button>
      
      <button class="btn-icon" @click="about">
        <span class="icon">ⓘ</span>
        <span class="btn-small-text-zh">关于</span>
        <span class="btn-small-text-en">About</span>
      </button>
      
      <button class="btn-icon" @click="exit">
        <span class="icon">🚪</span>
        <span class="btn-small-text-zh">退出</span>
        <span class="btn-small-text-en">Exit</span>
      </button>
      
      <button class="btn-icon" @click="help">
        <span class="icon">❓</span>
        <span class="btn-small-text-zh">帮助</span>
        <span class="btn-small-text-en">Help</span>
      </button>
    </div>

    <div v-if="showGuide" class="modal-overlay" @click="closeGuide">
      <div class="modal-content" @click.stop>
        <h2>参观指南 View Guide</h2>
        <div class="guide-text">
          <p><strong>移动控制：</strong></p>
          <ul>
            <li>WASD - 移动方向</li>
            <li>鼠标 - 视角转动</li>
            <li>空格 - 跳跃</li>
            <li>G - 切换飞行模式</li>
            <li>飞行模式下：Shift下降 / Space上升</li>
          </ul>
          <p><strong>其他操作：</strong></p>
          <ul>
            <li>ESC - 打开设置菜单</li>
            <li>点击屏幕 - 重新锁定鼠标</li>
          </ul>
        </div>
        <button class="btn-close" @click="closeGuide">关闭</button>
      </div>
    </div>

    <div v-if="showAbout" class="modal-overlay" @click="closeAbout">
      <div class="modal-content" @click.stop>
        <h2>关于 About</h2>
        <div class="about-text">
          <p><strong>四合院虚拟现实游游</strong></p>
          <p>Siheyuan Tour Model</p>
          <p style="margin-top: 20px;">基于 Three.js + Rapier 构建的四合院虚拟游览系统</p>
          <p>By Mello</p>
        </div>
        <button class="btn-close" @click="closeAbout">关闭</button>
      </div>
    </div>

    <div v-if="showSettings" class="modal-overlay" @click="closeSettings">
      <div class="modal-content" @click.stop>
        <h2>设置 Settings</h2>
        <div class="settings-content">
          <p>设置选项将在游戏内通过ESC键访问</p>
        </div>
        <button class="btn-close" @click="closeSettings">关闭</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StartMenu',
  data() {
    return {
      showGuide: false,
      showAbout: false,
      showSettings: false
    };
  },
  methods: {
    startTour() {
      this.$emit('start');
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
  max-width: 500px;
  width: 30vw;
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
  width: 420px;
  height: 110px;
  background: linear-gradient(180deg, #ff9933 0%, #ff7700 50%, #ee6600 100%);
  border: 5px solid #8b4513;
  border-radius: 16px;
  box-shadow: 0 8px 0 #5a2d0a, 0 12px 20px rgba(0,0,0,0.5);
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  position: relative;
}

.btn-main:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 0 #5a2d0a, 0 16px 25px rgba(0,0,0,0.6);
}

.btn-main:active {
  transform: translateY(4px);
  box-shadow: 0 4px 0 #5a2d0a, 0 6px 12px rgba(0,0,0,0.4);
}

.btn-text-zh {
  font-size: 42px;
  font-weight: 900;
  color: white;
  text-shadow: 3px 3px 0 rgba(0,0,0,0.5), 
               -1px -1px 0 rgba(255,255,255,0.3);
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  letter-spacing: 2px;
}

.btn-text-en {
  font-size: 26px;
  font-weight: 700;
  color: white;
  text-shadow: 2px 2px 0 rgba(0,0,0,0.4);
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

.btn-small-text-en {
  font-size: 11px;
  font-weight: 600;
  color: rgba(255,255,255,0.85);
  text-shadow: 1px 1px 2px rgba(0,0,0,0.4);
  font-family: Arial, sans-serif;
  display: block;
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
    width: 70vw;
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
    width: 320px;
    height: 90px;
  }
  .btn-text-zh {
    font-size: 32px;
  }
  .btn-text-en {
    font-size: 20px;
  }
}
</style>
