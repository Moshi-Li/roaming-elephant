import * as THREE from "three";
import { EventEmitter } from "events";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";
import Resources from "./Utils/Resources";
import Camera from "./Camera";
import Renderer from "./Renderer";

import ModelComponents from "./Components";

declare const window: Window &
  typeof globalThis & {
    Earth: Earth;
  };

export default class Earth extends EventEmitter {
  container;
  scene;
  sizes;
  time;
  resources;
  camera;
  renderer;
  controls;
  components: any;

  constructor(container?: HTMLDivElement) {
    super();
    if (!window.Earth && container === undefined)
      throw new Error("No container");
    if (window.Earth) return window.Earth;
    window.Earth = this;

    this.container = container;

    this.resources = new Resources();
    this.sizes = new Sizes();
    this.time = new Time();

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x040d21);
    this.scene.fog = new THREE.Fog(0x333, 50, 500);

    this.camera = new Camera();

    this.renderer = new Renderer();

    this.controls = new OrbitControls(
      this.camera.instance,
      this.renderer.instance.domElement
    );

    this.controls.enabled = false;

    this.resources.on("loaded", () => {
      this.components = new ModelComponents();
      this.emit("loaded");
    });

    this.sizes.on("resize", () => {
      this.resize();
    });

    this.time.on("tick", () => {
      this.update();
    });
  }

  resize() {
    this.camera?.resize();
    this.renderer?.resize();
  }

  update() {
    this.renderer?.update();
    this.controls?.update();
    this.components?.update();
    //this.debugger.update();
  }

  setKeyMap(key: string, value: boolean) {
    this.components!.keyMap[key] = value;
  }
}
