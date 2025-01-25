import { SkraaFotoAddressSearch } from './address-search.js'

customElements.define('skraafoto-address-search', SkraaFotoAddressSearch)

/**
 * Web component that displays a reusable webpage header
 */
export class SkraaFotoHeader extends HTMLElement {

  constructor() {
    super()
  }

  connectedCallback() {
    this.createDOM()
  }

  createDOM() {
    // Create elements
    const markup = document.createElement('header')
    markup.className = 'sf-header'
    markup.dataset.theme = 'dark'

    let headerContent = `<style>${ this.styles }</style>`

    headerContent += `
      <div style="flex-grow: 1;"></div>
      <skraafoto-address-search collapsible data-theme="light" style="background-color: transparent;"></skraafoto-address-search>
    `
    markup.innerHTML = headerContent
    this.append(markup)
  }
}