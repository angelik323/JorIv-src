import { useSecurityV1 } from './security-v1'

export const useSecurityStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useSecurityV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
