import { useBusinessLineV1 } from './business-line-v1'

export const useBusinessLineStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useBusinessLineV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
