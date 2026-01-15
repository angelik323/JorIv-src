// Vue - pinia
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ActionType } from '@/interfaces/global'
import { IDirectCorporateForm } from '@/interfaces/customs/clients/ClientDirectLegalPerson'

// Composables
import { useUtils } from '@/composables'
import { BANK_TYPES_OPTIONS } from '@/constants/resources/clients'

// Stores
import { useAssetResourceStore } from '@/stores/resources-manager/assets'

const useCorporateForm = (
  props: {
    action: ActionType
    data: IDirectCorporateForm | null
  },
  emit: Function
) => {
  const {
    legal_people_company_classification,
    ciius,
    banks,
    legal_people_fund_sources,
  } = storeToRefs(useAssetResourceStore('v1'))

  const { isEmptyOrZero, formatCurrencyString } = useUtils()

  const formElementRef = ref()

  const initialModelsValues: IDirectCorporateForm = {
    company_classification: null,
    ciiu_code: null,
    total_monthly_operational_income: null,
    total_monthly_non_operational_income: null,
    other_non_operational_income_concept: null,
    total_monthly_expenses: null,
    total_assets: null,
    total_liabilities: null,
    financial_information_cutoff_date: null,
    bank: null,
    holder_account_type: null,
    holder_account_number: null,
    source_of_funds: null,
    another_source_of_funds: null,
    is_registered_issuer_subject_to_disclosure: false,
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const _setValueModel = () => {
    if (!props.data) return
    Object.assign(models.value, props.data)
  }

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

  watch(
    () => models.value.source_of_funds,
    (newVal) => {
      if (newVal !== 'Otro') models.value.another_source_of_funds = null
    }
  )

  return {
    legal_people_company_classification,
    ciius,
    banks,
    bank_types: BANK_TYPES_OPTIONS,
    legal_people_fund_sources,
    formElementRef,
    models,
    formatCurrencyString,
  }
}

export default useCorporateForm
