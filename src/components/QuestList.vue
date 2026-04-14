<template>
  <div class="quest-list-overlay" v-if="visible">
    <div class="quest-list-panel">
      <div class="quest-list-header">
        <h2 class="quest-list-title">{{ locale === 'zh' ? '剧情走向' : 'Quest List' }}</h2>
        <button class="close-btn" @click="handleClose" title="Close">
          <span class="close-icon">×</span>
        </button>
      </div>
      
      <!-- 任务列表区域 -->
      <div class="quest-list-content">
        <div 
          v-for="(quest, index) in questList" 
          :key="quest.id" 
          class="quest-item"
          :class="{ 'completed': isQuestCompleted(quest.id), 'current': isCurrentQuest(quest.id) }"
        >
          <div class="quest-icon">
            <span v-if="isQuestCompleted(quest.id)">✓</span>
            <span v-else>{{ index + 1 }}</span>
          </div>
          <div class="quest-info">
            <div class="quest-name">{{ quest.name }}</div>
            <div class="quest-description">{{ quest.description }}</div>
          </div>
        </div>
      </div>
      
      <!-- 进度统计 -->
      <div class="quest-progress">
        <span>{{ completedCount }} / {{ questList.length }} {{ locale === 'zh' ? '已完成' : 'Completed' }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getQuestData } from '../data/storyData.js';

export default {
  name: 'QuestList',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    locale: {
      type: String,
      default: 'zh'
    },
    completedQuests: {
      type: Array,
      default: () => []
    },
    currentQuestId: {
      type: String,
      default: ''
    }
  },
  emits: ['close'],
  computed: {
    questList() {
      return getQuestData(this.locale);
    },
    completedCount() {
      return this.completedQuests.length;
    }
  },
  methods: {
    handleClose() {
      this.$emit('close');
    },
    isQuestCompleted(questId) {
      return this.completedQuests.includes(questId);
    },
    isCurrentQuest(questId) {
      return questId === this.currentQuestId;
    }
  }
};
</script>

<style scoped>
.quest-list-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
}

.quest-list-panel {
  width: 500px;
  max-height: 70vh;
  background: linear-gradient(135deg, rgba(245, 240, 232, 0.95) 0%, rgba(232, 224, 208, 0.95) 100%);
  border: 2px solid #d4c4a8;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.quest-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #d4c4a8;
  background: rgba(139, 69, 19, 0.1);
}

.quest-list-title {
  margin: 0;
  color: #5c4a32;
  font-size: 24px;
  font-weight: 600;
  font-family: 'SimSun', 'STSong', serif;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(139, 69, 19, 0.2);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(139, 69, 19, 0.4);
}

.close-icon {
  color: #5c4a32;
  font-size: 20px;
  line-height: 1;
}

.quest-list-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
}

.quest-item {
  display: flex;
  align-items: flex-start;
  padding: 14px 16px;
  margin-bottom: 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(139, 69, 19, 0.1);
  transition: all 0.3s;
}

.quest-item.completed {
  background: rgba(139, 69, 19, 0.15);
  border-color: rgba(139, 69, 19, 0.3);
}

.quest-item.current {
  background: rgba(255, 215, 0, 0.15);
  border-color: rgba(255, 215, 0, 0.5);
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.2);
}

.quest-item:not(.completed):not(.current) {
  opacity: 0.6;
}

.quest-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(139, 69, 19, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 14px;
  flex-shrink: 0;
  font-size: 14px;
  color: #5c4a32;
  font-weight: 600;
}

.quest-item.completed .quest-icon {
  background: #8b4513;
  color: white;
}

.quest-item.current .quest-icon {
  background: #d4a574;
  color: white;
}

.quest-info {
  flex: 1;
}

.quest-name {
  font-size: 16px;
  font-weight: 600;
  color: #5c4a32;
  margin-bottom: 4px;
  font-family: 'SimSun', 'STSong', serif;
}

.quest-item:not(.completed):not(.current) .quest-name {
  color: #999;
}

.quest-description {
  font-size: 13px;
  color: #888;
  line-height: 1.4;
}

.quest-item:not(.completed):not(.current) .quest-description {
  color: #bbb;
}

.quest-progress {
  padding: 16px 24px;
  border-top: 1px solid #d4c4a8;
  text-align: center;
  color: #5c4a32;
  font-size: 14px;
  background: rgba(139, 69, 19, 0.05);
}

/* 滚动条样式 */
.quest-list-content::-webkit-scrollbar {
  width: 6px;
}

.quest-list-content::-webkit-scrollbar-track {
  background: rgba(139, 69, 19, 0.1);
  border-radius: 3px;
}

.quest-list-content::-webkit-scrollbar-thumb {
  background: rgba(139, 69, 19, 0.3);
  border-radius: 3px;
}

.quest-list-content::-webkit-scrollbar-thumb:hover {
  background: rgba(139, 69, 19, 0.5);
}
</style>
