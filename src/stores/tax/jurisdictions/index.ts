import { useJurisdictionsV1 } from './jurisdictions-v1'

export const useJurisdictionsStore = (version: 'v1' | 'v2' = 'v1') => {
  switch (version) {
    case 'v1':
      return useJurisdictionsV1()
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
