<template>
  <div ref="container" class="scene-container">
    <div v-if="loading" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-hint">{{ currentLoadingHintText }}</div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: loadingProgress + '%' }"></div>
        </div>
        <div class="loading-text">{{ loadingProgress.toFixed(0) }}%</div>
      </div>
    </div>
    <!-- XYZ坐标和FPS - 右上角 -->
    <div class="player-info" v-if="!loading && player">
      <div>X: {{ playerPos.x.toFixed(2) }}</div>
      <div>Y: {{ playerPos.y.toFixed(2) }}</div>
      <div>Z: {{ playerPos.z.toFixed(2) }}</div>
      <div>FPS: {{ currentFPS }}</div>
    </div>
    <!-- 交互提示：靠近可交互对象且未打开设置面板时显示 -->
    <transition name="hint">
      <div
        v-if="!loading && currentInteraction && !showSettings && !isInDialogue"
        class="interaction-hint"
      >
        <div class="interaction-bg">
          <span class="interaction-text">{{ getInteractionDisplayName() }}</span>
        </div>
      </div>
    </transition>
    <!-- 当前位置显示 -->
    <div class="location-hint" v-if="!loading && displayLocationImage" :class="{ 'fade-out': isLocationFadingOut }" :style="{ backgroundImage: 'url(' + displayLocationImage + ')' }">
    </div>
    <div class="settings-overlay" v-if="showSettings">
      <div class="settings-panel">
        <h2 class="settings-title">{{ t('settingsTitle') }}</h2>

        <!-- 主菜单：分类选择 -->
        <div v-if="!settingsCategory" class="settings-menu">
          <button class="menu-btn" @click="settingsCategory = 'video'">
            <span class="menu-icon">🎨</span>
            {{ t('videoOptions') }}
          </button>
          <button class="menu-btn" @click="settingsCategory = 'music'">
            <span class="menu-icon">🎵</span>
            {{ t('musicOptions') }}
          </button>
          <button class="menu-btn" @click="settingsCategory = 'perf'">
            <span class="menu-icon">⚡</span>
            {{ t('perfOptions') }}
          </button>
          <button class="menu-btn" @click="settingsCategory = 'time'">
            <span class="menu-icon">🌅</span>
            {{ t('timeOptions') }}
          </button>
          <button class="menu-btn" @click="settingsCategory = 'language'">
            <span class="menu-icon">🌐</span>
            {{ t('language') }}
          </button>
        </div>

        <!-- 视频设置 -->
        <div v-if="settingsCategory === 'video'" class="settings-detail">
          <h3 class="settings-section-title">{{ t('videoOptions') }}</h3>
          <div class="settings-group">
            <label>{{ t('ambientLight') }} {{ ambientIntensity.toFixed(2) }}</label>
            <input type="range" v-model.number="ambientIntensity" min="0" max="2" step="0.05" />
          </div>
          <div class="settings-group">
            <label>{{ t('dirLight') }} {{ directionalIntensity.toFixed(1) }}</label>
            <input type="range" v-model.number="directionalIntensity" min="0" max="15" step="0.5" />
          </div>
          <div class="settings-group">
            <label>{{ t('bloom') }} {{ bloomStrength.toFixed(2) }}</label>
            <input type="range" v-model.number="bloomStrength" min="0" max="1" step="0.05" />
          </div>
          <div class="settings-group">
            <label>{{ t('exposure') }} {{ toneMappingExposure.toFixed(2) }}</label>
            <input type="range" v-model.number="toneMappingExposure" min="0.3" max="2.5" step="0.05" />
          </div>
          <button class="back-btn" @click="settingsCategory = null">{{ t('back') }}</button>
        </div>

        <!-- 音乐设置 -->
        <div v-if="settingsCategory === 'music'" class="settings-detail">
          <h3 class="settings-section-title">{{ t('musicOptions') }}</h3>
          <div class="settings-group settings-row">
            <label>{{ t('enableMusic') }}</label>
            <input type="checkbox" v-model="musicEnabled" />
          </div>
          <div class="settings-group">
            <label>{{ t('volume') }} {{ (musicVolume * 100).toFixed(0) }}%</label>
            <input type="range" v-model.number="musicVolume" min="0" max="1" step="0.05" />
          </div>
          <button class="back-btn" @click="settingsCategory = null">{{ t('back') }}</button>
        </div>

        <!-- 性能设置 -->
        <div v-if="settingsCategory === 'perf'" class="settings-detail">
          <h3 class="settings-section-title">{{ t('perfOptions') }}</h3>
          <div class="settings-group">
            <label>{{ t('maxFPS') }} {{ targetFPS }}</label>
            <input type="range" v-model.number="targetFPS" min="15" max="90" step="5" />
          </div>
          <button class="back-btn" @click="settingsCategory = null">{{ t('back') }}</button>
        </div>

        <!-- 时间设置 -->
        <div v-if="settingsCategory === 'time'" class="settings-detail">
          <h3 class="settings-section-title">{{ t('timeOptions') }}</h3>
          <div class="settings-group">
            <label>{{ t('sunTime') }} {{ sunTime }}:00</label>
            <input type="range" v-model.number="sunTime" min="9" max="18" step="1" />
          </div>
          <button class="back-btn" @click="settingsCategory = null">{{ t('back') }}</button>
        </div>

        <!-- 语言设置 -->
        <div v-if="settingsCategory === 'language'" class="settings-detail">
          <h3 class="settings-section-title">{{ t('language') }}</h3>
          <div class="settings-group settings-row lang-switch">
            <button class="lang-btn" :class="{ active: locale === 'zh' }" @click="setLocale('zh')">
              {{ t('zhLang') }}
            </button>
            <button class="lang-btn" :class="{ active: locale === 'en' }" @click="setLocale('en')">
              {{ t('enLang') }}
            </button>
          </div>
          <button class="back-btn" @click="settingsCategory = null">{{ t('back') }}</button>
        </div>

        <button v-if="!settingsCategory" class="settings-btn" @click="requestLock">{{ t('backToGame') }}</button>
        <button v-if="!settingsCategory" class="settings-btn save-exit-btn" @click="saveAndExit">{{ t('saveAndExit') }}</button>
      </div>
    </div>

    <!-- 书法临摹界面 -->
    <CalligraphyPractice v-if="showCalligraphyPractice" :locale="locale" @close="showCalligraphyPractice = false" @enter="isInCalligraphy = true" />

    <!-- 茶道小游戏界面 -->
    <TeaCeremony
      ref="teaCeremony"
      :visible="showTeaCeremony"
      :locale="locale"
      :current-step="teaCeremonyStep"
      :score="teaCeremonyScore"
      :rating="teaCeremonyRating"
      :is-complete="teaCeremonyComplete"
      @close="handleTeaCeremonyClose"
      @start="handleTeaStart"
    />

    <!-- 收集系统界面 -->
    <CollectionView
      v-if="showCollection"
      :visible="showCollection"
      :collection-system="collectionSystem"
      :locale="locale"
      @close="closeCollection"
    />

    <!-- 剧情介绍 -->
    <StoryIntro
      v-if="showIntro && !loading && !introCompleted"
      @complete="introCompleted = true"
    />
    
    <!-- 任务面板 -->
    <QuestPanel
      v-if="questManager && introCompleted"
      :quest-manager="questManager"
    />
  </div>
</template>

<script>
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {DRACOLoader} from 'three/addons/loaders/DRACOLoader.js';
import {MeshoptDecoder} from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import Stats from 'three/examples/jsm/libs/stats.module.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {GTAOManager, GTAOPresets} from '../utils/GTAOManager.js';
import {VolumetricLightPass} from '../utils/VolumetricLightPass.js';
import {ColorGradingPass, ColorGradingPresets} from '../utils/ColorGradingPass.js';
import {VignettePass} from '../utils/VignettePass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {SMAAPass} from 'three/addons/postprocessing/SMAAPass.js';
import RAPIER from '@dimforge/rapier3d-compat';
import {StoryManager} from '../game/StoryManager.js';
import {DialogueSystem} from '../game/DialogueSystem.js';
import {CollectionSystem} from '../game/CollectionSystem.js';
import {getChuihuaDialogue, getCollectionData, getQuestData, getShortDialogue, getStoryData, getTipsText, interactionPoints} from '../data/storyData.js';
import {i18n} from '../utils/i18n.js';
import CalligraphyPractice from './CalligraphyPractice.vue';
import TeaCeremony from './TeaCeremony.vue';
import CollectionView from './CollectionView.vue';
import StoryIntro from './StoryIntro.vue';
import {TeaCeremony as TeaCeremonyGame} from '../game/TeaCeremony.js';
import {saveManager} from '../game/SaveManager.js';
import {QuestManager} from '../game/QuestManager.js';
import QuestPanel from './QuestPanel.vue';

