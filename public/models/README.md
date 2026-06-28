# 3D Asset Pipeline — `/public/models/`

Drop GLTF/GLB exports here to swap any procedural scene with a real model.

## Naming Convention

| File | Used by |
|---|---|
| `hero-orb.glb` | `SceneCanvas` → replace the procedural `GoldOrb` |
| `wireframe-abstract.glb` | `WireframeMesh` → replace procedural icosahedron/dodecahedron |
| `tunnel-loop.glb` | `ScrollCamera3D` → replace procedural torus rings |
| `floating-panel.glb` | `SceneCanvas` → replace procedural `FloatingPanel` |

## Switching to a GLTF Model

Each 3D component accepts an optional `modelUrl` prop:

```jsx
// Zero code changes — just pass the path
<WireframeMesh modelUrl="/models/wireframe-abstract.glb" />
<ScrollCamera3D modelUrl="/models/tunnel-loop.glb" />
```

When `modelUrl` is **not** provided the component renders its procedural fallback, so dropping a file here is truly zero-friction.

## Export Settings (Blender / Spline)

- **Format**: GLTF 2.0 binary (`.glb`) — keeps textures embedded, single file
- **Scale**: 1 unit = 1 metre (Blender default)
- **Origin**: centred at scene origin `(0, 0, 0)` for easy positioning via R3F `position` prop
- **Animations**: embed as GLTF clip, accessed via `useAnimations` from `@react-three/drei`
- **Materials**: for emissive glow set `emissive` colour + `emissiveIntensity` > 0; avoid heavy PBR textures in hero scenes
- **Poly count**: aim for < 30k triangles per hero asset for smooth 60fps on mid-range laptops

## Spline Export

1. File → Export → Code Export → **React Three Fiber**
2. Copy the `.splinecode` URL or download as `.glb` and place here
3. In the component: `<SplineScene scene={SplineUrl} />`

## Notes

- Files are served as static assets via Vite/Vercel — no server processing needed
- Compress `.glb` files with [`gltf-transform`](https://gltf-transform.dev/): `gltf-transform optimize model.glb model.glb`
- Test with Chrome DevTools > Performance tab to verify < 16ms frame time
