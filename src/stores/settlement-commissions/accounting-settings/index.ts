import { useAccountingSettingsStoreV2 } from './accounting-settings-v2'

export const useAccountingSettingsStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      throw new Error(`Versión de store no disponible: ${version}`)
    case 'v2':
      return useAccountingSettingsStoreV2()
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
