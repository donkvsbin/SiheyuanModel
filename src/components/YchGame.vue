<template>
  <div class="ych-page">
    <button class="back-btn" @click="goBack">← 返回游戏</button>

    <div class="title">溢彩画</div>
    <div class="subtitle">以色为墨，染就丹青</div>

    <div class="canvas-wrap">
      <canvas
        ref="canvasRef"
        :width="canvasSize"
        :height="canvasSize"
        @click="handleCanvasClick"
      ></canvas>
      <div v-if="won" class="overlay win">
        <div class="overlay-title">画成！</div>
        <div class="overlay-desc">用了 {{ moves }} 步完成溢彩画</div>
        <button class="retry-btn" @click="resetGame">再画一幅</button>
      </div>
    </div>

    <div class="palette">
      <button
        v-for="(c, idx) in palette"
        :key="idx"
        class="color-btn"
        :class="{ active: !won && idx === activeColor, disabled: won || idx === activeColor }"
        :disabled="won || idx === activeColor"
        @click="pickColor(idx)"
      >
        <span class="paint-dish" :style="{ background: c }"></span>
      </button>
    </div>
  </div>
</template>

<script>
const GRID_SIZE = 6
const COLOR_COUNT = 4
const PALETTE = ['#C41E3A', '#E8B84B', '#3CB371', '#4A6FA5']

export default {
  name: 'YchGame',
  data() {
    return {
      grid: [],
      palette: PALETTE,
      moves: 0,
      activeColor: -1,
      won: false,
      controlledCells: [],
      canvasSize: 480,
      cellSize: 0,
    }
  },
  mounted() {
    this.initGame()
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    goBack() {
      this.$router.push('/')
    },

    initGame() {
      this.moves = 0
      this.won = false

      this.grid = []
      for (let r = 0; r < GRID_SIZE; r++) {
        this.grid[r] = []
        for (let c = 0; c < GRID_SIZE; c++) {
          this.grid[r][c] = Math.floor(Math.random() * COLOR_COUNT)
        }
      }

      this.calcCanvasSize()
      this.updateControlled()
      this.activeColor = this.grid[0][0]

      this.$nextTick(() => {
        this.render()
      })
    },

    calcCanvasSize() {
      const maxWidth = Math.min(window.innerWidth - 32, 500)
      this.canvasSize = maxWidth
      this.cellSize = Math.floor(this.canvasSize / GRID_SIZE)
      this.canvasSize = this.cellSize * GRID_SIZE
    },

    handleResize() {
      this.calcCanvasSize()
      this.$nextTick(() => {
        this.render()
      })
    },

    updateControlled() {
      const targetColor = this.grid[0][0]
      const visited = new Set()
      const queue = [[0, 0]]
      visited.add('0,0')
      const cells = []

      while (queue.length > 0) {
        const [r, c] = queue.shift()
        cells.push([r, c])

        for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
          const nr = r + dr
          const nc = c + dc
          const key = `${nr},${nc}`
          if (
            nr >= 0 && nr < GRID_SIZE &&
            nc >= 0 && nc < GRID_SIZE &&
            !visited.has(key) &&
            this.grid[nr][nc] === targetColor
          ) {
            visited.add(key)
            queue.push([nr, nc])
          }
        }
      }

      this.controlledCells = cells
    },

    pickColor(colorIdx) {
      if (this.won) return
      if (colorIdx === this.grid[0][0]) return

      this.moves++
      const newColor = colorIdx

      for (const [r, c] of this.controlledCells) {
        this.grid[r][c] = newColor
      }

      this.updateControlled()
      this.activeColor = newColor

      if (this.controlledCells.length === GRID_SIZE * GRID_SIZE) {
        this.won = true
      }

      this.render()
    },

    resetGame() {
      this.initGame()
    },

    handleCanvasClick(e) {
      if (this.won) return

      const rect = this.$refs.canvasRef.getBoundingClientRect()
      const scaleX = this.canvasSize / rect.width
      const scaleY = this.canvasSize / rect.height
      const x = (e.clientX - rect.left) * scaleX
      const y = (e.clientY - rect.top) * scaleY

      const col = Math.floor(x / this.cellSize)
      const row = Math.floor(y / this.cellSize)

      if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
        const cellColor = this.grid[row][col]
        if (cellColor !== this.grid[0][0]) {
          this.pickColor(cellColor)
        }
      }
    },

    render() {
      const canvas = this.$refs.canvasRef
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      const cs = this.cellSize
      const gap = Math.max(1, Math.floor(cs * 0.08))
      const innerSize = cs - gap * 2

      ctx.clearRect(0, 0, this.canvasSize, this.canvasSize)

      ctx.fillStyle = '#1a1a2e'
      ctx.fillRect(0, 0, this.canvasSize, this.canvasSize)

      const controlledSet = new Set(this.controlledCells.map(([r, c]) => `${r},${c}`))

      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          const x = c * cs + gap
          const y = r * cs + gap
          const colorIdx = this.grid[r][c]
          const color = this.palette[colorIdx]

          ctx.beginPath()
          const radius = Math.max(2, cs * 0.12)
          this.roundRect(ctx, x, y, innerSize, innerSize, radius)
          ctx.fillStyle = color
          ctx.fill()

          if (controlledSet.has(`${r},${c}`)) {
            ctx.save()
            ctx.shadowColor = '#ffffff'
            ctx.shadowBlur = cs * 0.3
            ctx.strokeStyle = 'rgba(255,255,255,0.8)'
            ctx.lineWidth = Math.max(1.5, cs * 0.06)
            ctx.beginPath()
            this.roundRect(ctx, x, y, innerSize, innerSize, radius)
            ctx.stroke()
            ctx.restore()
          }
        }
      }
    },

    roundRect(ctx, x, y, w, h, r) {
      ctx.moveTo(x + r, y)
      ctx.lineTo(x + w - r, y)
      ctx.arcTo(x + w, y, x + w, y + r, r)
      ctx.lineTo(x + w, y + h - r)
      ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
      ctx.lineTo(x + r, y + h)
      ctx.arcTo(x, y + h, x, y + h - r, r)
      ctx.lineTo(x, y + r)
      ctx.arcTo(x, y, x + r, y, r)
      ctx.closePath()
    },
  },
}
</script>

