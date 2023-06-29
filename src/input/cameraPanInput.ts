import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera'
import { ICameraInput } from '@babylonjs/core/Cameras/cameraInputsManager'

class CameraPanInput implements ICameraInput<FreeCamera> {
  camera: FreeCamera
  clientPos: {
    x: number
    y: number
  }
  sensibility: number
  _onMouseMove?: (evt: MouseEvent) => void
  _onTouchStart?: (evt: TouchEvent) => void
  _onVisibilityChange?: () => void
  pageVisibility: boolean

  constructor(camera: FreeCamera) {
    this.camera = camera
    this.clientPos = {
      x: 0,
      y: 0,
    }
    this.sensibility = 5
    this.pageVisibility = true
  }

  getClassName() {
    return 'CameraPanInput'
  }
  getSimpleName() {
    return 'CameraPan'
  }
  attachControl(_noPreventDefault: boolean) {
    const _this = this
    if (!this._onMouseMove) {
      this._onMouseMove = function (evt: MouseEvent) {
        _this.clientPos.x = 0.5 - evt.clientX / document.body.clientWidth
        _this.clientPos.y = evt.clientY / document.body.clientHeight - 0.5
      }
      this._onTouchStart = function (evt: TouchEvent) {
        if (evt.touches.length !== 1) return
        _this.clientPos.x = 0.5 - evt.touches[0].clientX / document.body.clientWidth
        _this.clientPos.y = evt.touches[0].clientY / document.body.clientHeight - 0.5
      }
      this._onVisibilityChange = function () {
        this.pageVisibility = document.visibilityState === 'visible'
      }

      window.addEventListener('mousemove', this._onMouseMove, false)
      window.addEventListener('touchstart', this._onTouchStart, false)
      document.addEventListener('visibilitychange', this._onVisibilityChange, false)
    }
  }
  detachControl() {
    if (this._onMouseMove) {
      window.removeEventListener('mousemove', this._onMouseMove!)
      window.removeEventListener('touchstart', this._onTouchStart!)
      document.removeEventListener('visibilitychange', this._onVisibilityChange!)
      this._onMouseMove = undefined
      this._onTouchStart = undefined
      this._onVisibilityChange = undefined
    }
  }
  /**
   * 
   * @param from 
   * @param to 
   * @param rate 
   * @returns 
   */
  transtitionAnimation(from: number, to: number, rate = 0.025) {
    return from + (to - from) * Math.min(rate, 1)
  }
  checkInputs() {
    if (this._onMouseMove && this.pageVisibility) {
      const engine = this.camera.getEngine()
      const elapsed = engine.getDeltaTime()
      // // debug
      // if (!_thr) {
      //   _thr = throttle(() => {
      //     console.log('pos: [%o, %o], w: %o, h: %o, client: [%o, %o]', camera.position.x, camera.position.z, document.body.clientWidth , document.body.clientHeight, this.clientPos.x, this.clientPos.y)
      //     console.log('delta: %o', engine.getDeltaTime())
      //   }, 1000)
      // }
      // _thr()

      this.camera.position.set(this.transtitionAnimation(this.camera.position.x, this.clientPos.x * this.sensibility, elapsed * 0.003), this.camera.position.y, this.transtitionAnimation(this.camera.position.z, this.clientPos.y * this.sensibility, elapsed * 0.003))
    }
  }
}

export { CameraPanInput }
