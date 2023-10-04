import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import Earth from "../index";
import ElephantModel from "../../assets/low-poly-animals.gltf";

export default class Airplane {
  earth;
  scene;
  instance;
  target: THREE.Object3D | undefined;
  camPosition;
  camPositionLookAt;

  rotateFlag: undefined | boolean;
  constructor() {
    this.earth = new Earth();
    this.scene = this.earth.scene;

    const geometry = new THREE.BoxGeometry(3, 4, 3);
    const material = new THREE.MeshBasicMaterial({
      wireframe: false,
      transparent: true,
      opacity: 0,
    });

    this.instance = new THREE.Mesh(geometry, material);
    this.loadModel();

    this.camPosition = new THREE.Mesh();
    this.camPositionLookAt = new THREE.Mesh();

    this.instance.add(this.camPosition, this.camPositionLookAt);
    this.setCameraPosition();

    this.scene?.add(this.instance);
  }

  setCameraPosition() {
    // set up following invisible cubes positions
    this.camPosition.position.set(
      0,
      this.instance.position.y + 30,
      this.instance.position.z - 30
    );
    this.camPositionLookAt.position.set(
      this.instance.position.x,
      this.instance.position.y + 2.5,
      this.instance.position.z
    );
  }

  loadModel() {
    const loader = new GLTFLoader();
    loader.load(ElephantModel, (gltf: GLTF) => {
      this.target = gltf.scene.children[2];

      this.target.position.set(0, 0, 0);
      this.target.scale.set(0.1, 0.11, 0.1);

      this.instance.add(this.target);
    });
  }

  setRotateFlag(flag: boolean | undefined) {
    this.rotateFlag = flag;
  }

  update() {
    if (this.target) {
      if (this.rotateFlag === true) {
        this.target.rotation.z += Math.PI * -0.01;
      } else if (this.rotateFlag === false) {
        this.target.rotation.z += Math.PI * 0.01;
      } else {
        this.target.rotation.x += Math.PI * 0.01;
      }
    }
    return;
  }
}
