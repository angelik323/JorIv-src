import { useUserParametersV1 } from "./user-parameters-v1"


export const useUserParametersStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useUserParametersV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
