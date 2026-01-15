import { useAccountingRestatementV1 } from './accounting-restatement-v1'
import { useExchangeDifferenceRestatementStoreV2 } from './exchange-difference-restatement-v2'

export function useAccountingRestatementStore(
  version: 'v1'
): ReturnType<typeof useAccountingRestatementV1>
export function useAccountingRestatementStore(
  version: 'v2'
): ReturnType<typeof useExchangeDifferenceRestatementStoreV2>
export function useAccountingRestatementStore(version: 'v1' | 'v2') {
  switch (version) {
    case 'v1':
      return useAccountingRestatementV1()
    case 'v2':
      return useExchangeDifferenceRestatementStoreV2()
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
