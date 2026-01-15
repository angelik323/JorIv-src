import useOwnListStoreV1 from './own-list-v1'

export const useOwnListStore = (version: 'v1' | 'v2' = 'v1') => {
  switch (version) {
    case 'v1':
      return useOwnListStoreV1()
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
