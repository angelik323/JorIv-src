import { useConsultIndividualListPreventionListStoreV1 } from './consult-individual-list-prevention-v1'

export const useConsultIndividualListPreventionListStore = (
  version: 'v1' | 'v2'
) => {
  switch (version) {
    case 'v1':
      return useConsultIndividualListPreventionListStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
