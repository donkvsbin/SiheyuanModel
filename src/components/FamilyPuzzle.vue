<template>
  <div v-if="visible" class="puzzle-overlay" @click.self="$emit('back')">
    <div class="puzzle-panel">
      <div class="panel-header">
        <span class="panel-title">全家福</span>
        <button class="close-btn" @click="$emit('back')">✕</button>
      </div>

      <div class="panel-body">
        <div class="subtitle">让离散的家人，重归团圆</div>

        <div class="puzzle-area" ref="areaRef">
          <div class="photo-frame" ref="frameRef">
            <img
              :src="familySrc"
              alt="全家福"
              class="family-img"
              draggable="false"
              @contextmenu.prevent
            />
            <div v-if="ready" class="target-zone" :style="targetStyle">
              <div class="target-glow"></div>
              <span class="target-hint" v-if="!completed">拖放至此</span>
            </div>
            <img v-if="completed" :src="finalSrc" alt="完整全家福" class="final-img-reveal" />
          </div>

          <div
            v-if="ready && !completed"
            ref="pieceRef"
            class="puzzle-piece"
            :class="{ dragging: isDragging, snapped: justSnapped }"
            :style="pieceStyle"
            @mousedown.prevent="startDrag"
            @touchstart.prevent="startDrag"
          >
            <img
              :src="pieceSrc"
              alt="三儿子"
              class="piece-img"
              draggable="false"
              @contextmenu.prevent
            />
          </div>
        </div>

        <div class="hint-text" v-if="ready && !completed">
          <span class="hint-icon">🖱</span> 拖动右下角的照片碎片，拼入图中
        </div>

        <button v-if="completed" class="confirm-btn" @click="$emit('complete')">好了</button>
      </div>
    </div>
  </div>
</template>

<script>
const TARGET_X = 0.03
const TARGET_Y = 0.55
const PIECE_W_RATIO = 0.38
const PIECE_H_RATIO = 0.35
const SNAP_TOLERANCE = 50

export default {
  name: 'FamilyPuzzle',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['complete', 'back'],
  data() {
    return {
      familySrc: '/photo/Character2D/familyColored.png',
      pieceSrc: '/photo/Character2D/thirdsonColored.png',
      finalSrc: '/photo/Character2D/finalPicColored.png',
      ready: false,
      completed: false,
      justSnapped: false,
      isDragging: false,
      pieceX: 0,
      pieceY: 0,
      dragStartX: 0,
      dragStartY: 0,
      pieceStartX: 0,
      pieceStartY: 0,
      imgWidth: 0,
      imgHeight: 0,
      pieceW: 0,
      pieceH: 0,
      targetCenterX: 0,
      targetCenterY: 0,
    }
  },
  computed: {
    targetStyle() {
      if (!this.imgWidth) return { display: 'none' }
      return {
        left: (this.imgWidth * TARGET_X) + 'px',
        top: (this.imgHeight * TARGET_Y) + 'px',
        width: (this.imgWidth * PIECE_W_RATIO) + 'px',
        height: (this.imgHeight * PIECE_H_RATIO) + 'px',
      }
    },
    pieceStyle() {
      return {
        left: this.pieceX + 'px',
        top: this.pieceY + 'px',
        width: this.pieceW + 'px',
        height: this.pieceH + 'px',
      }
    },
  },
  watch: {
    visible(val) {
      if (val) {
        this.resetGame()
        this.$nextTick(() => {
          this.loadImages()
        })
      }
    }
  },
  mounted() {
    window.addEventListener('mousemove', this.onDrag)
    window.addEventListener('mouseup', this.endDrag)
    window.addEventListener('touchmove', this.onDrag, { passive: false })
    window.addEventListener('touchend', this.endDrag)
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount() {
    window.removeEventListener('mousemove', this.onDrag)
    window.removeEventListener('mouseup', this.endDrag)
    window.removeEventListener('touchmove', this.onDrag)
    window.removeEventListener('touchend', this.endDrag)
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    loadImages() {
      this.ready = false
      const img = new Image()
      img.onload = () => {
        const maxW = Math.min(window.innerWidth - 80, 380)
        const scale = maxW / img.naturalWidth
        this.imgWidth = img.naturalWidth * scale
        this.imgHeight = img.naturalHeight * scale

        this.pieceW = this.imgWidth * PIECE_W_RATIO
        this.pieceH = this.imgHeight * PIECE_H_RATIO

        this.targetCenterX = this.imgWidth * TARGET_X + this.pieceW / 2
        this.targetCenterY = this.imgHeight * TARGET_Y + this.pieceH / 2

        this.resetPiecePosition()
        this.ready = true
      }
      img.src = this.familySrc
    },

    resetPiecePosition() {
      this.pieceX = (this.imgWidth - this.pieceW) / 2
      this.pieceY = this.imgHeight + 20
      this.justSnapped = false
    },

    handleResize() {
      if (!this.visible) return
      this.loadImages()
    },

    getClientPos(e) {
      if (e.touches && e.touches.length > 0) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY }
      }
      if (e.changedTouches && e.changedTouches.length > 0) {
        return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY }
      }
      return { x: e.clientX, y: e.clientY }
    },

    startDrag(e) {
      if (this.completed) return
      this.isDragging = true
      this.justSnapped = false
      const pos = this.getClientPos(e)
      this.dragStartX = pos.x
      this.dragStartY = pos.y
      this.pieceStartX = this.pieceX
      this.pieceStartY = this.pieceY
    },

    onDrag(e) {
      if (!this.isDragging) return
      e.preventDefault()
      const pos = this.getClientPos(e)
      this.pieceX = this.pieceStartX + (pos.x - this.dragStartX)
      this.pieceY = this.pieceStartY + (pos.y - this.dragStartY)
    },

    endDrag() {
      if (!this.isDragging) return
      this.isDragging = false
      this.checkSnap()
    },

    checkSnap() {
      const pieceCenterX = this.pieceX + this.pieceW / 2
      const pieceCenterY = this.pieceY + this.pieceH / 2

      const dist = Math.sqrt(
        Math.pow(pieceCenterX - this.targetCenterX, 2) +
        Math.pow(pieceCenterY - this.targetCenterY, 2)
      )

      if (dist < SNAP_TOLERANCE) {
        this.pieceX = this.targetCenterX - this.pieceW / 2
        this.pieceY = this.targetCenterY - this.pieceH / 2
        this.justSnapped = true
        setTimeout(() => {
          this.completed = true
        }, 400)
      }
    },

    resetGame() {
      this.completed = false
      this.justSnapped = false
      this.resetPiecePosition()
    },
  },
}
</script>

