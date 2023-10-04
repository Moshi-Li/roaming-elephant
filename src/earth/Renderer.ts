import * as THREE from "three";

import Earth from "./index";

export default class Renderer {
  earth;
  sizes;
  scene;
  instance: THREE.WebGLRenderer;

  constructor() {
    this.earth = new Earth();

    this.sizes = this.earth.sizes
      ? this.earth.sizes
      : {
          width: window.innerWidth,
          height: window.innerHeight,
          pixelRatio: window.devicePixelRatio,
        };

    this.scene = this.earth.scene;

    this.instance = new THREE.WebGLRenderer({
      antialias: true,
    });

    this.earth.container?.append(this.instance.domElement);
    this.resize();
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }

  update() {
    if (this.scene && this.earth.camera)
      this.instance.render(this.scene, this.earth.camera?.instance);
  }
}
