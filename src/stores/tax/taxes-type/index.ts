import { useTaxesTypeV1 } from './taxes-type-v1'

export const useTaxesTypeStore = (version: 'v1' | 'v2' = 'v1') => {
  switch (version) {
    case 'v1':
      return useTaxesTypeV1()
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
