import { Texture } from '@babylonjs/core/Materials/Textures/texture'
import { Effect } from '@babylonjs/core/Materials/effect'
import { Color4 } from '@babylonjs/core/Maths/math.color'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import { ParticleSystem } from '@babylonjs/core/Particles/particleSystem'
import '@babylonjs/core/Particles/particleSystemComponent'
import { Scene } from '@babylonjs/core/scene'

Effect.ShadersStore['starFragmentShader'] = /* glsl */ `
  varying vec2 vUV;
  varying vec4 vColor;
  uniform sampler2D diffuseSampler;
  uniform float globalAlpha;

  void main(void) {
    vec4 text = texture2D(diffuseSampler, vUV);
    float alpha = text.r * min(vColor.a, 1.0);
    vec3 color = mix(vColor.rgb, vec3(1.0, 0.8, 0.3), text.r) * alpha * globalAlpha;
    gl_FragColor = vec4(color, 1.0);
  }`

function createStarParticleSystem(scene: Scene): ParticleSystem {
  const particleSystem = new ParticleSystem('particles', 1500, scene)
  particleSystem.particleTexture = new Texture('/assets/textures/star.jpg', scene)
  particleSystem.minSize = 0.2
  particleSystem.maxSize = 0.5
  particleSystem.minLifeTime = 20
  particleSystem.maxLifeTime = 20
  particleSystem.emitRate = 75
  particleSystem.color1 = new Color4(134 / 255, 13 / 255, 255 / 255, 0.01)
  particleSystem.color2 = new Color4(8 / 255, 255 / 255, 214 / 255, 0.01)
  particleSystem.updateFunction = function (particles) {
    const glowSpeed = 1 + this._scaledUpdateSpeed * 5
    const gloomSpeed = 1 / glowSpeed
    for (let index = 0; index < particles.length; index++) {
      let particle = particles[index]
      particle.age += this._scaledUpdateSpeed

      if (particle.age >= particle.lifeTime) {
        // Recycle
        particles.splice(index, 1)
        this._stockParticles.push(particle)
        index--
        continue
      } else {
        if (particle.age <= 1.5) {
          particle.color.a *= glowSpeed
        } else if (particle.age >= particle.lifeTime - 2) {
          particle.color.a *= gloomSpeed
        }

        particle.direction.scaleToRef(this._scaledUpdateSpeed, this._scaledDirection)
        particle.position.addInPlace(this._scaledDirection)
      }
    }
  }
  const boxEmitter = particleSystem.createBoxEmitter(new Vector3(0, 2.5, 0), new Vector3(0, 2.5, 0), new Vector3(-50, 0, -30), new Vector3(50, 0, 30))

  // custom effect
  const starEffect = scene.getEngine().createEffectForParticles('star', ['globalAlpha'], undefined, undefined, undefined, undefined, undefined, particleSystem)
  particleSystem.setCustomEffect(starEffect, 0)

  // prewarm
  particleSystem.preWarmCycles = 50
  particleSystem.preWarmStepOffset = 30

  let globalAlpha = 0.0
  starEffect.onBind = function () {
    const delta = scene.getEngine().getDeltaTime() * 0.001
    globalAlpha = Math.min(globalAlpha + delta, 1.0)

    starEffect.setFloat('globalAlpha', globalAlpha)
  }

  return particleSystem
}

export { createStarParticleSystem }
