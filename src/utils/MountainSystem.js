/**
 * 远景地面系统 - 环形地面（中间挖空留给院落），填充空气墙外的空白区域
 */

import * as THREE from 'three'

export class MountainSystem {
  /**
   * @param {THREE.Scene} scene
   * @param {object} [options]
   */
  constructor(scene, options = {}) {
    this.scene = scene
    this.groundY = options.groundY ?? 7.0
    this.outerSize = options.outerSize ?? 500   // 外圈总大小
    this.innerSize = options.innerSize ?? 60    // 中间挖空（院落+空气墙区域）

    this._createGroundPlane()
  }

  _createGroundPlane() {
    const halfOuter = this.outerSize / 2
    const halfInner = this.innerSize / 2

    const shape = new THREE.Shape()
    shape.moveTo(-halfOuter, -halfOuter)
    shape.lineTo( halfOuter, -halfOuter)
    shape.lineTo( halfOuter,  halfOuter)
    shape.lineTo(-halfOuter,  halfOuter)
    shape.closePath()

    const hole = new THREE.Path()
    hole.moveTo(-halfInner, -halfInner)
    hole.lineTo( halfInner, -halfInner)
    hole.lineTo( halfInner,  halfInner)
    hole.lineTo(-halfInner,  halfInner)
    hole.closePath()
    shape.holes.push(hole)

    const geo = new THREE.ShapeGeometry(shape)
    const mat = new THREE.MeshLambertMaterial({
      color: 0x6b7d5a,
      fog: true,
      side: THREE.DoubleSide,
    })
    this.groundPlane = new THREE.Mesh(geo, mat)
    this.groundPlane.rotation.x = -Math.PI / 2
    this.groundPlane.position.y = this.groundY
    this.groundPlane.receiveShadow = true
    this.groundPlane.renderOrder = 10
    this.scene.add(this.groundPlane)
  }

  dispose() {
    this.groundPlane.geometry.dispose()
    this.groundPlane.material.dispose()
    this.scene.remove(this.groundPlane)
  }
}
