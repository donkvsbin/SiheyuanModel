<template>
  <transition name="quest-slide">
    <div class="quest-panel" v-if="currentQuest">
      <div class="quest-header">
        <img class="quest-icon" src="/photo/icon.png" alt="quest" />
        <span class="quest-name">{{ currentQuest.name }}</span>
      </div>
      <div class="quest-desc" v-if="currentQuest.description">{{ currentQuest.description }}</div>
    </div>
  </transition>
</template>

<script>


export default {
  name: 'QuestPanel',
  props: {
    questManager: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      currentQuest: null
    };
  },
  mounted() {
    this.updateQuestInfo();
    // 监听任务变化
    if (this.questManager) {
      this.questManager.on('questStart', this.onQuestStart);
      this.questManager.on('questComplete', this.onQuestComplete);
    }
  },
  beforeUnmount() {
    if (this.questManager) {
      this.questManager.off('questStart', this.onQuestStart);
      this.questManager.off('questComplete', this.onQuestComplete);
    }
  },
  methods: {
    updateQuestInfo() {
      if (this.questManager) {
        this.currentQuest = this.questManager.getCurrentQuest();
      }
    },
    onQuestStart(quest) {
      // 先清空当前任务触发动画，然后显示新任务
      this.currentQuest = null;
      this.$nextTick(() => {
        this.currentQuest = quest;
      });
    },
    onQuestComplete() {
      const nextQuest = this.questManager.getCurrentQuest();
      if (nextQuest) {
        // 有下一个任务，先清空再显示新任务
        this.currentQuest = null;
        this.$nextTick(() => {
          this.currentQuest = nextQuest;
        });
      } else {
        // 没有任务了，直接清空
        this.currentQuest = null;
      }
    }
  }
};
</script>

<style scoped>
.quest-panel {
  position: fixed;
  left: 0;
  top: 100px;
  background: transparent;
  padding: 12px 16px;
  min-width: 200px;
  max-width: 280px;
  color: #fff;
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
  z-index: 100;
  pointer-events: none;
}

.quest-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.quest-icon {
  width: 20px;
  height: 20px;
  filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.8));
}

.quest-name {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  line-height: 1.4;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.quest-desc {
  font-size: 13px;
  color: #ffd700;
  line-height: 1.5;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  padding-left: 28px;
}

/* 出现/消失动画 */
.quest-slide-enter-active {
  transition: all 0.4s ease;
}

.quest-slide-leave-active {
  transition: all 0.3s ease;
}

.quest-slide-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.quest-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
