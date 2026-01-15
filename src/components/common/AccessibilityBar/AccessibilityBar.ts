import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
import { useAccessibilityStore } from '@/stores'

const useAccessibilityBar = () => {
  const {
    _increaseFontSize,
    _decreaseFontSize,
    _toggleContrast,
    _toggleHighlightLinks,
    _toggleGrayscale,
    _reset,
  } = useAccessibilityStore('v1')

  const { fontSizeLevel, highContrastMode, highlightLinksMode, grayscaleMode } =
    storeToRefs(useAccessibilityStore('v1'))

  const $q = useQuasar()

  // Menú expandido
  const isExpanded = ref(false)

  const isMinFontSize = computed(() => fontSizeLevel.value <= -1)
  const isMaxFontSize = computed(() => fontSizeLevel.value >= 2)

  const hasChanges = computed(() => {
    return (
      fontSizeLevel.value !== 0 ||
      highContrastMode.value ||
      grayscaleMode.value ||
      highlightLinksMode.value
    )
  })

  // Responsivo
  const isMobile = computed(() => $q.screen.lt.sm)

  const toggleExpanded = () => {
    isExpanded.value = !isExpanded.value
  }

  const increaseFontSize = () => {
    _increaseFontSize()
    if (isMobile.value) isExpanded.value = false
  }

  const decreaseFontSize = () => {
    _decreaseFontSize()
    if (isMobile.value) isExpanded.value = false
  }

  const toggleContrast = () => {
    _toggleContrast()
    if (isMobile.value) isExpanded.value = false
  }

  const toggleHighlightLinks = () => {
    _toggleHighlightLinks()
    if (isMobile.value) isExpanded.value = false
  }

  const toggleGrayscale = () => {
    _toggleGrayscale()
    if (isMobile.value) isExpanded.value = false
  }

  const resetAll = () => {
    _reset()
    if (isMobile.value) isExpanded.value = false
  }

  // Logica cambiar tamaño de fuente
  const applyFontSize = (level: number) => {
    document.documentElement.className = document.documentElement.className
      .replace(/\bfont-size-level-\S+/g, '')
      .trim()

    document.documentElement.classList.add(`font-size-level-${level}`)
  }

  // Logica cambiar contraste
  const applyHighContrast = (isActive: boolean) => {
    document.documentElement.classList.toggle('high-contrast-mode', isActive)
  }

  // Logica resaltar botones
  const applyHighlightLinks = (isActive: boolean) => {
    document.documentElement.classList.toggle('highlight-links-mode', isActive)
  }

  // Logica escala de grises
  const applyGrayscale = (isActive: boolean) => {
    document.documentElement.classList.toggle('grayscale-mode', isActive)
  }

  watch(fontSizeLevel, applyFontSize, { immediate: true })
  watch(highContrastMode, applyHighContrast, { immediate: true })
  watch(highlightLinksMode, applyHighlightLinks, { immediate: true })
  watch(grayscaleMode, applyGrayscale, { immediate: true })

  return {
    isExpanded,
    highContrastMode,
    highlightLinksMode,
    grayscaleMode,
    isMinFontSize,
    isMaxFontSize,
    hasChanges,
    isMobile,
    toggleExpanded,
    increaseFontSize,
    decreaseFontSize,
    toggleContrast,
    toggleHighlightLinks,
    toggleGrayscale,
    resetAll,
  }
}

export default useAccessibilityBar