export default {
  components: {
    CalligraphyPractice,
    TeaCeremony,
    CollectionView,
    StoryIntro,
    QuestPanel
  },
  props: {
    isNewGame: {
      type: Boolean,
      default: true
    },
    showIntro: {
      type: Boolean,
      default: false
    }
  },
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
      // 加载提示语索引
      currentLoadingHintIndex: 0,
      collidableObjects: [],
      playerPos: { x: 0, y: 0, z: 0 },
      oldman: null,
      oldmanMixer: null,
      oldmanAction: null,
      // 与老人交互相关
      isNearOldman: false,
      oldmanInteractDistance: 3.0,
      verticalVelocity: 0,
      isGrounded: false,
      groundedGraceTime: 0,
      flyMode: false, // 飞行模式开关
      // 太阳位置：约 9～10 点早晨光（偏东、较低角度）
      sunOffset: { x: 100, y: 85, z: 25 },
      showSettings: false,
      // 太阳固定在世界空间，不随玩家移动，保证任意视角光照一致
      sunWorldPosition: null,
      sunLightDirection: null,
      // 画质/光照设置（ESC 面板可调）
      // 默认环境光压暗一点、方向光更强，配合 AO 让方块之间的阴影更明显（类似 MC）
      ambientIntensity: 0.6,
      directionalIntensity: 4.5,
      // AO 参数：专门控制“建模与建模之间”的平滑阴影
      aoIntensity: 2.8, // 强化强度，让建模间阴影更加明显
      aoRadius: 3.5,   // 增大范围，强化遮蔽效果
      bloomStrength: 0.2,
      toneMappingExposure: 1.25  ,
      targetFPS: 90, // 目标帧率
      sunTime: 10, // 太阳时间 9~18点
      // 音乐：随机播放，本轮播过的不重复，播完一轮再进入下一轮
      musicEnabled: true,
      musicVolume: 0.5,
      bgm: null,
      _musicDelayTimer: null,
      _bgmTracksRemaining: null, // 当前轮未播放的曲目，空则重新洗牌
      // 剧情系统
      storyManager: null,
      dialogueSystem: null,
      isInDialogue: false,
      currentInteraction: null,
      pointerLockJustActivated: false,
      // 语言
      locale: i18n.getLocale(),
      // 设置分类
      settingsCategory: null,
      // 当前位置
      currentLocationImage: '',
      displayLocationImage: '',
      isLocationFadingOut: false,
      // 秋千状态
      isOnSwing: false,
      swingPosition: { x: -8, y: 16, z: 1 },
      swingReturnPosition: null,
      // FPS显示
      currentFPS: 60,
      // 书法临摹界面
      showCalligraphyPractice: false,
      // 临摹模式状态
      isInCalligraphy: false,
      // 茶道游戏状态
      showTeaCeremony: false,
      teaCeremonyStep: 0,
      teaCeremonyScore: 0,
      teaCeremonyRating: { text: '' },
      teaCeremonyComplete: false,
      teaCeremonyGame: null,
      teaCeremonyStartTime: 0,
      hasCompletedTeaCeremony: false,
      // 收集系统
      collectionSystem: null,
      showCollection: false,
      // 剧情介绍
      introCompleted: false,
      // 跳跃状态
      jumpPressed: false,
      // 任务系统
      questManager: null
    };
  },
  computed: {
    t() {
      return i18n.t.bind(i18n);
    },
    currentLoadingHintText() {
      const hints = ['loadingHint1', 'loadingHint2', 'loadingHint3', 'loadingHint4'];
      return this.t(hints[this.currentLoadingHintIndex]);
    }
  },
  watch: {
    showCalligraphyPractice(v) {
      // 临摹界面关闭时，恢复游戏控制
      if (!v) {
        this.isInCalligraphy = false;
        // 重新锁定鼠标
        this.requestLock();
      }
    },
    showTeaCeremony(v) {
      // 茶道界面关闭时，恢复游戏控制
      if (!v) {
        if (this.teaCeremonyGame) {
          this.teaCeremonyGame.end();
        }
        this.teaCeremonyStep = null;
        this.teaCeremonyScore = 0;
        this.teaCeremonyRating = { text: '' };
        this.teaCeremonyComplete = false;
        // 重新锁定鼠标
        this.requestLock();
      }
    },
    showCollection(v) {
      // 收集界面关闭时，恢复游戏控制
      if (!v) {
        this.requestLock();
      }
    },
    musicEnabled(v) {
      if (this.bgm) {
        this.bgm.muted = !v;
        if (v) this.bgm.play().catch(() => { });
        else this.bgm.pause();
      }
    },
    musicVolume(v) {
      if (this.bgm) this.bgm.volume = Math.max(0, Math.min(1, v));
    },
    // AO 相关：滑杆一动就实时更新"建模之间的阴影"
    aoIntensity(v) {
      if (this.gtaoManager) {
        this.gtaoManager.setIntensity(v);
      }
    },
    aoRadius(v) {
      if (this.gtaoManager) {
        this.gtaoManager.setRadius(v);
      }
    }
  },
  mounted() {
    this.initRapier().then(() => {
      this.init();
      this.setupKeyboard();
      this.startLoadingHints();
      this.initStorySystem();
      this.initCollectionSystem();
      this.initQuestSystem();
      this.initI18n();
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
    // 保存并退出游戏
    saveAndExit() {
      const storyFlags = this.storyManager && this.storyManager.flags instanceof Map
        ? Object.fromEntries(this.storyManager.flags)
        : {};
      const saveData = {
        playerPosition: this.player ? {
          x: this.player.position.x,
          y: this.player.position.y,
          z: this.player.position.z
        } : null,
        unlockedItems: this.collectionSystem ? this.collectionSystem.unlockedItems : [],
        storyFlags: storyFlags,
        grandpaMemory: this.grandpaMemory || 0,
        locale: this.locale,
        questState: this.questManager ? this.questManager.saveState() : null
      };
      saveManager.save(saveData);
      this.$emit('exit');
    },
    // 加载游戏存档
    loadGame() {
      const saveData = saveManager.load();
      if (!saveData) return false;
      
      // 恢复玩家位置
      if (saveData.playerPosition && this.player && this.playerBody) {
        this.player.position.set(
          saveData.playerPosition.x,
          saveData.playerPosition.y,
          saveData.playerPosition.z
        );
        this.playerBody.setTranslation({
          x: saveData.playerPosition.x,
          y: saveData.playerPosition.y,
          z: saveData.playerPosition.z
        }, true);
      }
      
      // 恢复收集物品
      if (saveData.unlockedItems && this.collectionSystem) {
        this.collectionSystem.unlockedItems = saveData.unlockedItems;
      }
      
      // 恢复剧情进度
      if (saveData.storyFlags && this.storyManager) {
        this.storyManager.flags = new Map(Object.entries(saveData.storyFlags));
      }

      // 恢复记忆进度
      this.grandpaMemory = saveData.grandpaMemory || 0;
      
      // 恢复任务状态
      if (saveData.questState && this.questManager) {
        this.questManager.loadState(saveData.questState);
      }
      
      return true;
    },
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
      scene.background = cubeLoader.load(
          skyUrls,
          (tex) => {
            if (this.scene) this.scene.background = tex;
          },
          undefined,
          (err) => {
            console.error('天空盒加载失败', err);
          }
      );

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

      // 先做 GTAO（方块间自然光影），再做 Bloom
      // 使用建模强化版预设，极大增强建模间的阴影对比度
      this.gtaoManager = new GTAOManager({
        ...GTAOPresets.modelingEnhanced,
        radius: this.aoRadius,
        intensity: this.aoIntensity,
        samples: 32,      // 最高采样质量
        distanceExponent: 1.8, // 强化距离衰减
        blurRadius: 2,    // 最小模糊保持锐利边缘
        thickness: 3.0    // 最大厚度补偿
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

      // FPS 统计（隐藏DOM，仅用于数据更新）
      const stats = new Stats();
      stats.dom.style.display = 'none';

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
      directionalLight.shadow.bias = -0.0005;
      directionalLight.shadow.normalBias = 0.05;
      directionalLight.shadow.radius = 2;
      this.directionalLight = directionalLight;
      scene.add(directionalLight);

      // 预创建复用对象
      const moveDir = new THREE.Vector3();
      const finalDir = new THREE.Vector3();
      const clock = new THREE.Clock();
      const stairStepHeight = 0.5;
      const stairStepTolerance = 0.04;
      const stairSnapDistance = stairStepHeight + 0.08;
      const stairCameraSmooth = 14;
      const cameraEyeHeight = 1.2;
      let smoothedCameraY = null;

      // 帧率限制
      let lastFrameTime = 0;
      const getFrameInterval = () => 1000 / this.targetFPS;

      // 加载模型
      const loader = new GLTFLoader();
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
      loader.setDRACOLoader(dracoLoader);

      // 加载引导箭头模型
      const loadGuidance = () => {
        const guidanceLoader = new GLTFLoader();
        guidanceLoader.setDRACOLoader(dracoLoader);
        guidanceLoader.load(
          '/models/guidance.glb',
          (gltf) => {
            const model = gltf.scene;
            model.position.set(-24, 16, -30);
            model.rotation.x = Math.PI; // 倒置向下
            model.scale.setScalar(0.7);
            scene.add(model);
            this.guidance = model;
            this.guidanceBaseY = 16;
            this.guidanceTime = 0;
          },
          undefined,
          (err) => {
            console.error('引导箭头模型加载失败:', err);
          }
        );
      };

      // 加载第二个引导箭头模型
      const loadArrow2 = () => {
        const arrow2Loader = new GLTFLoader();
        arrow2Loader.setDRACOLoader(dracoLoader);
        arrow2Loader.load(
          '/models/guidance.glb',
          (gltf) => {
            const model = gltf.scene;
            model.position.set(-24, 15, -10.7);
            model.rotation.x = Math.PI; // 倒置向下
            model.scale.setScalar(0.7);
            scene.add(model);
            this.arrow2 = model;
            this.arrow2BaseY = 16.5;
            this.arrow2Time = 0;
          },
          undefined,
          (err) => {
            console.error('第二个箭头模型加载失败:', err);
          }
        );
      };

      // 加载screenwall模型
      const loadScreenWall = () => {
        const screenWallLoader = new GLTFLoader();
        screenWallLoader.setDRACOLoader(dracoLoader);
        screenWallLoader.load(
          '/models/screenwall.glb',
          (gltf) => {
            const model = gltf.scene;
            model.position.set(-24, 17.7, -10.5);
            model.scale.setScalar(2.5);
            model.rotation.x = Math.PI;
            model.rotation.y = Math.PI / 2;
            scene.add(model);
            this.screenWall = model;
          },
          undefined,
          (err) => {
            console.error('screenwall模型加载失败:', err);
          }
        );
      };

      const loadCalligraphy = () => {
        const calligraphyLoader = new GLTFLoader();
        calligraphyLoader.setDRACOLoader(dracoLoader);
        calligraphyLoader.load(
          '/models/calligraphy.glb',
          (gltf) => {
            const model = gltf.scene;
            model.position.set(1, 15.75, 18.5);
            model.scale.setScalar(1.5);
            model.rotation.y = Math.PI / 2;
            scene.add(model);
            this.calligraphy = model;
            //console.log('calligraphy模型加载成功，位置:', model.position);
          },
          undefined,
          (err) => {
            console.error('calligraphy模型加载失败:', err);
          }
        );
      };

      // 加载王氏家谱模型
      const loadFamilyBook = () => {
        const bookLoader = new GLTFLoader();
        bookLoader.setDRACOLoader(dracoLoader);
        bookLoader.load(
          '/models/Book.glb',
          (gltf) => {
            const model = gltf.scene;
            model.position.set(-1, 15.5, 20);
            model.scale.setScalar(1);
            model.rotation.x = Math.PI / 2;
            //model.rotation.y = Math.PI / 2;\
            model.rotation.z = -Math.PI / 2;
            model.traverse((child) => {
              if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });
            scene.add(model);
            this.familyBook = model;
          },
          undefined,
          (err) => {
            console.error('家谱模型加载失败:', err);
          }
        );
      };

      // 加载所有箭头模型（复用同一个素材）
      const loadAllArrows = () => {
        const arrowLoader = new GLTFLoader();
        arrowLoader.setDRACOLoader(dracoLoader);
        arrowLoader.load(
          '/models/guidance.glb',
          (gltf) => {
            // 创建箭头实例的辅助函数
            const createArrow = (position, baseY, name) => {
              const model = gltf.scene.clone();
              model.position.set(position.x, position.y, position.z);
              model.rotation.x = Math.PI;
              model.scale.setScalar(0.7);
              scene.add(model);
              return { model, baseY, time: 0 };
            };

            // 正房箭头
            const mainhouse = createArrow({ x: 1, y: 16, z: 40 }, 16, 'mainhouse');
            this.mainhouseArrow = mainhouse.model;
            this.mainhouseArrowBaseY = mainhouse.baseY;
            this.mainhouseArrowTime = mainhouse.time;

            // 东厢房箭头
            const eastwing = createArrow({ x: -22, y: 19, z: 20 }, 17, 'eastwing');
            this.eastwingArrow = eastwing.model;
            this.eastwingArrowBaseY = eastwing.baseY;
            this.eastwingArrowTime = eastwing.time;

            // 西厢房箭头
            const westwing = createArrow({ x: 24, y: 17, z: 20 }, 17, 'westwing');
            this.westwingArrow = westwing.model;
            this.westwingArrowBaseY = westwing.baseY;
            this.westwingArrowTime = westwing.time;

            // 垂花门箭头
            const chuihua = createArrow({ x: 1, y: 15, z: -10 }, 16.5, 'chuihua');
            this.chuihuaArrow = chuihua.model;
            this.chuihuaArrowBaseY = chuihua.baseY;
            this.chuihuaArrowTime = chuihua.time;

            // 石榴树箭头
            const pomegranate = createArrow({ x: -5, y: 16, z: 30 }, 16, 'pomegranate');
            this.pomegranateArrow = pomegranate.model;
            this.pomegranateArrowBaseY = pomegranate.baseY;
            this.pomegranateArrowTime = pomegranate.time;

            // 海棠树箭头
            const taohe = createArrow({ x: 7, y: 15, z: 5 }, 15.5, 'taohe');
            this.taoheArrow = taohe.model;
            this.taoheArrowBaseY = taohe.baseY;
            this.taoheArrowTime = taohe.time;
          },
          undefined,
          (err) => {
            console.error('箭头模型加载失败:', err);
          }
        );
      };

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
            model.position.set(-2, 14.5, -36);
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

            // 根据剧情状态设置王爷爷位置
            this.updateGrandpaPosition();

            // 创建老爷爷碰撞体（圆柱体包围盒）
            const grandpaLocation = this.storyManager.getGrandpaLocation();
            const colliderPos = grandpaLocation === 'chuihuamen'
              ? { x: 1, y: 15 + 1.5, z: -10 }
              : { x: -2, y: 14.5 + 1.5, z: -36 };
            const oldmanColliderDesc = RAPIER.ColliderDesc.cylinder(1.5, 0.8)
              .setTranslation(colliderPos.x, colliderPos.y, colliderPos.z)
              .setFriction(0)
              .setRestitution(0);
            this.world.createCollider(oldmanColliderDesc);

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
            //console.log('老人模型加载进度:', (progress.loaded / progress.total * 100).toFixed(0) + '%');
          },
          (err) => {
            console.error('老人人物 GLB 加载失败:', err);
          }
        );
      };

      // 加载老妇人抚摸猫模型
      const loadOldwomanPetting = () => {
        const oldwomanLoader = new GLTFLoader();
        oldwomanLoader.setDRACOLoader(dracoLoader);
        oldwomanLoader.setMeshoptDecoder(MeshoptDecoder);
        oldwomanLoader.load(
          '/models/petting.glb',
          (gltf) => {
            console.log('老妇人模型加载成功:', gltf);
            const model = gltf.scene;
            model.traverse((child) => {
              if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });

            // 设置位置与旋转
            model.scale.setScalar(2.5);
            model.position.set(-7, 14.7, 22);
            //model.rotation.y = Math.PI / 2;
            
            // 提高模型亮度并修复透明穿透
            model.traverse((child) => {
              if (child.isMesh && child.material) {
                const materials = Array.isArray(child.material) ? child.material : [child.material];
                materials.forEach(mat => {
                  mat.emissive = new THREE.Color(0x222222);
                  mat.emissiveIntensity = 0.3;
                  mat.transparent = false;
                  mat.side = THREE.FrontSide;
                  mat.depthWrite = true;
                  mat.depthTest = true;
                });
              }
            });
            
            scene.add(model);
            this.oldwomanPetting = model;

            // 创建老奶奶碰撞体（圆柱体包围盒）
            const oldwomanColliderDesc = RAPIER.ColliderDesc.cylinder(1.5, 0.8)
              .setTranslation(-7, 14.7 + 1.5, 22)
              .setFriction(0)
              .setRestitution(0);
            this.world.createCollider(oldwomanColliderDesc);

            // 播放动画
            if (gltf.animations && gltf.animations.length > 0) {
              const mixer = new THREE.AnimationMixer(model);
              const action = mixer.clipAction(gltf.animations[0]);
              action.play();
              this.oldwomanPettingMixer = mixer;
            }
          },
          undefined,
          (err) => {
            console.error('老妇人模型加载失败:', err);
          }
        );
      };

      // 加载猫模型
      const loadCat = () => {
        const catLoader = new GLTFLoader();
        catLoader.setDRACOLoader(dracoLoader);
        catLoader.setMeshoptDecoder(MeshoptDecoder);
        catLoader.load(
          '/models/cat.glb',
          (gltf) => {
            //console.log('猫模型加载成功:', gltf);
            const model = gltf.scene;
            model.traverse((child) => {
              if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });

            // 设置位置与缩放
            model.scale.setScalar(1);
            model.position.set(-8, 14.8, 26);
            model.rotation.y = Math.PI / 3;
            
            // 提高模型亮度并修复透明穿透
            model.traverse((child) => {
              if (child.isMesh && child.material) {
                const materials = Array.isArray(child.material) ? child.material : [child.material];
                materials.forEach(mat => {
                  mat.emissive = new THREE.Color(0x222222);
                  mat.emissiveIntensity = 0.3;
                  mat.transparent = false;
                  mat.side = THREE.FrontSide;
                  mat.depthWrite = true;
                  mat.depthTest = true;
                });
              }
            });
            
            scene.add(model);
            this.cat = model;

            // 创建猫碰撞体（小球体）
            const catColliderDesc = RAPIER.ColliderDesc.ball(0.5)
              .setTranslation(-8, 14.8 + 0.5, 26)
              .setFriction(0)
              .setRestitution(0);
            this.world.createCollider(catColliderDesc);
          },
          undefined,
          (err) => {
            console.error('猫模型加载失败:', err);
          }
        );
      };

      // 加载茶点模型
      const loadTea = () => {
        const teaLoader = new GLTFLoader();
        teaLoader.setDRACOLoader(dracoLoader);
        teaLoader.setMeshoptDecoder(MeshoptDecoder);
        teaLoader.load(
          '/models/tea.glb',
          (gltf) => {
            console.log('茶点模型加载成功:', gltf);
            const model = gltf.scene;
            model.traverse((child) => {
              if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });

            // 设置位置与缩放
            model.scale.setScalar(1);
            model.position.set(1, 15.7, 22);
            model.rotation.y = -Math.PI / 2;

            // 提高模型亮度并修复透明穿透
            model.traverse((child) => {
              if (child.isMesh && child.material) {
                const materials = Array.isArray(child.material) ? child.material : [child.material];
                materials.forEach(mat => {
                  mat.emissive = new THREE.Color(0x222222);
                  mat.emissiveIntensity = 0.3;
                  mat.transparent = false;
                  mat.side = THREE.FrontSide;
                  mat.depthWrite = true;
                  mat.depthTest = true;
                });
              }
            });
            
            scene.add(model);
            this.tea = model;
          },
          undefined,
          (err) => {
            console.error('茶点模型加载失败:', err);
          }
        );
      };

      loader.load(
        '/models/demo7.glb',
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

                // 检测发光材质（仅保留材质自发光效果，不添加点光源以避免性能问题）
                if (mat.emissive && (mat.emissive.r > 0 || mat.emissive.g > 0 || mat.emissive.b > 0)) {
                  // 仅增强材质自发光效果
                  mat.emissiveIntensity = Math.max(mat.emissiveIntensity || 0, 0.5);
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
            .setTranslation(-2, 15, -58);
          this.playerBody = this.world.createRigidBody(playerDesc);

          // 创建胶囊体碰撞器 (半径 0.2, 高度 0.8, 总高 1.2)
          // 减小半径增加边缘冗余，摩擦力设为0防止低速挂边
          const capsuleColliderDesc = RAPIER.ColliderDesc.capsule(0.4, 0.2)
            .setFriction(0)
            .setRestitution(0);
          this.world.createCollider(capsuleColliderDesc, this.playerBody);

          // 创建人物控制器
          // 优化参数：较小偏移量+大步高+强贴地，确保低速上楼梯顺滑
          this.playerController = this.world.createCharacterController(0.005);
          this.playerController.enableAutostep(stairStepHeight + stairStepTolerance, 0.02, true);
          this.playerController.enableSnapToGround(stairSnapDistance);
          this.playerController.setMaxSlopeClimbAngle(1.5);
          this.playerController.setMinSlopeSlideAngle(0.5);

          // Three.js 人物表现 (绿色胶囊体)
          const capsuleGeo = new THREE.CapsuleGeometry(0.25, 0.8, 4, 8);
          const capsuleMat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
          const capsule = new THREE.Mesh(capsuleGeo, capsuleMat);
          capsule.castShadow = true;
          capsule.visible = false; // 第一人称隐藏自身模型
          scene.add(capsule);
          this.player = capsule;
          smoothedCameraY = this.player.position.y + cameraEyeHeight;

          this.loading = false;
          // 场景加载完成后加载引导箭头和老人模型
          loadGuidance();
          loadArrow2();
          loadOldman();
          loadOldwomanPetting();
          loadCat();
          loadTea();
          loadScreenWall();
          loadCalligraphy();
          loadFamilyBook();
          loadAllArrows();
          
          // 如果不是新游戏，恢复玩家位置、剧情进度并跳过剧情介绍
          if (!this.isNewGame) {
            this.introCompleted = true;
            // 恢复玩家位置（在模型加载完成后）
            const saveData = saveManager.load();
            if (saveData) {
              // 恢复玩家位置
              if (saveData.playerPosition) {
                this.player.position.set(
                  saveData.playerPosition.x,
                  saveData.playerPosition.y,
                  saveData.playerPosition.z
                );
                this.playerBody.setTranslation({
                  x: saveData.playerPosition.x,
                  y: saveData.playerPosition.y,
                  z: saveData.playerPosition.z
                }, true);
                this.playerPos = { ...saveData.playerPosition };
              }
              // 恢复剧情进度（storyFlags）
              if (saveData.storyFlags) {
                this.storyManager.loadFlags(saveData.storyFlags);
              }
              // 注意：王爷爷位置在模型加载完成后再恢复
            }
          }

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

        // 打开 ESC 面板、坐在秋千上、临摹、茶道或tips显示时禁止 WASD 等移动操作
        if (this.player && this.playerBody && !this.showSettings && !this.isOnSwing && !this.isInCalligraphy && !this.showTeaCeremony && !(this.dialogueSystem && this.dialogueSystem.isTipsShowing())) {
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
            const nextPos = {
              x: curPos.x + finalDir.x * flySpeed * delta,
              y: curPos.y + verticalMove * flySpeed * delta,
              z: curPos.z + finalDir.z * flySpeed * delta
            };
            this.playerBody.setNextKinematicTranslation(nextPos);

            // Keep render/camera body in sync with kinematic target.
            this.player.position.set(nextPos.x, nextPos.y, nextPos.z);
            this.playerPos = { x: nextPos.x, y: nextPos.y, z: nextPos.z };
          } else {
            // 正常行走模式
            const moveSpeed = 4;
            const gravity = 18;
            const maxFallSpeed = 8;
            const groundStickVelocity = -0.08;
            const idleGroundStickVelocity = -0.02;
            const groundedGraceDuration = 0.12;

            const hAngle = this.cameraAngle.horizontal;

            moveDir.set(0, 0, 0);
            if (this.keys['w']) moveDir.z += 1;
            if (this.keys['s']) moveDir.z -= 1;
            if (this.keys['a']) moveDir.x += 1;
            if (this.keys['d']) moveDir.x -= 1;
            const hasMoveInput = moveDir.lengthSq() > 0;

            if (this.isGrounded) {
              this.groundedGraceTime = groundedGraceDuration;
            } else {
              this.groundedGraceTime = Math.max(0, this.groundedGraceTime - delta);
            }

            // 处理垂直逻辑（跳跃与重力）
            // 使用 groundedGraceTime 作为跳跃缓冲期，即使 isGrounded 为 false 也能跳跃
            if ((this.isGrounded || this.groundedGraceTime > 0) && this.keys[' '] && !this.jumpPressed) {
              this.verticalVelocity = 6; // 跳跃初速度
              this.isGrounded = false;
              this.groundedGraceTime = 0;
              this.jumpPressed = true; // 标记已跳跃，防止按住连续跳
            } else {
              // Short ground-assist window avoids low-speed stair jitter on step edges.
              const useGroundAssist = (this.isGrounded || (this.groundedGraceTime > 0 && hasMoveInput)) && this.verticalVelocity <= 0;
              if (useGroundAssist) {
                this.verticalVelocity = hasMoveInput ? groundStickVelocity : idleGroundStickVelocity;
              } else {
                this.verticalVelocity = Math.max(this.verticalVelocity - gravity * delta, -maxFallSpeed);
              }
            }

            const movement = new THREE.Vector3(0, this.verticalVelocity * delta, 0);

            if (hasMoveInput) {
              moveDir.normalize();

              finalDir.set(
                Math.sin(hAngle) * moveDir.z + Math.cos(hAngle) * moveDir.x,
                0,
                Math.cos(hAngle) * moveDir.z - Math.sin(hAngle) * moveDir.x
              );

              movement.x = finalDir.x * moveSpeed * delta;
              movement.z = finalDir.z * moveSpeed * delta;

              // 转向（只在方向有效时）
              if (finalDir.lengthSq() > 0.001) {
                const lookTarget = new THREE.Vector3().copy(this.player.position).add(finalDir);
                this.player.lookAt(lookTarget);
              }
            }

            // 上楼梯优化：检测前方是否有台阶，给一点向上的助推
            if (hasMoveInput && this.isGrounded) {
              const rayOrigin = this.playerBody.translation();
              const rayDir = new THREE.Vector3(finalDir.x, 0, finalDir.z).normalize();
              // 从脚部稍低位置发射射线，更容易检测到台阶
              const ray = new RAPIER.Ray({ x: rayOrigin.x, y: rayOrigin.y - 0.3, z: rayOrigin.z }, { x: rayDir.x, y: 0, z: rayDir.z });
              const hit = this.world.castRay(ray, 0.6, true);
              if (hit && hit.timeOfImpact < 0.5) {
                // 前方有障碍，可能是台阶，给一点向上推力（使用插值平滑）
                const targetBoost = 0.2;
                this.stairBoost = (this.stairBoost || 0) * 0.7 + targetBoost * 0.3;
                movement.y += this.stairBoost;
              } else {
                this.stairBoost = (this.stairBoost || 0) * 0.5;
              }
            } else {
              this.stairBoost = 0;
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
              this.verticalVelocity = hasMoveInput ? idleGroundStickVelocity : 0;
              this.groundedGraceTime = groundedGraceDuration;
            }

            const curPos = this.playerBody.translation();
            const nextPos = {
              x: curPos.x + correctedMovement.x,
              y: curPos.y + correctedMovement.y,
              z: curPos.z + correctedMovement.z
            };
            this.playerBody.setNextKinematicTranslation(nextPos);

            // Sync render body to the kinematic target to remove one-frame jitter.
            this.player.position.set(nextPos.x, nextPos.y, nextPos.z);
            this.playerPos = { x: nextPos.x, y: nextPos.y, z: nextPos.z };
          }
        }

        // 与老人距离检测（只算水平距离，更贴近日常感觉）
        if (this.player && this.oldman) {
          const px = this.player.position.x;
          const pz = this.player.position.z;
          const ox = this.oldman.position.x;
          const oz = this.oldman.position.z;
          const dx = px - ox;
          const dz = pz - oz;
          const dist = Math.sqrt(dx * dx + dz * dz);
          this.isNearOldman = dist <= this.oldmanInteractDistance;
        } else {
          this.isNearOldman = false;
        }

        // 检查交互点（剧情系统）
        this.checkInteractions();

        // 第一人称相机跟随与视角控制
        if (this.player && this.camera) {
          const h = this.cameraAngle.horizontal;
          const v = this.cameraAngle.vertical;

          // 相机置于胶囊体头部高度（视角调高）
          this.camera.position.x = this.player.position.x;
          this.camera.position.z = this.player.position.z;
          const targetCameraY = this.player.position.y + cameraEyeHeight;
          if (smoothedCameraY === null || this.flyMode) {
            smoothedCameraY = targetCameraY;
          } else {
            const smoothFactor = 1 - Math.exp(-stairCameraSmooth * delta);
            smoothedCameraY += (targetCameraY - smoothedCameraY) * smoothFactor;
          }
          this.camera.position.y = smoothedCameraY;

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

        // 更新老妇人模型动画
        if (this.oldwomanPettingMixer) {
          this.oldwomanPettingMixer.update(delta);
        }

        // 引导箭头上下浮动动画
        if (this.guidance) {
          this.guidanceTime = (this.guidanceTime || 0) + delta;
          this.guidance.position.y = this.guidanceBaseY + Math.sin(this.guidanceTime * 2) * 0.5;
          this.guidance.rotation.y += delta * 0.5; // Y轴旋转
        }

        // 第二个箭头上下浮动动画
        if (this.arrow2) {
          this.arrow2Time = (this.arrow2Time || 0) + delta;
          this.arrow2.position.y = this.arrow2BaseY + Math.sin(this.arrow2Time * 2) * 0.5;
          this.arrow2.rotation.y += delta * 0.5; // Y轴旋转
        }

        // 垂花门箭头上下浮动动画
        if (this.chuihuaArrow) {
          this.chuihuaArrowTime = (this.chuihuaArrowTime || 0) + delta;
          this.chuihuaArrow.position.y = this.chuihuaArrowBaseY + Math.sin(this.chuihuaArrowTime * 2) * 0.5;
          this.chuihuaArrow.rotation.y += delta * 0.5; // Y轴旋转
        }

        // 石榴树箭头上下浮动动画
        if (this.pomegranateArrow) {
          this.pomegranateArrowTime = (this.pomegranateArrowTime || 0) + delta;
          this.pomegranateArrow.position.y = this.pomegranateArrowBaseY + Math.sin(this.pomegranateArrowTime * 2) * 0.5;
          this.pomegranateArrow.rotation.y += delta * 0.5; // Y轴旋转
        }

        // 正房箭头上下浮动动画
        if (this.mainhouseArrow) {
          this.mainhouseArrowTime = (this.mainhouseArrowTime || 0) + delta;
          this.mainhouseArrow.position.y = this.mainhouseArrowBaseY + Math.sin(this.mainhouseArrowTime * 2) * 0.5;
          this.mainhouseArrow.rotation.y += delta * 0.5; // Y轴旋转
        }

        // 东厢房箭头上下浮动动画
        if (this.eastwingArrow) {
          this.eastwingArrowTime = (this.eastwingArrowTime || 0) + delta;
          this.eastwingArrow.position.y = this.eastwingArrowBaseY + Math.sin(this.eastwingArrowTime * 2) * 0.5;
          this.eastwingArrow.rotation.y += delta * 0.5; // Y轴旋转
        }

        // 西厢房箭头上下浮动动画
        if (this.westwingArrow) {
          this.westwingArrowTime = (this.westwingArrowTime || 0) + delta;
          this.westwingArrow.position.y = this.westwingArrowBaseY + Math.sin(this.westwingArrowTime * 2) * 0.5;
          this.westwingArrow.rotation.y += delta * 0.5; // Y轴旋转
        }

        // 海棠树箭头上下浮动动画
        if (this.taoheArrow) {
          this.taoheArrowTime = (this.taoheArrowTime || 0) + delta;
          this.taoheArrow.position.y = this.taoheArrowBaseY + Math.sin(this.taoheArrowTime * 2) * 0.5;
          this.taoheArrow.rotation.y += delta * 0.5; // Y轴旋转
        }

        composer.render();
        stats.update();
        // 更新FPS显示
        this.currentFPS = Math.round(1 / delta);
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
      this.pointerLockJustActivated = false;
      this.requestLock = () => {
        // 只在未锁定时请求锁定，避免重复触发导致视角切换
        if (document.pointerLockElement !== renderer.domElement) {
          renderer.domElement.requestPointerLock();
          // 标记刚刚激活指针锁定，用于跳过第一帧鼠标移动
          this.pointerLockJustActivated = true;
          // 100ms后解除标记
          setTimeout(() => {
            this.pointerLockJustActivated = false;
          }, 100);
        }
      };
      renderer.domElement.addEventListener('click', this.requestLock);

      document.addEventListener('pointerlockchange', () => {
        // 对话、tips显示、茶道完成或收集界面打开时不自动打开ESC面板
        if (this.isInDialogue || (this.dialogueSystem && this.dialogueSystem.isTipsShowing()) || this.showTeaCeremony || this.showCollection) {
          this.showSettings = false;
          return;
        }
        const wasLocked = this.showSettings === false && document.pointerLockElement !== null;
        this.showSettings = document.pointerLockElement === null;
        if (this.showSettings) {
          this.keys = {}; // 打开面板时清空按键，避免回到游戏时误触
        } else if (wasLocked) {
          // ESC面板关闭，重新获得指针锁定时，标记需要跳过第一帧
          this.pointerLockJustActivated = true;
          setTimeout(() => { this.pointerLockJustActivated = false; }, 50);
        }
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
        const key = e.key.toLowerCase();

        // L键打开/关闭收集界面
        if (key === 'l') {
          if (this.showCollection) {
            // 如果已打开，则关闭
            this.closeCollection();
            return;
          } else if (!this.isInDialogue && !this.showTeaCeremony && !this.showCalligraphyPractice) {
            // 如果未打开且满足条件，则打开
            this.openCollection();
            return;
          }
          return;
        }

        if (this.showSettings || this.showCollection) return; // ESC面板或收集界面时不响应移动键

        // 交互键F
        if (key === 'f') {
          // 如果茶道游戏正在进行，处理茶道步骤
          if (this.showTeaCeremony) {
            this.handleTeaStep();
            return;
          }
          // 如果多页tips正在显示，完全跳过处理（DialogueSystem在捕获阶段处理）
          if (this.dialogueSystem && this.dialogueSystem.isTipsShowing() &&
              this.dialogueSystem.tipsPages && this.dialogueSystem.tipsPages.length > 0) {
            return;
          }
          // 如果单页tips正在显示，按F处理（打字中显示全部，打字完成关闭）
          if (this.dialogueSystem && this.dialogueSystem.isTipsShowing()) {
            // 让 DialogueSystem 自己处理 F 键逻辑
            return;
          }
          // 如果正在对话中，不处理交互（让DialogueSystem处理F键）
          if (this.isInDialogue) return;
          this.handleInteract();
          return;
        }

        // 如果在对话中，不处理其他按键（让DialogueSystem处理）
        if (this.isInDialogue) return;
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
        if (this.showSettings || this.showCollection) return;
        const key = e.key.toLowerCase();
        this.keys[key] = false;
        // 空格键释放时重置跳跃状态
        if (key === ' ') {
          this.jumpPressed = false;
        }
      };
      window.addEventListener('keydown', this.onKeyDown);
      window.addEventListener('keyup', this.onKeyUp);

      this.onMouseDown = () => { this.isDragging = true; };
      this.onMouseUp = () => { this.isDragging = false; };
      this.onMouseMove = (e) => {
        // 直接通过鼠标移动旋转视角，无需拖拽
        // 对话、临摹、茶道、收集界面或tips显示时禁止视角控制
        if (this.isInDialogue || this.isInCalligraphy || this.showTeaCeremony || this.showCollection || (this.dialogueSystem && this.dialogueSystem.isTipsShowing())) return;
        if (document.pointerLockElement) {
          // 跳过指针锁定刚激活时的第一帧移动，避免视角乱跳
          if (this.pointerLockJustActivated) return;
          this.cameraAngle.horizontal -= e.movementX * 0.002;
          this.cameraAngle.vertical -= e.movementY * 0.002;
          this.cameraAngle.vertical = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, this.cameraAngle.vertical));
        }
      };
      window.addEventListener('mousedown', this.onMouseDown);
      window.addEventListener('mouseup', this.onMouseUp);
      window.addEventListener('mousemove', this.onMouseMove);
    },

    // 老人交互方法
    handleOldmanInteract() {
      if (this.isInDialogue) return;

      // 解锁收集物
      this.unlockCollectionItem('oldman');

      // 检查王爷爷当前位置
      const grandpaLocation = this.storyManager.getGrandpaLocation();

      if (grandpaLocation === 'chuihuamen') {
        // 王爷爷在垂花门：使用垂花门对话
        const chuihuaDialogue = getChuihuaDialogue(this.locale);
        this.isInDialogue = true;
        this.dialogueSystem.start(chuihuaDialogue, () => {
          this.isInDialogue = false;
          // 完成"与王爷爷交流"任务
          const currentQuest = this.questManager.getCurrentQuest();
          if (currentQuest && currentQuest.id === 'quest_meet_grandpa_chuihua') {
            this.questManager.completeCurrentQuest();
          }
          // 设置对话冷却
          this.dialogueCooldown = true;
          this.pointerLockJustActivated = true;
          setTimeout(() => {
            this.dialogueCooldown = false;
            this.pointerLockJustActivated = false;
          }, 200);
        });
        return;
      }

      // 王爷爷在大门：原有逻辑
      const hasCompletedFirstTalk = this.storyManager.getFlag('scene1_1_completed');

      if (!hasCompletedFirstTalk) {
        // 第一次对话：完整剧情
        const scene = this.storyManager.getCurrentScene();
        if (scene && scene.dialogue) {
          this.startDialogue(scene.dialogue, true);
        }
      } else {
        // 第二次及以后：简短提示
        const shortDialogue = getShortDialogue(this.locale);
        this.startDialogue(shortDialogue, false);
      }
    },

    // 初始化剧情系统
    initStorySystem() {
      // 创建剧情管理器
      this.storyManager = new StoryManager();
      this.loadStoryForCurrentLocale();

      // 创建对话系统
      this.dialogueSystem = new DialogueSystem(this.$refs.container, this.locale);

      // 监听语言变化，重新加载剧情
      i18n.onChange((locale) => {
        this.locale = locale;
        this.loadStoryForCurrentLocale();
        // 更新对话系统的语言
        if (this.dialogueSystem) {
          this.dialogueSystem.setLocale(locale);
        }
      });

      // 监听场景变化
      this.storyManager.on('sceneStart', (scene) => {
        console.log('场景开始:', scene.title);
      });

      // 不再自动触发剧情，改为靠近老爷爷时交互触发
    },

    // 初始化任务系统
    initQuestSystem() {
      this.questManager = new QuestManager();

      // 先加载任务数据定义
      const quests = getQuestData(this.locale);
      this.questManager.loadQuests(quests);

      // 检查是否有存档，继续游戏时恢复任务进度
      const saveData = saveManager.load();
      if (saveData && !this.isNewGame && saveData.questState) {
        // 加载状态（这会覆盖 currentQuestIndex 和 completedQuests）
        this.questManager.loadState(saveData.questState);
      }

      // 监听语言变化
      i18n.onChange((locale) => {
        // 保存当前任务状态
        const currentState = this.questManager.saveState();
        // 加载新语言的任务数据
        const newQuests = getQuestData(locale);
        this.questManager.loadQuests(newQuests);
        // 恢复任务状态（保持当前任务索引和已完成列表）
        this.questManager.loadState(currentState);
      });
    },

    // 初始化收集系统
    initCollectionSystem() {
      this.collectionSystem = new CollectionSystem();
      this.loadCollectionForCurrentLocale();
      this.collectionSystem.loadFromStorage();

      // 监听语言变化
      i18n.onChange((locale) => {
        this.loadCollectionForCurrentLocale();
      });

      // 监听解锁事件，自动保存
      this.collectionSystem.on('itemUnlocked', () => {
        this.collectionSystem.saveToStorage();
      });
    },

    // 加载当前语言的收集数据
    loadCollectionForCurrentLocale() {
      const data = getCollectionData(this.locale);
      this.collectionSystem.loadCollectionData(data);
    },

    // 解锁收集物
    unlockCollectionItem(interactionId) {
      if (!this.collectionSystem) return;
      const item = this.collectionSystem.getItemByInteractionId(interactionId);
      if (item) {
        this.collectionSystem.unlockItem(item.id);
      }
    },

    // 打开收集界面
    openCollection() {
      if (this.collectionSystem) {
        this.showCollection = true;
        // 释放鼠标锁定
        if (document.pointerLockElement) {
          document.exitPointerLock();
        }
      }
    },

    // 关闭收集界面
    closeCollection() {
      this.showCollection = false;
    },

    // 加载当前语言的剧情
    loadStoryForCurrentLocale() {
      const data = getStoryData(this.locale);
      this.storyManager.loadStory(data);
    },

    // 开始对话
    startDialogue(dialogueData, isFirstTalk = false) {
      if (!dialogueData || dialogueData.length === 0) return;

      this.isInDialogue = true;
      // 清除对话冷却
      this.dialogueCooldown = false;
      // 保持指针锁定，不显示鼠标，使用键盘或自动推进对话

      this.dialogueSystem.start(dialogueData, () => {
        this.isInDialogue = false;
        // 只有第一次完整对话才标记为完成
        if (isFirstTalk) {
          this.storyManager.setFlag('scene1_1_completed', true);
          // 完成"和王爷爷说话"任务
          const currentQuest = this.questManager.getCurrentQuest();
          if (currentQuest && currentQuest.id === 'quest_talk_to_grandpa') {
            this.questManager.completeCurrentQuest();
          }
        }
        // 设置对话冷却，防止F键立即触发新对话
        this.dialogueCooldown = true;
        // 对话结束后跳过一帧鼠标移动，避免视角跳变
        this.pointerLockJustActivated = true;
        setTimeout(() => {
          this.dialogueCooldown = false;
          this.pointerLockJustActivated = false;
        }, 200); // 200ms冷却时间
      });
    },

    // 检查交互点
    checkInteractions() {
      if (!this.player || this.isInDialogue || this.showTeaCeremony) return;

      const playerPos = this.player.position;
      let nearestInteraction = null;
      let nearestDistance = Infinity;

      interactionPoints.forEach(point => {
        // 跳过一次性的已交互目标
        if (point.once && this.storyManager.getFlag(`interacted_${point.id}`)) return;
        
        const distance = playerPos.distanceTo(new THREE.Vector3(point.position.x, point.position.y, point.position.z));
        if (distance < point.radius && distance < nearestDistance) {
          // 检查条件
          if (!point.condition || this.storyManager.checkCondition(point.condition)) {
            nearestDistance = distance;
            nearestInteraction = point;
          }
        }
      });

      this.currentInteraction = nearestInteraction;
      this.isNearOldman = nearestInteraction && nearestInteraction.id === 'oldman';

      // 更新当前位置
      this.updateLocation();
    },

    // 更新玩家当前位置
    updateLocation() {
      if (!this.player) return;
      const pos = this.player.position;
      const x = pos.x;
      const z = pos.z;

      // 根据坐标判断位置（用户指定区域）
      let locationImage = '';

      // 大门区域
      if (x >= -27 && x <= -14 && z >= -38 && z <= -22) {
        locationImage = this.locale === 'en' ? '/photo/place/en/MainGate.png' : '/photo/place/zh/damen.png';
      }
      // 入院小径区域
      else if (x >= -28 && x <= 43 && z >= -21 && z <= -9) {
        locationImage = this.locale === 'en' ? '/photo/place/en/GardenPath.png' : '/photo/place/zh/ruyuanxiaojing.png';
      }
      // 内院区域
      else if (x >= -19 && x <= 20 && z >= -5 && z <= 41) {
        locationImage = this.locale === 'en' ? '/photo/place/en/InnerCourtyard.png' : '/photo/place/zh/neiyuan.png';
      }

      // 位置变化时触发渐出渐入效果
      if (locationImage !== this.currentLocationImage) {
        this.currentLocationImage = locationImage;
        if (this.displayLocationImage === '') {
          // 从无到有，直接显示
          this.displayLocationImage = locationImage;
          this.isLocationFadingOut = false;
        } else if (locationImage === '') {
          // 离开所有区域，渐出后清空
          this.isLocationFadingOut = true;
          setTimeout(() => {
            this.displayLocationImage = '';
            this.isLocationFadingOut = false;
          }, 500);
        } else {
          // 从A到B，先渐出再渐入
          this.isLocationFadingOut = true;
          setTimeout(() => {
            this.displayLocationImage = locationImage;
            this.isLocationFadingOut = false;
          }, 500);
        }
      }
    },

    // 处理交互按键
    handleInteract() {
      if (!this.currentInteraction || this.isInDialogue || this.dialogueCooldown) return;

      if (this.currentInteraction.id === 'oldman') {
        this.handleOldmanInteract();
      } else if (this.currentInteraction.id === 'guidance') {
        this.handleGuidanceInteract();
      } else if (this.currentInteraction.id === 'arrow2') {
        this.handleScreenWallInteract();
      } else if (this.currentInteraction.id === 'chuihuamen') {
        this.handleChuihuaInteract();
      } else if (this.currentInteraction.id === 'swing') {
        this.handleSwingInteract();
      } else if (this.currentInteraction.id === 'pomegranate') {
        this.handlePomegranateInteract();
      } else if (this.currentInteraction.id === 'calligraphy') {
        this.handleCalligraphyInteract();
      } else if (this.currentInteraction.id === 'oldwoman') {
        this.handleOldwomanInteract();
      } else if (this.currentInteraction.id === 'cat') {
        this.handleCatInteract();
      } else if (this.currentInteraction.id === 'mainhouse') {
        this.handleMainhouseInteract();
      } else if (this.currentInteraction.id === 'eastwing') {
        this.handleEastwingInteract();
      } else if (this.currentInteraction.id === 'westwing') {
        this.handleWestwingInteract();
      } else if (this.currentInteraction.id === 'tea') {
        this.handleTeaInteract();
      } else if (this.currentInteraction.id === 'familybook') {
        this.handleFamilyBookInteract();
      } else if (this.currentInteraction.id === 'taohe') {
        this.handleTaoheInteract();
      }
    },

    // 处理箭头交互（按F切换tips显示/隐藏）
    handleGuidanceInteract() {
      // 如果tips已经在显示，按F会关闭它（在onKeyDown中处理）
      // 如果tips没有显示，显示它
      if (this.dialogueSystem.isTipsShowing()) {
        return; // 已经在显示，不重复处理
      }

      // 检查是否已完成与王爷爷的第一次对话
      const hasCompletedFirstTalk = this.storyManager.getFlag('scene1_1_completed');
      if (!hasCompletedFirstTalk) {
        // 未完成对话，显示提示需要先和王爷爷对话
        const tipsText = this.locale === 'en' 
          ? "You should talk to Grandpa Wang first before entering the courtyard."
          : "你应该先和王爷爷打个招呼再进院子。";
        this.dialogueSystem.showTips(tipsText, () => {
          this.pointerLockJustActivated = true;
          setTimeout(() => { this.pointerLockJustActivated = false; }, 50);
        });
        return;
      }

      // 解锁收集物
      this.unlockCollectionItem('guidance');

      // 显示tips提示框
      const tipsText = getTipsText(this.locale, 'threshold');
      this.dialogueSystem.showTips(tipsText, () => {
        // tips关闭后跳过一帧鼠标移动，避免视角跳变
        this.pointerLockJustActivated = true;
        setTimeout(() => { this.pointerLockJustActivated = false; }, 50);
        // 标记门槛已交互，触发王爷爷位置变化
        this.storyManager.setFlag('threshold_interacted', true);
        this.updateGrandpaPosition();
        // 完成"探索门槛"任务，推进到"进入大门"
        const currentQuest = this.questManager.getCurrentQuest();
        if (currentQuest && currentQuest.id === 'quest_explore_threshold') {
          this.questManager.completeCurrentQuest();
        }
      });
    },

    // 更新王爷爷位置和交互点
    updateGrandpaPosition() {
      const location = this.storyManager.getGrandpaLocation();

      if (location === 'chuihuamen') {
        // 王爷爷移动到垂花门
        if (this.oldman) {
          this.oldman.position.set(6, 14.5, -11);
          this.oldman.rotation.y = Math.PI / 2 + Math.PI + Math.PI / 6; // 向左旋转45度
        }
        // 更新交互点位置到垂花门
        const oldmanPoint = interactionPoints.find(p => p.id === 'oldman');
        if (oldmanPoint) {
          oldmanPoint.position = { x: 6, y: 14.5, z: -11 };
        }
      } else if (location === 'gate') {
        // 王爷爷在大门（默认位置）
        if (this.oldman) {
          this.oldman.position.set(-2, 14.5, -36);
        }
        const oldmanPoint = interactionPoints.find(p => p.id === 'oldman');
        if (oldmanPoint) {
          oldmanPoint.position = { x: -2, y: 14.0, z: -36 };
        }
      }
    },

    // 处理垂花门交互（多页tips）
    handleChuihuaInteract() {
      if (this.dialogueSystem.isTipsShowing() || this.dialogueCooldown) return;

      // 解锁收集物
      this.unlockCollectionItem('chuihuamen');
      const tipsPages = getTipsText(this.locale, 'chuihuamen');
      this.dialogueSystem.showMultiPageTips(tipsPages, () => {
        this.pointerLockJustActivated = true;
        this.dialogueCooldown = true;
        setTimeout(() => {
          this.pointerLockJustActivated = false;
          this.dialogueCooldown = false;
        }, 500);
      });
    },

    // 处理王爷爷在垂花门的对话
    handleOldmanAtChuihua() {
      if (this.isInDialogue) return;
      const dialogue = getChuihuaDialogue(this.locale);
      this.startDialogue(dialogue, false);
    },

    // 处理影壁交互（通过箭头触发）
    handleScreenWallInteract() {
      if (this.dialogueSystem.isTipsShowing()) return;
      // 解锁收集物
      this.unlockCollectionItem('arrow2');
      const tipsText = getTipsText(this.locale, 'screenwall');
      this.dialogueSystem.showTips(tipsText, () => {
        this.pointerLockJustActivated = true;
        setTimeout(() => { this.pointerLockJustActivated = false; }, 50);
        // 完成"进入大门"任务，推进到"与王爷爷交流"
        const currentQuest = this.questManager.getCurrentQuest();
        if (currentQuest && currentQuest.id === 'quest_enter_gate') {
          this.questManager.completeCurrentQuest();
        }
      });
    },



    // 处理石榴树交互
    handlePomegranateInteract() {
      if (this.dialogueSystem.isTipsShowing()) return;
      // 解锁收集物
      this.unlockCollectionItem('pomegranate');
      const tipsText = getTipsText(this.locale, 'pomegranate');
      this.dialogueSystem.showTips(tipsText, () => {
        this.pointerLockJustActivated = true;
        setTimeout(() => { this.pointerLockJustActivated = false; }, 50);
      });
    },

    // 处理海棠树交互
    handleTaoheInteract() {
      if (this.dialogueSystem.isTipsShowing()) return;
      // 解锁收集物
      this.unlockCollectionItem('taohe');
      const tipsText = getTipsText(this.locale, 'taohe');
      this.dialogueSystem.showTips(tipsText, () => {
        this.pointerLockJustActivated = true;
        setTimeout(() => { this.pointerLockJustActivated = false; }, 50);
      });
    },

    // 处理纸墨笔砚交互
    handleCalligraphyInteract() {
      if (this.dialogueSystem.isTipsShowing()) return;
      // 解锁收集物
      this.unlockCollectionItem('calligraphy');
      const tipsText = getTipsText(this.locale, 'calligraphy');
      this.dialogueSystem.showTips(tipsText, () => {
        this.pointerLockJustActivated = true;
        setTimeout(() => { this.pointerLockJustActivated = false; }, 50);
        // 打开书法临摹界面
        this.showCalligraphyPractice = true;
      });
    },

    // 处理老奶奶交互（多轮对话）
    handleOldwomanInteract() {
      if (this.isInDialogue) return;
      // 解锁收集物
      this.unlockCollectionItem('oldwoman');
      // 从storyData获取老奶奶对话
      const storyData = getStoryData(this.locale);
      const grandmaScene = storyData.chapters[1]?.scenes[0];
      if (grandmaScene && grandmaScene.dialogue) {
        this.startDialogue(grandmaScene.dialogue, false);
      }
    },

    // 处理猫交互（普通tips）
    handleCatInteract() {
      if (this.dialogueSystem.isTipsShowing()) return;
      // 解锁收集物
      this.unlockCollectionItem('cat');
      const tipsText = getTipsText(this.locale, 'cat');
      this.dialogueSystem.showTips(tipsText, () => {
        this.pointerLockJustActivated = true;
        setTimeout(() => { this.pointerLockJustActivated = false; }, 50);
      });
    },

    // 处理正房交互
    handleMainhouseInteract() {
      if (this.dialogueSystem.isTipsShowing()) return;
      // 解锁收集物
      this.unlockCollectionItem('mainhouse');
      const tipsText = getTipsText(this.locale, 'mainhouse');
      this.dialogueSystem.showTips(tipsText, () => {
        this.pointerLockJustActivated = true;
        setTimeout(() => { this.pointerLockJustActivated = false; }, 50);
      });
    },

    // 处理东厢房交互
    handleEastwingInteract() {
      if (this.dialogueSystem.isTipsShowing()) return;
      // 解锁收集物
      this.unlockCollectionItem('eastwing');
      const tipsText = getTipsText(this.locale, 'eastwing');
      this.dialogueSystem.showTips(tipsText, () => {
        this.pointerLockJustActivated = true;
        setTimeout(() => { this.pointerLockJustActivated = false; }, 50);
      });
    },

    // 处理西厢房交互
    handleWestwingInteract() {
      if (this.dialogueSystem.isTipsShowing()) return;
      // 解锁收集物
      this.unlockCollectionItem('westwing');
      const tipsText = getTipsText(this.locale, 'westwing');
      this.dialogueSystem.showTips(tipsText, () => {
        this.pointerLockJustActivated = true;
        setTimeout(() => { this.pointerLockJustActivated = false; }, 50);
      });
    },

    // 处理茶道交互
    handleTeaInteract() {
      if (this.showTeaCeremony) return;
      
      // 解锁收集物
      this.unlockCollectionItem('tea');
      
      // 检查是否已完成过茶道游戏
      if (this.hasCompletedTeaCeremony) {
        // 第二次及以后：显示茶文化介绍
        this.showTeaCultureDialogue();
        return;
      }
      
      // 初始化茶道游戏（但不开始）
      this.teaCeremonyGame = new TeaCeremonyGame();
      this.teaCeremonyGame.onStepChange = (step) => {
        this.teaCeremonyStep = step;
      };
      this.teaCeremonyGame.onComplete = (result) => {
        this.teaCeremonyScore = result.score;
        this.teaCeremonyRating = result.rating;
        this.teaCeremonyComplete = true;
        this.teaCeremonyStep = null; // 完成时步骤设为null，显示完成界面
        // 标记已完成茶道游戏
        this.hasCompletedTeaCeremony = true;
        // 茶道完成时显示鼠标
        document.exitPointerLock();
      };
      
      this.showTeaCeremony = true;
      this.teaCeremonyComplete = false;
      this.teaCeremonyStep = null; // 初始为null，显示介绍页面
      
      // 交互后立即显示鼠标
      document.exitPointerLock();
    },

    // 显示茶文化介绍tips
    showTeaCultureDialogue() {
      const tipsPages = getTipsText(this.locale, 'tea');
      this.dialogueSystem.showMultiPageTips(tipsPages, () => {
        this.pointerLockJustActivated = true;
        this.dialogueCooldown = true;
        setTimeout(() => {
          this.pointerLockJustActivated = false;
          this.dialogueCooldown = false;
        }, 500);
      });
    },

    // 茶道步骤处理
    handleTeaStep() {
      if (!this.showTeaCeremony || !this.teaCeremonyGame) return;
      
      // 获取当前指示器位置
      const teaCeremonyComponent = this.$refs.teaCeremony;
      const indicatorPosition = teaCeremonyComponent ? teaCeremonyComponent.getIndicatorPosition() : 0;
      
      // 根据指示器位置判断是否完美
      const isPerfect = indicatorPosition >= 40 && indicatorPosition <= 60;
      
      const result = this.teaCeremonyGame.handleStep(isPerfect);
      
      // 重置指示器动画
      if (!result.finished && teaCeremonyComponent) {
        teaCeremonyComponent.resetIndicator();
      }
    },

    // 茶道完成关闭
    handleTeaCeremonyClose() {
      this.showTeaCeremony = false;
      // 重新锁定鼠标
      this.requestLock();
    },

    // 茶道游戏开始
    handleTeaStart() {
      // 开始茶道游戏
      this.teaCeremonyGame.start(this.locale);
      this.teaCeremonyStep = this.teaCeremonyGame.getCurrentStep();
      this.teaCeremonyScore = 0;
      this.teaCeremonyComplete = false;
    },

    // 处理秋千交互
    handleSwingInteract() {
      // 解锁收集物
      this.unlockCollectionItem('swing');
      if (this.isOnSwing) {
        // 下秋千
        this.exitSwing();
      } else {
        // 上秋千
        this.enterSwing();
      }
    },

    // 处理王氏家谱交互
    handleFamilyBookInteract() {
      if (this.dialogueSystem.isTipsShowing()) return;
      // 标记已交互（使交互点消失）
      this.storyManager.setFlag('interacted_familybook', true);
      // 解锁收集物
      this.unlockCollectionItem('familybook');
      // 显示tips提示框，关闭后模型消失
      const tipsText = getTipsText(this.locale, 'familybook');
      this.dialogueSystem.showTips(tipsText, () => {
        this.pointerLockJustActivated = true;
        setTimeout(() => { this.pointerLockJustActivated = false; }, 50);
        // tips关闭后模型消失（带动画）
        this.animateFamilyBookDisappear();
        // 完成"探索内院"任务，推进到"和王爷爷谈论家谱"
        const currentQuest = this.questManager.getCurrentQuest();
        if (currentQuest && currentQuest.id === 'quest_explore_courtyard') {
          this.questManager.completeCurrentQuest();
        }
      });
    },

    // 家谱模型消失动画
    animateFamilyBookDisappear() {
      if (!this.familyBook) return;
      const duration = 500; // 动画时长500ms
      const startTime = Date.now();
      const startScale = this.familyBook.scale.x;
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // 缩放从1到0
        const scale = startScale * (1 - progress);
        this.familyBook.scale.setScalar(scale);
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          this.familyBook.visible = false;
          this.familyBook.scale.setScalar(startScale); // 恢复原始缩放
        }
      };
      animate();
    },

    // 上秋千
    enterSwing() {
      // 保存当前位置
      this.swingReturnPosition = {
        x: this.player.position.x,
        y: this.player.position.y,
        z: this.player.position.z
      };
      // 移动到秋千位置
      this.player.position.set(this.swingPosition.x, this.swingPosition.y, this.swingPosition.z);
      this.playerBody.setTranslation({
        x: this.swingPosition.x,
        y: this.swingPosition.y,
        z: this.swingPosition.z
      });
      this.isOnSwing = true;
    },

    // 下秋千
    exitSwing() {
      if (this.swingReturnPosition) {
        // 回到原来的位置
        this.player.position.set(
          this.swingReturnPosition.x,
          this.swingReturnPosition.y,
          this.swingReturnPosition.z
        );
        this.playerBody.setTranslation({
          x: this.swingReturnPosition.x,
          y: this.swingReturnPosition.y,
          z: this.swingReturnPosition.z
        });
      }
      this.isOnSwing = false;
      this.swingReturnPosition = null;
    },

    // 初始化国际化
    initI18n() {
      i18n.onChange((locale) => {
        this.locale = locale;
      });
    },

    // 设置语言
    setLocale(locale) {
      i18n.setLocale(locale);
      this.locale = locale;
    },

    // 开始随机切换加载提示语
    startLoadingHints() {
      // 每3秒随机切换一次提示语
      setInterval(() => {
        if (this.loading) {
          this.currentLoadingHintIndex = Math.floor(Math.random() * 4);
        }
      }, 3000);
    },

    // 获取交互显示名称（秋千特殊处理）
    getInteractionDisplayName() {
      if (!this.currentInteraction) return '';
      // 如果在秋千上，显示"下秋千"
      if (this.currentInteraction.id === 'swing' && this.isOnSwing) {
        return this.locale === 'zh' ? '下秋千' : 'Leave Swing';
      }
      // 默认显示交互点名称
      if (this.locale === 'en' && this.currentInteraction.nameEn) {
        return this.currentInteraction.nameEn;
      }
      return this.currentInteraction.name;
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
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(10px);
}

