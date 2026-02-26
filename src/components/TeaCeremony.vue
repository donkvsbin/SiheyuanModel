<template>
  <div class="tea-ceremony-overlay" v-if="visible">
    <!-- 游戏介绍页面 -->
    <div class="tea-intro-panel" v-if="showIntro">
      <div class="intro-image">
        <img src="/photo/Games/teaStart.png" alt="Tea Ceremony" />
      </div>
      <div class="intro-content">
        <h2 class="intro-title">{{ locale === 'zh' ? '茶道体验' : 'Tea Ceremony' }}</h2>
        <div class="intro-description">
          <p>{{ locale === 'zh' ? '欢迎来到茶道体验！' : 'Welcome to the Tea Ceremony!' }}</p>
          <p>{{ locale === 'zh' ? '在金色区域内按下 F 键，完成完美时机判定。' : 'Press F within the golden zone for perfect timing.' }}</p>
          <p>{{ locale === 'zh' ? '完成四个步骤：温杯、投茶、注水、品茗。' : 'Complete four steps: Warm Cup, Add Tea, Pour Water, Taste.' }}</p>
        </div>
        <div class="intro-buttons">
          <button class="intro-btn start-btn" @click="startGame">
            {{ locale === 'zh' ? '开始游戏' : 'Start Game' }}
          </button>
          <button class="intro-btn exit-btn" @click="handleClose">
            {{ locale === 'zh' ? '退出' : 'Exit' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 游戏主界面 -->
    <div class="tea-ceremony-panel" v-else>
      <h2 class="tea-title"></h2>
      <div class="tea-content">
        <div class="tea-step" v-if="currentStep" :key="currentStep.index">
          <div class="step-name">{{ currentStep.name }}</div>
          <div class="step-desc">{{ currentStep.desc }}</div>
          
          <!-- 时机条 -->
          <div class="timing-container">
            <div class="timing-bar">
              <!-- 完美区域标记 -->
              <div class="perfect-zone"></div>
              <!-- 指示器 -->
              <div class="timing-indicator" :style="{ left: indicatorPosition + '%' }" :class="{ 'in-perfect': isInPerfectZone }"></div>
            </div>
            <div class="timing-labels">
              <span>{{ locale === 'zh' ? '开始' : 'Start' }}</span>
              <span class="perfect-label">{{ locale === 'zh' ? '完美时机' : 'Perfect' }}</span>
              <span>{{ locale === 'zh' ? '结束' : 'End' }}</span>
            </div>
          </div>
          
          <div class="step-hint">{{ locale === 'zh' ? '按 F 键继续' : 'Press F to continue' }}</div>
        </div>
        <div class="tea-complete" v-else-if="isComplete">
          <div class="complete-title">{{ locale === 'zh' ? '茶道完成！' : 'Tea Ceremony Complete!' }}</div>
          <div class="complete-rating">{{ rating.text }}</div>
        </div>
      </div>
      <button v-if="isComplete" class="tea-close-btn" @click="handleClose">
        {{ locale === 'zh' ? '完成' : 'Complete' }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TeaCeremony',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    locale: {
      type: String,
      default: 'zh'
    },
    currentStep: {
      type: Object,
      default: null
    },
    score: {
      type: Number,
      default: 0
    },
    rating: {
      type: Object,
      default: () => ({ text: '' })
    },
    isComplete: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'step', 'start'],
  data() {
    return {
      showIntro: true,
      indicatorPosition: 0,
      isInPerfectZone: false,
      animationId: null,
      direction: 1
    };
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.showIntro = true;
      }
      if (newVal && this.currentStep && !this.showIntro) {
        this.startAnimation();
      } else {
        this.stopAnimation();
      }
    },
    currentStep(newVal) {
      if (newVal && this.visible && !this.showIntro) {
        this.startAnimation();
      }
    }
  },
  beforeUnmount() {
    this.stopAnimation();
  },
  methods: {
    handleClose() {
      this.showIntro = true;
      this.$emit('close');
    },
    startGame() {
      this.showIntro = false;
      this.$emit('start');
      this.$nextTick(() => {
        if (this.currentStep) {
          this.startAnimation();
        }
      });
    },
    // 供父组件调用获取当前指示器位置
    getIndicatorPosition() {
      return this.indicatorPosition;
    },
    // 重置指示器位置
    resetIndicator() {
      this.indicatorPosition = 0;
      this.direction = 1;
    },
    startAnimation() {
      this.stopAnimation();
      this.indicatorPosition = 0;
      this.direction = 1;
      
      const animate = () => {
        if (!this.currentStep) return;
        
        const speed = 0.4; // 降低速度
        this.indicatorPosition += speed * this.direction;
        
        if (this.indicatorPosition >= 100) {
          this.indicatorPosition = 100;
          this.direction = -1;
        } else if (this.indicatorPosition <= 0) {
          this.indicatorPosition = 0;
          this.direction = 1;
        }
        
        this.isInPerfectZone = this.indicatorPosition >= 40 && this.indicatorPosition <= 60;
        
        this.animationId = requestAnimationFrame(animate);
      };
      
      this.animationId = requestAnimationFrame(animate);
    },
    stopAnimation() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
    }
  }
};
</script>

