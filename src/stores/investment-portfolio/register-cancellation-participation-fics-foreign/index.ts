import { useRegisterCancellationParticipationFicsForeignStoreV1 } from './register-cancellation-participation-fics-foreign-v1'

export const useRegisterCancellationParticipationFicsForeignStore = (
  version: 'v1' | 'v2'
) => {
  switch (version) {
    case 'v1':
      return useRegisterCancellationParticipationFicsForeignStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
