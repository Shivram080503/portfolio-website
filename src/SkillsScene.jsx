import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function SkillsScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0.3, 6);

    let targetRotationX = 0.25;
    let targetRotationY = 0.35;
    let pointerActive = false;

    const ambient = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambient);

    const point = new THREE.PointLight(0x58d2c1, 2.2, 30);
    point.position.set(3, 3, 4);
    scene.add(point);

    const key = new THREE.PointLight(0xf2b84b, 1.9, 25);
    key.position.set(-4, -2, 2);
    scene.add(key);

    const group = new THREE.Group();
    scene.add(group);

    const core = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1, 0.28, 170, 26),
      new THREE.MeshStandardMaterial({
        color: 0xf2b84b,
        metalness: 0.5,
        roughness: 0.28,
        emissive: 0x2f1c00,
        emissiveIntensity: 0.35
      })
    );
    group.add(core);

    const skills = [0xf07a5d, 0x58d2c1, 0x80d45f, 0xf2b84b, 0x5ea7ff, 0xd0d8de];
    const ringRadius = 2.3;
    skills.forEach((color, index) => {
      const angle = (index / skills.length) * Math.PI * 2;
      const orb = new THREE.Mesh(
        new THREE.SphereGeometry(0.19, 24, 24),
        new THREE.MeshStandardMaterial({ color, metalness: 0.3, roughness: 0.32 })
      );
      orb.position.set(
        Math.cos(angle) * ringRadius,
        Math.sin(angle * 1.1) * 0.7,
        Math.sin(angle) * ringRadius
      );
      group.add(orb);
    });

    const starGeometry = new THREE.BufferGeometry();
    const count = 650;
    const points = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      points[index * 3] = (Math.random() - 0.5) * 18;
      points[index * 3 + 1] = (Math.random() - 0.5) * 18;
      points[index * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    starGeometry.setAttribute("position", new THREE.BufferAttribute(points, 3));

    const starField = new THREE.Points(
      starGeometry,
      new THREE.PointsMaterial({ color: 0xffffff, size: 0.025, transparent: true, opacity: 0.75 })
    );
    scene.add(starField);

    function resize() {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    }

    function onPointerMove(event) {
      const rect = canvas.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      targetRotationY = x * 0.85;
      targetRotationX = y * 0.45;
      pointerActive = true;
    }

    function onPointerLeave() {
      pointerActive = false;
    }

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);

    let frame = 0;
    let time = 0;
    function animate() {
      time += 0.01;
      core.rotation.x += 0.005;
      core.rotation.y += 0.007;
      group.rotation.x += (targetRotationX - group.rotation.x) * 0.04;
      group.rotation.y += ((pointerActive ? targetRotationY : group.rotation.y + 0.003) - group.rotation.y) * 0.04;
      group.position.y = Math.sin(time) * 0.12;
      starField.rotation.y -= 0.0009;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      starGeometry.dispose();
      renderer.dispose();
      scene.traverse((child) => {
        if (child.isMesh) {
          child.geometry.dispose();
          child.material.dispose();
        }
      });
    };
  }, []);

  return <canvas ref={canvasRef} id="skillsCanvas" aria-label="3D skill visualization" />;
}
