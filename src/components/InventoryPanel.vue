<template>
  <div class="inventory-panel" v-if="ownedItems.length > 0">
    <div class="inv-header">{{ locale === 'zh' ? '已获得的任务道具' : 'Quest Items Obtained' }}</div>
    <transition-group name="item" tag="div" class="item-list">
      <div class="item-row" v-for="item in ownedItems" :key="item.id">
        <span class="item-icon">{{ item.icon }}</span>
        <span class="item-name">{{ locale === 'zh' ? item.name : item.nameEn }}</span>
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: 'InventoryPanel',
  props: {
    storyManager: { type: Object, default: null },
    locale: { type: String, default: 'zh' }
  },
  data() {
    return {
      items: [
        { id: 'familybook', name: '家谱', nameEn: 'Family Book', icon: '📖', flag: 'interacted_familybook' },
        { id: 'key', name: '铜钥匙', nameEn: 'Bronze Key', icon: '🔑', flag: 'eastwing_key_found', consumed: 'eastwing_door_unlocked' },
        { id: 'brush', name: '毛笔', nameEn: 'Brush', icon: '🖊️', flag: 'interacted_brush', consumed: 'ink_grinding_done' },
        { id: 'inkstick', name: '墨锭', nameEn: 'Ink Stick', icon: '⬛', flag: 'interacted_inkstick', consumed: 'ink_grinding_done' },
        { id: 'photopiece', name: '照片碎片', nameEn: 'Photo Piece', icon: '🖼️', flag: 'interacted_thirdson_photo', consumed: 'puzzle_completed' },
        { id: 'pomegranate', name: '石榴', nameEn: 'Pomegranate', icon: '🍎', flag: 'pomegranate_picked', consumed: 'pomegranate_share_completed' }
      ]
    };
  },
  computed: {
    ownedItems() {
      if (!this.storyManager) return [];
      return this.items.filter(item => {
        const hasItem = this.storyManager.getFlag(item.flag);
        if (!hasItem) return false;
        if (item.consumed) {
          return !this.storyManager.getFlag(item.consumed);
        }
        return true;
      });
    }
  }
};
</script>

<style scoped>
.inventory-panel {
  position: relative;
  z-index: 99;
  pointer-events: none;
  padding: 6px 16px 0;
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
}

.inv-header {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.38);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  margin-bottom: 2px;
  letter-spacing: 1px;
}

.item-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.item-row {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #fff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  font-size: 16px;
  font-weight: 700;
  line-height: 1.55;
}

.item-icon {
  font-size: 15px;
  line-height: 1;
  opacity: 0.85;
}

.item-name {
  white-space: nowrap;
}

.item-enter-active { transition: all 0.35s ease; }
.item-leave-active { transition: all 0.25s ease; }
.item-enter-from { opacity: 0; transform: translateX(-24px); }
.item-leave-to { opacity: 0; transform: translateX(-24px); }
</style>
