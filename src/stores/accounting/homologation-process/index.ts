import { useHomologationProcessStoreV1 } from './homologation-process-v1'

export const useHomologationProcessStore = (version: string) => {
  switch (version) {
    case 'v1':
      return useHomologationProcessStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
