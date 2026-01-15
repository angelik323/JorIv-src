import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import {
  IAccountStructureResponse,
  IAnnualPeriodClosingModel,
} from '@/interfaces/customs'

import { useAccountingResourceStore, useResourceManagerStore } from '@/stores'

const useAnnualPeriodClosingForm = (props: {
  action: 'create' | 'edit'
  data?: IAccountStructureResponse
}) => {
  const { _getResources } = useResourceManagerStore('v1')
  const {
    accounting_chart_operative_by_structure_annual: operativeByStructureSelect,
    third_parties_by_account_range_period_anual: thirdPartiesSelect,
    account_structures_accounting_accounts: structureSelect,
    not_consolidator_business_trust: consolidatorSelect,
  } = storeToRefs(useAccountingResourceStore('v1'))

  const annualPeriodClosingForm = ref()

  const models = ref<IAnnualPeriodClosingModel>({
    accounting_structure_id: 0,
    from_account_code: '',
    to_account_code: '',
  })

  const isEdit = computed(() => props.action === 'edit')

  watch(
    () => models.value.accounting_structure_id,
    async (newId, oldId) => {
      if (newId && newId !== oldId) {
        await _getResources(
          {
            accounting: ['not_consolidator_business_trust'],
          },
          `filter[accounting_structure_id]=${newId}`,
          'v2'
        )

        await _getResources(
          {
            accounting: ['accounting_chart_operative_by_structure'],
          },
          `filter[account_structures_id]=${newId}`
        )
      }
    }
  )

  watch(
    () => [models.value.from_account_code, models.value.to_account_code],
    async ([newFrom, newTo], [oldFrom, oldTo]) => {
      if (newFrom && newTo && (newFrom !== oldFrom || newTo !== oldTo)) {
        await _getResources(
          {
            accounting: ['third_parties_by_account_range'],
          },
          `filter[from_account]=${newFrom}&filter[to_account]=${newTo}`
        )
      }
    }
  )

  return {
    models,
    isEdit,
    structureSelect,
    thirdPartiesSelect,
    consolidatorSelect,
    annualPeriodClosingForm,
    operativeByStructureSelect,
  }
}

export default useAnnualPeriodClosingForm
