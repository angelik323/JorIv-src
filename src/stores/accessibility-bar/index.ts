import { useAccessibilityStoreV1 } from './accessibility-bar-v1'

export const useAccessibilityStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useAccessibilityStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
