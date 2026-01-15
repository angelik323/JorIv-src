import { useParticipationTypeRegistrationStoreV1 } from './participation-type-registration-v1'

export const useParticipationTypeRegistration = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useParticipationTypeRegistrationStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
