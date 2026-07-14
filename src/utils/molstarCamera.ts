import { PluginUIContext } from 'molstar/lib/mol-plugin-ui/context'

// Padding around the structure's bounding sphere. The sphere circumscribes the structure and
// is rotation-invariant, so fitting it is already clip-proof at any orientation; this is just a
// small margin on top. Raise it to pull the camera back, lower it to fill more of the canvas.
export const CAMERA_PADDING = 1.1

/** Frame the camera on the loaded structure so it cannot clip against the canvas edges. */
export const fitCamera = (plugin: PluginUIContext, padding = CAMERA_PADDING) => {
  plugin.canvas3d?.requestCameraReset({
    durationMs: 0,
    snapshot: (scene, camera) =>
      camera.getFocus(
        scene.boundingSphereVisible.center,
        scene.boundingSphereVisible.radius * padding,
      ),
  })
}
