import { useEffect, useRef } from 'react'
import { createPluginUI } from 'molstar/lib/mol-plugin-ui'
import { DefaultPluginUISpec } from 'molstar/lib/mol-plugin-ui/spec'
import { renderReact18 } from 'molstar/lib/mol-plugin-ui/react18'
import { PluginConfig } from 'molstar/lib/mol-plugin/config'
import { PluginCommands } from 'molstar/lib/mol-plugin/commands'
import { MolScriptBuilder as MS } from 'molstar/lib/mol-script/language/builder'
import { Color } from 'molstar/lib/mol-util/color'
import { Asset } from 'molstar/lib/mol-util/assets'
import { PluginUIContext } from 'molstar/lib/mol-plugin-ui/context'
import 'molstar/lib/mol-plugin-ui/skin/light.scss'

// Chain A (NiV-G glycoprotein target) — orange
const CHAIN_A_COLOR = Color(0x9fe3a2)
const CHAIN_A_COLOR_SURFACE = Color(0xe6f5e7)

// Chain B (designed nanobody) — same purple as landing page
const CHAIN_B_COLOR = Color(0xa3a2fc)
const CHAIN_B_COLOR_SURFACE = Color(0xf2f5ff)

const chainSelection = (chainId: string) =>
  MS.struct.generator.atomGroups({
    'chain-test': MS.core.rel.eq([MS.struct.atomProperty.macromolecular.auth_asym_id(), chainId]),
  })

const molstarStyles = `
.molstar-complex-viewer .msp-plugin {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  outline: none !important;
  border: none !important;
  box-shadow: none !important;
}
.molstar-complex-viewer .msp-canvas-container {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  outline: none !important;
  border: none !important;
}
.molstar-complex-viewer .msp-canvas {
  outline: none !important;
  border: none !important;
}
.molstar-complex-viewer canvas {
  outline: none !important;
  border: none !important;
}
.molstar-complex-viewer .msp-plugin *:focus {
  outline: none !important;
}
.molstar-complex-viewer .msp-layout-standard {
  border: none !important;
  outline: none !important;
}
.molstar-complex-viewer .msp-viewport {
  border: none !important;
  outline: none !important;
}
/* Hide only the log and 3D axis overlay — everything else is interactive */
.molstar-complex-viewer .msp-log,
.molstar-complex-viewer .msp-layout-bottom,
.molstar-complex-viewer .msp-viewport-axis {
  display: none !important;
}
`

