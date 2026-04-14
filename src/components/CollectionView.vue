<template>
  <div class="collection-overlay" @click="handleOverlayClick">
    <div class="collection-panel" @click.stop>
      <!-- 关闭按钮 - 右上角 -->
      <button class="close-btn-corner" @click="close">×</button>
      
      <!-- 标题 - 正上方 -->
      <h2 class="collection-title-top">{{ t('encyclopediaTitle') }}</h2>

      <!-- 内容区 - 左右布局 -->
      <div class="collection-content">
        <!-- 左侧：地点列表 -->
        <div class="location-list">
          <div
            v-for="item in locationItems"
            :key="item.id"
            class="location-item"
            :class="{ 
              active: selectedItem && selectedItem.id === item.id,
              unlocked: isUnlocked(item.id), 
              locked: !isUnlocked(item.id) 
            }"
            @click="selectItem(item)"
          >
            <div class="location-thumb">
              <img 
                v-if="item.image" 
                :src="item.image" 
                class="thumb-image"
                :class="{ silhouette: !isUnlocked(item.id) }"
              />
              <div v-else class="thumb-icon">{{ isUnlocked(item.id) ? item.icon : '?' }}</div>
            </div>
            <div class="location-name">{{ item.name }}</div>
            <div class="location-status">
              <span v-if="isUnlocked(item.id)" class="status-unlocked">✓</span>
              <span v-else class="status-locked">🔒</span>
            </div>
          </div>
        </div>

        <!-- 右侧：详情展示 -->
        <div class="detail-display">
          <div v-if="selectedItem" class="detail-content" :class="{ locked: !isUnlocked(selectedItem.id) }">
            <!-- 大图 -->
            <div class="detail-image-wrapper">
              <img 
                v-if="selectedItem.image" 
                :src="selectedItem.image" 
                class="detail-large-image"
                :class="{ silhouette: !isUnlocked(selectedItem.id) }"
              />
              <div v-else class="detail-icon-large">{{ isUnlocked(selectedItem.id) ? selectedItem.icon : '🔒' }}</div>
            </div>
            <!-- 文字介绍 -->
            <div class="detail-info">
              <h3 class="detail-title">{{ selectedItem.name }}</h3>
              <div class="detail-location">{{ isUnlocked(selectedItem.id) ? selectedItem.location : '???' }}</div>
              <p class="detail-description">
                {{ isUnlocked(selectedItem.id) ? selectedItem.description : t('lockedItemHint') }}
              </p>
            </div>
          </div>
          <div v-else class="detail-empty">
            <div class="empty-icon">📖</div>
            <div class="empty-text">{{ t('selectLocationHint') }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { i18n } from '../utils/i18n.js';

export default {
  name: 'CollectionView',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    collectionSystem: {
      type: Object,
      required: true
    },
    locale: {
      type: String,
      default: 'zh'
    }
  },
  data() {
    return {
      selectedItem: null,
      unlockedItems: new Set()
    };
  },
  computed: {
    t() {
      return i18n.t.bind(i18n);
    },
    allItems() {
      return this.collectionSystem?.getAllItems() || [];
    },
    // 只显示地点类收集物（建筑）
    locationItems() {
      return this.allItems.filter(item => item.category === 'location');
    },
    totalProgress() {
      const progress = this.collectionSystem?.getProgress();
      return progress?.percentage || 0;
    },
    unlockedCount() {
      return this.allItems.filter(item => this.isUnlocked(item.id)).length;
    },
    totalCount() {
      return this.allItems.length;
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.refreshUnlockedItems();
      }
    }
  },
  mounted() {
    this.refreshUnlockedItems();
    // 监听解锁事件
    if (this.collectionSystem) {
      this.collectionSystem.on('itemUnlocked', () => {
        this.refreshUnlockedItems();
      });
    }
  },
  methods: {
    refreshUnlockedItems() {
      if (this.collectionSystem) {
        // 从 collectionSystem 获取已解锁物品的数组
        const unlockedArray = this.collectionSystem.unlockedItemIds;
        this.unlockedItems = new Set(unlockedArray);
      }
    },
    isUnlocked(itemId) {
      return this.unlockedItems.has(itemId);
    },

    selectItem(item) {
      this.selectedItem = item;
    },
    close() {
      this.$emit('close');
    },
    handleOverlayClick() {
      this.close();
    }
  }
};
</script>

