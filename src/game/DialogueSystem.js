/**
 * 对话系统 - 管理游戏对话UI
 */
export class DialogueSystem {
    constructor(container, locale = 'zh') {
        this.container = container;
        this.locale = locale;
        this.isActive = false;
        this.currentDialogue = null;
        this.currentIndex = 0;
        this.onComplete = null;
        this.elements = {};
        this.characterImages = {
            'zh': {
                '王爷爷': '/photo/Character2D/oldman.png',
                '你': '/photo/Character2D/me.png',
                '老奶奶': '/photo/Character2D/oldwoman.png'
            },
            'en': {
                'Grandpa Wang': '/photo/Character2D/oldman.png',
                'You': '/photo/Character2D/me.png',
                'Grandma': '/photo/Character2D/oldwoman.png'
            }
        };
        this.onKeyDown = this.onKeyDown.bind(this);
        this.createUI();
    }

    setLocale(locale) {
        this.locale = locale;
        // 更新继续提示文本
        if (this.elements.continueHint) {
            this.elements.continueHint.textContent = this.locale === 'zh' ? '按 F 继续' : 'Press F to Continue';
        }
    }

    getContinueText() {
        return this.locale === 'zh' ? '按 F 继续' : 'Press F to Continue';
    }

    createUI() {
        const dialogueBox = document.createElement('div');
        dialogueBox.className = 'dialogue-box';
        dialogueBox.style.cssText = `
            position: fixed;
            bottom: 40px;
            left: 50%;
            transform: translateX(-50%);
            width: 1200px;
            height: 337px;
            background-image: url('/photo/chatbox.png');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            display: none;
            z-index: 300;
        `;

        // 头像区域 - 左侧框内
        const characterAvatar = document.createElement('div');
        characterAvatar.className = 'dialogue-avatar';
        characterAvatar.style.cssText = `
            position: absolute;
            left: 210px;
            top: 40px;
            width: 150px;
            height: 150px;
            overflow: hidden;
            display: none;
        `;

        const avatarImg = document.createElement('img');
        avatarImg.className = 'dialogue-avatar-img';
        avatarImg.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: cover;
        `;
        characterAvatar.appendChild(avatarImg);

        // 名字区域 - 左下角红色框
        const nameArea = document.createElement('div');
        nameArea.className = 'dialogue-name-area';
        nameArea.style.cssText = `
            position: absolute;
            left: 183px;
            bottom: 75px;
            width: 200px;
            height: 45px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const speakerName = document.createElement('div');
        speakerName.className = 'dialogue-speaker';
        speakerName.style.cssText = `
            font-size: 18px;
            font-weight: 600;
            color: #fff;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
        `;
        nameArea.appendChild(speakerName);

        // 文本区域 - 右侧大框
        const textArea = document.createElement('div');
        textArea.className = 'dialogue-text-area';
        textArea.style.cssText = `
            position: absolute;
            left: 380px;
            top: 45px;
            width: 600px;
            height: 200px;
            display: flex;
            align-items: flex-start;
            padding: 20px;
            box-sizing: border-box;
        `;

        const textContent = document.createElement('div');
        textContent.className = 'dialogue-text';
        textContent.style.cssText = `
            font-size: 20px;
            color: #3a2c1a;
            line-height: 1.8;
            width: 100%;
        `;
        textArea.appendChild(textContent);

        // 继续提示 - 右下角
        const continueHint = document.createElement('div');
        continueHint.className = 'dialogue-continue';
        continueHint.style.cssText = `
            position: absolute;
            right: 250px;
            bottom: 65px;
            font-size: 16px;
            color: #3a2c1a;
            padding: 8px 20px;
            border-radius: 4px;
            animation: pulse 1.5s infinite;
        `;

        dialogueBox.appendChild(characterAvatar);
        dialogueBox.appendChild(nameArea);
        dialogueBox.appendChild(textArea);
        dialogueBox.appendChild(continueHint);

        this.container.appendChild(dialogueBox);


        //tips提示区域
        // 创建tips弹窗（与对话框相同位置，使用tips.png）
        const tipsBox = document.createElement('div');
        tipsBox.className = 'tips-box';
        tipsBox.style.cssText = `
            position: fixed;
            bottom: -50px;
            left: 50%;
            transform: translateX(-50%);
            width: 650px;
            height: 450px;
            background-image: url('/photo/tips.png');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            display: none;
            z-index: 350;
        `;

        // tips文本区域
        const tipsTextArea = document.createElement('div');
        tipsTextArea.className = 'tips-text-area';
        tipsTextArea.style.cssText = `
            position: absolute;
            left: 32px;
            top: 130px;
            width: 570px;
            height: 250px;
            display: flex;
            justify-content: flex-start;
            font-size: 20px;
            color: #3a2c1a;
            line-height: 1.8;
            padding: 20px;
            box-sizing: border-box;
            text-align: left;
        `;
        tipsBox.appendChild(tipsTextArea);

        // tips继续提示（已移除）

        this.container.appendChild(tipsBox);

        this.elements = {
            box: dialogueBox,
            avatar: characterAvatar,
            avatarImg: avatarImg,
            speaker: speakerName,
            text: textContent,
            continueHint: continueHint,
            tipsBox: tipsBox,
            tipsText: tipsTextArea,

        };

        this.addStyles();
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0%, 100% { opacity: 0.7; }
                50% { opacity: 1; }
            }
            .dialogue-box.show {
                display: block;
                animation: slideUp 0.3s ease;
            }
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    updateAvatar(speaker) {
        const localeImages = this.characterImages[this.locale] || this.characterImages['zh'];
        const avatarPath = localeImages[speaker];
        if (avatarPath) {
            this.elements.avatar.style.display = 'block';
            this.elements.avatarImg.src = avatarPath;
        } else {
            this.elements.avatar.style.display = 'none';
        }
    }

