<template>
  <div v-if="visible" class="ink-overlay" @click.self="$emit('back')">
    <div class="ink-panel">
      <div class="panel-header">
        <span class="panel-title">磨墨</span>
        <button class="close-btn" @click="$emit('back')">✕</button>
      </div>

      <div class="panel-body">
        <div class="subtitle">心静墨自浓</div>

        <div class="stone-wrapper">
          <canvas
            ref="canvas"
            :width="canvasSize"
            :height="canvasSize"
            @mousedown="startGrind"
            @mousemove="onGrind"
            @mouseup="stopGrind"
            @mouseleave="stopGrind"
            @touchstart.prevent="startGrind"
            @touchmove.prevent="onGrind"
            @touchend="stopGrind"
          ></canvas>
          <div class="progress-row">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: progress + '%' }"></div>
            </div>
            <span class="progress-text">{{ progress }}%</span>
          </div>
        </div>

        <div class="hint-text" v-if="!completed">
          <span class="hint-icon">🖱</span> {{ hintMsg }}
        </div>

        <button v-if="completed" class="confirm-btn" @click="$emit('complete')">好了</button>
      </div>
    </div>
  </div>
</template>

<script>
const CANVAS_SIZE = 340
const STONE_CX = CANVAS_SIZE / 2
const STONE_CY = CANVAS_SIZE / 2
const POOL_RADIUS = 80
const TOTAL_PROGRESS = 100
const SPEED_FACTOR = 0.12

