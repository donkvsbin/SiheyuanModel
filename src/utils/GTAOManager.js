/**
 * GTAO (Ground Truth Ambient Occlusion) 管理器
 * 用于 Minecraft 风格平滑光照效果
 */
import * as THREE from 'three';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';

export class GTAOManager {
    constructor(options = {}) {
        this.gtaoPass = null;
        this.composer = null;
        this.scene = null;
        this.camera = null;

        // 默认参数 - 针对 Minecraft 风格优化
        this.params = {
            // AO 强度 (0-2)
            intensity: options.intensity ?? 1.6,
            // AO 半径 - 影响遮蔽范围
            radius: options.radius ?? 0.4,
            // 采样数量 - 越高质量越好，性能越低
            samples: options.samples ?? 16,
            // 模糊强度 - 降低噪点
            blurRadius: options.blurRadius ?? 6,
            // 距离衰减指数
            distanceExponent: options.distanceExponent ?? 1,
            // 厚度补偿 - 避免漏光
            thickness: options.thickness ?? 1.5,
            // 缩放系数
            scale: options.scale ?? 1.2,
            // 分辨率缩放 (0.5 = 半分辨率)
            resolutionScale: options.resolutionScale ?? 1,
            // 是否启用
            enabled: options.enabled ?? true
        };

        this.width = 0;
        this.height = 0;
    }

    /**
     * 初始化 GTAO Pass
     * @param {THREE.Scene} scene 
     * @param {THREE.Camera} camera 
     * @param {number} width 
     * @param {number} height 
     * @returns {GTAOPass}
     */
    init(scene, camera, width, height) {
        this.scene = scene;
        this.camera = camera;
        this.width = width;
        this.height = height;

        // 计算实际渲染分辨率
        const renderWidth = Math.floor(width * this.params.resolutionScale);
        const renderHeight = Math.floor(height * this.params.resolutionScale);

        // 创建 GTAO Pass
        this.gtaoPass = new GTAOPass(scene, camera, renderWidth, renderHeight);
        this.gtaoPass.output = GTAOPass.OUTPUT.Default;
        this.gtaoPass.enabled = this.params.enabled;

        // 应用初始参数
        this.updateMaterial();
        this.updateBlur();

        return this.gtaoPass;
    }

    /**
     * 更新 GTAO 材质参数
     */
    updateMaterial() {
        if (!this.gtaoPass) return;

        this.gtaoPass.updateGtaoMaterial({
            radius: this.params.radius,
            distanceExponent: this.params.distanceExponent,
            thickness: this.params.thickness,
            scale: this.params.scale,
            samples: this.params.samples
        });

        // 正确设置 intensity uniform
        if (this.gtaoPass.gtaoMaterial && this.gtaoPass.gtaoMaterial.uniforms.intensity) {
            this.gtaoPass.gtaoMaterial.uniforms.intensity.value = this.params.intensity;
        }
    }

    /**
     * 更新模糊参数
     */
    updateBlur() {
        if (!this.gtaoPass) return;

        // GTAOPass 内置双边模糊
        if (this.gtaoPass.pdMaterial) {
            this.gtaoPass.pdMaterial.uniforms.radius.value = this.params.blurRadius;
        }
    }

    /**
     * 设置 AO 强度
     * @param {number} value 0-2
     */
    setIntensity(value) {
        this.params.intensity = Math.max(0, Math.min(2, value));
        if (this.gtaoPass && this.gtaoPass.gtaoMaterial && this.gtaoPass.gtaoMaterial.uniforms.intensity) {
            this.gtaoPass.gtaoMaterial.uniforms.intensity.value = this.params.intensity;
        }
    }

    /**
     * 设置 AO 半径
     * @param {number} value 
     */
    setRadius(value) {
        this.params.radius = value;
        this.updateMaterial();
    }

    /**
     * 设置采样数量
     * @param {number} value 8/16/32
     */
    setSamples(value) {
        this.params.samples = value;
        this.updateMaterial();
    }

