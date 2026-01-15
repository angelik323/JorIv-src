import { useResourcesManagerV1 } from './resources-manager-v1'

export * from '@/stores/resources-manager/accounting'
export * from '@/stores/resources-manager/assets'
export * from '@/stores/resources-manager/fics'
export * from '@/stores/resources-manager/finantial-obligations'
export * from '@/stores/resources-manager/investment-portfolio'
export * from '@/stores/resources-manager/schedules'
export * from '@/stores/resources-manager/treasury'
export * from '@/stores/resources-manager/trust-business'
export * from '@/stores/resources-manager/users'
export * from '@/stores/resources-manager/settlement-commissions'
export * from '@/stores/resources-manager/accounts-payable'
export * from '@/stores/resources-manager/third-party'
export * from '@/stores/resources-manager/budget'
export * from '@/stores/resources-manager/billing-collect'
export * from '@/stores/resources-manager/derivative-contracting'
export * from '@/stores/resources-manager/clients'
export * from '@/stores/resources-manager/fixed-assets'
export * from '@/stores/resources-manager/seizures'
export * from '@/stores/resources-manager/audit'

export const useResourceManagerStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useResourcesManagerV1()
    case 'v2':
      throw new Error(`Versión de store no reconocida: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
