import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Earth from "./earth";
import { useScrollBlock } from "./hook/useScrollBlock";

import "./App.scss";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const canvasPointer = useRef<null | HTMLDivElement>(null);

  const introPointer = useRef<null | HTMLDivElement>(null);

  const [canvasControl, setCanvasControl] = useState<null | Earth>(null);

  const [blockScroll, allowScroll] = useScrollBlock();

  useEffect(() => {
    if (
      !canvasPointer.current ||
      !introPointer.current ||
      canvasControl !== null
    )
      return;
    blockScroll();
    const earth = new Earth(canvasPointer.current);
    earth.on("loaded", () => {
      document.addEventListener("mousemove", (e: MouseEvent) => {
        if (e.clientX <= window.innerWidth * 0.1) {
          earth.setKeyMap("KeyA", true);
        } else if (e.clientX >= window.innerWidth * 0.9) {
          earth.setKeyMap("KeyD", true);
        } else {
          earth.setKeyMap("KeyA", false);
          earth.setKeyMap("KeyD", false);
        }
      });

      gsap
        .to(introPointer.current, {
          opacity: "0",
          duration: 2.5,
          ease: "expo.in",
        })
        .then(() => {
          if (introPointer.current) introPointer.current.style.display = "none";
          allowScroll();
        });
    });
    setCanvasControl(earth);
  }, [canvasControl, allowScroll, blockScroll]);

  return (
    <>
      <div
        ref={canvasPointer}
        className="three--container"
        id="scene-container"
      ></div>

      <div ref={introPointer} className="intro"></div>
    </>
  );
}
