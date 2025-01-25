import OlMap from 'ol/Map.js'
import { defaults as defaultControls } from 'ol/control'
import { defaults as defaultInteractions } from 'ol/interaction'
import Collection from 'ol/Collection'
import { image2world } from '@dataforsyningen/saul'
import { configuration } from '../../modules/configuration.js'
import {
  updateViewport,
  updateMapView,
  updateMapImage,
  updateMapCenterIcon,
  updateTextContent,
  updatePlugins,
  updateCenter
} from './viewport-mixin.js'
import { state, reaction, when, autorun } from '../../state/index.js'


/**
 * HTML web component that displays an image using the OpenLayers library.
 * This is the main component of the Skraafoto application.
 * It provides methods, and UI tools for handling interactions with the image.
 */

export class SkraaFotoViewport extends HTMLElement {

  // properties
  coord_image
  map
  compass_element
  update_pointer_function
  update_view_function
  tool_measure_width
  tool_measure_height

  template = /*html*/`

    <p class="basic-image-info"></p>

    <div class="viewport-map"></div>
  `

  constructor() {
    super()
  }


  // Methods

  createDOM() {
    this.innerHTML = this.template
    this.compass_element = configuration.ENABLE_COMPASSARROWS ? this.querySelector('skraafoto-compass-arrows') : this.querySelector('skraafoto-compass')
  }

  /** Creates an OpenLayers map object and adds interactions, image data, etc. to it */
  async createMap(item) {
    // Initialize a map
    this.map = new OlMap({
      target: this.querySelector('.viewport-map'),
      controls: defaultControls({rotate: false, attribution: false, zoom: true}),
      interactions: new Collection()
    })
    updateMapImage(this.map, item)
    await updateMapView({
      map: this.map,
      item: item,
      zoom: state.view.zoom,
      center: this.coord_image
    })
    updateMapCenterIcon(this.map, this.coord_image)

    // add interactions
    const interactions = defaultInteractions({ pinchRotate: false })
    interactions.forEach(interaction => {
      this.map.addInteraction(interaction)
    })
  }

  /** Initializes the image map */
  initializeMap(item) {
    if (!item) {
      return
    }
    this.toggleSpinner(true)
    const center = state.view.position
    updateCenter(center, item).then((newCenters) => {
      this.coord_image = newCenters.imageCoord
      this.createMap(item)
      this.setupTools()
      this.setupListeners()
    })
  }

  setupTools() {

    // Add button to adjust brightness to the DOM
    const button_group = this.querySelector('.ds-button-group')
    const info_button = this.querySelector('#info-btn')
  }

  /** Toggles the visibility of the loading spinner. */
  toggleSpinner(bool) {
    const canvasElement = this.querySelector('.ol-viewport canvas')
    if (bool) {
      if (canvasElement) {
        canvasElement.style.cursor = 'progress'
      }
      // Attach a loading animation element while updating
      const spinner_element = document.createElement('ds-spinner')
      spinner_element.className = 'viewport-spinner'
      this.append(spinner_element)
    } else {
      if (canvasElement) {
        canvasElement.style.cursor = 'inherit'
      }
      // Removes loading animation elements
      setTimeout(() => {
        this.querySelectorAll('.viewport-spinner').forEach(function(spinner) {
          spinner.remove()
        })
      }, 200)
    }
  }

  /**
   * Triggers view sync in all viewports by updating the `view` state.
   */
  syncHandler() {
    const view = this.map.getView()
    if (!view) {
      return
    }
    const center = view.getCenter()
    const world_zoom = view.getZoom()
    const world_center = image2world(state.items[this.dataset.itemkey], center[0], center[1], state.view.kote)
    state.setView({
      zoom: world_zoom,
      position: world_center.slice(0,2),
      kote: world_center[2]
    })
  }

  // Maintains zoom level at new marker
  toImageZoom(zoom) {
    return zoom
  }

  clearDrawings() {
    // Clears tooltips from layer
    const overlays = this.map.getOverlays()
    overlays.forEach((overlay) => {
      if (!overlay) {
        return
      }
      const className = overlay.getElement().className
      if (className === 'ol-tooltip ol-tooltip-measure' || className === 'ol-tooltip ol-tooltip-static') {
        this.map.removeOverlay(overlay)
      }
    })
  }

  setupListeners() {

    // When map has finished loading, remove spinner, etc.
    this.map.on('rendercomplete', () => {
      this.toggleSpinner(false)
    })

    // When state changes, update viewport
    this.reactionDisposer = reaction(
      () => {
        return {
          item: state.items[this.dataset.itemkey], 
          view: {
            position: state.view.position,
            kote: state.view.kote,
            zoom: state.view.zoom
          },
          marker: {
            position: state.marker.position,
            kote: state.marker.kote
          },
          mode: state.toolMode
        }
      },
      (newData, oldData) => {
        // If there is no new image or the user just fiddled with some tools (`mode`), 
        // refrain from updating the viewport since that will abort the Draw action.
        if (!newData || newData.mode && newData.mode !== 'center') {
          return
        }
        if (!oldData || newData.item.id !== oldData.item.id) {
          this.clearDrawings()
        }
      }
    )

    this.map.on('pointermove', (event) => {

      // When user moves the pointer over this viewport, update all other viewports
      if (configuration.ENABLE_POINTER) {
        const coord = image2world(state.items[this.dataset.itemkey], event.coordinate[0], event.coordinate[1], state.view.kote)
        state.setPointerPosition = {point: coord, itemkey: this.dataset.itemkey}
      }
      
    })

    // Viewport sync trigger
    this.map.on('moveend', this.syncHandler.bind(this))
  }


  // Lifecycle callbacks

  connectedCallback() {
    this.createDOM()

    // Initialize image map when image item is available
    this.whenDisposer = when(
      () => state.items[this.dataset.itemkey],
      () => { this.initializeMap(state.items[this.dataset.itemkey]) }
    )
  }

  disconnectedCallback() {
    this.pointerDisposer()
    this.reactionDisposer()
    this.whenDisposer()
  }

}