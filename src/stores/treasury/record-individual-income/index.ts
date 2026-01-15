import { useRecordIndividualIncomeStoreV1 } from './record-individual-income-v1'

export const useRecordIndividualIncomeStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useRecordIndividualIncomeStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
