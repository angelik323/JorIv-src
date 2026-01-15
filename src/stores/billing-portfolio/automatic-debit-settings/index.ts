import { useAutomaticDebitSettingsStoreV1 } from './automatic-debit-settings-v1'

export const useAutomaticDebitSettingsStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useAutomaticDebitSettingsStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