<style scoped>
.ych-page {
  min-height: 100vh;
  background: #0f0f1a;
  color: #e0d5c0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  font-family: 'STKaiti', 'KaiTi', '楷体', serif;
  user-select: none;
}

.back-btn {
  align-self: flex-start;
  background: none;
  border: 1px solid #5a4a3a;
  color: #b8a080;
  padding: 8px 18px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 15px;
  font-family: inherit;
  transition: all 0.2s;
}
.back-btn:hover {
  border-color: #c9a96e;
  color: #d4b896;
}

.title {
  font-size: 48px;
  font-weight: bold;
  letter-spacing: 12px;
  color: #d4b896;
  margin-top: 8px;
  text-shadow: 0 0 40px rgba(200, 160, 100, 0.4);
}

.subtitle {
  font-size: 16px;
  color: #6b5c4e;
  margin-bottom: 20px;
  letter-spacing: 4px;
}


.canvas-wrap {
  position: relative;
  border: 2px solid #3a2a1a;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 60px rgba(180, 140, 80, 0.15);
}

.canvas-wrap canvas {
  display: block;
  cursor: pointer;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 15, 26, 0.82);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  animation: fadeIn 0.4s ease;
}
.overlay-title {
  font-size: 42px;
  font-weight: bold;
  letter-spacing: 8px;
  color: #e8c86a;
  text-shadow: 0 0 60px rgba(232, 200, 106, 0.6);
}
.overlay-desc {
  font-size: 16px;
  color: #8a7a6a;
  letter-spacing: 2px;
}

.retry-btn {
  margin-top: 12px;
  padding: 10px 32px;
  background: linear-gradient(135deg, #5a3a1a, #7a5030);
  border: 1px solid #9a7050;
  color: #e0c8a0;
  font-size: 18px;
  font-family: inherit;
  letter-spacing: 6px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}
.retry-btn:hover {
  background: linear-gradient(135deg, #6a4a2a, #8a6040);
  border-color: #b89060;
}

.palette {
  display: flex;
  gap: 16px;
  margin-top: 20px;
  padding: 14px 24px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid #2a2a3a;
  border-radius: 40px;
}

.color-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid transparent;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  padding: 0;
}
.color-btn:hover:not(.disabled) {
  border-color: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}
.color-btn.active {
  border-color: #e8c86a;
  box-shadow: 0 0 16px rgba(232, 200, 106, 0.5);
}
.color-btn.disabled {
  opacity: 0.4;
  cursor: default;
}

.paint-dish {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: block;
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.2), inset 0 -2px 4px rgba(0, 0, 0, 0.3);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
