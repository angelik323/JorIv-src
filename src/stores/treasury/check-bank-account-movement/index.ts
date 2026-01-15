import { useCheckBankAccountMovementStoreV1 } from './check-bank-account-movement-v1'

export const useCheckBankAccountMovementStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useCheckBankAccountMovementStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
