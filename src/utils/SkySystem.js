/**
 * 程序化天空系统 - CanvasTexture 天球 + 云层球体
 * 天球：Canvas 渐变纹理贴到 BackSide 大球体（天顶深蓝 → 地平线雾色 → 地面灰绿）
 * 云层：noise 云层球体，3D noise + 时间偏移模拟云飘动，跟随摄像机平移
 * 两个球体跟随摄像机平移但不跟随旋转，通过半径差产生纵深视差
 */

import * as THREE from 'three'

// ---------- 云层 Noise Shader ----------

const cloudVertexShader = /* glsl */ `
varying vec3 vWorldPos;
void main() {
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPos = worldPos.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const cloudFragmentShader = /* glsl */ `
varying vec3 vWorldPos;

uniform vec3 uCameraPos;
uniform float uTime;

float hash(vec3 p) {
  return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
}

float noise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
        mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
    mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
        mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
    f.z
  );
}

float fbm(vec3 p) {
  float v = 0.0;
  float amp = 0.5;
  float freq = 1.0;
  for (int i = 0; i < 4; i++) {
    v += amp * noise(p * freq);
    freq *= 2.1;
    amp *= 0.48;
  }
  return v;
}

void main() {
  vec3 dir = normalize(vWorldPos - uCameraPos);

  float heightMask = smoothstep(0.02, 0.25, dir.y);

  vec3 samplePos = vWorldPos * 0.008;
  samplePos.x += uTime * 0.015;
  samplePos.z += uTime * 0.008;

  float cloud = fbm(samplePos);
  float detail = fbm(samplePos * 2.5 + 10.0) * 0.3;
  cloud += detail;

  float cloudMask = smoothstep(0.42, 0.62, cloud);
  float cloudEdge = smoothstep(0.38, 0.50, cloud) * 0.25;

  float alpha = (cloudMask * 0.5 + cloudEdge) * heightMask;

  vec3 cloudCol = mix(vec3(0.95, 0.94, 0.92), vec3(0.98, 0.97, 0.96), smoothstep(0.1, 0.5, dir.y));

  gl_FragColor = vec4(cloudCol, alpha);
}
`

/**
 * 绘制渐变天空 Canvas，用于天球纹理
 */
function hash(seed) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

/**
 * 在 canvas 上绘制一层山脉剪影
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} W      画布宽
 * @param {number} baseY  山脉基线 Y（地平线位置）
 * @param {number} peaks  控制点数量
 * @param {number} maxH   最大峰高 (px)
 * @param {number} seed   随机种子（不同层用不同值）
 * @param {string} color  填充色
 */
function drawMountainLayer(ctx, W, baseY, peaks, maxH, seed, color) {
  const heights = []
  for (let i = 0; i < peaks; i++) {
    heights.push(hash(i * 3.7 + seed * 17.3) * maxH)
  }
  heights[peaks - 1] = heights[0] // 无缝环绕

  ctx.beginPath()
  ctx.moveTo(0, baseY + maxH)
  ctx.lineTo(0, baseY - heights[0] * 0.3)

  const dx = W / (peaks - 1)
  for (let i = 0; i < peaks - 1; i++) {
    const x0 = i * dx
    const x1 = (i + 1) * dx
    const midX = (x0 + x1) / 2

    // 用二次贝塞尔：控制点在山峰顶，终点在两道峰之间的山谷
    const cpY = baseY - heights[i]
    const valleyY = baseY - (heights[i] + heights[i + 1]) * 0.18
    ctx.quadraticCurveTo(x0, cpY, midX, valleyY)
  }

  ctx.lineTo(W, baseY + maxH)
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()
}

function createSkyCanvas() {
  const W = 2048
  const H = 2048
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  // 天空垂直渐变
  const horizonY = H * 0.52
  const grad = ctx.createLinearGradient(0, 0, 0, H)
  grad.addColorStop(0.0, '#1d3568')    // 天顶深蓝
  grad.addColorStop(0.22, '#4a7dbd')   // 中天
  grad.addColorStop(0.44, '#a0c2de')   // 近地平线
  grad.addColorStop(0.50, '#d0dce6')   // 地平线雾色
  grad.addColorStop(0.53, '#c5d2bc')   // 稍下过渡
  grad.addColorStop(0.62, '#99aa88')   // 地面浅
  grad.addColorStop(1.0, '#6b7d5a')    // 地面深

  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)

  // 三层山脉剪影 — 空气透视法：越远越淡越蓝
  drawMountainLayer(ctx, W, horizonY,      56, 260, 1, '#8aa0b8') // 最远 — 淡蓝灰
  drawMountainLayer(ctx, W, horizonY - 6,  44, 380, 2, '#6b8298') // 中层 — 蓝灰
  drawMountainLayer(ctx, W, horizonY - 12, 34, 520, 3, '#4a5a50') // 最近 — 青褐

  // 山脚用半透明柔化过渡，避免硬边
  const softenGrad = ctx.createLinearGradient(0, horizonY - 12, 0, horizonY + 20)
  softenGrad.addColorStop(0, 'rgba(208,220,230,0)')
  softenGrad.addColorStop(0.35, 'rgba(208,220,230,0.35)')
  softenGrad.addColorStop(0.65, 'rgba(208,220,230,0.25)')
  softenGrad.addColorStop(1, 'rgba(208,220,230,0)')
  ctx.fillStyle = softenGrad
  ctx.fillRect(0, horizonY - 12, W, 32)

  return canvas
}

export class SkySystem {
  /**
   * @param {THREE.Scene} scene
   * @param {THREE.Camera} camera
   * @param {object} [options]
   */
  constructor(scene, camera, options = {}) {
    this.scene = scene
    this.camera = camera
    this.elapsed = 0

    this.skyRadius = options.skyRadius ?? 400
    this.cloudRadius = options.cloudRadius ?? 130
    this.cloudSpeed = options.cloudSpeed ?? 1.0

    this._createSkySphere()
    this._createCloudSphere()
  }

  // ---- 天球：Canvas 渐变纹理贴 BackSide 球体 ----
  _createSkySphere() {
    const canvas = createSkyCanvas()
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace

    const geo = new THREE.SphereGeometry(this.skyRadius, 64, 32)
    const mat = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
    })

    this.skyMesh = new THREE.Mesh(geo, mat)
    this.skyMesh.renderOrder = -200
    this.skyMesh.frustumCulled = false
    this.scene.add(this.skyMesh)
  }

  // ---- 云层球体 ----
  _createCloudSphere() {
    const geo = new THREE.SphereGeometry(this.cloudRadius, 64, 32)
    const mat = new THREE.ShaderMaterial({
      vertexShader: cloudVertexShader,
      fragmentShader: cloudFragmentShader,
      uniforms: {
        uCameraPos: { value: new THREE.Vector3() },
        uTime: { value: 0 },
      },
      depthWrite: false,
      transparent: true,
      blending: THREE.NormalBlending,
      side: THREE.BackSide,
      fog: false,
    })
    this.cloudMesh = new THREE.Mesh(geo, mat)
    this.cloudMesh.renderOrder = -199
    this.cloudMesh.frustumCulled = false
    this.scene.add(this.cloudMesh)
  }

  /**
   * 每帧调用
   * @param {number} delta  秒
   * @param {THREE.Vector3} _sunWorldPos 未使用（Canvas 天球无需太阳方向）
   */
  update(delta, _sunWorldPos) {
    this.elapsed += delta
    const camPos = this.camera.position

    this.skyMesh.position.copy(camPos)
    this.cloudMesh.position.copy(camPos)

    this.cloudMesh.material.uniforms.uTime.value = this.elapsed * this.cloudSpeed
    this.cloudMesh.material.uniforms.uCameraPos.value.copy(camPos)
  }

  dispose() {
    this.skyMesh.geometry.dispose()
    this.skyMesh.material.map.dispose()
    this.skyMesh.material.dispose()
    this.scene.remove(this.skyMesh)

    this.cloudMesh.geometry.dispose()
    this.cloudMesh.material.dispose()
    this.scene.remove(this.cloudMesh)
  }
}