export default function MolstarViewerComplex() {
  const containerRef = useRef<HTMLDivElement>(null)
  const pluginRef = useRef<PluginUIContext | null>(null)

  useEffect(() => {
    let disposed = false

    const init = async () => {
      if (!containerRef.current || disposed) return

      const spec = DefaultPluginUISpec()
      spec.config = [
        ...(spec.config ?? []),
        [PluginConfig.General.ResolutionMode, 'native'],
        [PluginConfig.Viewport.ShowExpand, false],
        [PluginConfig.Viewport.ShowControls, true],
        [PluginConfig.Viewport.ShowSettings, false],
        [PluginConfig.Viewport.ShowSelectionMode, true],
        [PluginConfig.Viewport.ShowAnimation, false],
        [PluginConfig.Viewport.ShowTrajectoryControls, false],
      ]
      spec.layout = {
        initial: {
          isExpanded: false,
          showControls: true,
        },
      }
      spec.components = {
        remoteState: 'none',
      }

      if (pluginRef.current) {
        pluginRef.current.dispose()
        pluginRef.current = null
      }
      containerRef.current.innerHTML = ''

      const plugin = await createPluginUI({
        target: containerRef.current,
        render: renderReact18,
        spec,
      })
      pluginRef.current = plugin

      plugin.canvas3dContext?.setProps({ resolutionMode: 'native', pixelScale: 1 })

      // Sequence panel open at top, structure tree collapsed on the left, bottom hidden
      await PluginCommands.Layout.Update(plugin, {
        state: {
          regionState: {
            top: 'full',
            left: 'collapsed',
            right: 'hidden',
            bottom: 'hidden',
          },
        },
      })

      requestAnimationFrame(() => {
        requestAnimationFrame(() => plugin.handleResize?.())
      })

      if (plugin.canvas3d) {
        const { postprocessing, renderer, trackball } = plugin.canvas3d.props
        plugin.canvas3d.setProps({
          camera: {
            ...plugin.canvas3d.props.camera,
            helper: { ...plugin.canvas3d.props.camera.helper, axes: false },
          },
        })
        plugin.canvas3d.setProps({
          postprocessing: {
            ...postprocessing,
            occlusion: { name: 'off', params: {} },
            shadow: { name: 'off', params: {} },
            dof: { name: 'off', params: {} },
            antialiasing: postprocessing.antialiasing,
            outline: {
              name: 'on',
              params: {
                scale: 0.05,
                threshold: 0.33,
                color: Color(0x000000),
                includeTransparent: true,
              },
            },
            bloom: { name: 'off', params: {} },
            sharpening: { name: 'off', params: {} },
          },
          renderer: {
            ...renderer,
            backgroundColor: Color(0xffffff),
            colorMarker: true,
            highlightStrength: 0.5,
            selectStrength: 0.8,
            dimStrength: 0,
          },
        })

        // Static — no rotation
        PluginCommands.Canvas3D.SetSettings(plugin, {
          settings: {
            trackball: {
              ...trackball,
              animate: { name: 'off', params: {} },
            },
          },
        })
      }

      await plugin.clear()

      const data = await plugin.builders.data.download(
        { url: Asset.Url('/nipah_binder.cif'), isBinary: false },
        { state: { isGhost: true } },
      )
      const trajectory = await plugin.builders.structure.parseTrajectory(data, 'mmcif')
      const model = await plugin.builders.structure.createModel(trajectory)
      const structure = await plugin.builders.structure.createStructure(model)

      // Chain A — NiV-G glycoprotein target (warm tan)
      const chainA = await plugin.builders.structure.tryCreateComponentFromExpression(
        structure,
        chainSelection('A'),
        'chain-a',
        { label: 'Chain A' },
      )
      if (chainA) {
        await plugin.builders.structure.representation.addRepresentation(chainA, {
          type: 'gaussian-surface',
          color: 'illustrative',
          colorParams: {
            style: {
              name: 'uniform',
              params: { value: CHAIN_A_COLOR_SURFACE, saturation: 0, lightness: 0 },
            },
            carbonLightness: 0,
          },
          typeParams: { alpha: 0.3, celShaded: false },
        })
        await plugin.builders.structure.representation.addRepresentation(chainA, {
          type: 'cartoon',
          color: 'illustrative',
          colorParams: {
            style: {
              name: 'uniform',
              params: { value: CHAIN_A_COLOR, saturation: 0, lightness: 0 },
            },
            carbonLightness: 0,
          },
        })
      }

      // Chain B — designed nanobody (purple, same as landing page)
      const chainB = await plugin.builders.structure.tryCreateComponentFromExpression(
        structure,
        chainSelection('B'),
        'chain-b',
        { label: 'Chain B' },
      )
      if (chainB) {
        await plugin.builders.structure.representation.addRepresentation(chainB, {
          type: 'gaussian-surface',
          color: 'illustrative',
          colorParams: {
            style: {
              name: 'uniform',
              params: { value: CHAIN_B_COLOR_SURFACE, saturation: 0, lightness: 0 },
            },
            carbonLightness: 0,
          },
          typeParams: { alpha: 0.3, celShaded: false },
        })
        await plugin.builders.structure.representation.addRepresentation(chainB, {
          type: 'cartoon',
          color: 'illustrative',
          colorParams: {
            style: {
              name: 'uniform',
              params: { value: CHAIN_B_COLOR, saturation: 0, lightness: 0 },
            },
            carbonLightness: 0,
          },
        })
      }
    }

    init()

    return () => {
      disposed = true
      pluginRef.current?.dispose()
      pluginRef.current = null
      if (containerRef.current) containerRef.current.innerHTML = ''
    }
  }, [])

  return (
    <div className="molstar-complex-viewer relative h-full w-full">
      <style dangerouslySetInnerHTML={{ __html: molstarStyles }} />
      <div ref={containerRef} className="absolute inset-0" />
    </div>
  )
}
