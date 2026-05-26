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
 * 解析颜色字符串为 r/g/b 分量
 */
function parseRGB(color) {
  const r = parseInt(color.slice(1, 3), 16)
  const g = parseInt(color.slice(3, 5), 16)
  const b = parseInt(color.slice(5, 7), 16)
  return { r, g, b }
}

/**
 * RGB 颜色明度调整（-1~1，负=加深，正=提亮）
 */
function adjustColor(hex, amount) {
  const { r, g, b } = parseRGB(hex)
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v + amount * 255)))
  const toHex = (v) => clamp(v).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

/**
 * 在 canvas 上绘制一层真实山脉剪影
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} W      画布宽
 * @param {number} baseY  山脉基线 Y
 * @param {number} peaks  主峰数量
 * @param {number} maxH   最大峰高 (px)
 * @param {number} seed   随机种子
 * @param {string} color  基色（中间调）
 * @param {object}  opts  选项
 */
function drawMountainLayer(ctx, W, baseY, peaks, maxH, seed, color, opts = {}) {
  const shadowColor = opts.shadowColor || adjustColor(color, -0.18)    // 暗面
  const highlightColor = opts.highlightColor || adjustColor(color, 0.12) // 阳面
  const snowColor = opts.snowColor || '#f0f3f8'
  const snowThreshold = opts.snowThreshold ?? 0.65  // 多高以上出现雪

  // 生成主峰高度
  const heights = []
  for (let i = 0; i < peaks; i++) {
    const h1 = hash(i * 3.7 + seed * 17.3)
    const h2 = hash(i * 7.1 + seed * 23.9) * 0.35 // 次波叠加
    const h3 = hash(i * 5.3 + seed * 31.1) * 0.15 // 微扰动
    heights.push(Math.max(0.08, (h1 + h2 + h3) / 1.5) * maxH)
  }
  heights[peaks - 1] = heights[0] // 无缝环绕

  const dx = W / (peaks - 1)

  // ---- 第一阶段：逐段绘制山体，每段用独立渐变 ----
  for (let i = 0; i < peaks - 1; i++) {
    const x0 = i * dx
    const x1 = (i + 1) * dx
    const h0 = heights[i]
    const h1 = heights[i + 1]
    const midX = (x0 + x1) / 2
    const valleyY = baseY - Math.min(h0, h1) * 0.22

    // 山峰点
    const peakX = x0
    const peakY = baseY - h0

    const segGrad = ctx.createLinearGradient(x0, 0, x1, 0)

    // 模拟阳光从左侧照射：左侧=阳面，右侧=暗面
    segGrad.addColorStop(0, highlightColor)
    segGrad.addColorStop(0.25, color)
    segGrad.addColorStop(0.65, shadowColor)
    segGrad.addColorStop(1, adjustColor(color, -0.08))

    ctx.beginPath()
    ctx.moveTo(x0, baseY)

    // 左侧陡坡：从山脚上升到峰顶
    const steepness = 0.15 + hash(i * 4.1 + seed * 7.9) * 0.25 // 变化坡度
    ctx.quadraticCurveTo(
      x0 - dx * steepness, baseY - h0 * 0.2,  // 控制点偏左
      x0, peakY                                   // 到达峰顶
    )

    // 右侧缓坡 + 山谷：从峰顶下降到山谷再上升
    ctx.quadraticCurveTo(
      x0 + dx * 0.35, peakY - h0 * 0.35,          // 控制点在山腰
      midX, valleyY                                // 山谷
    )

    ctx.lineTo(x1, baseY)
    ctx.closePath()
    ctx.fillStyle = segGrad
    ctx.fill()

    // ---- 雪顶 ----
    if (h0 > maxH * snowThreshold) {
      const snowAlpha = Math.min(1, (h0 - maxH * snowThreshold) / (maxH * (1 - snowThreshold)))
      const snowTop = peakY
      const snowBase = peakY + h0 * 0.25

      const snowGrad = ctx.createLinearGradient(x0, snowTop, x0, snowBase)
      snowGrad.addColorStop(0, `rgba(255,255,255,${snowAlpha * 0.9})`)
      snowGrad.addColorStop(0.15, `rgba(248,250,254,${snowAlpha * 0.7})`)
      snowGrad.addColorStop(0.5, `rgba(230,235,242,${snowAlpha * 0.25})`)
      snowGrad.addColorStop(1, 'rgba(255,255,255,0)')

      ctx.beginPath()
      const snowHalfW = dx * 0.22
      ctx.moveTo(peakX - snowHalfW, snowBase)
      ctx.quadraticCurveTo(peakX - snowHalfW * 0.3, snowTop + h0 * 0.04, peakX, snowTop)
      ctx.quadraticCurveTo(peakX + snowHalfW * 0.3, snowTop + h0 * 0.04, peakX + snowHalfW, snowBase)
      ctx.closePath()
      ctx.fillStyle = snowGrad
      ctx.fill()
    }

    // ---- 山脊高光线 ----
    ctx.beginPath()
    ctx.moveTo(x0 - dx * 0.08, baseY - h0 * 0.85)
    ctx.quadraticCurveTo(x0 - dx * 0.02, baseY - h0 * 0.97, x0, baseY - h0)
    ctx.quadraticCurveTo(x0 + dx * 0.06, baseY - h0 * 0.93, x0 + dx * 0.15, baseY - h0 * 0.75)
    ctx.strokeStyle = `rgba(255,255,255,0.15)`
    ctx.lineWidth = Math.max(1, maxH * 0.015)
    ctx.stroke()
  }

  // ---- 第二阶段：叠加岩石纹理（半透明噪声点） ----
  ctx.save()
  ctx.globalCompositeOperation = 'overlay'
  for (let x = 0; x < W; x += 4) {
    for (let yi = 0; yi < 30; yi++) {
      const y = baseY - yi * (maxH / 30)
      const hIdx = Math.floor(x / dx)
      if (hIdx < 0 || hIdx >= heights.length) continue
      const localH = heights[Math.min(hIdx, heights.length - 1)]
      if (baseY - y > localH * 1.05) continue // 在山峰以上不画

      const n = hash(x * 0.73 + yi * 19.7 + seed * 41.3)
      if (n > 0.82) {
        ctx.fillStyle = n > 0.92
          ? 'rgba(255,255,255,0.06)'
          : 'rgba(0,0,0,0.04)'
        ctx.fillRect(x, y, 3, 2)
      }
    }
  }
  ctx.restore()

  // ---- 第三阶段：山脚半透明雾化带 ----
  const fogGrad = ctx.createLinearGradient(0, baseY - 6, 0, baseY + maxH * 0.12)
  fogGrad.addColorStop(0, 'rgba(200,210,218,0)')
  fogGrad.addColorStop(0.5, 'rgba(200,210,218,0.25)')
  fogGrad.addColorStop(1, 'rgba(200,210,218,0)')
  ctx.fillStyle = fogGrad
  ctx.fillRect(0, baseY - 6, W, maxH * 0.12 + 6)
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
  grad.addColorStop(0.0, '#1d3568')
  grad.addColorStop(0.22, '#4a7dbd')
  grad.addColorStop(0.44, '#a0c2de')
  grad.addColorStop(0.50, '#d0dce6')
  grad.addColorStop(0.53, '#c5d2bc')
  grad.addColorStop(0.62, '#99aa88')
  grad.addColorStop(1.0, '#6b7d5a')

  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)

  // 三层山脉 — 空气透视：远的淡蓝、近的青褐
  // 最远层
  drawMountainLayer(ctx, W, horizonY, 56, 260, 1, '#8fa8c0', {
    shadowColor: '#7d95ae',
    highlightColor: '#a2bbd3',
    snowColor: '#eef2f7',
    snowThreshold: 0.72,
  })
  // 中层
  drawMountainLayer(ctx, W, horizonY - 6, 44, 380, 2, '#6d849a', {
    shadowColor: '#5b7186',
    highlightColor: '#7f96ad',
    snowColor: '#eef4f8',
    snowThreshold: 0.68,
  })
  // 最近层 — 更丰富的青褐色带岩石感
  drawMountainLayer(ctx, W, horizonY - 12, 34, 520, 3, '#556a4a', {
    shadowColor: '#3d5035',
    highlightColor: '#6e8462',
    snowColor: '#f2f5f0',
    snowThreshold: 0.64,
  })

  // 整体山脚水平雾化
  const softenGrad = ctx.createLinearGradient(0, horizonY - 14, 0, horizonY + 22)
  softenGrad.addColorStop(0, 'rgba(208,220,230,0)')
  softenGrad.addColorStop(0.35, 'rgba(208,220,230,0.4)')
  softenGrad.addColorStop(0.65, 'rgba(208,220,230,0.28)')
  softenGrad.addColorStop(1, 'rgba(208,220,230,0)')
  ctx.fillStyle = softenGrad
  ctx.fillRect(0, horizonY - 14, W, 36)

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
