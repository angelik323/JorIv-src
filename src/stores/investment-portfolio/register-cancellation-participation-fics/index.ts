import { useRegisterCancellationParticipationFicsStoreV1 } from './register-cancellation-participation-fics-v1'

export const useRegisterCancellationParticipationFicsStore = (
  version: 'v1' | 'v2'
) => {
  switch (version) {
    case 'v1':
      return useRegisterCancellationParticipationFicsStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
