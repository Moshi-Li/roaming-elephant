import * as THREE from "three";
import * as CANNON from "cannon-es";
import Earth from "../index";

import dustVertex from "../Shaders/dustVertex";
import dustFragment from "../Shaders/dustFragment";
import EarthImage from "../../assets/8k_earth_nightmap.jpg";

export default class Planet {
  earth;
  scene;
  instance;
  planetBody: CANNON.Body | undefined;
  dustMesh: THREE.Points | undefined;
  constructor() {
    this.earth = new Earth();
    this.scene = this.earth.scene;

    this.instance = new THREE.Mesh(
      new THREE.SphereGeometry(100, 1000, 1000),
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load(EarthImage),
      })
    );

    this.setPlanet();
    this.setDust();
  }

  setPlanet() {
    this.instance.position.set(0, 0, 0);
    this.scene?.add(this.instance);
  }

  setPlanetPhysics(
    physicsWorld: CANNON.World,
    defaultMaterial: CANNON.Material
  ) {
    const planetShape = new CANNON.Sphere(100 + 25);
    const planetLandShape = new CANNON.Cylinder(7, 5, 3);

    this.planetBody = new CANNON.Body({
      shape: planetShape,
      material: defaultMaterial,
    });

    this.planetBody.addShape(planetLandShape, new CANNON.Vec3(0, -14.3, 0));

    physicsWorld.addBody(this.planetBody);
  }

  setDust() {
    const dustNumber = 500;
    const positionArray = new Float32Array(dustNumber * 3);
    const scaleArray = new Float32Array(dustNumber);

    // set ramdon position for each dust
    for (let i = 0; i < dustNumber; i++) {
      positionArray[i * 3] = (Math.random() - 0.5) * 400;
      positionArray[i * 3 + 1] = (Math.random() - 0.5) * 400;
      positionArray[i * 3 + 2] = (Math.random() - 0.5) * 400;
      scaleArray[i] = Math.random();
    }

    // set dust geometry to buffer geometery
    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positionArray, 3)
    );
    dustGeometry.setAttribute(
      "aScale",
      new THREE.BufferAttribute(scaleArray, 1)
    );

    // set dust material
    const dustMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: 3000 },
        uTime: { value: 0 },
      },
      vertexShader: dustVertex,
      fragmentShader: dustFragment,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.dustMesh = new THREE.Points(dustGeometry, dustMaterial);
    this.scene?.add(this.dustMesh);
  }

  update() {
    return;
  }
}
