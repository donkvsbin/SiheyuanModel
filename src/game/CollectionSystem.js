/**
 * 收集系统管理器 - 管理发现日志/收集物
 */
export class CollectionSystem {
    constructor() {
        this.unlockedItems = new Set();
        this.eventCallbacks = {};
        this.collectionData = null;
    }

    /**
     * 加载收集物数据
     */
    loadCollectionData(data) {
        this.collectionData = data;
    }

    /**
     * 解锁收集物
     */
    unlockItem(itemId) {
        if (!this.unlockedItems.has(itemId)) {
            this.unlockedItems.add(itemId);
            this.emit('itemUnlocked', itemId);
            return true;
        }
        return false;
    }

    /**
     * 检查收集物是否已解锁
     */
    isUnlocked(itemId) {
        return this.unlockedItems.has(itemId);
    }

    /**
     * 获取所有收集物
     */
    getAllItems() {
        if (!this.collectionData) return [];
        return this.collectionData.items || [];
    }

    /**
     * 获取已解锁的收集物
     */
    getUnlockedItems() {
        const allItems = this.getAllItems();
        return allItems.filter(item => this.unlockedItems.has(item.id));
    }

    /**
     * 获取指定分类的收集物
     */
    getItemsByCategory(category) {
        const allItems = this.getAllItems();
        return allItems.filter(item => item.category === category);
    }

    /**
     * 获取收集进度
     */
    getProgress() {
        const allItems = this.getAllItems();
        if (allItems.length === 0) return { unlocked: 0, total: 0, percentage: 0 };
        const unlocked = this.unlockedItems.size;
        return {
            unlocked,
            total: allItems.length,
            percentage: Math.round((unlocked / allItems.length) * 100)
        };
    }

    /**
     * 根据交互点ID获取对应收集物
     */
    getItemByInteractionId(interactionId) {
        if (!this.collectionData) return null;
        return this.collectionData.items?.find(item => item.interactionId === interactionId);
    }

    /**
     * 事件监听
     */
    on(event, callback) {
        if (!this.eventCallbacks[event]) {
            this.eventCallbacks[event] = [];
        }
        this.eventCallbacks[event].push(callback);
    }

    /**
     * 触发事件
     */
    emit(event, data) {
        const callbacks = this.eventCallbacks[event];
        if (callbacks) {
            callbacks.forEach(cb => cb(data));
        }
    }

    /**
     * 保存到本地存储
     */
    saveToStorage() {
        const data = {
            unlockedItems: Array.from(this.unlockedItems)
        };
        localStorage.setItem('siheyuan_collection', JSON.stringify(data));
    }

    /**
     * 从本地存储加载
     */
    loadFromStorage() {
        try {
            const data = JSON.parse(localStorage.getItem('siheyuan_collection'));
            if (data && data.unlockedItems) {
                this.unlockedItems = new Set(data.unlockedItems);
            }
        } catch (e) {
            console.warn('加载收集数据失败:', e);
        }
    }

    /**
     * 重置收集进度
     */
    reset() {
        this.unlockedItems.clear();
        this.saveToStorage();
    }
}

export default CollectionSystem;
