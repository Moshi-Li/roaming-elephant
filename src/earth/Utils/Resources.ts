import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { TextureLoader } from "three";
import { EventEmitter } from "events";
import EarthImage from "../../assets/8k_earth_nightmap.jpg";
import ElephantModel from "../../assets/low-poly-animals.gltf";

enum sourceType {
  gltfModel,
  texture,
}

export interface ResourceMetaI {
  path: string;
  name: string;
  type: sourceType;
}

const ResourceMeta: ResourceMetaI[] = [
  {
    name: "globeTexture",
    path: EarthImage,
    type: sourceType.texture,
  },
  {
    name: "animals",
    path: ElephantModel,
    type: sourceType.gltfModel,
  },
];

export default class Resources extends EventEmitter {
  count;
  constructor() {
    super();
    this.count = 0;

    const textureLoader = new TextureLoader();
    textureLoader
      .loadAsync(ResourceMeta[0].path)
      .then(() => this.resourceLoaded());

    const modelLoader = new GLTFLoader();
    modelLoader
      .loadAsync(ResourceMeta[1].path)
      .then(() => this.resourceLoaded());
    return;
  }

  resourceLoaded() {
    this.count = this.count + 1;
    if (this.count === ResourceMeta.length) {
      this.emit("loaded");
    }
  }
}