<style scoped>
.collection-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.collection-panel {
  width: 800px;
  height: 500px;
  background: url('/photo/Games/Collection.webp') no-repeat center center;
  background-size: 100% 100%;
  border-radius: 8px;
  position: relative;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
}

/* 标题 - 正上方 */
.collection-title-top {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: #5a3d2b;
  font-size: 32px;
  font-family: 'STKaiti', 'KaiTi', serif;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.5);
  margin: 0;
  z-index: 10;
}

/* 关闭按钮 - 右上角 */
.close-btn-corner {
  position: absolute;
  top: 15px;
  right: 20px;
  width: 36px;
  height: 36px;
  background: rgba(139, 90, 43, 0.8);
  border: 2px solid rgba(212, 175, 55, 0.5);
  border-radius: 50%;
  color: #f5e6c8;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  z-index: 10;
}

.close-btn-corner:hover {
  background: rgba(180, 60, 60, 0.9);
  border-color: rgba(212, 175, 55, 0.8);
}

/* 内容区 - 左右布局 */
.collection-content {
  padding: 70px 30px 30px 30px;
  display: flex;
  flex-direction: row;
  height: 100%;
  box-sizing: border-box;
  gap: 20px;
}

/* 左侧：地点列表 */
.location-list {
  width: 180px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  padding-right: 8px;
}

.location-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: rgba(139, 90, 43, 0.4);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.location-item:hover {
  background: rgba(139, 90, 43, 0.6);
  border-color: rgba(212, 175, 55, 0.5);
}

.location-item.active {
  background: rgba(139, 90, 43, 0.8);
  border-color: #d4af37;
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
}

.location-item.locked {
  opacity: 0.6;
}

.location-thumb {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumb-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-image.silhouette {
  filter: grayscale(100%) brightness(0.2) contrast(1.2);
  opacity: 0.5;
}

.thumb-icon {
  font-size: 20px;
}

.location-name {
  flex: 1;
  color: #ffffff;
  font-size: 14px;
  font-family: 'STKaiti', 'KaiTi', serif;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.location-item.locked .location-name {
  color: #ffffff;
  opacity: 0.8;
}

.location-status {
  font-size: 12px;
}

.status-unlocked {
  color: #4caf50;
}

.status-locked {
  opacity: 0.5;
}

/* 右侧：详情展示 */
.detail-display {
  flex: 1;
  background: rgba(139, 90, 43, 0.3);
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 12px;
  overflow: hidden;
}

.detail-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.detail-content.locked {
  opacity: 0.8;
}

.detail-image-wrapper {
  width: 100%;
  height: 280px;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.detail-large-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-large-image.silhouette {
  filter: grayscale(100%) brightness(0.15) contrast(1.2);
  opacity: 0.4;
}

.detail-icon-large {
  font-size: 80px;
}

.detail-info {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.detail-info .detail-title {
  color: #ffffff;
  font-size: 24px;
  margin: 0 0 8px 0;
  font-family: 'STKaiti', 'KaiTi', serif;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.detail-info .detail-location {
  color: #ffd700;
  font-size: 14px;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.3);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.detail-info .detail-description {
  color: #ffffff;
  font-size: 15px;
  line-height: 1.8;
  margin: 0;
  flex: 1;
  overflow-y: auto;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

/* 空状态 */
.detail-empty {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(245, 230, 200, 0.5);
}

.empty-icon {
  font-size: 60px;
  margin-bottom: 15px;
}

.empty-text {
  font-size: 16px;
  font-family: 'STKaiti', 'KaiTi', serif;
}

/* 滚动条样式 */
.location-list::-webkit-scrollbar {
  width: 4px;
}

.location-list::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}

.location-list::-webkit-scrollbar-thumb {
  background: rgba(212, 175, 55, 0.4);
  border-radius: 2px;
}

/* 滚动条样式 */
.items-grid::-webkit-scrollbar {
  width: 6px;
}

.items-grid::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.items-grid::-webkit-scrollbar-thumb {
  background: rgba(212, 175, 55, 0.5);
  border-radius: 3px;
}
</style>
