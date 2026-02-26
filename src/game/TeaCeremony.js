/**
 * 茶道小游戏逻辑管理器
 * 处理茶道流程、计分、步骤状态
 */

export class TeaCeremony {
    constructor() {
        this.step = 0;
        this.score = 0;
        this.startTime = 0;
        this.isActive = false;
        this.onComplete = null;
        this.onStepChange = null;
    }

    // 开始茶道
    start(locale = 'zh') {
        this.step = 0;
        this.score = 0;
        this.startTime = Date.now();
        this.isActive = true;
        this.locale = locale;

        if (this.onStepChange) {
            this.onStepChange(this.getCurrentStep());
        }
    }

    // 获取步骤配置
    getSteps() {
        return this.locale === 'zh' ? [
            { name: '温杯', desc: '用热水温润茶杯', time: 2000 },
            { name: '投茶', desc: '将茶叶放入杯中', time: 1500 },
            { name: '注水', desc: '缓缓注入热水', time: 3000 },
            { name: '品茗', desc: '细品茶香', time: 2000 }
        ] : [
            { name: 'Warm Cup', desc: 'Rinse the cup with hot water', time: 2000 },
            { name: 'Add Tea', desc: 'Put tea leaves into the cup', time: 1500 },
            { name: 'Pour Water', desc: 'Slowly pour hot water', time: 3000 },
            { name: 'Taste', desc: 'Savor the tea aroma', time: 2000 }
        ];
    }

    // 获取当前步骤
    getCurrentStep() {
        const steps = this.getSteps();
        if (this.step >= steps.length) {
            return null;
        }
        return {
            ...steps[this.step],
            index: this.step,
            total: steps.length
        };
    }

    // 获取进度条状态（0-100，用于可视化）
    getProgressState() {
        if (!this.isActive) return null;
        const steps = this.getSteps();
        if (this.step >= steps.length) return null;

        const currentStep = steps[this.step];
        const elapsed = Date.now() - this.startTime;
        const perfectTime = currentStep.time;
        const tolerance = 500; // 完美区域 ±500ms

        // 计算进度百分比（基于当前步骤总时间）
        const progress = Math.min(100, (elapsed / perfectTime) * 100);

        // 完美区域在进度条上的位置（中间区域）
        const perfectStart = 40; // 40% 开始
        const perfectEnd = 60;   // 60% 结束

        // 判断当前是否在完美区域内
        const inPerfectZone = progress >= perfectStart && progress <= perfectEnd;

        return {
            progress,
            perfectStart,
            perfectEnd,
            inPerfectZone,
            elapsed,
            perfectTime
        };
    }

    // 处理步骤（按F时调用）
    handleStep(isPerfect) {
        if (!this.isActive) return { finished: false, result: null };

        const steps = this.getSteps();
        if (this.step >= steps.length) return { finished: false, result: null };

        let result;
        if (isPerfect) {
            this.score += 100; // 完美时机
            result = 'perfect';
        } else {
            this.score += 20; // 一般时机
            result = 'normal';
        }

        this.step++;

        // 检查是否完成
        if (this.step >= steps.length) {
            this.isActive = false;
            if (this.onComplete) {
                this.onComplete({
                    score: this.score,
                    rating: this.getRating()
                });
            }
            return { finished: true, result }; // 完成
        }

        // 通知步骤变化
        if (this.onStepChange) {
            this.onStepChange(this.getCurrentStep());
        }

        return { finished: false, result }; // 未完成，继续
    }

    // 获取评级
    getRating() {
        if (this.score >= 350) {
            return {
                level: 'perfect',
                text: this.locale === 'zh' ? '完美！' : 'Perfect!'
            };
        } else if (this.score >= 200) {
            return {
                level: 'good',
                text: this.locale === 'zh' ? '良好' : 'Good'
            };
        } else {
            return {
                level: 'normal',
                text: this.locale === 'zh' ? '再接再厉' : 'Keep practicing'
            };
        }
    }

    // 结束茶道
    end() {
        this.isActive = false;
        this.step = 0;
        this.score = 0;
    }

    // 获取状态
    getState() {
        return {
            isActive: this.isActive,
            step: this.step,
            score: this.score,
            currentStep: this.getCurrentStep()
        };
    }
}
