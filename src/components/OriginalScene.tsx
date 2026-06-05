"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js"
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js"
import { RenderPass } from "three/addons/postprocessing/RenderPass.js"
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js"
import { OutputPass } from "three/addons/postprocessing/OutputPass.js"
import { RadioManager } from "@/lib/RadioManager"

function measureTextWidth(text: string) {
    const ctx = document.createElement("canvas").getContext("2d")!
    ctx.font = "400 128px Raleway, sans-serif"
    return ctx.measureText(text).width
}

function makeMetalliccSprite(
    text: string,
    height: number,
    dpr: number,
    color1: string,
    color2: string,
    highlight: string,
    speed: number,
    isNeon: boolean = false
) {
    const fontSize = 128
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")!

    ctx.font = `400 ${fontSize}px Raleway, sans-serif`
    const metrics = ctx.measureText(text)
    const tw = metrics.width
    const pad = isNeon ? fontSize * 0.7 : fontSize * 0.4
    const cw = Math.ceil(tw + pad * 2)
    const ch = Math.ceil(isNeon ? fontSize * 1.8 : fontSize * 1.4)

    canvas.width = cw * dpr
    canvas.height = ch * dpr
    ctx.scale(dpr, dpr)

    ctx.clearRect(0, 0, cw, ch)
    ctx.font = `400 ${fontSize}px Raleway, sans-serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    ctx.shadowColor = isNeon ? highlight : "rgba(0, 0, 0, 0.7)"
    ctx.shadowBlur = isNeon ? fontSize * 0.35 : fontSize * 0.25
    ctx.fillStyle = "#ffffff"
    ctx.fillText(text, cw / 2, ch / 2)

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true

    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        depthTest: true,
        sizeAttenuation: true,
    })

    material.onBeforeCompile = (shader) => {
        sprite.userData.shader = shader.uniforms.uTime = { value: 0 }

        shader.uniforms.uColor1 = { value: new THREE.Color(color1) }
        shader.uniforms.uColor2 = { value: new THREE.Color(color2) }
        shader.uniforms.uHighlight = { value: new THREE.Color(highlight) }
        shader.uniforms.uSpeed = { value: speed }

        shader.fragmentShader = shader.fragmentShader.replace("#include <common>", `
            #include <common>
            uniform float uTime;
            uniform vec3 uColor1;
            uniform vec3 uColor2;
            unifrom vec3 uHighlight;
            uniform float uSpeed;
            `).replace("gl_FragColor = vec4( outgoingLight, diffusseColor.a );", `
                float grad = vUv.x;
                vec3 base = mix(uColor1, uColor2, grad);
                float shine = sin((vUv.x + vUv.y) * 6.0 + uTime * uSpeed) * 0.5 + 0.5;
                shine = pow(shine, 3.0);
                vec3 finalColor = mix(base, uHighlight, shine * 0.6);
                outgoingLight = finalColor;
                gl_FragColor = vec4( outgoingLight, diffuseColor.a );
                `)
    }

    const sprite = new THREE.Sprite(material)
    const aspect = cw / ch
    const w = height * aspect
    sprite.scale.set(w, height, 1)
    sprite.userData.visualLeftBias = 0.5 - pad / cw
    return sprite
}

function makeCanvasSprite(
    text: string,
    height: number,
    dpr: number,
    stops: Array<{ pos: number; color: string}>,
    isNeon: boolean = false
) {
    const fontSize = 128
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")!

    ctx.font = `400 ${fontSize}px Raleway, sans-serif`
    const metrics = ctx.measureText(text)
    const tw = metrics.width
    const pad = isNeon ? fontSize * 0.7 : fontSize * 0.4
    const cw = Math.ceil(tw + pad * 2)
    const ch = Math.ceil(isNeon ? fontSize * 1.8 : fontSize * 1.4)

    canvas.width = cw * dpr
    canvas.height = ch * dpr
    ctx.scale(dpr, dpr)

    ctx.clearRect(0, 0, cw, ch)
    ctx.font = `400 ${fontSize}px Raleway, sans-serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    ctx.shadowColor = isNeon ? stops[stops.length - 1].color : "rgba(0, 0, 0, 0.7)"
    ctx.shadowBlur = isNeon ? fontSize * 0.35 : fontSize * 0.25

    const grad = ctx.createLinearGradient(0, 0, cw * 0.8, 0)
    for (const stop of stops) {
        grad.addColorStop(stop.pos, stop.color)
    }
    ctx.fillStyle = grad
    ctx.fillText(text, cw / 2, ch / 2)

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true

    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        depthTest: true,
        sizeAttenuation: true,
    })

    const sprite = new THREE.Sprite(material)
    const aspect = cw / ch
    const w = height * aspect
    sprite.scale.set(w, height, 1)
    sprite.userData.visualLeftBias = 0.6 - pad / cw
    return sprite

    function placeLeft(sprite: THREE.Sprite, anchorX: number, anchorY: number, z = 0) {
        const bias = sprite.userData.visualLeftBias as number
        sprite.position.set(anchorX - sprite.scale.x * bias, anchorY, z)
    }

    function placeRight(sprite: THREE.Sprite, anchorX: number, anchorY: number, z = 0) {
        const bias = sprite.userData.visualLeftBias as number
        sprite.position.set(anchorX - sprite.scale.x * bias, anchorY, z)
    }

    function clearSprites(sprites: THREE.Sprite[]) {
        for (const sprite of sprites) {
            if (sprite.parent) sprite.parent.remove(sprite)
                sprite.material.dispose()
            if (sprite.material.map) sprite.material.map.dispose()
        }
    }

    const platinum = { c1: "#999999", c2: "#e8e8e8", hl: "#ffffff", sp: 1.8 }
    const brightGold = { c1: "#805500", c2: "#ffd700", hl: "#fff8d6", sp: 1.5 }
    const silver = { c1: "#888899", c2: "#d0d0e0", hl: "#ffffff", sp: 1.6 }

    const goldGradient = [
        { pos: 0, color: "#805500" },
        { pos: 0.3, color: "#cc9900" },
        { pos: 0.6, color: "#ffd700" },
        { pos: 1, color: "#fff8d6" },
    ]

    let globalHasEntered = false

    export function OriginalScene({
        peeking = false,
        onEdgesReady,
        onLoaded,
    }: {
        
    })
}