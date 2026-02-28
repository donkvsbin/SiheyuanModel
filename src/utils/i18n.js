/**
 * 国际化语言管理器
 */

// 语言数据
const messages = {
    zh: {
        // StartMenu
        newGame: '新游戏',
        continueGame: '继续游戏',
        viewGuide: '参观指南',
        settings: '设置',
        about: '关于',
        exit: '退出',
        help: '帮助',
        // Guide
        guideTitle: '参观指南',
        controls: '移动控制：',
        wasd: 'WASD - 移动方向',
        mouse: '鼠标 - 视角转动',
        space: '空格 - 跳跃',
        flyMode: 'G - 切换飞行模式',
        flyControls: '飞行模式下：Shift下降 / Space上升',
        otherOps: '其他操作：',
        escMenu: 'ESC - 打开设置菜单',
        clickLock: '点击屏幕 - 重新锁定鼠标',
        close: '关闭',
        // About
        aboutTitle: '关于',
        appName: '四合院虚拟现实游',
        subtitle: 'Siheyuan Tour Model',
        tech: '基于 Three.js + Rapier 构建的四合院虚拟游览系统',
        author: 'By Mello',
        // Settings
        settingsTitle: '设置',
        settingsDesc: '设置选项将在游戏内通过ESC键访问',
        language: '语言',
        zhLang: '中文',
        enLang: 'English',
        // ESC Settings
        videoOptions: '视频选项',
        ambientLight: '环境光强度',
        dirLight: '平行光强度',
        bloom: '泛光强度',
        exposure: '曝光',
        musicOptions: '音乐选项',
        enableMusic: '开启音乐',
        volume: '音量',
        perfOptions: '性能选项',
        maxFPS: '最高FPS',
        timeOptions: '时间选项',
        sunTime: '太阳时间',
        backToGame: '返回游戏',
        saveAndExit: '保存并退出',
        clickToContinue: '点击继续',
        currentQuest: '当前任务',
        back: '返回',
        // Interaction
        interactHint: 'test',
        // Dialogue
        continueHint: '按 F 继续',
        // Loading hints
        loadingHint1: '正在为您推开朱红大门...',
        loadingHint2: '正在点亮院内灯笼...',
        loadingHint3: '正在唤醒沉睡的脊兽...',
        loadingHint4: '正在准备迎客茶点...',
        // Calligraphy
        'calligraphy.title': '书法临摹',
        'calligraphy.clear': '清空',
        'calligraphy.save': '保存作品',
        'calligraphy.hint': '按住鼠标左键在画布上书写，ESC键退出',
        // Collection
        collectionTitle: '发现日志',
        categoryAll: '全部',
        categoryArchitecture: '建筑',
        categoryCulture: '文化',
        categoryCharacter: '人物',
        categoryNature: '自然',
        discoveredAt: '发现地点',
        lockedItemHint: '继续探索四合院，发现更多隐藏的秘密...',
        lockedItemLocation: '位置提示'
    },
    en: {
        // StartMenu
        newGame: 'New Game',
        continueGame: 'Continue',
        viewGuide: 'View Guide',
        settings: 'Settings',
        about: 'About',
        exit: 'Exit',
        help: 'Help',
        // Guide
        guideTitle: 'View Guide',
        controls: 'Controls:',
        wasd: 'WASD - Move',
        mouse: 'Mouse - Look around',
        space: 'Space - Jump',
        flyMode: 'G - Toggle Fly Mode',
        flyControls: 'Fly Mode: Shift down / Space up',
        otherOps: 'Other:',
        escMenu: 'ESC - Open Settings',
        clickLock: 'Click screen - Lock mouse',
        close: 'Close',
        // About
        aboutTitle: 'About',
        appName: 'Siheyuan Virtual Tour',
        subtitle: 'Siheyuan Tour Model',
        tech: 'Built with Three.js + Rapier',
        author: 'By Mello',
        // Settings
        settingsTitle: 'Settings',
        settingsDesc: 'Settings can be accessed via ESC key in game',
        language: 'Language',
        zhLang: '中文',
        enLang: 'English',
        // ESC Settings
        videoOptions: 'Video Options',
        ambientLight: 'Ambient Light',
        dirLight: 'Directional Light',
        bloom: 'Bloom Strength',
        exposure: 'Exposure',
        musicOptions: 'Music Options',
        enableMusic: 'Enable Music',
        volume: 'Volume',
        perfOptions: 'Performance',
        maxFPS: 'Max FPS',
        timeOptions: 'Time Options',
        sunTime: 'Sun Time',
        backToGame: 'Back to Game',
        saveAndExit: 'Save & Exit',
        clickToContinue: 'Click to continue',
        currentQuest: 'Current Quest',
        back: 'Back',
        // Interaction
        interactHint: 'test',
        // Dialogue
        continueHint: 'Press F to Continue',
        // Loading hints
        loadingHint1: 'Opening the vermilion gate for you...',
        loadingHint2: 'Lighting the courtyard lanterns...',
        loadingHint3: 'Awakening the sleeping ridge beasts...',
        loadingHint4: 'Preparing tea and refreshments...',
        // Calligraphy
        'calligraphy.title': 'Calligraphy Practice',
        'calligraphy.clear': 'Clear',
        'calligraphy.save': 'Save Work',
        'calligraphy.hint': 'Hold left mouse button to write, ESC to exit',
        // Collection
        collectionTitle: 'Discovery Log',
        categoryAll: 'All',
        categoryArchitecture: 'Architecture',
        categoryCulture: 'Culture',
        categoryCharacter: 'Characters',
        categoryNature: 'Nature',
        discoveredAt: 'Discovered at',
        lockedItemHint: 'Continue exploring the siheyuan to discover more secrets...',
        lockedItemLocation: 'Location Hint'
    }
};

class I18n {
    constructor() {
        this.locale = localStorage.getItem('game-language') || 'zh';
        this.listeners = [];
    }

    // 获取当前语言
    getLocale() {
        return this.locale;
    }

    // 切换语言
    setLocale(locale) {
        if (this.locale !== locale && messages[locale]) {
            this.locale = locale;
            localStorage.setItem('game-language', locale);
            this.notify();
        }
    }

    // 获取翻译文本
    t(key) {
        return messages[this.locale]?.[key] || messages['zh'][key] || key;
    }

    // 监听语言变化
    onChange(callback) {
        this.listeners.push(callback);
    }

    // 通知所有监听器
    notify() {
        this.listeners.forEach(cb => cb(this.locale));
    }
}

// 单例导出
export const i18n = new I18n();
export default i18n;
