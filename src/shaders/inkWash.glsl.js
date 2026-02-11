/**
 * 水墨江南风格 Shader 集合
 */

// =====================================================
// 桥体 Shader - 宣纸质感
// =====================================================
export const bridgeVertexShader = `
varying vec3 vWorldPos;
varying vec3 vNormal;
varying vec4 vScreenPos;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPos = worldPos.xyz;
  vScreenPos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_Position = vScreenPos;
}
`;

export const bridgeFragmentShader = `
uniform vec3 uColorTop;
uniform vec3 uColorBottom;
uniform vec3 uColorAccent;
uniform vec3 uLightDir;

varying vec3 vWorldPos;
varying vec3 vNormal;
varying vec4 vScreenPos;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  // 光照
  float NdotL = dot(vNormal, normalize(uLightDir));
  NdotL = NdotL * 0.2 + 0.8;
  
  // 高度渐变
  float heightGrad = smoothstep(-1.0, 8.0, vWorldPos.y);
  
  // 宣纸纹理 - 使用屏幕空间坐标，保证各面一致
  vec2 screenUV = vScreenPos.xy / vScreenPos.w * 0.5 + 0.5;
  vec2 paperCoord = screenUV * 800.0;
  float grain = hash(floor(paperCoord)) * 0.025;
  
  // 基础颜色
  vec3 baseColor = mix(uColorBottom, uColorTop, heightGrad * 0.2 + 0.8);
  baseColor += grain;
  baseColor *= NdotL;
  
  gl_FragColor = vec4(baseColor, 1.0);
}
`;

// =====================================================
// 远山 Shader - 淡墨层叠效果
// =====================================================
export const mountainVertexShader = `
varying vec2 vUv;
varying float vHeight;

void main() {
  vUv = uv;
  vHeight = position.y;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const mountainFragmentShader = `
uniform vec3 uColor;
uniform float uOpacity;
uniform float uTime;

varying vec2 vUv;
varying float vHeight;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

void main() {
  // 水墨边缘效果
  float edge = noise(vUv * 30.0 + uTime * 0.01) * 0.15;
  
  // 高度渐变透明
  float alpha = uOpacity * (1.0 - smoothstep(0.3, 1.0, vHeight / 10.0));
  alpha += edge * 0.3;
  
  // 墨色变化
  vec3 color = uColor + noise(vUv * 50.0) * 0.05;
  
  gl_FragColor = vec4(color, alpha);
}
`;

// =====================================================
// 水面 Shader - 水墨风灵动波纹
// =====================================================
export const waterVertexShader = `
varying vec2 vUv;
varying vec3 vWorldPos;
uniform float uTime;

