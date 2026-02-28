/**
 * 游戏存档管理器
 * 负责保存和加载游戏进度
 */

export class SaveManager {
    constructor() {
        this.saveKey = 'siheyuan-save';
    }

    // 保存游戏
    save(data) {
        const saveData = {
            timestamp: Date.now(),
            playerPosition: data.playerPosition,
            unlockedItems: data.unlockedItems,
            storyFlags: data.storyFlags,
            grandpaMemory: data.grandpaMemory, // 王爷爷的记忆恢复进度
            questState: data.questState, // 任务系统状态
            locale: data.locale
        };
        localStorage.setItem(this.saveKey, JSON.stringify(saveData));
    }

    // 加载游戏
    load() {
        const saveData = localStorage.getItem(this.saveKey);
        if (!saveData) return null;
        try {
            return JSON.parse(saveData);
        } catch (e) {
            console.error('存档加载失败:', e);
            return null;
        }
    }

    // 检查是否有存档
    hasSave() {
        return !!localStorage.getItem(this.saveKey);
    }

    // 删除存档
    clear() {
        localStorage.removeItem(this.saveKey);
    }

    // 获取存档时间
    getSaveTime() {
        const saveData = this.load();
        return saveData ? saveData.timestamp : null;
    }
}

// 单例导出
export const saveManager = new SaveManager();
export default saveManager;
