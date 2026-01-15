import { useLetterFormatStoreV1 } from './list-letter-format-v1'

export const useLetterFormatStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useLetterFormatStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
