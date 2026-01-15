import { defineStore } from 'pinia'
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'
import { useAssetResourceStore } from '@/stores/resources-manager/assets'
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'
import { useInvestmentPortfolioResourceStore } from '@/stores/resources-manager/investment-portfolio'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useFinantialObligationResourceStore } from '@/stores/resources-manager/finantial-obligations'
import { useScheduleResourceStore } from '@/stores/resources-manager/schedules'
import { useSettlementCommissionsResourceStore } from '@/stores/resources-manager/settlement-commissions'
import { useTreasuryResourceStore } from '@/stores/resources-manager/treasury'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useUserResourceStore } from '@/stores/resources-manager/users'
import { useAccountsPayableResourceStore } from '@/stores/resources-manager/accounts-payable'
import { useDerivativeContractingResourceStore } from '@/stores/resources-manager/derivative-contracting'
import { useBillingCollectStore } from '@/stores/resources-manager/billing-collect'
import { useThirdPartyResourceStore } from '@/stores/resources-manager/third-party'
import { useNormativeResourceStore } from '@/stores/resources-manager/normative'
import { useClientsResourceStore } from '@/stores/resources-manager/clients'
import { useTaxResourceStore } from '@/stores/resources-manager/tax'
import { ResourceTypes } from '@/interfaces/customs'
import { useFixedAssetsResourceStore } from '@/stores/resources-manager/fixed-assets'
import { useSeizuresResourcesStore } from '@/stores/resources-manager/seizures'
import { useSarlaftResourceStore } from '@/stores/resources-manager/sarlaft'
import { useAuditResourcesStore } from '@/stores/resources-manager/audit'
import {
  SelectTableVersion,
  SelectTableVersionKey,
} from '@/constants/resources'

export const useResourcesManagerV1 = defineStore('resources-manager-v1', {
  state: () => ({
    version: 'v1',
    storesMap: {
      accounting: useAccountingResourceStore,
      assets: useAssetResourceStore,
      investment_portfolio: useInvestmentPortfolioResourceStore,
      fics: useFicResourceStore,
      finantial_obligations: useFinantialObligationResourceStore,
      schedule: useScheduleResourceStore,
      treasury: useTreasuryResourceStore,
      trust_business: useTrustBusinessResourceStore,
      user: useUserResourceStore,
      settlement_commissions: useSettlementCommissionsResourceStore,
      third_party: useThirdPartyResourceStore,
      budget: useBudgetResourceStore,
      accounts_payable: useAccountsPayableResourceStore,
      derivative_contracting: useDerivativeContractingResourceStore,
      billing_collect: useBillingCollectStore,
      normative: useNormativeResourceStore,
      clients: useClientsResourceStore,
      fixed_assets: useFixedAssetsResourceStore,
      tax: useTaxResourceStore,
      seizures: useSeizuresResourcesStore,
      sarlaft: useSarlaftResourceStore,
      audit: useAuditResourcesStore,
    },
  }),
  actions: {
    async _getResources(
      resourceKeys: ResourceTypes,
      additionalParams: string = '',
      version: SelectTableVersionKey = 'v1'
    ) {
      for (const [resourceType, keys] of Object.entries(resourceKeys)) {
        const store = this.storesMap[resourceType as keyof ResourceTypes]('v1')
        const params = `${SelectTableVersion[version]}?keys[]=${keys.join(
          '&keys[]='
        )}${additionalParams ? `&${additionalParams}` : ''}`
        await store.getResources(params)
      }
    },
    _resetKeys(resourceKeys: ResourceTypes) {
      Object.entries(resourceKeys).forEach(([resourceType, keys]) => {
        const store = this.storesMap[resourceType as keyof ResourceTypes]('v1')
        store.resetKeys(keys)
      })
    },
  },
  persist: true,
})
