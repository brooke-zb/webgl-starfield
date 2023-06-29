import { Engine } from '@babylonjs/core/Engines/engine'
import { Texture } from '@babylonjs/core/Materials/Textures/texture'
import { Effect } from '@babylonjs/core/Materials/effect'
import { ShaderMaterial } from '@babylonjs/core/Materials/shaderMaterial'
import { Scene } from '@babylonjs/core/scene'

Effect.ShadersStore['cloudsVertexShader'] = /* glsl */ `
  attribute vec2 uv;
  attribute vec3 position;
  attribute vec3 normal;
  varying vec2 vUv;
  varying float vCost;
  uniform mat4 worldViewProjection;

  void main(void) {
      vUv = uv;
      vCost = 1.0 - max(-position.y, 0.0) / 3.5;
      gl_Position = worldViewProjection * vec4(position, 1.0);
  }`
Effect.ShadersStore['cloudsFragmentShader'] = /* glsl */ `
  varying vec2 vUv;
  varying float vCost;
  uniform sampler2D textureSampler;
  uniform float time;
  uniform float globalAlpha;

  vec3 palette(float t) {
    // green purple blue [[0.300 0.460 0.830] [0.240 0.158 0.298] [1.000 1.000 1.000] [0.710 1.323 0.788]]
    vec3 a = vec3(0.300, 0.460, 0.830);
    vec3 b = vec3(0.240, 0.158, 0.298);
    vec3 c = vec3(1.000, 1.000, 1.000);
    vec3 d = vec3(0.710, 1.323, 0.788);

    return a + b * cos(6.28318 * (c * t + d));
  }

  void main(void) {
    vec4 textColor = texture2D(textureSampler, vec2(vUv.x, vUv.y + time));
    float alpha = (textColor.r * 0.7 * vCost) * globalAlpha;
    vec3 color = palette(vUv.x + vUv.y + time);
    gl_FragColor = vec4(color, alpha);
  }`

function createCloudsMaterial(scene: Scene): ShaderMaterial {
  const cloudTexture = new Texture('/assets/textures/tile.jpg', scene)
  const shaderMat = new ShaderMaterial(
    'cloudsShader',
    scene,
    {
      vertex: 'clouds',
      fragment: 'clouds',
    },
    {
      attributes: ['position', 'normal', 'uv'],
      uniforms: ['world', 'worldView', 'worldViewProjection', 'view', 'projection', 'textureSampler', 'time', 'globalAlpha'],
      needAlphaBlending: true,
    }
  )
  shaderMat.setTexture('textureSampler', cloudTexture)
  shaderMat.alphaMode = Engine.ALPHA_ADD

  let time = 0.0
  let globalAlpha = 0.0
  shaderMat.onBind = function () {
    const delta = scene.getEngine().getDeltaTime() * 0.001
    time += delta * 0.02
    globalAlpha = Math.min(globalAlpha + delta, 1.0)
    shaderMat.setFloat('time', time)
    shaderMat.setFloat('globalAlpha', globalAlpha)
  }

  return shaderMat
}

export { createCloudsMaterial }
