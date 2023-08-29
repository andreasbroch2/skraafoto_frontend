/* Import and define common custom elements */

import { Spinner } from '../../node_modules/@dataforsyningen/css/assets/designsystem.js'
import { AlertSplash } from './alert-splash.js'
import { SkraaFotoAdvancedViewport } from './advanced-viewport.js'
import { SkraaFotoAdvancedMap } from './advanced-map.js'
import { SkraaFotoDateSelector } from './date-selector.js'
import { SkraaFotoInfoBox } from './info-box.js'
import { SkraaFotoHeader } from './page-header.js'
import { SkraaFotoCompassArrows } from "./compass-arrows";
import { SkraaFotoCompass } from "./compass";
import { FirstTimeVisit } from './first-time-visitor.js'
import {configuration} from "../modules/configuration";



export function registerComponents() {
  customElements.define('ds-spinner', Spinner)
  customElements.define('skraafoto-alert-splash', AlertSplash);
  customElements.define('skraafoto-advanced-viewport', SkraaFotoAdvancedViewport)
  customElements.define('skraafoto-advanced-map', SkraaFotoAdvancedMap)
  customElements.define('skraafoto-date-selector', SkraaFotoDateSelector)
  customElements.define('skraafoto-info-box', SkraaFotoInfoBox)
  customElements.define('skraafoto-header', SkraaFotoHeader)
  customElements.define('skraafoto-first-time-visit', FirstTimeVisit)
  customElements.define('skraafoto-compass', SkraaFotoCompass);

  if (configuration.ENABLE_COMPASSARROWS) {
    customElements.define('skraafoto-compass-arrows', SkraaFotoCompassArrows);
  }

}

