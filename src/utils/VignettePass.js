/**
 * 暗角 Pass (Vignette)
 * MC风格画面聚焦效果
 */
import * as THREE from 'three';
import { Pass, FullScreenQuad } from 'three/addons/postprocessing/Pass.js';

const VignetteShader = {
    uniforms: {
        tDiffuse: { value: null },
        // 暗角强度
        intensity: { value: 0.35 },
        // 暗角柔和度
        smoothness: { value: 0.4 },
        // 暗角圆度 (1.0 = 圆形, <1 = 椭圆)
        roundness: { value: 0.9 },
        // 暗角颜色
        color: { value: new THREE.Vector3(0.0, 0.0, 0.0) }
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
    uniform float intensity;
    uniform float smoothness;
    uniform float roundness;
    uniform vec3 color;
    
    varying vec2 vUv;
    
    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);
      
      // 计算到中心的距离
      vec2 center = vUv - 0.5;
      center.x *= roundness;
      float dist = length(center) * 2.0;
      
      // 柔和的暗角渐变
      float vignette = smoothstep(1.0 - smoothness, 1.0, dist);
      vignette *= intensity;
      
      // 混合暗角颜色
      vec3 finalColor = mix(texel.rgb, color, vignette);
      
      gl_FragColor = vec4(finalColor, texel.a);
    }
  `
};

export class VignettePass extends Pass {
    constructor(options = {}) {
        super();

        this.params = {
            intensity: options.intensity ?? 0.35,
            smoothness: options.smoothness ?? 0.4,
            roundness: options.roundness ?? 0.9,
            color: options.color ?? new THREE.Vector3(0.0, 0.0, 0.0)
        };

        this.material = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.clone(VignetteShader.uniforms),
            vertexShader: VignetteShader.vertexShader,
            fragmentShader: VignetteShader.fragmentShader
        });

        this.fsQuad = new FullScreenQuad(this.material);
        this.updateUniforms();
    }

    updateUniforms() {
        this.material.uniforms.intensity.value = this.params.intensity;
        this.material.uniforms.smoothness.value = this.params.smoothness;
        this.material.uniforms.roundness.value = this.params.roundness;
        this.material.uniforms.color.value.copy(this.params.color);
    }

    setIntensity(value) {
        this.params.intensity = value;
        this.material.uniforms.intensity.value = value;
    }

    setSmoothness(value) {
        this.params.smoothness = value;
        this.material.uniforms.smoothness.value = value;
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

export default VignettePass;
