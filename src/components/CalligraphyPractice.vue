<template>
  <div class="calligraphy-overlay" @click.self="close">
    <div class="calligraphy-container">
      <div class="header">
        <h2>{{ title }}</h2>
        <button class="close-btn" @click="close">×</button>
      </div>
      
      <div class="canvas-wrapper">
        <canvas
          ref="canvas"
          :width="canvasWidth"
          :height="canvasHeight"
          @mousedown="startDrawing"
          @mousemove="draw"
          @mouseup="stopDrawing"
          @mouseleave="stopDrawing"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="stopDrawing"
        ></canvas>
        <img ref="templateImg" src="/photo/fu.png" class="template-image" @load="onImageLoad" />
      </div>
      
      <div class="controls">
        <button @click="clearCanvas">{{ clearText }}</button>
        <button @click="saveWork">{{ saveText }}</button>
      </div>
      
      <p class="hint">{{ hintText }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CalligraphyPractice',
  props: {
    locale: {
      type: String,
      default: 'zh'
    }
  },
  data() {
    return {
      canvasWidth: 400,
      canvasHeight: 400,
      isDrawing: false,
      ctx: null,
      lastX: 0,
      lastY: 0
    };
  },
  computed: {
    title() {
      return this.locale === 'zh' ? '书法临摹' : 'Calligraphy Practice';
    },
    clearText() {
      return this.locale === 'zh' ? '清空' : 'Clear';
    },
    saveText() {
      return this.locale === 'zh' ? '保存作品' : 'Save Work';
    },
    hintText() {
      return this.locale === 'zh' ? '按住鼠标左键在画布上书写，ESC键退出' : 'Hold left mouse button to write, ESC to exit';
    }
  },
  mounted() {
    this.initCanvas();
    window.addEventListener('keydown', this.handleKeydown);
    // 显示鼠标光标
    document.body.style.cursor = 'default';
    // 退出指针锁定
    if (document.pointerLockElement) {
      document.exitPointerLock();
    }
    // 通知父组件进入临摹模式
    this.$emit('enter');
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeydown);
    // 恢复鼠标光标
    document.body.style.cursor = 'none';
  },
  methods: {
    initCanvas() {
      const canvas = this.$refs.canvas;
      this.ctx = canvas.getContext('2d');
      
      // 设置画布背景为米黄色（宣纸颜色）
      this.ctx.fillStyle = '#f5f5dc';
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
      
      // 设置笔触样式
      this.ctx.strokeStyle = '#1a1a1a';
      this.ctx.lineWidth = 8;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      
      // 绘制底图（如果已加载）
      this.drawTemplate();
    },
    onImageLoad() {
      this.drawTemplate();
    },
    drawTemplate() {
      const img = this.$refs.templateImg;
      if (!img || !img.complete || !this.ctx) return;
      
      // 绘制半透明底图作为临摹参考
      this.ctx.save();
      this.ctx.globalAlpha = 0.15;
      const scale = Math.min(
        this.canvasWidth / img.naturalWidth,
        this.canvasHeight / img.naturalHeight
      ) * 0.8;
      const x = (this.canvasWidth - img.naturalWidth * scale) / 2;
      const y = (this.canvasHeight - img.naturalHeight * scale) / 2;
      this.ctx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale);
      this.ctx.restore();
    },
    getCoordinates(e) {
      const canvas = this.$refs.canvas;
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    },
    startDrawing(e) {
      e.preventDefault();
      this.isDrawing = true;
      const coords = this.getCoordinates(e);
      this.lastX = coords.x;
      this.lastY = coords.y;
    },
    draw(e) {
      if (!this.isDrawing) return;
      e.preventDefault();
      
      const coords = this.getCoordinates(e);
      
      this.ctx.beginPath();
      this.ctx.moveTo(this.lastX, this.lastY);
      this.ctx.lineTo(coords.x, coords.y);
      this.ctx.stroke();
      
      this.lastX = coords.x;
      this.lastY = coords.y;
    },
    stopDrawing() {
      this.isDrawing = false;
    },
    handleTouchStart(e) {
      this.startDrawing(e);
    },
    handleTouchMove(e) {
      this.draw(e);
    },
    clearCanvas() {
      this.ctx.fillStyle = '#f5f5dc';
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.drawTemplate();
    },
    saveWork() {
      const canvas = this.$refs.canvas;
      const link = document.createElement('a');
      link.download = 'my-calligraphy.png';
      link.href = canvas.toDataURL();
      link.click();
    },
    close() {
      this.$emit('close');
    },
    handleKeydown(e) {
      if (e.key === 'Escape') {
        this.close();
      }
    }
  }
};
</script>

<style scoped>
.calligraphy-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.calligraphy-container {
  background: #2a2a2a;
  border-radius: 12px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header h2 {
  color: #f5f5dc;
  margin: 0;
  font-size: 20px;
}

.close-btn {
  background: none;
  border: none;
  color: #999;
  font-size: 28px;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.canvas-wrapper {
  position: relative;
  display: inline-block;
  border: 3px solid #8b4513;
  border-radius: 4px;
  background: #f5f5dc;
}

.canvas-wrapper canvas {
  display: block;
  cursor: crosshair;
  border-radius: 2px;
}

.template-image {
  display: none;
}

.controls {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  justify-content: center;
}

.controls button {
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  background: #8b4513;
  color: #f5f5dc;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.controls button:hover {
  background: #a0522d;
  transform: translateY(-1px);
}

.hint {
  text-align: center;
  color: #999;
  font-size: 12px;
  margin-top: 12px;
  margin-bottom: 0;
}
</style>
