import { useAccountingConsolidation } from './accounting-consolidation-v1'
import { useAccountingConsolidationV2 } from './accounting-consolidation-v2'

export function useAccountingConsolidationStore(
  version: 'v1'
): ReturnType<typeof useAccountingConsolidation>
export function useAccountingConsolidationStore(
  version: 'v2'
): ReturnType<typeof useAccountingConsolidationV2>
export function useAccountingConsolidationStore(version: 'v1' | 'v2') {
  switch (version) {
    case 'v1':
      return useAccountingConsolidation()
    case 'v2':
      return useAccountingConsolidationV2()
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
