<template>
  <div class="puzzle-page">
    <button class="back-btn" @click="goBack">← 返回游戏</button>

    <div class="title">全家福</div>
    <div class="subtitle">让离散的家人，重归团圆</div>

    <div class="puzzle-area" ref="areaRef">
      <!-- Family photo base -->
      <div class="photo-frame" ref="frameRef">
        <img
          :src="familySrc"
          alt="全家福"
          class="family-img"
          draggable="false"
          @contextmenu.prevent
        />
        <!-- Target zone highlight -->
        <div v-if="ready" class="target-zone" :style="targetStyle">
          <div class="target-glow"></div>
          <span class="target-hint" v-if="!completed">拖放至此</span>
        </div>

        <!-- Completed: show final image -->
        <img v-if="completed" :src="finalSrc" alt="完整全家福" class="final-img-reveal" />
      </div>

      <!-- Draggable piece -->
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

    <div class="hint-text" v-if="ready && !completed && !isDragging">
      <span class="hint-icon">🖱</span> 拖动右下角的照片碎片，拼入图中
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
  data() {
    return {
      familySrc: '/photo/Character2D/family.png',
      pieceSrc: '/photo/Character2D/thirdson.png',
      finalSrc: '/photo/Character2D/finalPic.png',
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
  mounted() {
    this.loadImages()
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
    goBack() {
      this.$router.push('/')
    },

    loadImages() {
      const img = new Image()
      img.onload = () => {
        const maxW = Math.min(window.innerWidth - 48, 520)
        const scale = maxW / img.naturalWidth
        this.imgWidth = img.naturalWidth * scale
        this.imgHeight = img.naturalHeight * scale

        this.pieceW = this.imgWidth * PIECE_W_RATIO
        this.pieceH = this.imgHeight * PIECE_H_RATIO

        this.targetCenterX = this.imgWidth * TARGET_X + this.pieceW / 2
        this.targetCenterY = this.imgHeight * TARGET_Y + this.pieceH / 2

        // Start piece centered below the photo
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
      this.ready = false
      this.completed = false
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
.puzzle-page {
  min-height: 100vh;
  background: #0f0f1a;
  color: #e0d5c0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  font-family: 'STKaiti', 'KaiTi', '楷体', serif;
  user-select: none;
  overflow-y: auto;
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

.puzzle-area {
  position: relative;
  display: inline-block;
}

.photo-frame {
  position: relative;
  border: 3px solid #3a2a1a;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 60px rgba(180, 140, 80, 0.15);
  line-height: 0;
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
  border: 2px dashed rgba(255, 215, 0, 0.5);
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
  background: rgba(255, 200, 50, 0.06);
  border-radius: 4px;
}

.target-hint {
  position: relative;
  z-index: 1;
  color: rgba(255, 215, 0, 0.6);
  font-size: 18px;
  letter-spacing: 4px;
}

@keyframes targetPulse {
  0%, 100% { border-color: rgba(255, 215, 0, 0.35); }
  50% { border-color: rgba(255, 215, 0, 0.65); }
}

/* Puzzle piece */
.puzzle-piece {
  position: absolute;
  cursor: grab;
  z-index: 10;
  border-radius: 4px;
  border: 2px solid rgba(200, 160, 100, 0.3);
  transition: box-shadow 0.2s, border-color 0.2s;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}
.puzzle-piece.dragging {
  cursor: grabbing;
  z-index: 20;
  border-color: rgba(255, 200, 50, 0.6);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6), 0 0 24px rgba(255, 200, 50, 0.25);
}
.puzzle-piece.snapped {
  border-color: rgba(255, 215, 0, 0.9);
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
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

/* Hint */
.hint-text {
  margin-top: 16px;
  font-size: 14px;
  color: #5a4a3a;
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
