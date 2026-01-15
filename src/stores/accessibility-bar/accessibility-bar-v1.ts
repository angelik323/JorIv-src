import { defineStore } from 'pinia'

// Maximos y minimos de niveles de tamaño de fuente
const MIN_FONT_SIZE_LEVEL = -1
const MAX_FONT_SIZE_LEVEL = 2

export const useAccessibilityStoreV1 = defineStore('accessibility-store-v1', {
  state: () => ({
    fontSizeLevel: 0 as number,
    highContrastMode: false as boolean,
    highlightLinksMode: false as boolean,
    grayscaleMode: false as boolean,
  }),

  actions: {
    _increaseFontSize() {
      if (this.fontSizeLevel < MAX_FONT_SIZE_LEVEL) {
        this.fontSizeLevel++
      }
    },

    _decreaseFontSize() {
      if (this.fontSizeLevel > MIN_FONT_SIZE_LEVEL) {
        this.fontSizeLevel--
      }
    },

    _toggleContrast() {
      this.highContrastMode = !this.highContrastMode
    },

    _toggleHighlightLinks() {
      this.highlightLinksMode = !this.highlightLinksMode
    },

    _toggleGrayscale() {
      this.grayscaleMode = !this.grayscaleMode
    },

    _reset() {
      this.fontSizeLevel = 0
      this.highContrastMode = false
      this.highlightLinksMode = false
      this.grayscaleMode = false
    },
  },

  persist: true,
})
