<template>
  <div ref="container" class="model-viewer"></div>
</template>

<script>
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

export default {
  name: 'ModelViewer',
  props: {
    modelPath: {
      type: String,
      required: true
    },
    autoRotate: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    modelPath(newPath, oldPath) {
      if (newPath !== oldPath) {
        console.log('ModelViewer: Model path changed to', newPath);
        this.reloadModel();
      }
    }
  },
  data() {
    return {
      isDragging: false,
      previousMousePosition: { x: 0, y: 0 },
      rotationSpeed: 0.005,
      autoRotateSpeed: 0.01,
      scale: 1,
      minScale: 0.5,
      maxScale: 3
    };
  },
  mounted() {
    // 初始化 Three.js 对象（非响应式，避免与 Vue 代理冲突）
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.model = null;
    
    this.initThree();
    this.loadModel();
    this.addEventListeners();
    this.animate();
  },
  beforeUnmount() {
    this.removeEventListeners();
    if (this.renderer) {
      this.renderer.dispose();
    }
  },
  methods: {
    initThree() {
      const container = this.$refs.container;
      const width = container.clientWidth;
      const height = container.clientHeight;

      // 场景
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x2a2a2a);

      // 相机
      this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      this.camera.position.set(0, 0, 5);

      // 渲染器
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.shadowMap.enabled = true;
      container.appendChild(this.renderer.domElement);

      // 灯光
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      this.scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 5, 5);
      directionalLight.castShadow = true;
      this.scene.add(directionalLight);

      const backLight = new THREE.DirectionalLight(0xffffff, 0.4);
      backLight.position.set(-5, 5, -5);
      this.scene.add(backLight);

      // 处理窗口大小变化
      window.addEventListener('resize', this.onWindowResize);
    },

    loadModel() {
      if (!this.modelPath) {
        console.warn('ModelViewer: No model path provided');
        return;
      }

      console.log('ModelViewer: Loading model from', this.modelPath);

      const loader = new GLTFLoader();
      
      // 配置 DRACO 解码器
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('/draco/');
      loader.setDRACOLoader(dracoLoader);
      loader.load(
        this.modelPath,
        (gltf) => {
          console.log('ModelViewer: Model loaded successfully');
          this.model = gltf.scene;
          
          // 计算模型包围盒，自动调整大小和位置
          const box = new THREE.Box3().setFromObject(this.model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          
          console.log('ModelViewer: Model size', size, 'center', center);
          
          // 重置模型位置到中心
          this.model.position.sub(center);
          
          // 自动缩放以适应视口
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = maxDim > 0 ? 2 / maxDim : 1;
          this.model.scale.setScalar(scale);
          this.scale = scale;
          
          this.scene.add(this.model);
          this.$emit('loaded');
        },
        (progress) => {
          if (progress.total > 0) {
            const percent = (progress.loaded / progress.total * 100).toFixed(0);
            console.log('ModelViewer: Loading', percent + '%');
          }
        },
        (error) => {
          console.error('ModelViewer: Error loading model:', error);
          // 显示错误提示
          this.showError('模型加载失败');
        }
      );
    },

    showError(message) {
      // 在场景中显示错误文字
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 512;
      canvas.height = 128;
      context.fillStyle = '#2a2a2a';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = '#d4af37';
      context.font = '24px Arial';
      context.textAlign = 'center';
      context.fillText(message, canvas.width / 2, canvas.height / 2);
      
      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(4, 1, 1);
      this.scene.add(sprite);
    },

    reloadModel() {
      // 移除旧模型
      if (this.model) {
        this.scene.remove(this.model);
        this.model = null;
      }
      // 清除场景中的错误提示
      const sprites = [];
      this.scene.traverse((child) => {
        if (child.isSprite) sprites.push(child);
      });
      sprites.forEach(sprite => this.scene.remove(sprite));
      
      // 重新加载新模型
      this.loadModel();
    },

    addEventListeners() {
      const canvas = this.renderer.domElement;
      
      // 鼠标拖拽旋转
      canvas.addEventListener('mousedown', this.onMouseDown);
      canvas.addEventListener('mousemove', this.onMouseMove);
      canvas.addEventListener('mouseup', this.onMouseUp);
      canvas.addEventListener('mouseleave', this.onMouseUp);
      
      // 滚轮缩放
      canvas.addEventListener('wheel', this.onWheel, { passive: false });
      
      // 触摸支持
      canvas.addEventListener('touchstart', this.onTouchStart, { passive: false });
      canvas.addEventListener('touchmove', this.onTouchMove, { passive: false });
      canvas.addEventListener('touchend', this.onTouchEnd);
    },

    removeEventListeners() {
      const canvas = this.renderer.domElement;
      canvas.removeEventListener('mousedown', this.onMouseDown);
      canvas.removeEventListener('mousemove', this.onMouseMove);
      canvas.removeEventListener('mouseup', this.onMouseUp);
      canvas.removeEventListener('mouseleave', this.onMouseUp);
      canvas.removeEventListener('wheel', this.onWheel);
      canvas.removeEventListener('touchstart', this.onTouchStart);
      canvas.removeEventListener('touchmove', this.onTouchMove);
      canvas.removeEventListener('touchend', this.onTouchEnd);
      window.removeEventListener('resize', this.onWindowResize);
    },

    onMouseDown(event) {
      this.isDragging = true;
      this.previousMousePosition = {
        x: event.clientX,
        y: event.clientY
      };
      this.$emit('drag-start');
    },

    onMouseMove(event) {
      if (!this.isDragging || !this.model) return;

      const deltaMove = {
        x: event.clientX - this.previousMousePosition.x,
        y: event.clientY - this.previousMousePosition.y
      };

      // 旋转模型
      this.model.rotation.y += deltaMove.x * this.rotationSpeed;
      this.model.rotation.x += deltaMove.y * this.rotationSpeed;

      this.previousMousePosition = {
        x: event.clientX,
        y: event.clientY
      };
    },

    onMouseUp() {
      this.isDragging = false;
      this.$emit('drag-end');
    },

    onWheel(event) {
      event.preventDefault();
      if (!this.model) return;

      const delta = event.deltaY > 0 ? 0.9 : 1.1;
      const newScale = this.scale * delta;
      
      // 限制缩放范围
      if (newScale >= this.minScale && newScale <= this.maxScale) {
        this.scale = newScale;
        this.model.scale.setScalar(this.scale);
      }
    },

    // 触摸事件处理
    onTouchStart(event) {
      if (event.touches.length === 1) {
        this.isDragging = true;
        this.previousMousePosition = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY
        };
        this.$emit('drag-start');
      }
    },

    onTouchMove(event) {
      if (!this.isDragging || !this.model || event.touches.length !== 1) return;
      event.preventDefault();

      const deltaMove = {
        x: event.touches[0].clientX - this.previousMousePosition.x,
        y: event.touches[0].clientY - this.previousMousePosition.y
      };

      this.model.rotation.y += deltaMove.x * this.rotationSpeed;
      this.model.rotation.x += deltaMove.y * this.rotationSpeed;

      this.previousMousePosition = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      };
    },

    onTouchEnd() {
      this.isDragging = false;
      this.$emit('drag-end');
    },

    onWindowResize() {
      const container = this.$refs.container;
      if (!container || !this.camera || !this.renderer) return;

      const width = container.clientWidth;
      const height = container.clientHeight;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    },

    animate() {
      requestAnimationFrame(this.animate);

      // 自动旋转
      if (this.autoRotate && !this.isDragging && this.model) {
        this.model.rotation.y += this.autoRotateSpeed;
      }

      this.renderer.render(this.scene, this.camera);
    }
  }
};
</script>

<style scoped>
.model-viewer {
  width: 100%;
  height: 100%;
  cursor: grab;
}

.model-viewer:active {
  cursor: grabbing;
}

.model-viewer canvas {
  display: block;
}
</style>
