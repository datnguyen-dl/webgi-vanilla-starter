import {
  ViewerApp,
  AssetManagerPlugin,
  GBufferPlugin,
  // timeout, // Dat <====
  ProgressivePlugin,
  TonemapPlugin,
  SSRPlugin,
  SSAOPlugin,
  // DiamondPlugin, // Dat <====
  // FrameFadePlugin, // Dat <====
  // GLTFAnimationPlugin, // Dat <====
  // GroundPlugin, // Dat <====
  BloomPlugin,
  // TemporalAAPlugin, // Dat <====
  // AnisotropyPlugin, // Dat <====
  // GammaCorrectionPlugin, // Dat <====

  // addBasePlugins, // Dat <====
  // ITexture,  // Dat <====
  // TweakpaneUiPlugin,  // Dat <====
  // AssetManagerBasicPopupPlugin,  // Dat <====
  // CanvasSnipperPlugin, // Dat <====

  // IViewerPlugin, // Dat <====

  // Color, // Import THREE.js internals
  // Texture, // Import THREE.js internals
} from "webgi";
import "./styles.css";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

async function setupViewer() {
  // Initialize the viewer
  const viewer = new ViewerApp({
    canvas: document.getElementById("webgi-canvas") as HTMLCanvasElement,
    useRgbm: false, // Dat <====
  });

  // Add some plugins
  const manager = await viewer.addPlugin(AssetManagerPlugin);
  const camera = viewer.scene.activeCamera; // Dat <====
  const position = camera.position;
  const target = camera.target;
  console.log("camera: ", camera);
  console.log("position: ", position);
  console.log("target: ", target);

  // Add a popup(in HTML) with download progress when any asset is downloading.
  // await viewer.addPlugin(AssetManagerBasicPopupPlugin)  // Dat <====

  // Add plugins individually.
  await viewer.addPlugin(GBufferPlugin); // Dat <====
  await viewer.addPlugin(new ProgressivePlugin(32)); // Dat <====
  await viewer.addPlugin(new TonemapPlugin(!viewer.useRgbm)); // Dat <====
  // await viewer.addPlugin(GammaCorrectionPlugin)
  await viewer.addPlugin(SSRPlugin); // Dat <====
  await viewer.addPlugin(SSAOPlugin); // Dat <====
  // await viewer.addPlugin(DiamondPlugin)
  // await viewer.addPlugin(FrameFadePlugin)
  // await viewer.addPlugin(GLTFAnimationPlugin)
  // await viewer.addPlugin(GroundPlugin)
  await viewer.addPlugin(BloomPlugin); // Dat <====
  // await viewer.addPlugin(TemporalAAPlugin)
  // await viewer.addPlugin(AnisotropyPlugin)

  // or use this to add all main ones at once.
  // await addBasePlugins(viewer) // Dat <====

  // Add more plugins not available in base, like CanvasSnipperPlugin which has helpers to download an image of the canvas.
  // await viewer.addPlugin(CanvasSnipperPlugin)  // Dat <====

  // This must be called once after all plugins are added.
  viewer.renderer.refreshPipeline();

  await manager.addFromPath("./assets/Drill2k.glb"); // Dat <====

  // Load an environment map if not set in the glb file
  // await viewer.scene.setEnvironment(
  //     await manager.importer!.importSinglePath<ITexture>(
  //         "./assets/environment.hdr"
  //     )
  // );

  // Add some UI for tweak and testing.
  // const uiPlugin = await viewer.addPlugin(TweakpaneUiPlugin)  // Dat <====
  // Add plugins to the UI to see their settings.
  // uiPlugin.setupPlugins<IViewerPlugin>(TonemapPlugin, CanvasSnipperPlugin)  // Dat <====

  // Dat <====
  function setupScrollanimation() {
    const tl = gsap.timeline();
    console.log("tl: ", tl);
    // frist section

    tl.to(position, {
      x: 2.7,
      y: -2.9,
      z: -4.4,
      //   duration: 4,
      scrollTrigger: {
        trigger: ".second",
        start: "top bottom",
        end: "top top",
        // markers: true,
        scrub: true,
        immediateRender: false
      },
      onUpdate,
    })
      .to(target, {
        x: -0.8,
        y: 0.7,
        z: -0.6,
        scrollTrigger: {
          trigger: ".second",
          start: "top bottom",
          end: "top top",
          scrub: true,
          immediateRender: false
        },
      })
      // Last section =======
      .to(position, {
        x: -2.7,
        y: -0.3,
        z: 2,
        scrollTrigger: {
          trigger: ".third",
          start: "top bottom",
          end: "top top",
          scrub: true,
          immediateRender: false
        },
        onUpdate,
      })
      .to(target, {
        x: -1,
        y: 0.9,
        z: -0.1,
        scrollTrigger: {
          trigger: ".third",
          start: "top bottom",
          end: "top top",
          scrub: true,
          immediateRender: false
        },
      });
  }
  setupScrollanimation();

  //   WEBGI UPDATE
  let needsUpdate = true;

  function onUpdate() {
    needsUpdate = true;
    viewer.renderer.resetShadows();
  }

  viewer.addEventListener("preFrame", () => {
    if (needsUpdate) {
      camera.positionUpdated(true);
      camera.targetUpdated(true);
      needsUpdate = false;
    }
  });
}

setupViewer();
