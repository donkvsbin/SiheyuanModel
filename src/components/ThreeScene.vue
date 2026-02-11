<template>
  <div id="three-container">
    <canvas ref="threeCanvas"></canvas>
    <div class="title-overlay">
      <h1>赵州桥</h1>
      <p>安济桥 · 隋代</p>
    </div>
  </div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  backgroundVertexShader,
  backgroundFragmentShader
} from "@/shaders/background.glsl.js";
import {
  bridgeVertexShader,
  bridgeFragmentShader,
  mountainVertexShader,
  mountainFragmentShader,
  sunVertexShader,
  sunFragmentShader
} from "@/shaders/inkWash.glsl.js";

export default {
  name: "ThreeScene",
  data() {
    return {
      uniforms: []
    };
  },
  mounted() {
    this.init();
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
    if (this.animationId) cancelAnimationFrame(this.animationId);
  },
  methods: {
    init() {
      const canvas = this.$refs.threeCanvas;

      // ==================== 场景 ====================
      const scene = new THREE.Scene();

      // ==================== 相机 ====================
      const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.set(30, 14, 45);

      // ==================== 渲染器 ====================
      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0xf5f3ef, 1);

      // ==================== 控制器 ====================
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.minDistance = 15;
      controls.maxDistance = 100;
      controls.maxPolarAngle = Math.PI / 2.1;
      controls.target.set(0, 4, 0);

      // ==================== 光照 ====================
      scene.add(new THREE.AmbientLight(0xffffff, 0.75));
      const mainLight = new THREE.DirectionalLight(0xfff8f0, 0.6);
      mainLight.position.set(10, 25, 15);
      scene.add(mainLight);

      // ==================== 雾效（轻微） ====================
      scene.fog = new THREE.Fog(0xe8e4dc, 10, 10);

      // ==================== 背景 ====================
      const bgUniforms = {
        uTime: { value: 0 },
        uColorTop: { value: new THREE.Color(0xd8d4c8) },
        uColorBottom: { value: new THREE.Color(0xf0ebe0) }
      };
      this.uniforms.push(bgUniforms);

      const bgMat = new THREE.ShaderMaterial({
        vertexShader: backgroundVertexShader,
        fragmentShader: backgroundFragmentShader,
        uniforms: bgUniforms,
        depthWrite: false
      });
      const bgMesh = new THREE.Mesh(new THREE.PlaneGeometry(300, 180), bgMat);
      bgMesh.position.set(0, 35, -80);
      bgMesh.renderOrder = -100;
      scene.add(bgMesh);

      // ==================== 太阳 ====================
      const sunUniforms = {
        uTime: { value: 0 },
        uColorCore: { value: new THREE.Color(0xe85830) },
        uColorGlow: { value: new THREE.Color(0xf08060) }
      };
      this.uniforms.push(sunUniforms);

      const sunMat = new THREE.ShaderMaterial({
        vertexShader: sunVertexShader,
        fragmentShader: sunFragmentShader,
        uniforms: sunUniforms,
        transparent: true,
        depthWrite: false
      });
      const sunMesh = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), sunMat);
      sunMesh.position.set(20, 48, -75);
      scene.add(sunMesh);

      // ==================== 远山 ====================
      const createMountain = (zPos, height, color, opacity, scale) => {
        const mUniforms = {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(color) },
          uOpacity: { value: opacity }
        };
        this.uniforms.push(mUniforms);

        const mMat = new THREE.ShaderMaterial({
          vertexShader: mountainVertexShader,
          fragmentShader: mountainFragmentShader,
          uniforms: mUniforms,
          transparent: true,
          depthWrite: false,
          side: THREE.DoubleSide
        });

        const shape = new THREE.Shape();
        const pts = this.genMountainPts(height);
        shape.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) shape.lineTo(pts[i].x, pts[i].y);
        shape.lineTo(pts[pts.length - 1].x, 0);
        shape.lineTo(pts[0].x, 0);
        shape.closePath();

        const mesh = new THREE.Mesh(new THREE.ShapeGeometry(shape), mMat);
        mesh.position.set(0, 0, zPos);
        mesh.scale.set(scale, 1, 1);
        return mesh;
      };

      scene.add(createMountain(-70, 14, 0xc8c4bc, 0.25, 2.2));
      scene.add(createMountain(-55, 11, 0xb0aca4, 0.4, 1.8));
      scene.add(createMountain(-40, 9, 0x989488, 0.5, 1.5));

      // ==================== 赵州桥 ====================
      const bridgeUniforms = {
        uTime: { value: 0 },
        uColorTop: { value: new THREE.Color(0xf8efe2) },
        uColorBottom: { value: new THREE.Color(0xCAC1AC) },
        uColorAccent: { value: new THREE.Color(0xe8dfd2) },
        uLightDir: { value: new THREE.Vector3(10, 25, 15).normalize() }
      };
      this.uniforms.push(bridgeUniforms);

      const bridgeMat = new THREE.ShaderMaterial({
        vertexShader: bridgeVertexShader,
        fragmentShader: bridgeFragmentShader,
        uniforms: bridgeUniforms,
        side: THREE.DoubleSide
      });

      // 桥体参数（加长版）
      const SPAN = 28;
      const RISE = 5;
      const W = 6;
      const H = SPAN / 2;

      // 桥体轮廓
      const bridgeShape = new THREE.Shape();
      bridgeShape.moveTo(-H - 1.5, 0);
      bridgeShape.lineTo(-H - 1.5, RISE + 2);
      bridgeShape.quadraticCurveTo(0, RISE + 2.6, H + 1.5, RISE + 2);
      bridgeShape.lineTo(H + 1.5, 0);
      bridgeShape.closePath();

      // 主拱洞
      const mainArch = new THREE.Path();
      for (let i = 0; i <= 50; i++) {
        const t = i / 50;
        const angle = Math.PI * t;
        const x = Math.cos(angle) * H;
        const y = Math.sin(angle) * RISE;
        i === 0 ? mainArch.moveTo(x, y) : mainArch.lineTo(x, y);
      }
      mainArch.closePath();
      bridgeShape.holes.push(mainArch);

      // 敞肩小拱（位于主拱肩部，在桥身实体内）
      const addSmallArch = (cx, cy, rx, ry) => {
        const p = new THREE.Path();
        for (let i = 0; i <= 24; i++) {
          const a = Math.PI * i / 24;
          i === 0
            ? p.moveTo(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry)
            : p.lineTo(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry);
        }
        p.closePath();
        bridgeShape.holes.push(p);
      };
      // 外侧小拱（靠近桥台）
      addSmallArch(-10, RISE + 0.8, 1.6, 1.2);
      addSmallArch(10, RISE + 0.8, 1.6, 1.2);
      // 内侧小拱（靠近拱顶）
      addSmallArch(-5, RISE + 1.5, 1.2, 0.9);
      addSmallArch(5, RISE + 1.5, 1.2, 0.9);

      // 挤出桥体
      const bridgeGeo = new THREE.ExtrudeGeometry(bridgeShape, {
        depth: W,
        bevelEnabled: true,
        bevelThickness: 0.08,
        bevelSize: 0.08,
        bevelSegments: 2
      });
      const bridge = new THREE.Mesh(bridgeGeo, bridgeMat);
      bridge.position.set(0, 0, -W / 2);
      scene.add(bridge);

      // 拱圈装饰
      const ringShape = new THREE.Shape();
      const ro = H + 0.25, ri = H - 0.15;
      for (let i = 0; i <= 50; i++) {
        const a = Math.PI * i / 50;
        ringShape.lineTo(Math.cos(a) * ro, Math.sin(a) * (RISE + 0.15));
      }
      for (let i = 50; i >= 0; i--) {
        const a = Math.PI * i / 50;
        ringShape.lineTo(Math.cos(a) * ri, Math.sin(a) * (RISE - 0.1));
      }
      ringShape.closePath();
      const ringGeo = new THREE.ExtrudeGeometry(ringShape, { depth: 0.2, bevelEnabled: false });
      const fRing = new THREE.Mesh(ringGeo, bridgeMat);
      fRing.position.z = W / 2 + 0.01;
      scene.add(fRing);
      const bRing = fRing.clone();
      bRing.position.z = -W / 2 - 0.21;
      scene.add(bRing);

      // 桥面
      const deckLen = SPAN + 3.5;
      const deckShape = new THREE.Shape();
      deckShape.moveTo(-deckLen / 2, 0);
      deckShape.quadraticCurveTo(0, 0.45, deckLen / 2, 0);
      deckShape.lineTo(deckLen / 2, -0.12);
      deckShape.quadraticCurveTo(0, 0.33, -deckLen / 2, -0.12);
      deckShape.closePath();
      const deckGeo = new THREE.ExtrudeGeometry(deckShape, { depth: W + 0.8, bevelEnabled: false });
      const deck = new THREE.Mesh(deckGeo, bridgeMat);
      deck.position.set(0, RISE + 2.05, -(W + 0.8) / 2);
      scene.add(deck);

      // 栏杆（浅色、加粗）
      const railMat = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
      const railLen = deckLen - 0.5;
      const createRail = (z) => {
        const g = new THREE.Group();
        for (let i = 0; i <= 20; i++) {
          const t = i / 20;
          const x = -railLen / 2 + railLen * t;
          const deckY = RISE + 2.05 + Math.sin(t * Math.PI) * 0.45;
          const post = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.7, 0.18), railMat);
          post.position.set(x, deckY + 0.35, z);
          g.add(post);
          if (i % 4 === 0) {
            const cap = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.1, 0.25), railMat);
            cap.position.set(x, deckY + 0.75, z);
            g.add(cap);
            const ball = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), railMat);
            ball.position.set(x, deckY + 0.9, z);
            g.add(ball);
          }
        }
        const pts = [];
        for (let i = 0; i <= 30; i++) {
          const t = i / 30;
          const deckY = RISE + 2.05 + Math.sin(t * Math.PI) * 0.45;
          pts.push(new THREE.Vector3(
            -railLen / 2 + railLen * t,
            deckY + 0.85,
            z
          ));
        }
        const tube = new THREE.Mesh(
          new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.06, 8),
          railMat
        );
        g.add(tube);
        return g;
      };
      scene.add(createRail(W / 2 + 0.45));
      scene.add(createRail(-W / 2 - 0.45));

      // 桥台
      const abutGeo = new THREE.BoxGeometry(3.5, 3.2, W + 1.5);
      const abut1 = new THREE.Mesh(abutGeo, bridgeMat);
      abut1.position.set(-H - 3.2, 1.6, 0);
      scene.add(abut1);
      const abut2 = abut1.clone();
      abut2.position.x = H + 3.2;
      scene.add(abut2);

      // ==================== 地面 ====================
      const groundMat = new THREE.MeshBasicMaterial({ color: 0xB8B8B4 });
      const ground = new THREE.Mesh(new THREE.PlaneGeometry(300, 150), groundMat);
      ground.rotation.x = -Math.PI / 2;
      ground.position.set(0, 0.2, 0);
      scene.add(ground);



      // ==================== 动画 ====================
      const clock = new THREE.Clock();
      const animate = () => {
        this.animationId = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();
        this.uniforms.forEach((u) => { if (u.uTime) u.uTime.value = t; });
        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      // ==================== 响应式 ====================
      this.onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", this.onResize);
    },

    genMountainPts(h) {
      const pts = [];
      for (let i = 0; i <= 60; i++) {
        const x = (i / 60 - 0.5) * 120;
        let y = Math.sin((i / 60) * Math.PI * 2 + 1) * h * 0.3;
        y += Math.sin((i / 60) * Math.PI * 4 + 2) * h * 0.25;
        y += Math.sin((i / 60) * Math.PI * 1.5) * h * 0.5;
        y = Math.max(0.5, y + h * 0.35 + (Math.random() - 0.5) * h * 0.08);
        pts.push({ x, y });
      }
      return pts;
    }
  }
};
</script>

<style scoped>
#three-container {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(to bottom, #dcd8cc, #f0ebe0);
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.title-overlay {
  position: absolute;
  top: 32px;
  left: 40px;
  pointer-events: none;
  font-family: "STKaiti", "KaiTi", "楷体", serif;
}

.title-overlay h1 {
  font-size: 2.6rem;
  font-weight: 400;
  margin: 0;
  letter-spacing: 0.4em;
  color: #4a4038;
  text-shadow: 2px 2px 8px rgba(255, 255, 255, 0.7);
}

.title-overlay p {
  font-size: 1rem;
  margin: 8px 0 0;
  color: #7a6a5a;
  letter-spacing: 0.2em;
}
</style>
