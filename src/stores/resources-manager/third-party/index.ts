import { useThirdPartyV1 } from './third-party-v1'

export const useThirdPartyResourceStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useThirdPartyV1()
    case 'v2':
      throw new Error(`Versión de store no reconocida: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
