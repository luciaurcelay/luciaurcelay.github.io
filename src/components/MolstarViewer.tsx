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

const CHAIN_B_COLOR = Color(0xa3a2fc)
const CHAIN_B_COLOR_SURFACE = Color(0xf2f5ff)

const chainSelection = (chainId: string) =>
  MS.struct.generator.atomGroups({
    'chain-test': MS.core.rel.eq([MS.struct.atomProperty.macromolecular.auth_asym_id(), chainId]),
  })

const molstarStyles = `
.molstar-viewer .msp-plugin {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  outline: none !important;
  border: none !important;
  box-shadow: none !important;
}
.molstar-viewer .msp-canvas-container {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  outline: none !important;
  border: none !important;
}
.molstar-viewer .msp-canvas {
  width: 100% !important;
  height: 100% !important;
  outline: none !important;
  border: none !important;
}
.molstar-viewer canvas {
  outline: none !important;
  border: none !important;
  pointer-events: none !important;
}
.molstar-viewer .msp-plugin *:focus {
  outline: none !important;
}
.molstar-viewer .msp-layout-standard {
  border: none !important;
  outline: none !important;
}
.molstar-viewer .msp-viewport {
  border: none !important;
  outline: none !important;
}

.molstar-viewer .msp-log,
.molstar-viewer .msp-layout-left,
.molstar-viewer .msp-layout-right,
.molstar-viewer .msp-layout-top,
.molstar-viewer .msp-layout-bottom,
.molstar-viewer .msp-viewport-axis,
.molstar-viewer .msp-viewport-top-left,
.molstar-viewer .msp-viewport-top-right,
.molstar-viewer .msp-viewport-bottom-left,
.molstar-viewer .msp-viewport-bottom-right {
  display: none !important;
}
.molstar-viewer .msp-viewport-controls,
.molstar-viewer .msp-viewport-controls-buttons,
.molstar-viewer .msp-button,
.molstar-viewer .msp-control-group {
  display: none !important;
}
`

export default function MolstarViewer() {
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
      ]
      spec.layout = {
        initial: {
          isExpanded: false,
          showControls: false,
        },
      }
      spec.components = {
        controls: { left: 'none', right: 'none', top: 'none', bottom: 'none' },
        remoteState: 'none',
      }
      spec.config = [
        [PluginConfig.Viewport.ShowExpand, false],
        [PluginConfig.Viewport.ShowControls, false],
        [PluginConfig.Viewport.ShowSettings, false],
        [PluginConfig.Viewport.ShowSelectionMode, false],
        [PluginConfig.Viewport.ShowAnimation, false],
        [PluginConfig.Viewport.ShowTrajectoryControls, false],
      ]

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

      if (plugin.canvas3d) {
        const { postprocessing, renderer, trackball } = plugin.canvas3d.props
        plugin.canvas3d.setProps({
          camera: {
            ...plugin.canvas3d.props.camera,
            helper: {
              ...plugin.canvas3d.props.camera.helper,
              axes: false,
            },
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
            colorMarker: false,
            highlightStrength: 0,
            selectStrength: 0,
            dimStrength: 0,
          },
        })

        PluginCommands.Canvas3D.SetSettings(plugin, {
          settings: {
            trackball: {
              ...trackball,
              animate: { name: 'spin', params: { speed: 0.1 } },
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

      /*
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
              params: { value: CHAIN_A_COLOR, saturation: 0, lightness: 0 },
            },
            carbonLightness: 0,
          },
          typeParams: {
            alpha: 1,
            celShaded: false,
          },
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
      */

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
          typeParams: {
            alpha: 0.3,
            celShaded: false,
          },
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
    <div className="molstar-viewer relative h-full w-full">
      <style dangerouslySetInnerHTML={{ __html: molstarStyles }} />
      <div ref={containerRef} className="absolute inset-0" />
    </div>
  )
}
