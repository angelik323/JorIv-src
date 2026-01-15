import { useTaxesAndWithholdingsV1 } from './taxes-and-withholdings-v1'

export const useTaxesAndWithholdingsStore = (version: 'v1' | 'v2' = 'v1') => {
  switch (version) {
    case 'v1':
      return useTaxesAndWithholdingsV1()
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
