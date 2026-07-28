/**
 * 语音预加载器 — 在 loading 阶段将所有 mp3 拉到浏览器缓存
 * DialogueSystem 播放时直接从 Blob URL 读取，不再受网络波动影响
 */

export class VoicePreloader {
  /**
   * @param {string} basePath  语音目录路径，如 '/vocal/1/'
   */
  constructor(basePath) {
    this.basePath = basePath
    /** @type {Map<string, ArrayBuffer>} */
    this.cache = new Map()
    this._loaded = false
  }

  get loaded() {
    return this._loaded
  }

  /**
   * 从 manifest.json 读取文件列表，逐个 fetch 并缓存
   * @param {(loaded: number, total: number) => void} [onProgress]
   * @returns {Promise<void>}
   */
  async preload(onProgress) {
    const manifestUrl = this.basePath + 'manifest.json'
    const resp = await fetch(manifestUrl)
    if (!resp.ok) throw new Error(`无法读取语音清单: ${resp.status}`)
    const files = /** @type {string[]} */ (await resp.json())

    let loaded = 0
    const total = files.length

    // 分批并发下载，避免同时开太多连接
    const BATCH_SIZE = 8
    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      const batch = files.slice(i, i + BATCH_SIZE)
      await Promise.all(
        batch.map(async (filename) => {
          const path = this.basePath + filename
          const r = await fetch(path)
          if (r.ok) {
            this.cache.set(path, await r.arrayBuffer())
          }
          loaded++
          if (onProgress) onProgress(loaded, total)
        })
      )
    }

    this._loaded = true
  }

  /**
   * 为指定路径生成 Blob URL（每次调用创建新 URL，用完需 revoke）
   * @param {string} path
   * @returns {string|null}
   */
  createBlobUrl(path) {
    const buffer = this.cache.get(path)
    if (!buffer) return null
    const blob = new Blob([buffer], { type: 'audio/mpeg' })
    return URL.createObjectURL(blob)
  }

  /**
   * 销毁所有缓存，释放内存
   */
  destroy() {
    this.cache.clear()
    this._loaded = false
  }
}