    start(dialogueData, onComplete) {
        this.currentDialogue = dialogueData;
        this.currentIndex = 0;
        this.onComplete = onComplete;
        this.isActive = true;
        this.isTyping = false; // 是否正在打字
        this.typeSpeed = 50; // 打字速度（毫秒/字）
        this.typeTimer = null; // 打字定时器
        this.elements.box.style.display = 'block';
        this.elements.box.classList.add('show');

        // 设置继续提示文本
        this.elements.continueHint.textContent = this.getContinueText();

        // 绑定F键监听
        document.addEventListener('keydown', this.onKeyDown);

        this.showCurrentLine();
    }

    onKeyDown(e) {
        if (!this.isActive) return;
        if (e.key.toLowerCase() === 'f') {
            e.preventDefault();
            // 如果正在打字，按F跳过打字直接显示完整文本
            if (this.isTyping) {
                this.skipTyping();
            } else {
                this.nextLine();
            }
        }
    }

    showCurrentLine() {
        if (!this.currentDialogue || this.currentIndex >= this.currentDialogue.length) {
            this.end();
            return;
        }

        const line = this.currentDialogue[this.currentIndex];
        this.elements.speaker.textContent = line.speaker || '';
        this.updateAvatar(line.speaker);

        // 开始打字机效果
        this.startTyping(line.text || '');
    }

    // 开始打字效果
    startTyping(fullText) {
        this.isTyping = true;
        this.fullText = fullText;
        this.currentText = '';
        this.charIndex = 0;

        // 隐藏继续提示
        this.elements.continueHint.style.opacity = '0.3';

        // 清除之前的定时器
        if (this.typeTimer) {
            clearInterval(this.typeTimer);
        }

        // 开始逐字显示
        this.typeTimer = setInterval(() => {
            if (this.charIndex < this.fullText.length) {
                this.currentText += this.fullText[this.charIndex];
                this.elements.text.textContent = this.currentText;
                this.charIndex++;
            } else {
                // 打字完成
                this.finishTyping();
            }
        }, this.typeSpeed);
    }

    // 跳过打字，直接显示完整文本
    skipTyping() {
        if (this.typeTimer) {
            clearInterval(this.typeTimer);
            this.typeTimer = null;
        }
        this.elements.text.textContent = this.fullText;
        this.finishTyping();
    }

    // 打字完成
    finishTyping() {
        this.isTyping = false;
        this.elements.continueHint.style.opacity = '1';
    }

    nextLine() {
        if (!this.isActive) return;
        this.currentIndex++;
        this.showCurrentLine();
    }

    end() {
        // 清除打字定时器
        if (this.typeTimer) {
            clearInterval(this.typeTimer);
            this.typeTimer = null;
        }

        this.isActive = false;
        this.isTyping = false;
        this.elements.box.style.display = 'none';
        this.elements.box.classList.remove('show');

        // 移除F键监听
        document.removeEventListener('keydown', this.onKeyDown);

        if (this.onComplete) {
            this.onComplete();
        }
    }

    isInDialogue() {
        return this.isActive;
    }

    // Tips相关状态
    isTipsActive = false;
    tipsOnComplete = null;
    isTipsTyping = false;
    tipsTypeTimer = null;
    tipsTypeSpeed = 30; // tips打字速度稍快

    // Tips的F键处理函数（绑定this）
    onTipsKeyDown = (e) => {
        if (e.key.toLowerCase() === 'f') {
            e.preventDefault();
            e.stopPropagation();
            // 如果正在打字，跳过打字显示全部文字
            if (this.isTipsTyping) {
                this.skipTipsTyping();
            } else {
                // 文字已显示完整，按F关闭tips
                this.hideTips();
            }
        }
    }

    // 切换tips显示/隐藏（类似对话框的F键逻辑）
    toggleTips() {
        if (this.isTipsActive) {
            // 关闭tips
            this.hideTips();
        }
    }

