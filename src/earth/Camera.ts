import * as THREE from "three";

import Earth from "./index";

export default class Camera {
  earth;
  sizes;
  scene;
  instance: THREE.PerspectiveCamera;
  constructor() {
    this.earth = new Earth();
    this.sizes = this.earth.sizes
      ? this.earth.sizes
      : { width: window.innerWidth, height: window.innerHeight };

    this.scene = this.earth.scene;

    this.instance = new THREE.PerspectiveCamera(
      50,
      this.sizes.width / this.sizes.height,
      0.1,
      1000
    );
    this.setInstance();
  }
  setInstance() {
    if (!this.instance) return false;
    this.instance.position.set(0, 200, 400);
    this.instance.lookAt(0, 0, 0);
    return true;
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }
}
