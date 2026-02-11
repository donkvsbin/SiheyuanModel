<template>
  <div ref="container" class="scene-container">
    <div v-if="loading" class="loading-overlay">
      <div class="loading-content">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: loadingProgress + '%' }"></div>
        </div>
        <div class="loading-text">{{ loadingProgress.toFixed(0) }}%</div>
      </div>
    </div>
    <div class="player-info" v-if="!loading && player">
      <div>X: {{ playerPos.x.toFixed(2) }}</div>
      <div>Y: {{ playerPos.y.toFixed(2) }}</div>
      <div>Z: {{ playerPos.z.toFixed(2) }}</div>

    </div>
    <div class="footer-text" v-if="!loading">By Mello</div>
    <div class="settings-overlay" v-if="showSettings">
      <div class="settings-panel">
        <h2 class="settings-title">设置</h2>

        <section class="settings-section">
          <h3 class="settings-section-title">视频选项</h3>
          <div class="settings-group">
            <label>环境光强度 {{ ambientIntensity.toFixed(2) }}</label>
            <input type="range" v-model.number="ambientIntensity" min="0" max="2" step="0.05" />
          </div>
          <div class="settings-group">
            <label>平行光强度 {{ directionalIntensity.toFixed(1) }}</label>
            <input type="range" v-model.number="directionalIntensity" min="0" max="15" step="0.5" />
          </div>
          <div class="settings-group">
            <label>泛光强度 {{ bloomStrength.toFixed(2) }}</label>
            <input type="range" v-model.number="bloomStrength" min="0" max="1" step="0.05" />
          </div>
          <div class="settings-group">
            <label>曝光 {{ toneMappingExposure.toFixed(2) }}</label>
            <input type="range" v-model.number="toneMappingExposure" min="0.3" max="2.5" step="0.05" />
          </div>
        </section>

        <section class="settings-section">
          <h3 class="settings-section-title">音乐选项</h3>
          <div class="settings-group settings-row">
            <label>开启音乐</label>
            <input type="checkbox" v-model="musicEnabled" />
          </div>
          <div class="settings-group">
            <label>音量 {{ (musicVolume * 100).toFixed(0) }}%</label>
            <input type="range" v-model.number="musicVolume" min="0" max="1" step="0.05" />
          </div>
        </section>

        <section class="settings-section">
          <h3 class="settings-section-title">性能选项</h3>
          <div class="settings-group">
            <label>最高FPS {{ targetFPS }}</label>
            <input type="range" v-model.number="targetFPS" min="15" max="60" step="5" />
          </div>
        </section>

        <section class="settings-section">
          <h3 class="settings-section-title">时间选项</h3>
          <div class="settings-group">
            <label>太阳时间 {{ sunTime }}:00</label>
            <input type="range" v-model.number="sunTime" min="9" max="18" step="1" />
          </div>
        </section>

        <button class="settings-btn" @click="requestLock">回到游戏</button>
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import Stats from 'three/examples/jsm/libs/stats.module.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { GTAOManager, GTAOPresets } from '../utils/GTAOManager.js';
import { VolumetricLightPass } from '../utils/VolumetricLightPass.js';
import { ColorGradingPass, ColorGradingPresets } from '../utils/ColorGradingPass.js';
import { VignettePass } from '../utils/VignettePass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';
import RAPIER from '@dimforge/rapier3d-compat';