.loading-content {
  text-align: center;
  background: white;
  padding: 40px 60px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  min-width: 320px;
}

.progress-bar {
  width: 300px;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin: 0 auto;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4a9eff, #67b5ff);
  border-radius: 4px;
  transition: width 0.3s ease;
  box-shadow: 0 0 8px rgba(74, 158, 255, 0.4);
}

.loading-hint {
  color: #666;
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 25px;
  min-height: 24px;
  transition: opacity 0.3s ease;
}

.loading-text {
  color: #333;
  font-size: 18px;
  font-weight: 500;
  margin-top: 15px;
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

.location-hint {
  position: absolute;
  bottom: 20px;
  left: 20px;
  width: 180px;
  height: 75px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  pointer-events: none;
  z-index: 100;
  opacity: 0;
  animation: locationFadeIn 0.5s ease forwards;
}

@keyframes locationFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.location-hint.fade-out {
  animation: locationFadeOut 0.5s ease forwards;
}

@keyframes locationFadeOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
}

.settings-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  backdrop-filter: blur(15px);
}

.settings-panel {
  background: white;
  border: none;
  border-radius: 20px;
  padding: 32px 40px;
  min-width: 360px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.settings-title {
  margin: 0 0 24px 0;
  color: #333;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
}

.settings-section {
  margin-bottom: 20px;
}

.settings-section-title {
  margin: 0 0 16px 0;
  color: #555;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 2px solid #eee;
  padding-bottom: 8px;
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
  color: #666;
  font-size: 14px;
  margin-bottom: 8px;
  font-weight: 500;
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
  margin-top: 24px;
  padding: 14px 40px;
  background: #4a9eff;
  border: none;
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(74, 158, 255, 0.3);
}

.settings-btn:hover {
  background: #3a8eed;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(74, 158, 255, 0.4);
}

.save-exit-btn {
  background: #4caf50;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.save-exit-btn:hover {
  background: #43a047;
  box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
}

.lang-switch {
  gap: 12px;
}

.lang-btn {
  flex: 1;
  padding: 10px 20px;
  background: rgba(0, 0, 0, 0.05);
  border: 2px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  transition: all 0.2s;
}

.lang-btn.active {
  background: #4a9eff;
  border-color: #4a9eff;
  color: white;
}

.lang-btn:hover {
  border-color: #4a9eff;
}

/* 设置菜单样式 */
.settings-menu {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: rgba(0, 0, 0, 0.03);
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  color: #444;
  font-weight: 500;
  transition: all 0.2s;
  text-align: left;
}

.menu-btn:hover {
  background: rgba(74, 158, 255, 0.08);
  border-color: #4a9eff;
  color: #4a9eff;
  transform: translateX(4px);
}

.menu-icon {
  font-size: 20px;
  width: 28px;
  text-align: center;
}

/* 设置详情页样式 */
.settings-detail {
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.back-btn {
  display: block;
  width: 100%;
  margin-top: 20px;
  padding: 12px 30px;
  background: rgba(0, 0, 0, 0.05);
  border: 2px solid #ddd;
  color: #666;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.2s;
}

.back-btn:hover {
  background: rgba(0, 0, 0, 0.08);
  border-color: #999;
  color: #444;
}

/* 交互提示框过渡动画 */
.hint-enter-active,
.hint-leave-active {
  transition: all 0.3s ease;
}

.hint-enter-from,
.hint-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}

.hint-enter-to,
.hint-leave-from {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.interaction-hint {
  position: absolute;
  bottom: 90px;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
  z-index: 150;
}

.interaction-bg {
  width: 200px;
  height: 60px;
  background-image: url('/photo/interaction.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.interaction-text {
  color: #FDF8E4;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  padding-left: 20px;
  padding-bottom: 5px;
}

</style>
