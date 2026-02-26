<template>
  <div class="collection-overlay" @click="handleOverlayClick">
    <div class="collection-panel" @click.stop>
      <!-- 关闭按钮 - 右上角 -->
      <button class="close-btn-corner" @click="close">×</button>
      
      <!-- 标题 - 正上方 -->
      <h2 class="collection-title-top">{{ t('collectionTitle') }}</h2>

      <!-- 内容区 -->
      <div class="collection-content">
        <div class="items-grid">
          <div
            v-for="item in allItems"
            :key="item.id"
            class="item-card"
            :class="{ unlocked: isUnlocked(item.id), locked: !isUnlocked(item.id) }"
            @click="selectItem(item)"
          >
            <div class="item-icon">{{ isUnlocked(item.id) ? item.icon : '???' }}</div>
            <div class="item-name">{{ isUnlocked(item.id) ? item.name : '???' }}</div>
          </div>
        </div>

        <!-- 选中物品详情 -->
        <div v-if="selectedItem && isUnlocked(selectedItem.id)" class="item-detail">
          <h3 class="detail-title">{{ selectedItem.name }}</h3>
          <div class="detail-icon">{{ selectedItem.icon }}</div>
          <p class="detail-description">{{ selectedItem.description }}</p>
          <div class="detail-meta">
            <span class="detail-location">{{ t('discoveredAt') }}: {{ selectedItem.location }}</span>
          </div>
        </div>
        <div v-else-if="selectedItem && !isUnlocked(selectedItem.id)" class="item-detail locked">
          <h3 class="detail-title">???</h3>
          <div class="detail-icon">🔒</div>
          <p class="detail-description">{{ t('lockedItemHint') }}</p>
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
        this.unlockedItems = new Set(this.collectionSystem.unlockedItems);
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
  background: url('/photo/Games/Collection.png') no-repeat center center;
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

/* 内容区 */
.collection-content {
  padding: 70px 50px 40px 50px;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
  overflow-y: auto;
  padding-right: 10px;
  flex: 1;
}

.item-card {
  aspect-ratio: 1;
  background: rgba(139, 90, 43, 0.6);
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.item-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.item-card.unlocked {
  background: rgba(139, 90, 43, 0.8);
  border-color: rgba(212, 175, 55, 0.6);
}

.item-card.locked {
  background: rgba(100, 100, 100, 0.4);
  border-color: rgba(150, 150, 150, 0.3);
  opacity: 0.6;
}

.item-icon {
  font-size: 36px;
  margin-bottom: 8px;
}

.item-name {
  color: #f5e6c8;
  font-size: 12px;
  text-align: center;
  padding: 0 5px;
}

.item-card.locked .item-name {
  color: #999;
}

/* 详情区 */
.item-detail {
  margin-top: 20px;
  padding: 20px;
  background: rgba(139, 90, 43, 0.7);
  border: 2px solid rgba(212, 175, 55, 0.4);
  border-radius: 10px;
  flex: 1;
}

.item-detail.locked {
  background: rgba(80, 80, 80, 0.5);
  border-color: rgba(150, 150, 150, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.detail-title {
  color: #f5e6c8;
  font-size: 20px;
  margin-bottom: 10px;
  font-family: 'STKaiti', 'KaiTi', serif;
}

.detail-icon {
  font-size: 48px;
  margin: 10px 0;
}

.detail-description {
  color: #e8d4b8;
  font-size: 14px;
  line-height: 1.6;
  margin: 10px 0;
}

.detail-meta {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(212, 175, 55, 0.3);
}

.detail-location {
  color: #d4af37;
  font-size: 12px;
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
