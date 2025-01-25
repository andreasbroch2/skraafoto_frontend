/* Import and define common custom elements */

import { SkraaFotoViewport } from './viewport/viewport.js'
import { SkraaFotoHeader } from './header/page-header.js'

export async function registerComponents() {
  customElements.define('skraafoto-viewport', SkraaFotoViewport)
  customElements.define('skraafoto-header', SkraaFotoHeader)

}