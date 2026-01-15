import { useRecordIndividualExpensesStoreV1 } from './record-individual-expenses-v1'

export const useRecordIndividualExpensesStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useRecordIndividualExpensesStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
