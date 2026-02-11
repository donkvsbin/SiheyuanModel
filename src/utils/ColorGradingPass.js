/**
 * 色彩分级 Pass
 * MC风格暖色调 + 对比度增强
 */
import * as THREE from 'three';
import { Pass, FullScreenQuad } from 'three/addons/postprocessing/Pass.js';

const ColorGradingShader = {
    uniforms: {
        tDiffuse: { value: null },
        // 色温调整 (负值偏暖，正值偏冷)
        temperature: { value: 0.1 },
        // 色调调整 (负值偏绿，正值偏品红)
        tint: { value: 0.0 },
        // 对比度 (1.0 = 无变化)
        contrast: { value: 1.1 },
        // 饱和度 (1.0 = 无变化)
        saturation: { value: 1.05 },
        // 亮度 (0.0 = 无变化)
        brightness: { value: 0.0 },
        // 曝光 (1.0 = 无变化)
        exposure: { value: 1.0 },
        // 阴影色调 (RGB)
        shadowColor: { value: new THREE.Vector3(0.0, 0.0, 0.05) },
        // 高光色调 (RGB)
        highlightColor: { value: new THREE.Vector3(0.05, 0.03, 0.0) }
    },
    vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float temperature;
    uniform float tint;
    uniform float contrast;
    uniform float saturation;
    uniform float brightness;
    uniform float exposure;
    uniform vec3 shadowColor;
    uniform vec3 highlightColor;
    
    varying vec2 vUv;
    
    // 色温调整矩阵
    vec3 adjustTemperature(vec3 color, float temp) {
      // 简化的色温调整
      color.r += temp * 0.1;
      color.b -= temp * 0.1;
      return color;
    }
    
    // 色调调整
    vec3 adjustTint(vec3 color, float t) {
      color.g += t * 0.1;
      return color;
    }
    
    // 对比度调整
    vec3 adjustContrast(vec3 color, float c) {
      return (color - 0.5) * c + 0.5;
    }
    
    // 饱和度调整
    vec3 adjustSaturation(vec3 color, float s) {
      float luminance = dot(color, vec3(0.299, 0.587, 0.114));
      return mix(vec3(luminance), color, s);
    }
    
    // 分离色调 (阴影/高光染色)
    vec3 splitToning(vec3 color, vec3 shadows, vec3 highlights) {
      float luminance = dot(color, vec3(0.299, 0.587, 0.114));
      vec3 shadowMix = mix(color, color + shadows, 1.0 - luminance);
      vec3 highlightMix = mix(shadowMix, shadowMix + highlights, luminance);
      return highlightMix;
    }
    
    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);
      vec3 color = texel.rgb;
      
      // 曝光
      color *= exposure;
      
      // 色温
      color = adjustTemperature(color, temperature);
      
      // 色调
      color = adjustTint(color, tint);
      
      // 对比度
      color = adjustContrast(color, contrast);
      
      // 饱和度
      color = adjustSaturation(color, saturation);
      
      // 亮度
      color += brightness;
      
      // 分离色调
      color = splitToning(color, shadowColor, highlightColor);
      
      // 钳制
      color = clamp(color, 0.0, 1.0);
      
      gl_FragColor = vec4(color, texel.a);
    }
  `
};

export class ColorGradingPass extends Pass {
    constructor(options = {}) {
        super();

        this.params = {
            temperature: options.temperature ?? 0.15,      // 暖色偏移
            tint: options.tint ?? 0.0,
            contrast: options.contrast ?? 1.12,            // 对比度增强
            saturation: options.saturation ?? 1.08,        // 饱和度微增
            brightness: options.brightness ?? 0.0,
            exposure: options.exposure ?? 1.0,
            shadowColor: options.shadowColor ?? new THREE.Vector3(0.0, 0.0, 0.03),   // 阴影偏蓝
            highlightColor: options.highlightColor ?? new THREE.Vector3(0.04, 0.02, 0.0) // 高光偏暖
        };

        this.material = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.clone(ColorGradingShader.uniforms),
            vertexShader: ColorGradingShader.vertexShader,
            fragmentShader: ColorGradingShader.fragmentShader
        });

        this.fsQuad = new FullScreenQuad(this.material);
        this.updateUniforms();
    }

    updateUniforms() {
        this.material.uniforms.temperature.value = this.params.temperature;
        this.material.uniforms.tint.value = this.params.tint;
        this.material.uniforms.contrast.value = this.params.contrast;
        this.material.uniforms.saturation.value = this.params.saturation;
        this.material.uniforms.brightness.value = this.params.brightness;
        this.material.uniforms.exposure.value = this.params.exposure;
        this.material.uniforms.shadowColor.value.copy(this.params.shadowColor);
        this.material.uniforms.highlightColor.value.copy(this.params.highlightColor);
    }

    setTemperature(value) {
        this.params.temperature = value;
        this.material.uniforms.temperature.value = value;
    }

    setContrast(value) {
        this.params.contrast = value;
        this.material.uniforms.contrast.value = value;
    }

    setSaturation(value) {
        this.params.saturation = value;
        this.material.uniforms.saturation.value = value;
    }

    setBrightness(value) {
        this.params.brightness = value;
        this.material.uniforms.brightness.value = value;
    }

    setExposure(value) {
        this.params.exposure = value;
        this.material.uniforms.exposure.value = value;
    }

    updateParams(params) {
        Object.assign(this.params, params);
        this.updateUniforms();
    }

    render(renderer, writeBuffer, readBuffer) {
        this.material.uniforms.tDiffuse.value = readBuffer.texture;

        if (this.renderToScreen) {
            renderer.setRenderTarget(null);
        } else {
            renderer.setRenderTarget(writeBuffer);
        }

        this.fsQuad.render(renderer);
    }

    dispose() {
        this.material.dispose();
    }
}

// MC风格预设
export const ColorGradingPresets = {
    // MC默认暖色调
    minecraft: {
        temperature: -0.01,           // 极轻微偏冷
        tint: 0,
        contrast: 1.009,                // 略提对比度，使 GTAO 方块阴影在任意视角都可见
        saturation: 1.0,
        brightness: 0.0,
        exposure: 1.02,
        shadowColor: new THREE.Vector3(0.005, 0.002, 0.012),  // 极淡蓝紫
        highlightColor: new THREE.Vector3(0.0, 0.0, 0.003)    // 几乎中性
    },
    // 日落
    sunset: {
        temperature: 0.35,
        tint: 0.05,
        contrast: 1.15,
        saturation: 1.2,
        brightness: 0.0,
        exposure: 0.95,
        shadowColor: new THREE.Vector3(0.02, 0.0, 0.05),
        highlightColor: new THREE.Vector3(0.08, 0.04, 0.0)
    },
    // 清晨
    morning: {
        temperature: 0.08,
        tint: -0.02,
        contrast: 1.08,
        saturation: 1.05,
        brightness: 0.02,
        exposure: 1.05,
        shadowColor: new THREE.Vector3(0.02, 0.02, 0.04),
        highlightColor: new THREE.Vector3(0.03, 0.02, 0.0)
    }
};

export default ColorGradingPass;
