<template>
  <div class="story-intro" v-if="showing" @click="skip" :class="{ 'fade-out': isFadingOut }">
    <div class="intro-content">
      <p
        v-for="(line, index) in lines"
        :key="index"
        class="intro-line"
        :class="{ 'line-visible': index <= currentLine }"
      >
        {{ line }}
      </p>
    </div>
    <div class="skip-hint" v-if="currentLine >= lines.length - 1 && !isFadingOut">
      {{ t('clickToContinue') }}
    </div>
  </div>
</template>

<script>
import { i18n } from '../utils/i18n.js';

export default {
  name: 'StoryIntro',
  data() {
    return {
      showing: true,
      currentLine: -1,
      lines: [],
      lineInterval: null,
      isFadingOut: false
    };
  },
  computed: {
    t() {
      return i18n.t.bind(i18n);
    }
  },
  mounted() {
    this.loadLines();
    this.startAnimation();
  },
  beforeUnmount() {
    if (this.lineInterval) {
      clearInterval(this.lineInterval);
    }
  },
  methods: {
    loadLines() {
      const locale = i18n.getLocale();
      if (locale === 'zh') {
        this.lines = [
          '你叫小林。',
          '今天，妈妈让你去看看外公。',
          '他一个人住在老四合院里，院子叫"静心院"。',
          '听说院子已经有一百多年了。',
          '你上次来，还是小时候。'
        ];
      } else {
        this.lines = [
          'Your name is Xiao Lin.',
          'Today, your mother asked you to visit Grandpa.',
          'He lives alone in an old courtyard called "Jingxin Courtyard".',
          'It is said to be over a hundred years old.',
          'The last time you came here, you were just a child.'
        ];
      }
    },
    startAnimation() {
      let lineIndex = 0;
      this.lineInterval = setInterval(() => {
        if (lineIndex < this.lines.length) {
          this.currentLine = lineIndex;
          lineIndex++;
        } else {
          clearInterval(this.lineInterval);
          this.lineInterval = null;
        }
      }, 2000); // 每2秒显示一行
    },
    skip() {
      if (this.currentLine < this.lines.length - 1) {
        // 如果还没显示完，直接显示所有行
        this.currentLine = this.lines.length - 1;
        if (this.lineInterval) {
          clearInterval(this.lineInterval);
          this.lineInterval = null;
        }
      } else if (!this.isFadingOut) {
        // 开始淡出动画
        this.isFadingOut = true;
        // 2秒后完全关闭
        setTimeout(() => {
          this.showing = false;
          this.$emit('complete');
        }, 2000);
      }
    }
  }
};
</script>

<style scoped>
.story-intro {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  cursor: pointer;
  transition: opacity 2s ease;
}

.story-intro.fade-out {
  opacity: 0;
  pointer-events: none;
}

.intro-content {
  text-align: center;
  padding: 40px;
}

.intro-line {
  color: #fff;
  font-size: 28px;
  font-weight: 400;
  line-height: 1.8;
  margin: 20px 0;
  opacity: 0;
  transform: translateY(20px);
  transition: all 1s ease;
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
  letter-spacing: 2px;
}

.intro-line.line-visible {
  opacity: 1;
  transform: translateY(0);
}

.skip-hint {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.8; }
}
</style>
