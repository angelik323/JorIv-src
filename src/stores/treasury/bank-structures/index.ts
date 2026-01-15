import { useBankStructuresV1 } from './bank-structures-v1'

export const useBankStructuresStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useBankStructuresV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