<style scoped>
.puzzle-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.puzzle-panel {
  background: linear-gradient(135deg, #f5f0e8 0%, #e8e0d0 100%);
  border-radius: 20px;
  width: 90%;
  max-width: 520px;
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
  margin-bottom: 16px;
  letter-spacing: 4px;
}

.puzzle-area {
  position: relative;
  display: inline-block;
}

.photo-frame {
  position: relative;
  border: 3px solid #d4c4a8;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(139, 69, 19, 0.12);
  line-height: 0;
  background: #faf7f0;
}

.family-img {
  display: block;
  width: 100%;
  height: auto;
  pointer-events: none;
}

/* Target zone */
.target-zone {
  position: absolute;
  border: 2px dashed rgba(180, 130, 80, 0.5);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  animation: targetPulse 2s ease-in-out infinite;
}

.target-glow {
  position: absolute;
  inset: 0;
  background: rgba(180, 130, 80, 0.06);
  border-radius: 4px;
}

.target-hint {
  position: relative;
  z-index: 1;
  color: rgba(140, 100, 60, 0.6);
  font-size: 16px;
  letter-spacing: 4px;
}

@keyframes targetPulse {
  0%, 100% { border-color: rgba(180, 130, 80, 0.35); }
  50% { border-color: rgba(180, 130, 80, 0.65); }
}

/* Puzzle piece */
.puzzle-piece {
  position: absolute;
  cursor: grab;
  z-index: 10;
  border-radius: 4px;
  border: 2px solid rgba(180, 130, 80, 0.4);
  transition: box-shadow 0.2s, border-color 0.2s;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}
.puzzle-piece.dragging {
  cursor: grabbing;
  z-index: 20;
  border-color: rgba(160, 100, 40, 0.7);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.35), 0 0 20px rgba(160, 100, 40, 0.2);
}
.puzzle-piece.snapped {
  border-color: rgba(160, 100, 40, 0.9);
  box-shadow: 0 0 24px rgba(160, 100, 40, 0.35);
  transition: all 0.3s ease;
}

.piece-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 2px;
  pointer-events: none;
  display: block;
}

/* Final revealed image */
.final-img-reveal {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  animation: fadeIn 0.6s ease;
  z-index: 5;
}

/* Confirm button */
.confirm-btn {
  margin-top: 18px;
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

/* Hint */
.hint-text {
  margin-top: 16px;
  font-size: 14px;
  color: #8b7355;
  letter-spacing: 2px;
  animation: hintFade 2s ease-in-out infinite;
}
.hint-icon {
  font-size: 16px;
}

@keyframes hintFade {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.9; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