export default {
  name: 'InkGrinding',
  props: {
    visible: { type: Boolean, default: false },
    locale: { type: String, default: 'zh' }
  },
  emits: ['complete', 'back'],
  data() {
    return {
      canvasSize: CANVAS_SIZE,
      progress: 0,
      completed: false,
      isGrinding: false,
      lastAngle: null,
      totalAngle: 0,
      ctx: null,
      particles: [],
      animFrame: null,
    }
  },
  computed: {
    hintMsg() {
      return this.locale === 'zh'
        ? '按住鼠标在砚台上画圈磨墨'
        : 'Hold mouse button and draw circles on the ink stone'
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.resetGame()
        this.$nextTick(() => { this.initCanvas() })
      } else {
        this.stopAnimLoop()
      }
    }
  },
  mounted() {
    if (this.visible) {
      this.$nextTick(() => { this.initCanvas() })
    }
  },
  beforeUnmount() {
    this.stopAnimLoop()
  },
  methods: {
    initCanvas() {
      const canvas = this.$refs.canvas
      if (!canvas) return
      this.ctx = canvas.getContext('2d')
      this.drawStone()
    },

    drawStone() {
      const ctx = this.ctx
      if (!ctx) return
      const s = this.canvasSize

      // 桌面背景
      ctx.fillStyle = '#f5f0e8'
      ctx.fillRect(0, 0, s, s)

      // 砚台底座（深色石材）
      const baseGrad = ctx.createLinearGradient(STONE_CX - 110, STONE_CY - 70, STONE_CX + 110, STONE_CY + 70)
      baseGrad.addColorStop(0, '#4a4a4a')
      baseGrad.addColorStop(0.3, '#3a3a3a')
      baseGrad.addColorStop(0.7, '#2a2a2a')
      baseGrad.addColorStop(1, '#1a1a1a')
      ctx.fillStyle = baseGrad
      ctx.beginPath()
      ctx.roundRect(STONE_CX - 140, STONE_CY - 90, 280, 180, 30)
      ctx.fill()

      // 砚台边框纹理
      ctx.strokeStyle = '#555'
      ctx.lineWidth = 2
      ctx.stroke()

      // 砚台顶面（稍浅）
      const topGrad = ctx.createLinearGradient(STONE_CX - 110, STONE_CY - 65, STONE_CX + 110, STONE_CY + 65)
      topGrad.addColorStop(0, '#5a5a5a')
      topGrad.addColorStop(0.5, '#4a4a4a')
      topGrad.addColorStop(1, '#353535')
      ctx.fillStyle = topGrad
      ctx.beginPath()
      ctx.roundRect(STONE_CX - 125, STONE_CY - 78, 250, 156, 22)
      ctx.fill()

      // 墨池（凹陷区域）
      const poolGrad = ctx.createRadialGradient(STONE_CX, STONE_CY, POOL_RADIUS * 0.2, STONE_CX, STONE_CY, POOL_RADIUS)
      const darkness = this.progress / 100
      const r = Math.floor(40 + darkness * 20)
      const g = Math.floor(35 + darkness * 20)
      const b = Math.floor(30 + darkness * 30)
      poolGrad.addColorStop(0, `rgb(${r},${g},${b})`)
      poolGrad.addColorStop(0.7, `rgb(${Math.floor(r*0.7)},${Math.floor(g*0.7)},${Math.floor(b*0.7)})`)
      poolGrad.addColorStop(1, '#4a4a4a')
      ctx.fillStyle = poolGrad
      ctx.beginPath()
      ctx.ellipse(STONE_CX, STONE_CY, POOL_RADIUS, POOL_RADIUS * 0.65, 0, 0, Math.PI * 2)
      ctx.fill()

      // 池边高光线
      ctx.strokeStyle = 'rgba(255,255,255,0.08)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.ellipse(STONE_CX, STONE_CY, POOL_RADIUS + 2, POOL_RADIUS * 0.65 + 2, 0, 0, Math.PI * 2)
      ctx.stroke()

      // 墨汁纹理（随进度显现）
      if (this.progress > 10) {
        ctx.fillStyle = `rgba(20, 18, 15, ${0.1 + this.progress * 0.005})`
        ctx.beginPath()
        ctx.ellipse(STONE_CX + 5, STONE_CY + 3, POOL_RADIUS * 0.6, POOL_RADIUS * 0.4, 0, 0, Math.PI * 2)
        ctx.fill()
      }

      // 墨锭（小方块，在池边）
      const stickX = STONE_CX + 90
      const stickY = STONE_CY - 15
      ctx.save()
      ctx.fillStyle = '#1a1a1a'
      ctx.shadowColor = 'rgba(0,0,0,0.3)'
      ctx.shadowBlur = 6
      ctx.shadowOffsetX = 2
      ctx.shadowOffsetY = 2
      ctx.beginPath()
      ctx.roundRect(stickX - 9, stickY - 18, 18, 36, 4)
      ctx.fill()
      ctx.restore()

      // 墨锭顶部金色标签
      ctx.fillStyle = '#8b7355'
      ctx.fillRect(stickX - 6, stickY - 14, 12, 6)

      // 粒子
      for (const p of this.particles) {
        ctx.fillStyle = `rgba(30, 25, 20, ${p.alpha})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
    },

    startAnimLoop() {
      if (this.animFrame) return
      const tick = () => {
        this.updateParticles()
        this.drawStone()
        this.animFrame = requestAnimationFrame(tick)
      }
      tick()
    },

    stopAnimLoop() {
      if (this.animFrame) {
        cancelAnimationFrame(this.animFrame)
        this.animFrame = null
      }
    },

    updateParticles() {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i]
        p.x += p.vx
        p.y += p.vy
        p.alpha -= 0.015
        p.r *= 0.98
        if (p.alpha <= 0) this.particles.splice(i, 1)
      }
    },

    spawnParticles(x, y, count) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = 0.5 + Math.random() * 1.5
        this.particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: 1.5 + Math.random() * 3,
          alpha: 0.7 + Math.random() * 0.3,
        })
      }
    },

    getCanvasPos(e) {
      const canvas = this.$refs.canvas
      if (!canvas) return null
      const rect = canvas.getBoundingClientRect()
      const clientX = e.clientX || (e.touches && e.touches[0].clientX)
      const clientY = e.clientY || (e.touches && e.touches[0].clientY)
      if (clientX == null || clientY == null) return null
      return { x: clientX - rect.left, y: clientY - rect.top }
    },

    isInPool(pos) {
      if (!pos) return false
      const dx = (pos.x - STONE_CX) / POOL_RADIUS
      const dy = (pos.y - STONE_CY) / (POOL_RADIUS * 0.65)
      return dx * dx + dy * dy < 1.1
    },

    startGrind(e) {
      if (this.completed) return
      const pos = this.getCanvasPos(e)
      if (!pos) return
      if (!this.isInPool(pos)) return
      this.isGrinding = true
      this.lastAngle = Math.atan2(pos.y - STONE_CY, pos.x - STONE_CX)
      this.startAnimLoop()
    },

    onGrind(e) {
      if (!this.isGrinding) return
      const pos = this.getCanvasPos(e)
      if (!pos) return
      if (!this.isInPool(pos)) {
        this.stopGrind()
        return
      }
      const angle = Math.atan2(pos.y - STONE_CY, pos.x - STONE_CX)
      if (this.lastAngle != null) {
        let delta = angle - this.lastAngle
        // 规范化到 [-PI, PI]
        if (delta > Math.PI) delta -= Math.PI * 2
        if (delta < -Math.PI) delta += Math.PI * 2
        this.totalAngle += Math.abs(delta)
        const gained = Math.abs(delta) * (180 / Math.PI) * SPEED_FACTOR
        this.progress = Math.min(TOTAL_PROGRESS, this.progress + gained)
        if (Math.abs(delta) > 0.05) {
          this.spawnParticles(pos.x, pos.y, 2)
        }
        if (this.progress >= TOTAL_PROGRESS) {
          this.progress = TOTAL_PROGRESS
          this.completed = true
          this.isGrinding = false
          this.stopAnimLoop()
          this.drawStone()
        }
      }
      this.lastAngle = angle
    },

    stopGrind() {
      this.isGrinding = false
      this.lastAngle = null
    },

    resetGame() {
      this.progress = 0
      this.completed = false
      this.isGrinding = false
      this.lastAngle = null
      this.totalAngle = 0
      this.particles = []
      this.stopAnimLoop()
    },
  },
}
</script>

<style scoped>
.ink-overlay {
  position: fixed;
  inset: 0;
  z-index: 1001;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.ink-panel {
  background: linear-gradient(135deg, #f5f0e8 0%, #e8e0d0 100%);
  border-radius: 20px;
  width: 90%;
  max-width: 460px;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 2px solid #d4c4a8;
  color: #5c4a32;
  font-family: 'STKaiti', 'KaiTi', '楷体', serif;
  user-select: none;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px 15px 24px;
  border-bottom: 1px solid rgba(139, 69, 19, 0.2);
  background: rgba(139, 69, 19, 0.05);
}

.panel-title {
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 6px;
  color: #5c4a32;
}

.close-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(139, 69, 19, 0.1);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #5c4a32;
  font-weight: 300;
  line-height: 1;
  transition: all 0.2s ease;
}
.close-btn:hover {
  background: rgba(139, 69, 19, 0.25);
  transform: scale(1.05);
}

.panel-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 20px 20px;
}

.subtitle {
  font-size: 14px;
  color: #8b7355;
  margin-bottom: 12px;
  letter-spacing: 4px;
}

.stone-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

canvas {
  display: block;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(139, 69, 19, 0.12);
  cursor: pointer;
  border: 3px solid #d4c4a8;
}

.progress-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  width: 100%;
  max-width: 300px;
}

.progress-bar {
  flex: 1;
  height: 10px;
  background: rgba(139, 69, 19, 0.12);
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4a4a4a, #1a1a1a);
  border-radius: 5px;
  transition: width 0.15s ease;
}

.progress-text {
  font-size: 13px;
  color: #5c4a32;
  min-width: 36px;
  text-align: right;
}

.hint-text {
  margin-top: 12px;
  font-size: 14px;
  color: #8b7355;
  letter-spacing: 2px;
  animation: hintFade 2s ease-in-out infinite;
}
.hint-icon { font-size: 16px; }

.confirm-btn {
  margin-top: 14px;
  background: linear-gradient(135deg, #b8944e 0%, #9a7a3e 100%);
  border: none;
  color: #fff;
  padding: 10px 40px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  letter-spacing: 4px;
  font-family: inherit;
  transition: all 0.2s;
}
.confirm-btn:hover {
  background: linear-gradient(135deg, #c9a96e 0%, #b8944e 100%);
  box-shadow: 0 0 16px rgba(180, 130, 80, 0.3);
}

@keyframes hintFade {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.9; }
}
</style>
