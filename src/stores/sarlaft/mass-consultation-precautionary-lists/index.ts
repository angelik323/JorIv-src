import useMassConsultationPrecautionaryListsStoreV1 from './mass-consultation-precautionary-lists-v1'

export const useMassConsultationPrecautionaryListsStore = (
  version: 'v1' | 'v2'
) => {
  switch (version) {
    case 'v1':
      return useMassConsultationPrecautionaryListsStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
