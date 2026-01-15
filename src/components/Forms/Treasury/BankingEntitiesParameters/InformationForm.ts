import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'

import { useRules, useUtils } from '@/composables'
import { WriteActionType } from '@/interfaces/global'

import { useTreasuryResourceStore } from '@/stores'
import { ICreateBankingEntitiesAccountingParametersCommissions } from '@/interfaces/customs/treasury/BankingEntitesAccountingParametersComissions'

const useInformationForm = (
  props: {
    action: WriteActionType
    data: ICreateBankingEntitiesAccountingParametersCommissions | null
  },
  emit: Function
) => {
  const {
    banks,
    treasury_movement_codes,
    commission_rate
  } = storeToRefs(useTreasuryResourceStore('v1'))

  const selectOptions = computed(() => ({
    banks: banks.value,
    treasury_movement_codes: treasury_movement_codes.value,
    commission_rate: commission_rate.value,
    validates_collection_method: [
      {
        value: false,
        label: "No"
      },
      {
        value: true,
        label: 'Si'
      }
    ]
  }))

  const { is_required, only_number_with_max_integers_and_decimals, max_length } = useRules()
  const { isEmptyOrZero } = useUtils()

  const formElementRef = ref()

  const initialModelsValues: ICreateBankingEntitiesAccountingParametersCommissions = {
    bank_id: 0,
    description: "",
    accounting_blocks_collection_id: 0,
    treasury_movement_code_id: 0,
    validates_collection_method: false,
    commission_rate: "",
    commission_percentage: 0,
    fixed_value: 0,
    observations: ""
  }
  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const _setValueModel = () => {
    if (!props.data) return
    models.value = { ...(props.data as ICreateBankingEntitiesAccountingParametersCommissions) }
  }

  watch(
    () => models.value.bank_id,
    (newVal) => {
      const bankSelected = selectOptions.value.banks.find(idx => idx.value == newVal)
      models.value.description = bankSelected?.label ?? ''
    }
  )

  watch(
    () => props.data,
    (val) => {
      if (!val) return
      _setValueModel()
    },
    { deep: true, immediate: true }
  )

  watch(
    models,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  return {
    formElementRef,
    models,
    selectOptions,
    
    is_required,
    only_number_with_max_integers_and_decimals,
    max_length,
  }
}

export default useInformationForm
