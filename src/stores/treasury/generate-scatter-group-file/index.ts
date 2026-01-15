import { useGenerateScatterGroupFileStoreV1 } from './generate-scatter-group-file-v1'

export const useGenerateScatterGroupFileStore = (
  version: 'v1' | 'v2' = 'v1'
) => {
  switch (version) {
    case 'v1':
      return useGenerateScatterGroupFileStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
