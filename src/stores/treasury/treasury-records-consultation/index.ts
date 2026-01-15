import { useTreasuryRecordsConsultationStoreV1 } from './treasury-records-consultation-v1'

export const useTreasuryRecordsConsultationStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useTreasuryRecordsConsultationStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
