import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const PARTICLE_COUNT = 2400;
const WIRE_SHAPES = 7;

function buildParticles() {
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const speeds = new Float32Array(PARTICLE_COUNT);
  const radius = 14;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    const r = radius * Math.cbrt(Math.random());
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
    speeds[i] = 0.3 + Math.random() * 0.7;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color: 0x8cd6ff,
    size: 0.06,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  return { points: new THREE.Points(geo, mat), speeds };
}

function buildWireframes() {
  const group = new THREE.Group();
  const matCyan = new THREE.MeshBasicMaterial({ color: 0x8cd6ff, wireframe: true, transparent: true, opacity: 0.18 });
  const matLime = new THREE.MeshBasicMaterial({ color: 0xd6f57a, wireframe: true, transparent: true, opacity: 0.12 });

  const shapes = [
    { geo: new THREE.BoxGeometry(2.2, 2.2, 2.2, 4, 4, 4), mat: matCyan, pos: [-5, 2, -4], rot: [0.4, 0.3, 0] },
    { geo: new THREE.TorusGeometry(1.6, 0.4, 8, 18), mat: matLime, pos: [5.5, -1.5, -3], rot: [1.2, 0, 0.4] },
    { geo: new THREE.OctahedronGeometry(1.8), mat: matCyan, pos: [2, 3.5, -6], rot: [0.2, 0.6, 0] },
    { geo: new THREE.BoxGeometry(1.4, 2.8, 1.4, 3, 6, 3), mat: matLime, pos: [-3.5, -3, -5], rot: [0.1, 0.2, 0.3] },
    { geo: new THREE.TorusKnotGeometry(0.9, 0.28, 40, 6), mat: matCyan, pos: [0, -2.5, -7], rot: [0, 0.4, 0] },
    { geo: new THREE.IcosahedronGeometry(1.3), mat: matLime, pos: [-7, 0.5, -5], rot: [0.3, 0, 0.5] },
    { geo: new THREE.BoxGeometry(3.5, 0.08, 3.5, 8, 1, 8), mat: matCyan, pos: [0, -4, -4], rot: [0, 0, 0] },
  ];

  const meshes = [];
  shapes.forEach(({ geo, mat, pos, rot }) => {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(...pos);
    mesh.rotation.set(...rot);
    group.add(mesh);
    meshes.push(mesh);
  });
  return { group, meshes };
}

function buildFloatingRings() {
  const group = new THREE.Group();
  const mat = new THREE.MeshBasicMaterial({ color: 0x8cd6ff, wireframe: true, transparent: true, opacity: 0.08 });
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(4 + i * 2.5, 0.03, 6, 80), mat);
    ring.rotation.x = (Math.random() - 0.5) * Math.PI;
    ring.rotation.y = (Math.random() - 0.5) * Math.PI;
    group.add(ring);
  }
  return group;
}

function buildGridPlane() {
  const geo = new THREE.PlaneGeometry(30, 30, 20, 20);
  const mat = new THREE.MeshBasicMaterial({
    color: 0x8cd6ff,
    wireframe: true,
    transparent: true,
    opacity: 0.04,
  });
  const grid = new THREE.Mesh(geo, mat);
  grid.rotation.x = -Math.PI / 2;
  grid.position.y = -5;
  return grid;
}

const WebGLScene = ({ className = '' }) => {
  const mountRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, el.clientWidth / el.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 8);

    const ambientLight = new THREE.AmbientLight(0x8cd6ff, 0.3);
    scene.add(ambientLight);

    const { points } = buildParticles();
    scene.add(points);

    const { group: wireGroup, meshes } = buildWireframes();
    scene.add(wireGroup);

    const rings = buildFloatingRings();
    scene.add(rings);

    const grid = buildGridPlane();
    scene.add(grid);

    const handleMouseMove = (e) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let animId;
    let t = 0;
    const speeds = [0.3, -0.2, 0.15, -0.35, 0.25, -0.18, 0.1];

    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.005;

      meshes.forEach((mesh, i) => {
        const s = speeds[i] ?? 0.2;
        mesh.rotation.x += s * 0.004;
        mesh.rotation.y += s * 0.006;
        mesh.position.y += Math.sin(t + i) * 0.003;
      });

      rings.rotation.y = t * 0.08;
      rings.rotation.x = t * 0.03;

      points.rotation.y = t * 0.02;
      points.rotation.x = t * 0.01;

      const targetX = mouseRef.current.x * 0.6;
      const targetY = mouseRef.current.y * 0.4;
      camera.position.x += (targetX - camera.position.x) * 0.025;
      camera.position.y += (targetY - camera.position.y) * 0.025;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!el) return;
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className={`absolute inset-0 ${className}`} aria-hidden="true" />;
};

export default WebGLScene;
