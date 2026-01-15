import { useCheckBankTransfers } from './check-bank-transfers-v1'

export const useCheckBankTransfersStore = (version: 'v1' | 'v2' = 'v1') => {
  switch (version) {
    case 'v1':
      return useCheckBankTransfers()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
