import { Engine } from '@babylonjs/core/Engines/engine'
import { Scene } from '@babylonjs/core/scene'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera'
import { Color4 } from '@babylonjs/core/Maths/math.color'
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader'
import { CameraPanInput } from './input/cameraPanInput'
import { createStarParticleSystem } from './starParticleSystem'
import { createCloudsMaterial } from './cloudsMaterial'
import { DefaultRenderingPipeline } from '@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/defaultRenderingPipeline'

import '@babylonjs/loaders/glTF/2.0'

const canvas = document.getElementById('bg') as HTMLCanvasElement
const engine = new Engine(canvas, true)
const createScene = function () {
  // 场景
  const scene = new Scene(engine)
  scene.clearColor = new Color4(2 / 255, 6 / 255, 25 / 255, 1)

  // 相机
  const camera = new FreeCamera('camera1', new Vector3(0, 50, 0), scene)
  camera.setTarget(Vector3.Zero())
  camera.fov = 1.2
  camera.inputs.clear()
  camera.inputs.add(new CameraPanInput(camera))
  camera.attachControl(canvas, true)
  camera.minZ = 0
  camera.maxZ = 1000

  // 星空粒子
  const particleSystem = createStarParticleSystem(scene)
  particleSystem.start()

  // 星云
  const cloudsMat = createCloudsMaterial(scene)
  SceneLoader.ImportMeshAsync(['cone'], '/assets/models/', 'cone.glb', scene)
    .then(result => {
      const cone = result.meshes[0].getChildMeshes()[0]
      cone.material = cloudsMat
    })
    .catch(err => {
      console.log(err)
    })

  // 锐化
  const pipeline = new DefaultRenderingPipeline('default', false, scene, scene.cameras)
  pipeline.sharpenEnabled = true

  return scene
}

// 渲染
const scene = createScene()
engine.runRenderLoop(function () {
  scene.render()
})
window.addEventListener('resize', function () {
  engine.resize()
})
