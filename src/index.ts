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

  await manager.addFromPath("./assets/drill3.glb"); // Dat <====

  viewer.getPlugin(TonemapPlugin)!.config!.clipBackground = true; // in case its set to false in the glb // Dat <====
  viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: false }); // Dat <==== scroll camera to smooth

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

    // FIRST SECTION

    tl.to(position, {
      x: 1.56,
      y: -2.26,
      z: -3.85,
      //   duration: 4,
      scrollTrigger: {
        trigger: ".second",
        start: "top bottom",
        end: "top top",
        // markers: true,
        scrub: true,
        immediateRender: false,
      },
      onUpdate,
    })
      .to(target, {
        x: -1.37,
        y: 1.99,
        z: -0.37,
        scrollTrigger: {
          trigger: ".second",
          start: "top bottom",
          end: "top top",
          scrub: true,
          immediateRender: false,
        },
      })

      // LAST SECTION

      .to(position, {
        x: -3.4,
        y: 9.6,
        z: 1.71,
        scrollTrigger: {
          trigger: ".third",
          start: "top bottom",
          end: "top top",
          scrub: true,
          immediateRender: false,
        },
        onUpdate,
      })
      .to(target, {
        x: -1.5,
        y: 2.13,
        z: -0.4,
        scrollTrigger: {
          trigger: ".third",
          start: "top bottom",
          end: "top top",
          scrub: true,
          immediateRender: false,
        },
      });
  }
  setupScrollanimation();

  // WEBGI UPDATE
  let needsUpdate = true;

  function onUpdate() {
    needsUpdate = true;
    // viewer.renderer.resetShadows()
    viewer.setDirty();
  }

  viewer.addEventListener("preFrame", () => {
    if (needsUpdate) {
      camera.positionTargetUpdated(true);
      needsUpdate = false;
    }
  });
  //   viewer.addEventListener("preFrame", () => {
  //     if (needsUpdate) {
  //       camera.positionUpdated(true);
  //       camera.targetUpdated(true);
  //       needsUpdate = false;
  //     }
  //   });
}

setupViewer();
