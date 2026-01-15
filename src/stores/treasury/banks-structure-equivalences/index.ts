import { useBankStructureEquivalencesStoreV1 } from './banks-structure-equivalences-v1'

export const useBankStructureEquivalencesStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useBankStructureEquivalencesStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
