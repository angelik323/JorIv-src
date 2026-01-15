import { useFundsThatParticipateInOtherInvestmentFundsStoreV1 } from './funds-that-participate-in-other-investment-funds-v1'

export const useFundsThatParticipateInOtherInvestmentFundsStore = (
  version: 'v1' | 'v2'
) => {
  switch (version) {
    case 'v1':
      return useFundsThatParticipateInOtherInvestmentFundsStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
