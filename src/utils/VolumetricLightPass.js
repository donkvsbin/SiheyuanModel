/**
 * 体积光 Pass (God Rays)
 * MC风格太阳光束效果
 */
import * as THREE from 'three';
import { Pass, FullScreenQuad } from 'three/addons/postprocessing/Pass.js';

const VolumetricLightShader = {
  uniforms: {
    tDiffuse: { value: null },
    lightPosition: { value: new THREE.Vector2(0.5, 0.5) },
    exposure: { value: 0.3 },
    decay: { value: 0.95 },
    density: { value: 0.8 },
    weight: { value: 0.4 },
    samples: { value: 50 }
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
    uniform vec2 lightPosition;
    uniform float exposure;
    uniform float decay;
    uniform float density;
    uniform float weight;
    uniform int samples;
    
    varying vec2 vUv;
    
    void main() {
      vec2 texCoord = vUv;
      vec2 deltaTextCoord = texCoord - lightPosition;
      deltaTextCoord *= 1.0 / float(samples) * density;
      
      vec4 color = texture2D(tDiffuse, texCoord);
      float illuminationDecay = 1.0;
      
      for (int i = 0; i < 50; i++) {
        if (i >= samples) break;
        texCoord -= deltaTextCoord;
        vec4 sampleColor = texture2D(tDiffuse, texCoord);
        sampleColor *= illuminationDecay * weight;
        color += sampleColor;
        illuminationDecay *= decay;
      }
      
      gl_FragColor = color * exposure;
    }
  `
};

// 提取高亮区域的Shader
const LuminosityHighPassShader = {
  uniforms: {
    tDiffuse: { value: null },
    luminosityThreshold: { value: 0.9 },
    smoothWidth: { value: 0.01 },
    defaultColor: { value: new THREE.Color(0x000000) },
    defaultOpacity: { value: 0.0 }
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
    uniform float luminosityThreshold;
    uniform float smoothWidth;
    uniform vec3 defaultColor;
    uniform float defaultOpacity;
    
    varying vec2 vUv;
    
    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);
      float luminosity = dot(texel.rgb, vec3(0.299, 0.587, 0.114));
      float alpha = smoothstep(luminosityThreshold, luminosityThreshold + smoothWidth, luminosity);
      gl_FragColor = mix(vec4(defaultColor, defaultOpacity), texel, alpha);
    }
  `
};

// 合成Shader
const AdditiveBlendShader = {
  uniforms: {
    tDiffuse: { value: null },
    tAdd: { value: null },
    intensity: { value: 1.0 }
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
    uniform sampler2D tAdd;
    uniform float intensity;
    varying vec2 vUv;
    
    void main() {
      vec4 base = texture2D(tDiffuse, vUv);
      vec4 add = texture2D(tAdd, vUv);
      gl_FragColor = base + add * intensity;
    }
  `
};

export class VolumetricLightPass extends Pass {
  constructor(scene, camera, options = {}) {
    super();

    this.scene = scene;
    this.camera = camera;
    this.sunPosition = options.sunPosition || new THREE.Vector3(50, 200, 20);

    // 参数
    this.params = {
      exposure: options.exposure ?? 0.25,
      decay: options.decay ?? 0.96,
      density: options.density ?? 0.5,
      weight: options.weight ?? 0.3,
      samples: options.samples ?? 40,
      threshold: options.threshold ?? 0.85,
      intensity: options.intensity ?? 0.6
    };

    // 创建渲染目标
    const size = new THREE.Vector2();
    const renderer = options.renderer;

    this.renderTargetBright = new THREE.WebGLRenderTarget(1, 1);
    this.renderTargetGodRays = new THREE.WebGLRenderTarget(1, 1);

    // 高亮提取材质
    this.highPassMaterial = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(LuminosityHighPassShader.uniforms),
      vertexShader: LuminosityHighPassShader.vertexShader,
      fragmentShader: LuminosityHighPassShader.fragmentShader
    });

    // 体积光材质
    this.godRaysMaterial = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(VolumetricLightShader.uniforms),
      vertexShader: VolumetricLightShader.vertexShader,
      fragmentShader: VolumetricLightShader.fragmentShader
    });

    // 合成材质
    this.compositeMaterial = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(AdditiveBlendShader.uniforms),
      vertexShader: AdditiveBlendShader.vertexShader,
      fragmentShader: AdditiveBlendShader.fragmentShader
    });

    this.fsQuad = new FullScreenQuad();

    this.updateParams();
  }

  updateParams() {
    this.highPassMaterial.uniforms.luminosityThreshold.value = this.params.threshold;

    this.godRaysMaterial.uniforms.exposure.value = this.params.exposure;
    this.godRaysMaterial.uniforms.decay.value = this.params.decay;
    this.godRaysMaterial.uniforms.density.value = this.params.density;
    this.godRaysMaterial.uniforms.weight.value = this.params.weight;
    this.godRaysMaterial.uniforms.samples.value = this.params.samples;

    this.compositeMaterial.uniforms.intensity.value = this.params.intensity;
  }

  setSize(width, height) {
    // 使用半分辨率提升性能
    const halfWidth = Math.floor(width / 2);
    const halfHeight = Math.floor(height / 2);

    this.renderTargetBright.setSize(halfWidth, halfHeight);
    this.renderTargetGodRays.setSize(halfWidth, halfHeight);
  }

  setSunPosition(position) {
    this.sunPosition.copy(position);
  }

  render(renderer, writeBuffer, readBuffer) {
    // 计算太阳在屏幕上的位置（NDC -1~1 转 0~1）
    const sunScreenPos = this.sunPosition.clone().project(this.camera);
    let lightPos = new THREE.Vector2(
      (sunScreenPos.x + 1) / 2,
      (sunScreenPos.y + 1) / 2
    );

    // 太阳在屏幕内时使用真实位置；在屏幕外时 clamp 到屏幕边缘（保持太阳方向），保证任意视角都有地平线散射
    const inScreen = sunScreenPos.z < 1 &&
      lightPos.x >= 0 && lightPos.x <= 1 &&
      lightPos.y >= 0 && lightPos.y <= 1;

    if (!inScreen) {
      // 将太阳方向 clamp 到屏幕矩形内（最近边），光线仍从太阳方向散射，强度略降
      lightPos = new THREE.Vector2(
        Math.max(0.05, Math.min(0.95, lightPos.x)),
        Math.max(0.05, Math.min(0.95, lightPos.y))
      );
      this.compositeMaterial.uniforms.intensity.value = this.params.intensity * 0.2;
    } else {
      this.compositeMaterial.uniforms.intensity.value = this.params.intensity;
    }

    this.godRaysMaterial.uniforms.lightPosition.value.copy(lightPos);

    // Pass 1: 提取高亮区域
    this.fsQuad.material = this.highPassMaterial;
    this.highPassMaterial.uniforms.tDiffuse.value = readBuffer.texture;
    renderer.setRenderTarget(this.renderTargetBright);
    this.fsQuad.render(renderer);

    // Pass 2: 径向模糊生成God Rays
    this.fsQuad.material = this.godRaysMaterial;
    this.godRaysMaterial.uniforms.tDiffuse.value = this.renderTargetBright.texture;
    renderer.setRenderTarget(this.renderTargetGodRays);
    this.fsQuad.render(renderer);

    // Pass 3: 合成（intensity 已在上面根据太阳是否在屏内设好）
    // 使用中间渲染目标避免feedback loop
    if (!this.renderTargetComposite) {
      this.renderTargetComposite = new THREE.WebGLRenderTarget(readBuffer.width, readBuffer.height);
    }

    this.fsQuad.material = this.compositeMaterial;
    this.compositeMaterial.uniforms.tDiffuse.value = readBuffer.texture;
    this.compositeMaterial.uniforms.tAdd.value = this.renderTargetGodRays.texture;

    renderer.setRenderTarget(this.renderTargetComposite);
    this.fsQuad.render(renderer);

    // 复制到输出目标
    if (this.renderToScreen) {
      renderer.setRenderTarget(null);
    } else {
      renderer.setRenderTarget(writeBuffer);
    }

    // 使用CopyShader或直接绘制
    this.fsQuad.material = new THREE.MeshBasicMaterial({
      map: this.renderTargetComposite.texture
    });
    this.fsQuad.render(renderer);
  }

  dispose() {
    this.renderTargetBright.dispose();
    this.renderTargetGodRays.dispose();
    this.highPassMaterial.dispose();
    this.godRaysMaterial.dispose();
    this.compositeMaterial.dispose();
  }
}

export default VolumetricLightPass;
