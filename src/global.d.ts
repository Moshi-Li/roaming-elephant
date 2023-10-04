declare global {
  interface Window {
    Earth: any;
    SkillPlayground: any;
  }
}

declare module "*.gltf" {
  const src: string;
  export default src;
}
