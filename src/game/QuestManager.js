/**
 * 任务管理器 - 管理游戏任务系统
 */

export class QuestManager {
    constructor() {
        this.quests = [];
        this.currentQuestIndex = -1;
        this.completedQuests = [];
        this.listeners = [];
    }

    // 加载任务数据
    loadQuests(questData) {
        this.quests = questData;
        // 只有在没有设置过任务索引时才从第一个任务开始
        if (this.quests.length > 0 && this.currentQuestIndex === -1) {
            this.currentQuestIndex = 0;
            this.notify('questStart', this.getCurrentQuest());
        }
    }

    // 获取当前任务
    getCurrentQuest() {
        if (this.currentQuestIndex >= 0 && this.currentQuestIndex < this.quests.length) {
            return this.quests[this.currentQuestIndex];
        }
        return null;
    }

    // 获取当前任务索引
    getCurrentQuestIndex() {
        return this.currentQuestIndex;
    }

    // 完成任务
    completeCurrentQuest() {
        const currentQuest = this.getCurrentQuest();
        if (!currentQuest) return false;

        // 标记为完成
        this.completedQuests.push({
            ...currentQuest,
            completedAt: Date.now()
        });

        this.notify('questComplete', currentQuest);

        // 进入下一个任务
        this.currentQuestIndex++;

        if (this.currentQuestIndex < this.quests.length) {
            const nextQuest = this.getCurrentQuest();
            this.notify('questStart', nextQuest);
            return true;
        } else {
            // 所有任务完成
            this.notify('allQuestsComplete', null);
            return false;
        }
    }

    // 检查特定任务是否完成
    isQuestCompleted(questId) {
        return this.completedQuests.some(q => q.id === questId);
    }

    // 获取所有已完成任务
    getCompletedQuests() {
        return this.completedQuests;
    }

    // 获取任务进度
    getProgress() {
        return {
            current: this.currentQuestIndex + 1,
            total: this.quests.length,
            completed: this.completedQuests.length
        };
    }

    // 保存任务状态
    saveState() {
        return {
            currentQuestIndex: this.currentQuestIndex,
            completedQuests: this.completedQuests
        };
    }

    // 加载任务状态
    loadState(state) {
        if (state.completedQuests) {
            this.completedQuests = state.completedQuests;
        }
        if (state.currentQuestIndex !== undefined) {
            this.currentQuestIndex = state.currentQuestIndex;
            // 触发当前任务开始事件，通知UI更新
            const currentQuest = this.getCurrentQuest();
            if (currentQuest) {
                this.notify('questStart', currentQuest);
            }
        }
    }

    // 添加事件监听
    on(event, callback) {
        this.listeners.push({ event, callback });
    }

    // 移除事件监听
    off(event, callback) {
        this.listeners = this.listeners.filter(
            l => !(l.event === event && l.callback === callback)
        );
    }

    // 通知事件
    notify(event, data) {
        this.listeners
            .filter(l => l.event === event)
            .forEach(l => l.callback(data));
    }
}

export default QuestManager;