void main() {
  vUv = uv;
  vec3 pos = position;
  
  // 顶点动态起伏，增加灵动感
  float wave = sin(pos.x * 0.15 + uTime * 0.3) * 0.2;
  wave += sin(pos.y * 0.1 - uTime * 0.2) * 0.15;
  pos.z += wave;
  
  vec4 worldPos = modelMatrix * vec4(pos, 1.0);
  vWorldPos = worldPos.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

export const waterFragmentShader = `
uniform float uTime;
uniform vec3 uColorDeep;
uniform vec3 uColorShallow;
uniform float uOpacity;

varying vec2 vUv;
varying vec3 vWorldPos;

// 噪声函数
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

void main() {
  // 多层动态波纹 - 水墨画风格的水纹
  float t = uTime * 0.15;
  
  // 主波纹 - 横向流动的水墨线条
  float wave1 = sin(vWorldPos.z * 0.5 + vWorldPos.x * 0.08 + t * 2.0) * 0.5 + 0.5;
  float wave2 = sin(vWorldPos.z * 0.3 - vWorldPos.x * 0.05 + t * 1.5) * 0.5 + 0.5;
  float wave3 = sin(vWorldPos.z * 0.8 + vWorldPos.x * 0.12 - t * 2.5) * 0.5 + 0.5;
  
  // 细腻波纹
  float ripple1 = sin(vWorldPos.z * 1.2 + t * 3.0) * 0.3;
  float ripple2 = sin(vWorldPos.x * 0.6 + vWorldPos.z * 0.4 + t * 2.0) * 0.25;
  
  // 水墨晕染噪声
  float inkNoise = noise(vUv * 8.0 + t * 0.3) * 0.12;
  float inkFlow = noise(vec2(vWorldPos.z * 0.1 + t, vWorldPos.x * 0.05)) * 0.08;
  
  // 波纹组合
  float waves = (wave1 * 0.4 + wave2 * 0.35 + wave3 * 0.25);
  float detail = (ripple1 + ripple2) * 0.15;
  
  // 水墨线条效果 - 形成优雅的横向波纹线
  float linePattern = smoothstep(0.42, 0.48, waves) - smoothstep(0.52, 0.58, waves);
  linePattern += smoothstep(0.72, 0.78, waves) - smoothstep(0.82, 0.88, waves);
  linePattern *= 0.15;
  
  // 基础颜色渐变（远深近浅）
  float depthGrad = smoothstep(-50.0, 50.0, vWorldPos.z);
  vec3 baseColor = mix(uColorDeep, uColorShallow, depthGrad * 0.4 + 0.3);
  
  // 波纹明暗变化
  baseColor *= (0.88 + waves * 0.12 + detail);
  baseColor += vec3(linePattern);
  baseColor += inkNoise + inkFlow;
  
  // 边缘轻微透明
  float edgeAlpha = 1.0 - smoothstep(0.8, 1.0, abs(vUv.x - 0.5) * 2.0) * 0.2;
  
  gl_FragColor = vec4(baseColor, uOpacity * edgeAlpha);
}
`;

// =====================================================
// 树木 Shader - 粉色桃花树
// =====================================================
export const treeVertexShader = `
varying vec2 vUv;
varying vec3 vNormal;

void main() {
  vUv = uv;
  vNormal = normalMatrix * normal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const treeFragmentShader = `
uniform vec3 uColor;
uniform float uTime;

varying vec2 vUv;
varying vec3 vNormal;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

void main() {
  // 花瓣纹理
  float petal = noise(vUv * 20.0 + uTime * 0.02);
  
  // 光照
  float light = dot(vNormal, normalize(vec3(1.0, 1.0, 0.5))) * 0.5 + 0.5;
  
  // 颜色变化
  vec3 color = uColor * (0.85 + petal * 0.3) * light;
  
  // 边缘柔化
  float alpha = 0.9 - petal * 0.2;
  
  gl_FragColor = vec4(color, alpha);
}
`;

// =====================================================
// 太阳 Shader - 橙红光晕
// =====================================================
export const sunVertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const sunFragmentShader = `
uniform vec3 uColorCore;
uniform vec3 uColorGlow;
uniform float uTime;

varying vec2 vUv;

void main() {
  vec2 center = vec2(0.5, 0.5);
  float dist = length(vUv - center) * 2.0;
  
  // 核心
  float core = 1.0 - smoothstep(0.0, 0.4, dist);
  
  // 光晕
  float glow = 1.0 - smoothstep(0.2, 1.0, dist);
  glow *= glow;
  
  // 颜色混合
  vec3 color = mix(uColorGlow, uColorCore, core);
  float alpha = core * 0.95 + glow * 0.5;
  
  gl_FragColor = vec4(color, alpha);
}
`;

// =====================================================
// 小岛/荷叶 Shader
// =====================================================
export const islandVertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const islandFragmentShader = `
uniform vec3 uColor;
uniform float uTime;

varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

void main() {
  float n = noise(vUv * 10.0);
  vec3 color = uColor * (0.9 + n * 0.2);
  
  // 边缘柔化
  vec2 center = vec2(0.5);
  float dist = length(vUv - center) * 2.0;
  float alpha = 1.0 - smoothstep(0.6, 1.0, dist);
  
  gl_FragColor = vec4(color, alpha * 0.85);
}
`;