export default {
  data() {
    return {
      player: null,
      playerBody: null,
      playerController: null,
      world: null,
      rapierLoaded: false,
      keys: {},
      camera: null,
      cameraAngle: { horizontal: 0, vertical: 0 },
      cameraDistance: 0,
      isDragging: false,
      loading: true,
      loadingProgress: 0,
      collidableObjects: [],
      playerPos: { x: 0, y: 0, z: 0 },
      oldman: null,
      oldmanMixer: null,
      oldmanAction: null,
      verticalVelocity: 0,
      isGrounded: false,
      flyMode: false, // 飞行模式开关
      // 太阳位置：约 9～10 点早晨光（偏东、较低角度）
      sunOffset: { x: 100, y: 85, z: 25 },
      showSettings: false,
      // 太阳固定在世界空间，不随玩家移动，保证任意视角光照一致
      sunWorldPosition: null,
      sunLightDirection: null,
      // 画质/光照设置（ESC 面板可调）
      ambientIntensity: 0.75,
      directionalIntensity: 4,
      bloomStrength: 0.2,
      toneMappingExposure: 1.4  ,
      targetFPS: 60, // 目标帧率
      sunTime: 10, // 太阳时间 9~18点
      // 音乐：随机播放，本轮播过的不重复，播完一轮再进入下一轮
      musicEnabled: true,
      musicVolume: 0.5,
      bgm: null,
      _musicDelayTimer: null,
      _bgmTracksRemaining: null // 当前轮未播放的曲目，空则重新洗牌
    };
  },
  watch: {
    musicEnabled(v) {
      if (this.bgm) {
        this.bgm.muted = !v;
        if (v) this.bgm.play().catch(() => { });
        else this.bgm.pause();
      }
    },
    musicVolume(v) {
      if (this.bgm) this.bgm.volume = Math.max(0, Math.min(1, v));
    }
  },
  mounted() {
    this.initRapier().then(() => {
      this.init();
      this.setupKeyboard();
    });
  },
  beforeUnmount() {
    if (this._musicDelayTimer) clearTimeout(this._musicDelayTimer);
    if (this.bgm) {
      this.bgm.pause();
      this.bgm.src = '';
    }
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('mousemove', this.onMouseMove);
    if (this.animationId) cancelAnimationFrame(this.animationId);
    if (this.gtaoManager) this.gtaoManager.dispose();
    if (this.volumetricLightPass) this.volumetricLightPass.dispose();
    if (this.colorGradingPass) this.colorGradingPass.dispose();
    if (this.vignettePass) this.vignettePass.dispose();
  },
  methods: {
    async initRapier() {
      await RAPIER.init();
      this.world = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 });
      this.rapierLoaded = true;
    },
    init() {
      if (!this.rapierLoaded) return;
      const scene = new THREE.Scene();

      // 天空盒：读取 public/Sky/chenwu_textures 六面图（路径大小写须与文件夹一致）
      const cubeLoader = new THREE.CubeTextureLoader();
      // 顺序: +x, -x, +y, -y, +z, -z；X 方向反了则交换 px/nx
      const skyUrls = [
        '/Sky/chenwu_textures/nx.jpg', '/Sky/chenwu_textures/px.jpg',
        '/Sky/chenwu_textures/py.jpg', '/Sky/chenwu_textures/ny.jpg',
        '/Sky/chenwu_textures/pz.jpg', '/Sky/chenwu_textures/nz.jpg'
      ];
      const skyCube = cubeLoader.load(
        skyUrls,
        (tex) => {
          if (this.scene) this.scene.background = tex;
        },
        undefined,
        (err) => { console.error('天空盒加载失败', err); }
      );
      scene.background = skyCube;

      // 添加距离雾（轻微雾蒙蒙效果）
      scene.fog = new THREE.Fog(0xd0dce6, 40, 220);

      // 相机
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.set(0, 2, 5);
      this.camera = camera;

      // 渲染器：强制使用独立显卡
      const renderer = new THREE.WebGLRenderer({
        antialias: false,
        powerPreference: "high-performance",
        logarithmicDepthBuffer: false,
        failIfMajorPerformanceCaveat: false // 强制使用独显，即使性能较差也不回退核显
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(1.0); // 固定像素比1.0提升性能
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap; // 改用PCF，比Soft快
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = this.toneMappingExposure;
      renderer.sortObjects = true; // 显式开启排序
      this.$refs.container.appendChild(renderer.domElement);

      // 后期处理合成器
      const composer = new EffectComposer(renderer);
      const renderPass = new RenderPass(scene, camera);
      composer.addPass(renderPass);

      // 先做 GTAO（方块间自然光影），再做 Bloom，这样缝隙阴影不依赖"是否看到太阳光晕"
      this.gtaoManager = new GTAOManager({
        radius: 0.8,
        samples: 8,
        blurRadius: 3,
        distanceExponent: 1.1,
        thickness: 1.6,
        scale: 2.5,
        resolutionScale: 0.5,
        intensity: 3.6
      });
      const gtaoPass = this.gtaoManager.init(scene, camera, window.innerWidth, window.innerHeight);
      composer.addPass(gtaoPass);

      // 提高 Bloom 阈值，只让太阳等极亮区域泛光，避免整片天空过亮把建筑对比度"洗掉"，从而任意视角都能看到 GTAO 方块阴影
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth / 4, window.innerHeight / 4),
        0.52,
        this.bloomStrength,
        0.9
      );
      composer.addPass(bloomPass);
      this.bloomPass = bloomPass;
      this.renderer = renderer;

      // 添加体积光 (God Rays)
      this.volumetricLightPass = new VolumetricLightPass(scene, camera, {
        sunPosition: new THREE.Vector3(this.sunOffset.x, this.sunOffset.y, this.sunOffset.z),
        exposure: 0.12,
        decay: 0.96,
        density: 0.35,
        weight: 0.18,
        samples: 15,
        threshold: 0.8,
        intensity: 0.28
      });
      this.volumetricLightPass.setSize(window.innerWidth, window.innerHeight);
      composer.addPass(this.volumetricLightPass);

      // 添加色彩分级 (暖色调+对比度)
      this.colorGradingPass = new ColorGradingPass(ColorGradingPresets.minecraft);
      composer.addPass(this.colorGradingPass);

      // 添加暗角
      this.vignettePass = new VignettePass({
        intensity: 0.3,
        smoothness: 0.45,
        roundness: 0.85
      });
      composer.addPass(this.vignettePass);

      // 添加 SMAA 抗锯齿（解决远距离锯齿问题）
      const smaaPass = new SMAAPass(window.innerWidth, window.innerHeight);
      composer.addPass(smaaPass);
      this.smaaPass = smaaPass;

      const outputPass = new OutputPass();
      composer.addPass(outputPass);

      // FPS 统计
      const stats = new Stats();
      stats.dom.style.position = 'absolute';
      stats.dom.style.top = '0px';
      stats.dom.style.left = '0px';
      this.$refs.container.appendChild(stats.dom);

      // 控制器（禁用干扰）
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enabled = false;

      // 光照（强度由 data 中的画质参数控制）
      this.scene = scene;
      const ambientLight = new THREE.AmbientLight(0xffffff, this.ambientIntensity);
      scene.add(ambientLight);
      this.ambientLight = ambientLight;

      // 太阳固定在世界空间，光照方向不随玩家/相机变化，保证任意视角平滑光照一致
      this.sunWorldPosition = new THREE.Vector3(this.sunOffset.x, this.sunOffset.y, this.sunOffset.z);
      const sunTargetWorld = new THREE.Vector3(0, 0, 0); // 光指向世界原点方向
      this.sunLightDirection = new THREE.Vector3()
        .subVectors(sunTargetWorld, this.sunWorldPosition)
        .normalize();

      const directionalLight = new THREE.DirectionalLight(0xfff5e6, this.directionalIntensity);
      directionalLight.position.copy(this.sunWorldPosition);
      directionalLight.target.position.copy(sunTargetWorld);
      directionalLight.castShadow = true;

      // 阴影：优化分辨率为1024，大幅减少渲染开销
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      directionalLight.shadow.camera.near = 1;
      directionalLight.shadow.camera.far = 500;
      directionalLight.shadow.camera.left = -60;
      directionalLight.shadow.camera.right = 60;
      directionalLight.shadow.camera.top = 60;
      directionalLight.shadow.camera.bottom = -60;
      directionalLight.shadow.bias = -0.0004;
      directionalLight.shadow.normalBias = 0.05;
      directionalLight.shadow.radius = 5;
      this.directionalLight = directionalLight;
      scene.add(directionalLight);

      // 预创建复用对象
      const moveDir = new THREE.Vector3();
      const finalDir = new THREE.Vector3();
      const clock = new THREE.Clock();

      // 帧率限制
      let lastFrameTime = 0;
      const getFrameInterval = () => 1000 / this.targetFPS;

      // 加载模型
      const loader = new GLTFLoader();
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
      loader.setDRACOLoader(dracoLoader);

      // 加载老人 GLB 模型（在四合院场景加载完成后执行）
      const loadOldman = () => {
        const oldmanLoader = new GLTFLoader();
        oldmanLoader.setDRACOLoader(dracoLoader);
        oldmanLoader.setMeshoptDecoder(MeshoptDecoder);
        oldmanLoader.load(
          '/models/oldmanidel.glb',
          (gltf) => {
            console.log('老人模型加载成功:', gltf);
            const model = gltf.scene;
            model.traverse((child) => {
              if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
              child.userData.isOldman = true;
            });

            // 设置缩放、位置与旋转（模型趴姿改站立，方向转180度）
            model.scale.setScalar(2.5,0); // 放大2倍
            model.position.set(5, 9.5, -37);
            model.rotation.x = -Math.PI ; // X轴旋转-90度，从趴姿改为站立
            model.rotation.z = Math.PI; // Y轴旋转180度，调整朝向
            
            // 提高模型亮度并修复透明穿透
            model.traverse((child) => {
              if (child.isMesh && child.material) {
                const materials = Array.isArray(child.material) ? child.material : [child.material];
                materials.forEach(mat => {
                  // 增加自发光和光照响应
                  mat.emissive = new THREE.Color(0x222222);
                  mat.emissiveIntensity = 0.3;
                  // 修复透明穿透：关闭透明，强制单面渲染
                  mat.transparent = false;
                  mat.side = THREE.FrontSide;
                  mat.depthWrite = true;
                  mat.depthTest = true;
                });
              }
            });
            
            scene.add(model);
            this.oldman = model;
            console.log('老人模型已添加到场景，位置:', model.position);

            // 播放动画
            if (gltf.animations && gltf.animations.length > 0) {
              const mixer = new THREE.AnimationMixer(model);
              const action = mixer.clipAction(gltf.animations[0]);
              action.play();
              this.oldmanMixer = mixer;
              this.oldmanAction = action;
            }
          },
          (progress) => {
            console.log('老人模型加载进度:', (progress.loaded / progress.total * 100).toFixed(0) + '%');
          },
          (err) => {
            console.error('老人人物 GLB 加载失败:', err);
          }
        );
      };

      loader.load(
        '/models/demo5.glb',
        (gltf) => {
          gltf.scene.traverse((child) => {
            if (child.isMesh) {
              child.frustumCulled = true;
              child.castShadow = true;
              child.receiveShadow = true;

              // 平滑顶点法线，使建筑在任意视角都有平滑明暗过渡（不只在朝向太阳时）
              if (child.geometry) child.geometry.computeVertexNormals();

              // 处理树叶等透明贴图的阴影与可见性，修复透视排序错误
              const materials = Array.isArray(child.material) ? child.material : [child.material];
              materials.forEach(mat => {
                if (mat.map || mat.alphaMap) {
                  mat.alphaTest = 0.5;
                  mat.transparent = false;
                  mat.depthWrite = true; // 强制写入深度缓存，确保遮挡关系
                  mat.depthTest = true;
                  mat.needsUpdate = true;
                }

                // 检测发光材质并添加点光源
                if (mat.emissive && (mat.emissive.r > 0 || mat.emissive.g > 0 || mat.emissive.b > 0)) {
                  const worldPos = new THREE.Vector3();
                  child.updateMatrixWorld();
                  child.getWorldPosition(worldPos);

                  // 创建点光源：柔和发光，强度1.5，距离5米
                  const intensity = (mat.emissiveIntensity || 1) * 1.5;
                  const pointLight = new THREE.PointLight(mat.emissive, intensity, 5);
                  pointLight.position.copy(worldPos);
                  pointLight.castShadow = false;
                  pointLight.decay = 2; // 平方衰减
                  scene.add(pointLight);
                }
              });

              // 为地面和台阶创建 Rapier 碰撞器
              const name = child.name.toLowerCase();
              if (name.includes('ground') || name.includes('floor') || name.includes('step') || name.includes('terrain') || child.geometry.attributes.position.count > 100) {
                // 使用 Trimesh 处理复杂地形
                const vertices = child.geometry.attributes.position.array;
                const indices = child.geometry.index ? child.geometry.index.array : null;

                // 处理世界矩阵缩放
                child.updateMatrixWorld();
                const worldScale = new THREE.Vector3();
                child.getWorldScale(worldScale);

                // 如果有缩放，需要手动缩放顶点
                const scaledVertices = new Float32Array(vertices.length);
                for (let i = 0; i < vertices.length; i += 3) {
                  scaledVertices[i] = vertices[i] * worldScale.x;
                  scaledVertices[i + 1] = vertices[i + 1] * worldScale.y;
                  scaledVertices[i + 2] = vertices[i + 2] * worldScale.z;
                }

                const colliderDesc = RAPIER.ColliderDesc.trimesh(scaledVertices, indices || new Uint32Array(vertices.length / 3).map((_, i) => i));

                // 设置位置
                const worldPos = new THREE.Vector3();
                const worldQuat = new THREE.Quaternion();
                child.getWorldPosition(worldPos);
                child.getWorldQuaternion(worldQuat);

                colliderDesc.setTranslation(worldPos.x, worldPos.y, worldPos.z);
                colliderDesc.setRotation(worldQuat);

                this.world.createCollider(colliderDesc);
              }
            }
          });
          gltf.scene.scale.setScalar(1);
          scene.add(gltf.scene);

          // --- 所有模型加载完成后，再初始化人物 ---
          // 创建动力学刚体 (Kinematic Character)，起始高度设为 20
          const playerDesc = RAPIER.RigidBodyDesc.kinematicPositionBased()
            .setTranslation(5, 10, -58);
          this.playerBody = this.world.createRigidBody(playerDesc);

          // 创建胶囊体碰撞器 (半径 0.25, 高度 0.8, 总高 1.3)
          const capsuleColliderDesc = RAPIER.ColliderDesc.capsule(0.4, 0.25);
          this.world.createCollider(capsuleColliderDesc, this.playerBody);

          // 创建人物控制器
          // 略大 margin 减少楼梯棱角卡顿；步高/步宽配合楼梯；较弱贴地减少上下楼抖动
          this.playerController = this.world.createCharacterController(0.05);
          this.playerController.enableAutostep(0.5, 0.4, true);
          this.playerController.enableSnapToGround(0.15);

          // Three.js 人物表现 (绿色胶囊体)
          const capsuleGeo = new THREE.CapsuleGeometry(0.25, 0.8, 4, 8);
          const capsuleMat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
          const capsule = new THREE.Mesh(capsuleGeo, capsuleMat);
          capsule.castShadow = true;
          capsule.visible = false; // 第一人称隐藏自身模型
          scene.add(capsule);
          this.player = capsule;

          this.loading = false;
          // 场景加载完成后加载老人模型
          loadOldman();
          // 进入游戏后随机 1～10 秒内开始播放，曲目从 playing 里随机选
          const delayMs = 1000 + Math.random() * 9000;
          this._musicDelayTimer = setTimeout(() => this.startBgm(), delayMs);
        },
        (progress) => {
          this.loadingProgress = (progress.loaded / progress.total) * 100;
        }
      );

      // 动画循环
      const animate = (currentTime) => {
        this.animationId = requestAnimationFrame(animate);
        
        // 限制帧率到目标FPS
        if (currentTime - lastFrameTime < getFrameInterval()) {
          return;
        }
        lastFrameTime = currentTime;
        
        const delta = Math.min(clock.getDelta(), 0.1);
        
        // 物理模拟
        this.world.step();

        // 打开 ESC 面板时禁止 WASD 等移动操作
        if (this.player && this.playerBody && !this.showSettings) {
          if (this.flyMode) {
            // 飞行模式：无碰撞，自由移动
            const flySpeed = 8;
            const hAngle = this.cameraAngle.horizontal;
            const vAngle = this.cameraAngle.vertical;

            moveDir.set(0, 0, 0);
            if (this.keys['w']) moveDir.z += 1;
            if (this.keys['s']) moveDir.z -= 1;
            if (this.keys['a']) moveDir.x += 1;
            if (this.keys['d']) moveDir.x -= 1;

            let verticalMove = 0;
            if (this.keys['shift']) verticalMove -= 1; // 下降
            if (this.keys[' ']) verticalMove += 1;     // 上升

            if (moveDir.lengthSq() > 0) {
              moveDir.normalize();
              finalDir.set(
                Math.sin(hAngle) * moveDir.z + Math.cos(hAngle) * moveDir.x,
                0,
                Math.cos(hAngle) * moveDir.z - Math.sin(hAngle) * moveDir.x
              );
            } else {
              finalDir.set(0, 0, 0);
            }

            const curPos = this.playerBody.translation();
            this.playerBody.setNextKinematicTranslation({
              x: curPos.x + finalDir.x * flySpeed * delta,
              y: curPos.y + verticalMove * flySpeed * delta,
              z: curPos.z + finalDir.z * flySpeed * delta
            });

            const p = this.playerBody.translation();
            this.player.position.set(p.x, p.y, p.z);
            this.playerPos = { x: p.x, y: p.y, z: p.z };
          } else {
            // 正常行走模式
            const moveSpeed = 4;

            const hAngle = this.cameraAngle.horizontal;

            moveDir.set(0, 0, 0);
            if (this.keys['w']) moveDir.z += 1;
            if (this.keys['s']) moveDir.z -= 1;
            if (this.keys['a']) moveDir.x += 1;
            if (this.keys['d']) moveDir.x -= 1;

            // 处理垂直逻辑（跳跃与重力）
            if (this.isGrounded && this.keys[' ']) {
              this.verticalVelocity = 6; // 跳跃初速度
              this.isGrounded = false;
            }

            this.verticalVelocity -= 18 * delta; // 重力加速度
            const movement = new THREE.Vector3(0, this.verticalVelocity * delta, 0);

            if (moveDir.lengthSq() > 0) {
              moveDir.normalize();

              finalDir.set(
                Math.sin(hAngle) * moveDir.z + Math.cos(hAngle) * moveDir.x,
                0,
                Math.cos(hAngle) * moveDir.z - Math.sin(hAngle) * moveDir.x
              );

              movement.x = finalDir.x * moveSpeed * delta;
              movement.z = finalDir.z * moveSpeed * delta;

              // 转向
              const lookTarget = new THREE.Vector3().copy(this.player.position).add(finalDir);
              this.player.lookAt(lookTarget);
            }

            // 计算并移动
            this.playerController.computeColliderMovement(
              this.playerBody.collider(0),
              movement
            );

            const correctedMovement = this.playerController.computedMovement();
            this.isGrounded = this.playerController.computedGrounded();

            // 如果着地，重置垂直速度
            if (this.isGrounded && this.verticalVelocity < 0) {
              this.verticalVelocity = -0.1; // 微小的向下压力保持贴地
            }

            const curPos = this.playerBody.translation();
            this.playerBody.setNextKinematicTranslation({
              x: curPos.x + correctedMovement.x,
              y: curPos.y + correctedMovement.y,
              z: curPos.z + correctedMovement.z
            });

            // 同步 Three.js
            const p = this.playerBody.translation();
            this.player.position.set(p.x, p.y, p.z);
            this.playerPos = { x: p.x, y: p.y, z: p.z };
          }
        }

        // 第一人称相机跟随与视角控制
        if (this.player && this.camera) {
          const h = this.cameraAngle.horizontal;
          const v = this.cameraAngle.vertical;

          // 相机置于胶囊体头部高度（视角调高）
          this.camera.position.x = this.player.position.x;
          this.camera.position.y = this.player.position.y + 1.2;
          this.camera.position.z = this.player.position.z;

          // 计算视向目标
          const target = new THREE.Vector3(
            this.camera.position.x + Math.sin(h) * Math.cos(v),
            this.camera.position.y + Math.sin(v),
            this.camera.position.z + Math.cos(h) * Math.cos(v)
          );

          this.camera.lookAt(target);
        }

        // 应用画质参数到光照与后处理
        if (this.ambientLight) this.ambientLight.intensity = this.ambientIntensity;
        if (this.directionalLight) this.directionalLight.intensity = this.directionalIntensity;
        if (this.bloomPass) this.bloomPass.strength = this.bloomStrength;
        if (this.renderer) this.renderer.toneMappingExposure = this.toneMappingExposure;

        // 根据时间更新太阳位置和光照方向（9~18点）
        const hour = this.sunTime;
        const angle = ((hour - 9) / 9) * Math.PI; // 9点=0, 18点=π
        const sunRadius = 150;
        const sunX = Math.cos(angle) * sunRadius;
        const sunY = Math.sin(angle) * sunRadius * 0.8 + 50; // 高度随时间变化
        const sunZ = 25;
        
        this.sunWorldPosition.set(sunX, sunY, sunZ);
        const sunTargetWorld = new THREE.Vector3(0, 0, 0);
        this.sunLightDirection.subVectors(sunTargetWorld, this.sunWorldPosition).normalize();

        // 光照方向固定；阴影相机跟随视线中心，并对焦点做网格稳定化，避免移动时影子闪烁
        if (this.directionalLight && this.sunLightDirection && this.camera) {
          const viewDist = 45;
          const shadowDist = 350;
          this._shadowFocus = this._shadowFocus || new THREE.Vector3();
          this._camDir = this._camDir || new THREE.Vector3();
          this.camera.getWorldDirection(this._camDir);
          this._shadowFocus.copy(this.camera.position).addScaledVector(this._camDir, viewDist);
          // 粗网格稳定化：转动视角时阴影相机几乎不微动，细长条影子不再一闪一闪
          const shadowSnap = 0.2;
          this._shadowFocus.x = Math.round(this._shadowFocus.x / shadowSnap) * shadowSnap;
          this._shadowFocus.y = Math.round(this._shadowFocus.y / shadowSnap) * shadowSnap;
          this._shadowFocus.z = Math.round(this._shadowFocus.z / shadowSnap) * shadowSnap;
          this.directionalLight.target.position.copy(this._shadowFocus);
          this.directionalLight.position.copy(this._shadowFocus).addScaledVector(this.sunLightDirection, -shadowDist);
          this.directionalLight.target.updateMatrixWorld();
        }
        if (this.volumetricLightPass && this.sunWorldPosition) {
          this.volumetricLightPass.setSunPosition(this.sunWorldPosition.clone());
        }

        if (this.oldmanMixer) {
          this.oldmanMixer.update(delta);
        }

        composer.render();
        stats.update();
      };
      animate();

      this.onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);
        // 同步 GTAO 分辨率
        if (this.gtaoManager) {
          this.gtaoManager.resize(window.innerWidth, window.innerHeight);
        }
        // 同步体积光分辨率
        if (this.volumetricLightPass) {
          this.volumetricLightPass.setSize(window.innerWidth, window.innerHeight);
        }
        // 同步 SMAA 分辨率
        if (this.smaaPass) {
          this.smaaPass.setSize(window.innerWidth, window.innerHeight);
        }
      };
      window.addEventListener('resize', this.onResize);

      // 指针锁定逻辑
      this.requestLock = () => {
        renderer.domElement.requestPointerLock();
      };
      renderer.domElement.addEventListener('click', this.requestLock);

      document.addEventListener('pointerlockchange', () => {
        this.showSettings = document.pointerLockElement === null;
        if (this.showSettings) this.keys = {}; // 打开面板时清空按键，避免回到游戏时误触
      });
    },

    startBgm() {
      if (!this.bgm) {
        const audio = new Audio();
        audio.volume = Math.max(0, Math.min(1, this.musicVolume));
        audio.muted = !this.musicEnabled;
        audio.addEventListener('ended', () => this.playNextBgm());
        this.bgm = audio;
      }
      this.playNextBgm();
    },

    playNextBgm() {
      if (!this.bgm || !this.musicEnabled) return;
      const allTracks = ['Begining.mp3', 'Dry Hands.mp3', 'Living Mice.mp3', 'Mice on Venus.mp3'];
      if (!this._bgmTracksRemaining || this._bgmTracksRemaining.length === 0) {
        this._bgmTracksRemaining = [...allTracks];
      }
      const idx = Math.floor(Math.random() * this._bgmTracksRemaining.length);
      const track = this._bgmTracksRemaining.splice(idx, 1)[0];
      this.bgm.src = `/music/playing/${track}`;
      this.bgm.play().catch(() => { });
    },

    setupKeyboard() {
      this.onKeyDown = (e) => {
        if (this.showSettings) return; // ESC 面板打开时不响应移动键
        const key = e.key.toLowerCase();
        if (key === 'g') {
          this.flyMode = !this.flyMode; // 切换飞行模式
          if (this.flyMode) {
            this.verticalVelocity = 0; // 进入飞行模式时清空垂直速度
          }
          return;
        }
        this.keys[key] = true;
      };
      this.onKeyUp = (e) => {
        if (this.showSettings) return;
        this.keys[e.key.toLowerCase()] = false;
      };
      window.addEventListener('keydown', this.onKeyDown);
      window.addEventListener('keyup', this.onKeyUp);

      this.onMouseDown = () => { this.isDragging = true; };
      this.onMouseUp = () => { this.isDragging = false; };
      this.onMouseMove = (e) => {
        // 直接通过鼠标移动旋转视角，无需拖拽
        if (document.pointerLockElement) {
          this.cameraAngle.horizontal -= e.movementX * 0.002;
          this.cameraAngle.vertical -= e.movementY * 0.002; // 修复：修改为减号，解决上下视角反向问题
          this.cameraAngle.vertical = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, this.cameraAngle.vertical));
        }
      };
      window.addEventListener('mousedown', this.onMouseDown);
      window.addEventListener('mouseup', this.onMouseUp);
      window.addEventListener('mousemove', this.onMouseMove);
    }
  }
};
</script>