    /**
     * 设置模糊强度
     * @param {number} value 
     */
    setBlurRadius(value) {
        this.params.blurRadius = value;
        this.updateBlur();
    }

    /**
     * 设置距离衰减
     * @param {number} value 
     */
    setDistanceExponent(value) {
        this.params.distanceExponent = value;
        this.updateMaterial();
    }

    /**
     * 设置厚度补偿
     * @param {number} value 
     */
    setThickness(value) {
        this.params.thickness = value;
        this.updateMaterial();
    }

    /**
     * 设置分辨率缩放
     * @param {number} scale 0.5 = 半分辨率
     */
    setResolutionScale(scale) {
        this.params.resolutionScale = scale;
        if (this.gtaoPass && this.width && this.height) {
            const renderWidth = Math.floor(this.width * scale);
            const renderHeight = Math.floor(this.height * scale);
            this.gtaoPass.setSize(renderWidth, renderHeight);
        }
    }

    /**
     * 启用/禁用 GTAO
     * @param {boolean} enabled 
     */
    setEnabled(enabled) {
        this.params.enabled = enabled;
        if (this.gtaoPass) {
            this.gtaoPass.enabled = enabled;
        }
    }

    /**
     * 窗口大小变化时调用
     * @param {number} width 
     * @param {number} height 
     */
    resize(width, height) {
        this.width = width;
        this.height = height;

        if (this.gtaoPass) {
            const renderWidth = Math.floor(width * this.params.resolutionScale);
            const renderHeight = Math.floor(height * this.params.resolutionScale);
            this.gtaoPass.setSize(renderWidth, renderHeight);
        }
    }

    /**
     * 批量更新参数
     * @param {Object} params 
     */
    updateParams(params) {
        Object.assign(this.params, params);
        this.updateMaterial();
        this.updateBlur();
    }

    /**
     * 获取当前参数
     * @returns {Object}
     */
    getParams() {
        return { ...this.params };
    }

    /**
     * 切换输出模式（用于调试）
     * @param {string} mode 'default' | 'ao' | 'depth' | 'normal'
     */
    setOutputMode(mode) {
        if (!this.gtaoPass) return;

        const modes = {
            'default': GTAOPass.OUTPUT.Default,
            'ao': GTAOPass.OUTPUT.AO,
            'depth': GTAOPass.OUTPUT.Depth,
            'normal': GTAOPass.OUTPUT.Normal,
            'denoise': GTAOPass.OUTPUT.Denoise
        };

        this.gtaoPass.output = modes[mode] || GTAOPass.OUTPUT.Default;
    }

    /**
     * 销毁
     */
    dispose() {
        if (this.gtaoPass) {
            this.gtaoPass.dispose?.();
            this.gtaoPass = null;
        }
        this.scene = null;
        this.camera = null;
    }
}

/**
 * 预设参数配置
 */
export const GTAOPresets = {
    // Minecraft 风格 - 柔和、平滑、稳定
    minecraft: {
        radius: 0.4,
        samples: 16,
        blurRadius: 6,
        distanceExponent: 1,
        thickness: 1.5,
        scale: 1.2,
        intensity: 1.6
    },
    // 高质量 - 更精细
    highQuality: {
        radius: 0.3,
        samples: 32,
        blurRadius: 6,
        distanceExponent: 1.2,
        thickness: 1.5,
        scale: 1,
        intensity: 1.0
    },
    // 性能优先 - 半分辨率
    performance: {
        radius: 0.25,
        samples: 16,
        blurRadius: 8,
        distanceExponent: 1,
        thickness: 1.0,
        scale: 1.2,
        resolutionScale: 0.5,
        intensity: 1.2
    },
    // 强接触阴影 - 强化边缘
    strongContact: {
        radius: 0.15,
        samples: 16,
        blurRadius: 4,
        distanceExponent: 2,
        thickness: 2,
        scale: 1.5,
        intensity: 1.0
    }
};

export default GTAOManager;
