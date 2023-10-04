import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { TextureLoader } from "three";
import { EventEmitter } from "events";

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
    path: "/8k_earth_nightmap.jpg",
    type: sourceType.texture,
  },
  {
    name: "animals",
    path: "/low-poly-animals.gltf",
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
