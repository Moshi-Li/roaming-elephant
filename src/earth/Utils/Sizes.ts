import { EventEmitter } from "events";
import Earth from "../index";

export default class Sizes extends EventEmitter {
  earth;
  width;
  height;
  pixelRatio;
  constructor() {
    super();

    // Setup
    this.earth = new Earth();

    this.width = this.earth.container?.clientWidth
      ? this.earth.container?.clientWidth
      : window.innerWidth;
    this.height = this.earth.container?.clientWidth
      ? this.earth.container?.clientHeight
      : window.innerHeight;

    this.pixelRatio = Math.min(window.devicePixelRatio, 2);

    // Resize event
    window.addEventListener("resize", () => {
      this.width = this.earth.container?.clientWidth
        ? this.earth.container?.clientWidth
        : window.innerWidth;
      this.height = this.earth.container?.clientWidth
        ? this.earth.container?.clientHeight
        : window.innerHeight;

      this.pixelRatio = Math.min(window.devicePixelRatio, 2);

      this.emit("resize");
    });
  }
}
