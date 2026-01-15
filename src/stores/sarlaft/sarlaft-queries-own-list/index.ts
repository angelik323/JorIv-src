import { useSarlaftQueriesOwnListStoreV1 } from './sarlaft-queries-own-list-v1'

export const useSarlaftQueriesOwnListStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useSarlaftQueriesOwnListStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
