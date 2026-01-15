import { useQualificationsStoreV1 } from '@/stores/investment-portfolio/qualifications/qualifications-v1'

export const useQualificationsStore = (version: 'v1' | 'v2' = 'v1') => {
  switch (version) {
    case 'v1':
      return useQualificationsStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