<style scoped>
.tea-ceremony-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.tea-ceremony-panel {
  background: linear-gradient(135deg, #f5f0e8 0%, #e8e0d0 100%);
  padding: 40px 60px;
  border-radius: 20px;
  text-align: center;
  min-width: 400px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 2px solid #d4c4a8;
}

.tea-title {
  margin: 0 0 30px 0;
  color: #5c4a32;
  font-size: 32px;
  font-weight: 600;
  font-family: 'SimSun', 'STSong', serif;
}

.tea-content {
  margin-bottom: 30px;
}

.tea-step {
  animation: stepEnter 0.5s ease;
}

@keyframes stepEnter {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  50% {
    opacity: 0.8;
    transform: translateY(-5px) scale(1.02);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.step-name {
  animation: namePulse 0.6s ease;
}

@keyframes namePulse {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  60% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.step-desc {
  animation: descSlide 0.5s ease 0.1s both;
}

@keyframes descSlide {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.timing-container {
  animation: timingAppear 0.5s ease 0.2s both;
}

@keyframes timingAppear {
  0% {
    opacity: 0;
    transform: scaleX(0);
  }
  100% {
    opacity: 1;
    transform: scaleX(1);
  }
}

.step-hint {
  animation: hintBounce 0.5s ease 0.3s both;
}

@keyframes hintBounce {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  60% {
    opacity: 1;
    transform: translateY(-3px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.step-name {
  font-size: 28px;
  color: #8b4513;
  font-weight: 600;
  margin-bottom: 15px;
  font-family: 'SimSun', 'STSong', serif;
}

.step-desc {
  font-size: 18px;
  color: #666;
  margin-bottom: 25px;
  line-height: 1.6;
}

.step-hint {
  font-size: 14px;
  color: #999;
  padding: 10px 20px;
  background: rgba(139, 69, 19, 0.1);
  border-radius: 20px;
  display: inline-block;
}

/* 时机条样式 */
.timing-container {
  margin: 20px 0 25px 0;
  padding: 0 20px;
}

.timing-bar {
  position: relative;
  width: 100%;
  height: 20px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: visible;
}

.perfect-zone {
  position: absolute;
  left: 40%;
  width: 20%;
  height: 100%;
  background: linear-gradient(90deg, rgba(255, 215, 0, 0.3), rgba(255, 215, 0, 0.5), rgba(255, 215, 0, 0.3));
  border-radius: 4px;
}

.timing-indicator {
  position: absolute;
  top: -5px;
  width: 6px;
  height: 30px;
  background: #fff;
  border: 2px solid #8b4513;
  border-radius: 3px;
  transform: translateX(-50%);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.timing-indicator.in-perfect {
  background: #ffd700;
  border-color: #ffd700;
  box-shadow: 0 0 15px #ffd700, 0 2px 4px rgba(0, 0, 0, 0.3);
}

.timing-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 12px;
  color: #888;
}

.perfect-label {
  color: #d4a574;
  font-weight: 600;
}

.tea-complete {
  animation: fadeIn 0.5s ease;
}

.complete-title {
  font-size: 28px;
  color: #5c4a32;
  font-weight: 600;
  margin-bottom: 20px;
  font-family: 'SimSun', 'STSong', serif;
}

.complete-score {
  font-size: 24px;
  color: #8b4513;
  margin-bottom: 15px;
}

.complete-rating {
  font-size: 20px;
  color: #d4a574;
  font-weight: 600;
}

.tea-close-btn {
  padding: 14px 50px;
  background: #8b4513;
  border: none;
  color: white;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.2s;
  font-family: 'SimSun', 'STSong', serif;
}

.tea-close-btn:hover {
  background: #6b3410;
  transform: translateY(-2px);
}

/* 游戏介绍页面样式 */
.tea-intro-panel {
  display: flex;
  background: linear-gradient(135deg, #f5f0e8 0%, #e8e0d0 100%);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 2px solid #d4c4a8;
  max-width: 900px;
  width: 90%;
}

.intro-image {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0e6d3;
  padding: 20px;
}

.intro-image img {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
  border-radius: 10px;
}

.intro-content {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.intro-title {
  margin: 0 0 20px 0;
  color: #5c4a32;
  font-size: 32px;
  font-weight: 600;
  font-family: 'SimSun', 'STSong', serif;
  text-align: center;
}

.intro-description {
  margin-bottom: 30px;
  text-align: left;
}

.intro-description p {
  margin: 10px 0;
  color: #666;
  font-size: 16px;
  line-height: 1.6;
}

.intro-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.intro-btn {
  padding: 12px 35px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'SimSun', 'STSong', serif;
}

.start-btn {
  background: #8b4513;
  color: white;
}

.start-btn:hover {
  background: #6b3410;
  transform: translateY(-2px);
}

.exit-btn {
  background: rgba(0, 0, 0, 0.1);
  color: #666;
  border: 2px solid #d4c4a8;
}

.exit-btn:hover {
  background: rgba(0, 0, 0, 0.15);
  border-color: #8b4513;
  color: #8b4513;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
