"use client"

import * as React from "react"
import * as THREE from "three"
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js"

import { burst, pickWord, prefersReducedMotion } from "@/lib/yan-fx"

/**
 * The hero's WebGL toy box: a pokeable 3D Mochi-chan with candies in orbit
 * and more drifting across the whole hero. Plain three.js, no post-processing.
 *
 * `anchorRef` is an empty box in the page layout; the mochi is sized and
 * positioned to sit inside it, so the 3D follows the responsive grid.
 */
export default function MochiScene({
  anchorRef,
  onPoke,
  onReady,
  onFail,
}: {
  anchorRef: React.RefObject<HTMLElement | null>
  onPoke?: () => void
  onReady?: () => void
  onFail?: () => void
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const cb = React.useRef({ onPoke, onReady, onFail })
  React.useEffect(() => {
    cb.current = { onPoke, onReady, onFail }
  })

  React.useEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    if (!canvas || !host) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" })
    } catch {
      cb.current.onFail?.()
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.toneMapping = THREE.NeutralToneMapping
    renderer.toneMappingExposure = 1.08

    const disposables: { dispose: () => void }[] = []
    const track = <T extends { dispose: () => void }>(x: T) => (disposables.push(x), x)

    const scene = new THREE.Scene()
    const CAM_Z = 14
    const FOV = 32
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 60)
    camera.position.set(0, 0, CAM_Z)

    const pmrem = new THREE.PMREMGenerator(renderer)
    const env = track(pmrem.fromScene(new RoomEnvironment(), 0.035))
    scene.environment = env.texture
    scene.environmentIntensity = 0.85
    pmrem.dispose()

    scene.add(new THREE.HemisphereLight(0xfff0f6, 0xffb9d6, 0.9))
    const key = new THREE.DirectionalLight(0xfff4f8, 1.7)
    key.position.set(-5, 7, 9)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0xc7a6ff, 1.5)
    rim.position.set(6, 2, -5)
    scene.add(rim)

    /* ------------------------------ materials ------------------------------ */

    const palette = {
      pink: 0xff86bb,
      hot: 0xff5c9f,
      lavender: 0xb69bff,
      mint: 0x7fe6c0,
      lemon: 0xffdf66,
      sky: 0x86ccff,
      peach: 0xffae8a,
      cream: 0xfff3f8,
    }
    const ink = 0x43193a

    const candyMat = (color: number, extra: THREE.MeshPhysicalMaterialParameters = {}) =>
      track(
        new THREE.MeshPhysicalMaterial({
          color,
          roughness: 0.2,
          metalness: 0,
          clearcoat: 1,
          clearcoatRoughness: 0.12,
          ...extra,
        })
      )
    const mats = Object.fromEntries(
      Object.entries(palette).map(([k, v]) => [k, candyMat(v)])
    ) as Record<keyof typeof palette, THREE.MeshPhysicalMaterial>
    const pearlMat = candyMat(0xffffff, { roughness: 0.12, iridescence: 1, iridescenceIOR: 1.6 })
    const bubbleMat = candyMat(0xffffff, {
      roughness: 0,
      transparent: true,
      opacity: 0.26,
      iridescence: 1,
      iridescenceIOR: 1.35,
      depthWrite: false,
    })
    const inkMat = candyMat(ink, { roughness: 0.18 })

    /* ------------------------------ geometry ------------------------------- */

    /** Closed polygon → Shape with softened corners. */
    const roundedShape = (pts: [number, number][], r: number) => {
      const s = new THREE.Shape()
      const n = pts.length
      const lerp = (a: [number, number], b: [number, number], t: number): [number, number] => [
        a[0] + (b[0] - a[0]) * t,
        a[1] + (b[1] - a[1]) * t,
      ]
      for (let i = 0; i < n; i++) {
        const prev = pts[(i - 1 + n) % n]
        const cur = pts[i]
        const next = pts[(i + 1) % n]
        const a = lerp(cur, prev, r)
        const b = lerp(cur, next, r)
        if (i === 0) s.moveTo(a[0], a[1])
        else s.lineTo(a[0], a[1])
        s.quadraticCurveTo(cur[0], cur[1], b[0], b[1])
      }
      s.closePath()
      return s
    }
    const starPts = (points: number, outer: number, inner: number) => {
      const out: [number, number][] = []
      for (let i = 0; i < points * 2; i++) {
        const rr = i % 2 ? inner : outer
        const a = (i * Math.PI) / points + Math.PI / 2
        out.push([Math.cos(a) * rr, Math.sin(a) * rr])
      }
      return out
    }
    const puff = (shape: THREE.Shape, depth = 0.16, bevel = 0.17) => {
      const g = new THREE.ExtrudeGeometry(shape, {
        depth,
        bevelEnabled: true,
        bevelThickness: bevel,
        bevelSize: bevel * 0.85,
        bevelSegments: 10,
        curveSegments: 20,
      })
      g.center()
      return track(g)
    }

    const heartShape = new THREE.Shape()
    heartShape.moveTo(0, -0.52)
    heartShape.bezierCurveTo(-0.95, 0.08, -0.52, 0.78, 0, 0.3)
    heartShape.bezierCurveTo(0.52, 0.78, 0.95, 0.08, 0, -0.52)

    const flowerShape = new THREE.Shape()
    for (let i = 0; i <= 120; i++) {
      const a = (i / 120) * Math.PI * 2
      const rr = 0.4 + 0.17 * Math.cos(5 * a)
      const x = Math.cos(a + Math.PI / 2) * rr
      const y = Math.sin(a + Math.PI / 2) * rr
      if (i === 0) flowerShape.moveTo(x, y)
      else flowerShape.lineTo(x, y)
    }

    const geo = {
      heart: puff(heartShape, 0.14, 0.2),
      star: puff(roundedShape(starPts(5, 0.66, 0.31), 0.24), 0.14, 0.13),
      sparkle: puff(roundedShape(starPts(4, 0.76, 0.22), 0.2), 0.1, 0.1),
      flower: puff(flowerShape, 0.1, 0.14),
      donut: track(new THREE.TorusGeometry(0.42, 0.21, 28, 72)),
      ball: track(new THREE.SphereGeometry(0.5, 48, 48)),
      pill: track(new THREE.CapsuleGeometry(0.24, 0.5, 12, 32)),
    }

    /* -------------------------------- mochi -------------------------------- */

    const R = 1.5
    const smooth = (x: number, a: number, b: number) => {
      const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
      return t * t * (3 - 2 * t)
    }
    /** Sphere → daifuku: plump belly, low dome, softly flattened base. */
    const deform = (v: THREE.Vector3) => {
      const t = v.y / R
      const belly = 1 + 0.2 * (1 - smooth(t, -1, 0.55))
      v.x *= belly
      v.z *= belly * 0.95
      v.y *= t > 0 ? 0.86 : 0.7
      if (v.y < -0.66) v.y = -0.66 - 0.16 * Math.tanh((-0.66 - v.y) / 0.16)
      return v
    }
    const BASE_Y = -0.82

    const bodyGeo = track(new THREE.SphereGeometry(R, 128, 96))
    {
      const pos = bodyGeo.attributes.position as THREE.BufferAttribute
      const col = new Float32Array(pos.count * 3)
      const v = new THREE.Vector3()
      const top = new THREE.Color(0xffffff)
      const bottom = new THREE.Color(0xffc4dd)
      const c = new THREE.Color()
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i)
        deform(v)
        pos.setXYZ(i, v.x, v.y, v.z)
        c.copy(bottom).lerp(top, smooth(v.y, -0.9, 0.5))
        col.set([c.r, c.g, c.b], i * 3)
      }
      bodyGeo.setAttribute("color", new THREE.BufferAttribute(col, 3))
      bodyGeo.computeVertexNormals()
    }
    const bodyMat = track(
      new THREE.MeshPhysicalMaterial({
        vertexColors: true,
        roughness: 0.36,
        clearcoat: 0.55,
        clearcoatRoughness: 0.32,
        sheen: 1,
        sheenColor: new THREE.Color(0xff9cc8),
        sheenRoughness: 0.45,
      })
    )

    /** A point on the deformed body from face angles, plus its outward normal. */
    const surface = (az: number, el: number) => {
      const at = (a: number, e: number) =>
        deform(new THREE.Vector3(Math.sin(a) * Math.cos(e), Math.sin(e), Math.cos(a) * Math.cos(e)).multiplyScalar(R))
      const p = at(az, el)
      const n = at(az + 0.01, el).sub(p).cross(at(az, el + 0.01).sub(p)).normalize()
      if (n.dot(p) < 0) n.negate()
      return { p, n }
    }
    const FWD = new THREE.Vector3(0, 0, 1)
    const place = (obj: THREE.Object3D, az: number, el: number, lift = 0) => {
      const { p, n } = surface(az, el)
      obj.position.copy(p).addScaledVector(n, lift)
      obj.quaternion.setFromUnitVectors(FWD, n)
      return obj
    }

    // mochi = [layout position + scale] → squish (pivot at the base) → tilt → body + face
    const mochi = new THREE.Group()
    const squish = new THREE.Group()
    const tilt = new THREE.Group()
    tilt.position.y = -BASE_Y
    const body = new THREE.Mesh(bodyGeo, bodyMat)
    tilt.add(body)
    squish.add(tilt)
    mochi.add(squish)
    scene.add(mochi)

    const face = new THREE.Group()
    tilt.add(face)

    // Soft round sprite for blush + shadow.
    const blobTex = (() => {
      const c = document.createElement("canvas")
      c.width = c.height = 128
      const g = c.getContext("2d")!
      const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64)
      grad.addColorStop(0, "rgba(255,255,255,1)")
      grad.addColorStop(0.55, "rgba(255,255,255,0.55)")
      grad.addColorStop(1, "rgba(255,255,255,0)")
      g.fillStyle = grad
      g.fillRect(0, 0, 128, 128)
      const t = track(new THREE.CanvasTexture(c))
      t.colorSpace = THREE.SRGBColorSpace
      return t
    })()

    const eyeGeo = track(new THREE.SphereGeometry(0.17, 32, 32))
    const glintGeo = track(new THREE.SphereGeometry(1, 16, 16))
    const white = track(new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }))
    const happyGeo = track(
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(-0.17, -0.07, 0.03),
          new THREE.Vector3(-0.09, 0.07, 0.07),
          new THREE.Vector3(0, 0.11, 0.08),
          new THREE.Vector3(0.09, 0.07, 0.07),
          new THREE.Vector3(0.17, -0.07, 0.03),
        ]),
        24,
        0.04,
        10
      )
    )
    const blushGeo = track(new THREE.CircleGeometry(0.34, 32))
    const blushMat = track(
      new THREE.MeshBasicMaterial({
        map: blobTex,
        color: 0xff6fa8,
        transparent: true,
        opacity: 0.62,
        depthWrite: false,
        toneMapped: false,
      })
    )

    const eyes = [-1, 1].map((side) => {
      const g = place(new THREE.Group(), side * 0.31, 0.03, 0.03) as THREE.Group
      const home = g.position.clone()
      const open = new THREE.Group()
      const ball = new THREE.Mesh(eyeGeo, inkMat)
      ball.scale.set(0.92, 1.32, 0.42)
      const glintA = new THREE.Mesh(glintGeo, white)
      glintA.scale.setScalar(0.052)
      glintA.position.set(0.045, 0.09, 0.07)
      const glintB = new THREE.Mesh(glintGeo, white)
      glintB.scale.setScalar(0.024)
      glintB.position.set(-0.05, -0.07, 0.068)
      open.add(ball, glintA, glintB)
      const happy = new THREE.Mesh(happyGeo, inkMat)
      happy.visible = false
      g.add(open, happy)
      face.add(g)

      const blush = place(new THREE.Mesh(blushGeo, blushMat), side * 0.5, -0.17, 0.04)
      blush.scale.set(1.25, 0.78, 1)
      face.add(blush)
      return { g, home, open, happy }
    })

    {
      // ω mouth, traced over the surface.
      const pts = [
        [-0.092, -0.115],
        [-0.07, -0.168],
        [-0.03, -0.185],
        [0, -0.13],
        [0.03, -0.185],
        [0.07, -0.168],
        [0.092, -0.115],
      ].map(([az, el]) => {
        const { p, n } = surface(az, el)
        return p.addScaledVector(n, 0.012)
      })
      const mouth = new THREE.Mesh(
        track(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 48, 0.024, 10)),
        inkMat
      )
      face.add(mouth)
    }

    {
      // Sakura hair clip.
      const clip = place(new THREE.Group(), 0.6, 0.74, 0.07) as THREE.Group
      const petalGeo = track(new THREE.SphereGeometry(1, 24, 24))
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2
        const petal = new THREE.Mesh(petalGeo, mats.pink)
        petal.scale.set(0.125, 0.19, 0.06)
        petal.position.set(Math.sin(a) * 0.17, Math.cos(a) * 0.17, 0)
        petal.rotation.z = -a
        clip.add(petal)
      }
      const center = new THREE.Mesh(petalGeo, mats.lemon)
      center.scale.set(0.075, 0.075, 0.06)
      center.position.z = 0.03
      clip.add(center)
      clip.scale.setScalar(1.35)
      clip.rotateZ(0.3)
      face.add(clip)
    }

    // Blob shadow that always faces the camera.
    const shadow = new THREE.Mesh(
      track(new THREE.PlaneGeometry(1, 1)),
      track(
        new THREE.MeshBasicMaterial({
          map: blobTex,
          color: 0x9a3f78,
          transparent: true,
          opacity: 0.3,
          depthWrite: false,
          toneMapped: false,
        })
      )
    )
    shadow.renderOrder = -1
    scene.add(shadow)

    /* ------------------------------- candies ------------------------------- */

    type Candy = {
      mesh: THREE.Mesh
      spin: THREE.Vector3
      phase: number
      size: number
      /** Flat shapes keep facing the camera and only sway, so they stay readable. */
      flat: boolean
      // orbiters
      orbit?: { rx: number; rz: number; ry: number; y: number; speed: number; a: number }
      // drifters: normalized viewport coordinates + depth
      drift?: { u: number; v: number; z: number }
    }
    const candies: Candy[] = []
    const addCandy = (g: keyof typeof geo, m: THREE.Material, size: number, i: number, rest: Partial<Candy>) => {
      const mesh = new THREE.Mesh(geo[g], m)
      mesh.rotation.set(i * 1.7, i * 2.3, i * 0.9)
      scene.add(mesh)
      // deterministic pseudo-randomness so the composition is art-directed
      const h = (n: number) => {
        const x = Math.sin(i * 127.1 + n * 311.7) * 43758.5453
        return x - Math.floor(x)
      }
      candies.push({
        mesh,
        size,
        flat: g === "heart" || g === "star" || g === "sparkle" || g === "flower",
        phase: h(1) * Math.PI * 2,
        spin: new THREE.Vector3(h(2) - 0.5, h(3) - 0.5, h(4) - 0.5).multiplyScalar(0.9),
        ...rest,
      })
    }

    // A small solar system around the mochi.
    const orbiters: [keyof typeof geo, THREE.Material, number, number, number, number, number][] = [
      // geo, material, size, rx, y, speed, startAngle
      ["heart", mats.hot, 0.62, 2.35, 0.95, 0.42, 0.4],
      ["star", mats.lemon, 0.6, 2.6, -0.25, 0.34, 2.3],
      ["sparkle", mats.sky, 0.5, 2.2, 1.75, 0.5, 4.1],
      ["donut", mats.lavender, 0.6, 2.75, 0.35, 0.3, 5.3],
      ["ball", pearlMat, 0.34, 2.15, -0.6, 0.58, 1.2],
      ["flower", mats.pink, 0.52, 2.5, 1.35, 0.38, 3.2],
      ["ball", bubbleMat, 0.62, 2.9, 1.9, 0.26, 0.0],
    ]
    orbiters.forEach(([g, m, size, rx, y, speed, a], i) =>
      addCandy(g, m, size, i, { orbit: { rx, rz: rx * 0.85, ry: 0.22, y, speed, a } })
    )

    // Drifters fill the rest of the hero; kept toward the edges so copy stays readable.
    const drifters: [keyof typeof geo, THREE.Material, number, number, number, number][] = [
      // geo, material, size, u, v, z
      ["star", mats.lavender, 0.9, -0.47, 0.36, -1],
      ["heart", mats.pink, 0.55, -0.31, 0.43, -4],
      ["donut", mats.mint, 0.85, -0.49, -0.34, 0],
      ["sparkle", mats.lemon, 0.55, -0.2, -0.44, -3],
      ["pill", mats.peach, 0.75, 0.02, 0.45, -2],
      ["ball", bubbleMat, 1.1, 0.05, -0.42, -1],
      ["flower", mats.sky, 0.7, 0.5, 0.42, -3],
      ["pill", mats.mint, 0.6, 0.49, -0.4, 1],
      ["ball", pearlMat, 0.42, -0.42, 0.06, -6],
      ["heart", mats.lavender, 0.5, 0.3, -0.47, -5],
      ["ball", bubbleMat, 0.6, 0.22, 0.4, -2],
      ["sparkle", mats.pink, 0.42, 0.44, 0.02, -7],
    ]
    drifters.forEach(([g, m, size, u, v, z], i) => addCandy(g, m, size, i + 20, { drift: { u, v, z } }))

    /* -------------------------------- layout ------------------------------- */

    let W = 1
    let H = 1
    let unit = 1 // world units per css px at z = 0
    let narrow = false
    const anchorPos = new THREE.Vector3()
    let anchorScale = 1

    const layout = () => {
      const r = host.getBoundingClientRect()
      W = Math.max(1, r.width)
      H = Math.max(1, r.height)
      renderer.setSize(W, H, false)
      camera.aspect = W / H
      camera.updateProjectionMatrix()
      const viewH = 2 * CAM_Z * Math.tan(THREE.MathUtils.degToRad(FOV / 2))
      unit = viewH / H
      narrow = W < 900

      const a = anchorRef.current?.getBoundingClientRect()
      if (a && a.width > 0) {
        const cx = a.left - r.left + a.width / 2
        const cy = a.top - r.top + a.height / 2
        // The mochi is ~3.6 wide; the orbit is allowed to spill a little past the box.
        anchorScale = (Math.min(a.width, a.height * 1.15) * unit) / 5.3
        anchorPos.set((cx - W / 2) * unit, -(cy - H / 2) * unit - 1.02 * anchorScale, 0)
      }
      mochi.position.copy(anchorPos)
      mochi.scale.setScalar(anchorScale)
    }
    layout()
    const ro = new ResizeObserver(layout)
    ro.observe(host)
    if (anchorRef.current) ro.observe(anchorRef.current)

    /* ------------------------------ interaction ---------------------------- */

    const pointer = { x: 0, y: 0, inside: false }
    const look = { x: 0, y: 0 }
    const ray = new THREE.Raycaster()
    const ndc = new THREE.Vector2()
    let hovering = false
    let pressed = false

    const hitMochi = (clientX: number, clientY: number) => {
      const r = canvas.getBoundingClientRect()
      ndc.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1)
      ray.setFromCamera(ndc, camera)
      return ray.intersectObject(body, false).length > 0
    }

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1
      pointer.y = -(((e.clientY - r.top) / r.height) * 2 - 1)
      pointer.inside = e.clientY < r.bottom && e.clientY > r.top
      const hit = e.target === canvas && hitMochi(e.clientX, e.clientY)
      if (hit !== hovering) {
        hovering = hit
        canvas.style.cursor = hit ? "grab" : ""
      }
    }

    // squish spring (deviation of the vertical scale from 1) + a little hop
    const sq = { x: 0, v: 0, target: 0 }
    const hop = { y: 0, v: 0 }
    let happyUntil = 0
    let blinkAt = 2.2
    let blushBoost = 0

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 || !hitMochi(e.clientX, e.clientY)) return
      pressed = true
      sq.target = -0.24
      sq.v -= 2.5
      canvas.style.cursor = "grabbing"
      happyUntil = now() + 1.1
      blushBoost = 1
      burst(
        { x: e.clientX, y: e.clientY },
        { shapes: ["heart", "sparkle", "star"], count: 16, power: 1.05, size: 12, ring: true, word: pickWord() }
      )
      cb.current.onPoke?.()
      if (reduced) renderOnce()
    }
    const onUp = () => {
      if (!pressed) return
      pressed = false
      sq.target = 0
      hop.v += 3.2
      canvas.style.cursor = hovering ? "grab" : ""
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    canvas.addEventListener("pointerdown", onDown)
    window.addEventListener("pointerup", onUp)
    window.addEventListener("pointercancel", onUp)

    /* --------------------------------- loop -------------------------------- */

    const t0 = performance.now()
    const now = () => (performance.now() - t0) / 1000
    let last = 0
    const reduced = prefersReducedMotion()
    let raf = 0
    let visible = true
    let ready = false
    const tmp = new THREE.Vector3()

    const frame = (dt: number, t: number) => {
      // springs
      const stiff = 150
      const damp = 7.5
      sq.v += (stiff * (sq.target - sq.x) - damp * sq.v) * dt
      sq.x += sq.v * dt
      hop.v += (-90 * hop.y - 9 * hop.v) * dt
      hop.y += hop.v * dt

      const breathe = Math.sin(t * 1.9) * 0.018
      const sy = Math.max(0.5, 1 + sq.x + breathe)
      const sxz = 1 / Math.sqrt(sy)
      squish.scale.set(sxz, sy, sxz)
      const bob = Math.sin(t * 1.1) * 0.09
      mochi.position.set(anchorPos.x, anchorPos.y + (bob + Math.max(-0.2, hop.y)) * anchorScale, 0)

      // lean + look toward the pointer
      const tx = pointer.inside ? pointer.x : 0
      const ty = pointer.inside ? pointer.y : 0
      const mx = (mochi.position.x / (W * unit)) * 2
      const my = (mochi.position.y / (H * unit)) * 2
      look.x += (THREE.MathUtils.clamp(tx - mx, -1, 1) - look.x) * Math.min(1, dt * 5)
      look.y += (THREE.MathUtils.clamp(ty - my, -1, 1) - look.y) * Math.min(1, dt * 5)
      tilt.rotation.y = look.x * 0.38 + Math.sin(t * 0.7) * 0.04
      tilt.rotation.x = -look.y * 0.22
      tilt.rotation.z = -look.x * 0.06 + Math.sin(t * 0.9) * 0.02

      // eyes: follow, blink, smile when poked
      const isHappy = t < happyUntil
      let lid = 1
      if (t > blinkAt) {
        const k = (t - blinkAt) / 0.16
        lid = k < 1 ? Math.abs(1 - 2 * k) : 1
        if (k >= 1) blinkAt = t + 2.4 + ((Math.sin(t * 12.9898) * 43758.5453) % 1) * 2.2 + 1
      }
      for (const eye of eyes) {
        eye.open.visible = !isHappy
        eye.happy.visible = isHappy
        eye.open.scale.y = Math.max(0.08, lid)
        eye.g.position.set(eye.home.x + look.x * 0.07, eye.home.y + look.y * 0.045, eye.home.z)
      }
      blushBoost = Math.max(0, blushBoost - dt * 0.9)
      blushMat.opacity = 0.6 + blushBoost * 0.38

      // shadow hugs the base and thins out when the mochi hops
      const lift = bob + Math.max(0, hop.y)
      shadow.position.set(anchorPos.x, anchorPos.y - 0.2 * anchorScale, -0.6)
      shadow.scale.set(4.9 * anchorScale * sxz * (1 - lift * 0.5), 0.78 * anchorScale * (1 - lift * 0.8), 1)

      // candies
      const scroll = window.scrollY
      for (const c of candies) {
        if (c.flat) {
          c.mesh.rotation.set(
            Math.sin(t * 0.8 + c.phase) * 0.3,
            Math.sin(t * 0.6 + c.phase * 2) * 0.65,
            Math.sin(t * 0.5 + c.phase * 3) * 0.35
          )
        } else {
          c.mesh.rotation.x += c.spin.x * dt
          c.mesh.rotation.y += c.spin.y * dt
          c.mesh.rotation.z += c.spin.z * dt * 0.5
        }
        if (c.orbit) {
          const o = c.orbit
          const a = o.a + t * o.speed
          tmp.set(Math.cos(a) * o.rx, o.y + Math.sin(a * 2 + c.phase) * o.ry, Math.sin(a) * o.rz)
          c.mesh.position.copy(anchorPos).addScaledVector(tmp, anchorScale)
          c.mesh.position.y += 1.05 * anchorScale
          c.mesh.scale.setScalar(c.size * anchorScale * (1 + Math.sin(t * 2 + c.phase) * 0.04))
        } else if (c.drift) {
          const d = c.drift
          const depth = (CAM_Z - d.z) / CAM_Z
          const vw = W * unit * depth
          const vh = H * unit * depth
          const near = (d.z + 8) / 9 // 0 far … 1 near
          c.mesh.position.set(
            d.u * vw + Math.sin(t * 0.5 + c.phase) * 0.18 - look.x * near * 0.35,
            d.v * vh + Math.cos(t * 0.6 + c.phase) * 0.22 - look.y * near * 0.25 + scroll * unit * near * 0.5,
            d.z
          )
          c.mesh.scale.setScalar(c.size * (narrow ? 0.72 : 1))
        }
      }
    }

    const renderOnce = () => {
      frame(1 / 60, now())
      renderer.render(scene, camera)
      if (!ready) {
        ready = true
        cb.current.onReady?.()
      }
    }

    const loop = () => {
      raf = requestAnimationFrame(loop)
      const t = now()
      const dt = Math.min(t - last, 1 / 30)
      last = t
      frame(dt, t)
      renderer.render(scene, camera)
      if (!ready) {
        ready = true
        cb.current.onReady?.()
      }
    }
    const start = () => {
      if (raf || reduced || !visible || document.hidden) return
      last = now()
      raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
      else stop()
    })
    io.observe(canvas)
    const onVis = () => (document.hidden ? stop() : start())
    document.addEventListener("visibilitychange", onVis)

    if (reduced) {
      // A still life: settle the springs, draw once, redraw on resize.
      for (let i = 0; i < 30; i++) frame(1 / 60, 1)
      renderOnce()
      ro.observe(document.documentElement)
    } else start()

    const onResizeStill = () => reduced && renderOnce()
    window.addEventListener("resize", onResizeStill)

    return () => {
      stop()
      io.disconnect()
      ro.disconnect()
      document.removeEventListener("visibilitychange", onVis)
      window.removeEventListener("resize", onResizeStill)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
      window.removeEventListener("pointercancel", onUp)
      canvas.removeEventListener("pointerdown", onDown)
      disposables.forEach((d) => d.dispose())
      renderer.dispose()
    }
  }, [anchorRef])

  return <canvas ref={canvasRef} className="absolute inset-0 size-full touch-pan-y" aria-hidden="true" />
}
