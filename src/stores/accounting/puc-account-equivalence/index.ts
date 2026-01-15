import { usePucAccountEquivalenceStoreV1 } from './puc-account-equivalence-v1'
import { usePucAccountEquivalenceStoreV2 } from './puc-account-equivalence-v2'

export function usePucAccountEquivalenceStore(
  version: 'v1'
): ReturnType<typeof usePucAccountEquivalenceStoreV1>
export function usePucAccountEquivalenceStore(
  version: 'v2'
): ReturnType<typeof usePucAccountEquivalenceStoreV2>
export function usePucAccountEquivalenceStore(version: 'v1' | 'v2') {
  switch (version) {
    case 'v1':
      return usePucAccountEquivalenceStoreV1()
    case 'v2':
      return usePucAccountEquivalenceStoreV2()
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
