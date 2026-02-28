/**
 * 剧情管理器 - 控制游戏剧情流程
 */
export class StoryManager {
    constructor() {
        this.currentChapter = 0;
        this.currentScene = 0;
        this.storyData = null;
        this.eventCallbacks = {};
        this.flags = new Map(); // 剧情标记
    }

    /**
     * 加载剧情数据
     */
    loadStory(storyData) {
        this.storyData = storyData;
        this.currentChapter = 0;
        this.currentScene = 0;
    }

    /**
     * 获取当前场景
     */
    getCurrentScene() {
        if (!this.storyData) return null;
        const chapter = this.storyData.chapters[this.currentChapter];
        if (!chapter) return null;
        return chapter.scenes[this.currentScene];
    }

    /**
     * 进入下一场景
     */
    nextScene() {
        const chapter = this.storyData.chapters[this.currentChapter];
        if (this.currentScene < chapter.scenes.length - 1) {
            this.currentScene++;
            this.triggerSceneStart();
            return true;
        }
        return this.nextChapter();
    }

    /**
     * 进入下一章节
     */
    nextChapter() {
        if (this.currentChapter < this.storyData.chapters.length - 1) {
            this.currentChapter++;
            this.currentScene = 0;
            this.triggerSceneStart();
            return true;
        }
        return false; // 剧情结束
    }

    /**
     * 跳转到指定场景
     */
    gotoScene(chapterIndex, sceneIndex) {
        if (this.storyData.chapters[chapterIndex]?.scenes[sceneIndex]) {
            this.currentChapter = chapterIndex;
            this.currentScene = sceneIndex;
            this.triggerSceneStart();
            return true;
        }
        return false;
    }

    /**
     * 触发场景开始事件
     */
    triggerSceneStart() {
        const scene = this.getCurrentScene();
        if (scene) {
            this.emit('sceneStart', scene);
            if (scene.onEnter) {
                scene.onEnter(this);
            }
        }
    }

    /**
     * 设置剧情标记
     */
    setFlag(key, value = true) {
        this.flags.set(key, value);
    }

    /**
     * 获取剧情标记
     */
    getFlag(key) {
        return this.flags.get(key) || false;
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
     * 检查条件是否满足
     */
    checkCondition(condition) {
        if (!condition) return true;
        if (condition.flag) {
            return this.getFlag(condition.flag) === condition.value;
        }
        return true;
    }

    /**
     * 加载剧情标记（用于存档恢复）
     */
    loadFlags(flags) {
        if (flags && typeof flags === 'object') {
            this.flags = new Map(Object.entries(flags));
        }
    }

    /**
     * 获取所有剧情标记（用于存档）
     */
    getAllFlags() {
        return Object.fromEntries(this.flags);
    }

    /**
     * 获取王爷爷当前位置
     * 返回: 'gate' (大门) 或 'chuihuamen' (垂花门) 或 null (隐藏)
     */
    getGrandpaLocation() {
        // 如果已完成门槛交互，王爷爷移动到垂花门
        if (this.getFlag('threshold_interacted')) {
            return 'chuihuamen';
        }
        // 如果已完成第一章对话，王爷爷在大门
        if (this.getFlag('scene1_1_completed')) {
            return 'gate';
        }
        // 默认在大门
        return 'gate';
    }

    /**
     * 检查王爷爷是否可见
     */
    isGrandpaVisible() {
        const location = this.getGrandpaLocation();
        return location !== null;
    }
}

export default StoryManager;