<style scoped>
.scene-container {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-content {
  text-align: center;
}

.progress-bar {
  width: 300px;
  height: 6px;
  background: #333;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 20px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4a9eff, #67b5ff);
  transition: width 0.3s ease;
}

.loading-text {
  color: #fff;
  font-size: 18px;
  font-weight: 500;
}

.player-info {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.5);
  color: #00ff00;
  padding: 10px;
  border-radius: 5px;
  font-family: monospace;
  font-size: 16px;
  pointer-events: none;
  z-index: 100;
}

.footer-text {
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: rgba(255, 255, 255, 0.6);
  font-family: Arial, sans-serif;
  font-size: 14px;
  pointer-events: none;
  z-index: 100;
}

.settings-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.settings-panel {
  background: rgba(30, 30, 40, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 24px 32px;
  min-width: 320px;
  backdrop-filter: blur(12px);
}

.settings-title {
  margin: 0 0 16px 0;
  color: #fff;
  font-size: 22px;
  font-weight: 600;
  text-align: center;
}

.settings-section {
  margin-bottom: 20px;
}

.settings-section-title {
  margin: 0 0 12px 0;
  color: rgba(255, 255, 255, 0.85);
  font-size: 15px;
  font-weight: 600;
}

.settings-group {
  margin-bottom: 16px;
}

.settings-group.settings-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.settings-group.settings-row label {
  margin-bottom: 0;
}

.settings-group input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: #5a9eff;
  cursor: pointer;
}

.settings-group label {
  display: block;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  margin-bottom: 6px;
}

.settings-group input[type="range"] {
  width: 100%;
  height: 6px;
  accent-color: #5a9eff;
  cursor: pointer;
}

.settings-btn {
  display: block;
  width: 100%;
  margin-top: 20px;
  padding: 12px 40px;
  background: rgba(90, 158, 255, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-size: 16px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
}

.settings-btn:hover {
  background: rgba(90, 158, 255, 0.5);
}
</style>
