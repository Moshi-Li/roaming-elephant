import * as THREE from "three";

import Earth from "../index";

export default class Planet {
  earth;
  scene;
  instance: THREE.Light[];
  constructor() {
    this.earth = new Earth();
    this.scene = this.earth.scene;
    this.instance = [];
    this.setLights();
    this.scene?.add(...this.instance);
  }

  setLights() {
    const dLightI = new THREE.DirectionalLight("#ffffff", 1);
    dLightI.position.set(0, 0, 500);

    const dLightII = new THREE.DirectionalLight("#ffffff", 1);
    dLightII.position.set(0, 500, 0);

    this.instance.push(dLightI);
    this.instance.push(dLightII);
    return false;
  }
}
