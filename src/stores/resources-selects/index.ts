import { useResourecesV1 } from './resources-v1'

export const useResourceStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useResourecesV1()
    case 'v2':
      throw new Error(`Versión de store no reconocida: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