    // 隐藏tips
    hideTips() {
        // 清除打字定时器
        if (this.tipsTypeTimer) {
            clearInterval(this.tipsTypeTimer);
            this.tipsTypeTimer = null;
        }

        // 移除F键监听
        document.removeEventListener('keydown', this.onTipsKeyDown);

        this.isTipsActive = false;
        this.isTipsTyping = false;
        this.elements.tipsBox.style.display = 'none';
        this.elements.tipsBox.style.animation = '';

        // 立即执行回调，确保Vue组件能正确响应
        const callback = this.tipsOnComplete;
        this.tipsOnComplete = null; // 清除回调避免重复执行
        if (callback) {
            callback();
        }
    }

    // 显示tips提示框（按F弹出，再按F关闭）
    showTips(text, onComplete) {
        this.tipsOnComplete = onComplete;
        this.elements.tipsBox.style.display = 'block';
        this.elements.tipsBox.style.animation = 'slideUp 0.3s ease';
        this.isTipsActive = true;

        // 绑定F键监听
        document.addEventListener('keydown', this.onTipsKeyDown);

        // 开始打字效果
        this.startTipsTyping(text);
    }

    // 开始tips打字效果
    startTipsTyping(fullText) {
        this.isTipsTyping = true;
        this.tipsFullText = fullText;
        this.tipsCurrentText = '';
        this.tipsCharIndex = 0;

        // 清除之前的定时器
        if (this.tipsTypeTimer) {
            clearInterval(this.tipsTypeTimer);
        }

        // 开始逐字显示
        this.tipsTypeTimer = setInterval(() => {
            if (this.tipsCharIndex < this.tipsFullText.length) {
                this.tipsCurrentText += this.tipsFullText[this.tipsCharIndex];
                this.elements.tipsText.textContent = this.tipsCurrentText;
                this.tipsCharIndex++;
            } else {
                // 打字完成
                this.finishTipsTyping();
            }
        }, this.tipsTypeSpeed);
    }

    // 跳过tips打字
    skipTipsTyping() {
        if (this.tipsTypeTimer) {
            clearInterval(this.tipsTypeTimer);
            this.tipsTypeTimer = null;
        }
        this.elements.tipsText.textContent = this.tipsFullText;
        this.finishTipsTyping();
    }

    // tips打字完成
    finishTipsTyping() {
        this.isTipsTyping = false;
    }

    // 显示多页tips（类似对话框，按F翻页）
    showMultiPageTips(textArray, onComplete) {
        // 如果tips已经在显示，先关闭它
        if (this.isTipsActive) {
            // 先移除旧的事件监听
            if (this.tipsKeyHandler) {
                document.removeEventListener('keydown', this.tipsKeyHandler);
                this.tipsKeyHandler = null;
            }
            // 关闭但不触发回调
            this.isTipsActive = false;
            this.elements.tipsBox.style.display = 'none';
            this.elements.tipsBox.style.animation = '';
        }

        this.tipsPages = textArray;
        this.tipsCurrentIndex = 0;
        this.tipsOnComplete = onComplete;
        this.isTipsActive = true;

        // 显示第一页
        this.elements.tipsText.textContent = this.tipsPages[0];
        this.elements.tipsBox.style.display = 'block';
        this.elements.tipsBox.style.animation = 'slideUp 0.3s ease';

        // 绑定F键翻页（使用捕获阶段，优先处理）
        this.tipsKeyHandler = (e) => {
            if (e.key.toLowerCase() === 'f') {
                e.preventDefault();
                e.stopPropagation();
                this.nextTipsPage();
            }
        };
        document.addEventListener('keydown', this.tipsKeyHandler, true);
    }

    // 下一页tips
    nextTipsPage() {
        this.tipsCurrentIndex++;
        if (this.tipsCurrentIndex >= this.tipsPages.length) {
            // 所有页都显示完了，关闭
            this.hideMultiPageTips();
        } else {
            // 显示下一页
            this.elements.tipsText.textContent = this.tipsPages[this.tipsCurrentIndex];
        }
    }

    // 隐藏多页tips
    hideMultiPageTips() {
        // 先移除F键监听（使用相同的捕获阶段参数）
        if (this.tipsKeyHandler) {
            document.removeEventListener('keydown', this.tipsKeyHandler, true);
            this.tipsKeyHandler = null;
        }

        this.isTipsActive = false;
        this.elements.tipsBox.style.display = 'none';
        this.elements.tipsBox.style.animation = '';
        this.tipsPages = null; // 清除多页数据

        // 延迟执行回调
        setTimeout(() => {
            if (this.tipsOnComplete) {
                this.tipsOnComplete();
            }
        }, 50);
    }

    // 检查tips是否处于显示状态
    isTipsShowing() {
        return this.isTipsActive;
    }
}

export default DialogueSystem;
