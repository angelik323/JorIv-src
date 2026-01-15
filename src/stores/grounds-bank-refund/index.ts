import { useGroundsBankRefundV1 } from "./grounds-bank-refund-v1"

export const useGroundsBankRefundStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useGroundsBankRefundV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
