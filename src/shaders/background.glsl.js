/**
 * Minecraft 风格天空 Shader
 * 卡通纯净风格 + 方块太阳
 */

export const backgroundVertexShader = `
varying vec3 vWorldPosition;

void main() {
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const backgroundFragmentShader = `
uniform vec3 uSunPosition;
uniform vec3 uSkyColorTop;
uniform vec3 uSkyColorHorizon;
uniform float uTime;
uniform float uCloudSpeed;

varying vec3 vWorldPosition;

// 简单 3D 噪声（用于云朵形状）
float hash(vec3 p) {
  p = fract(p * vec3(443.897, 441.423, 437.195));
  p += dot(p.zxy, p.yxz + 19.27);
  return fract(p.x * p.y * p.z);
}
float noise3(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float n = mix(
    mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
        mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
    mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
        mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z
  );
  return n;
}
// 分形噪声，云朵更蓬松
float fbm(vec3 p) {
  float v = 0.0;
  float a = 0.5;
  float f = 1.0;
  for (int i = 0; i < 4; i++) {
    v += a * noise3(p);
    p *= 2.0;
    a *= 0.5;
    f *= 2.0;
  }
  return v;
}

// 大气散射函数
vec3 atmosphericScattering(vec3 dir, vec3 sunDir, float height) {
  // 瑞利散射 - 天空蓝色
  float rayleigh = pow(1.0 - height, 2.0);
  vec3 rayleighColor = vec3(0.3, 0.5, 0.9) * rayleigh * 0.15;
  
  // 米氏散射 - 太阳周围光晕
  float sunAngle = max(dot(dir, sunDir), 0.0);
  float mie = pow(sunAngle, 8.0) * 0.3;
  vec3 mieColor = vec3(1.0, 0.9, 0.7) * mie;
  
  // 地平线散射 - 偏暖的大气效果
  float horizonScatter = pow(1.0 - abs(dir.y), 4.0);
  vec3 horizonColor = vec3(0.95, 0.85, 0.75) * horizonScatter * 0.2;
  
  return rayleighColor + mieColor + horizonColor;
}

void main() {
  vec3 dir = normalize(vWorldPosition);
  vec3 sunDir = normalize(uSunPosition);
  
  // 简单纯净天空渐变
  float height = max(dir.y, 0.0);
  vec3 skyColor = mix(uSkyColorHorizon, uSkyColorTop, pow(height, 0.5));
  
  // 地平线泛白（柔和渐变）
  float horizonFade = 1.0 - smoothstep(0.0, 0.15, abs(dir.y));
  vec3 horizonWhite = vec3(0.95, 0.95, 0.92);
  skyColor = mix(skyColor, horizonWhite, horizonFade * 0.5);
  
  // 添加大气散射
  vec3 scatter = atmosphericScattering(dir, sunDir, height);
  skyColor += scatter;
  
  // 方块太阳（Billboard正方形投影）
  vec3 sunUp = vec3(0.0, 1.0, 0.0);
  vec3 sunRight = normalize(cross(sunUp, sunDir));
  sunUp = normalize(cross(sunDir, sunRight));
  
  float projRight = dot(dir - sunDir * dot(dir, sunDir), sunRight);
  float projUp = dot(dir - sunDir * dot(dir, sunDir), sunUp);
  
  float sunSize = 0.1;
  float sun = step(max(abs(projRight), abs(projUp)), sunSize) * step(0.9, dot(dir, sunDir));
  vec3 sunColor = vec3(1.0, 0.95, 0.7);
  
  // 太阳光晕
  float sunDot = max(dot(dir, sunDir), 0.0);
  float halo = pow(sunDot, 6.0) * 0.5;
  vec3 haloColor = vec3(1.0, 0.9, 0.7) * halo;
  
  vec3 finalColor = skyColor + haloColor;
  finalColor = mix(finalColor, sunColor, sun);
  
  // 程序化云朵：仅在上半球，随风飘动（低亮度，不抢眼）
  float cloudHeight = max(dir.y, 0.0);
  float cloudMask = smoothstep(0.05, 0.35, cloudHeight);
  vec3 cloudSamplePos = dir * 120.0;
  cloudSamplePos.xz += uTime * uCloudSpeed * 8.0;
  float cloudNoise = fbm(cloudSamplePos * 0.012);
  cloudNoise += 0.35 * fbm(cloudSamplePos * 0.025 + vec3(10.0, 0.0, 5.0));
  float cloud = smoothstep(0.42, 0.58, cloudNoise) * cloudMask;
  vec3 cloudColor = vec3(0.75, 0.78, 0.82);
  finalColor = mix(finalColor, cloudColor, cloud * 0.65);
  // 太阳在云层之上（云不遮挡太阳）
  finalColor = mix(finalColor, sunColor, sun);
  
  gl_FragColor = vec4(finalColor, 1.0);
}
`;
