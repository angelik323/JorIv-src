// Vue - pinia
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ActionType } from '@/interfaces/global'
import { IIndirectCorporateForm } from '@/interfaces/customs/clients/ClientIndirectLegalPerson'
import { QForm } from 'quasar'

// Composables
import { useUtils } from '@/composables'

// Stores
import { useAssetResourceStore } from '@/stores/resources-manager/assets'

const useCorporateForm = (
  props: {
    action: ActionType
    data: IIndirectCorporateForm | null
  },
  emit: Function
) => {
  const { legal_people_fund_sources } = storeToRefs(useAssetResourceStore('v1'))

  const { defaultIconsLucide, isEmptyOrZero, formatCurrencyString } = useUtils()

  const formElementRef = ref<QForm>()

  const initialModelsValues: IIndirectCorporateForm = {
    economic_activities: [],
    bank_accounts: [],
    total_monthly_operational_income: null,
    total_monthly_non_operational_income: null,
    other_non_operational_income_concept: null,
    total_monthly_expenses: null,
    total_assets: null,
    total_liabilities: null,
    financial_information_cutoff_date: null,
    source_of_funds: null,
    another_source_of_funds: null,
    is_registered_issuer_subject_to_disclosure: false,
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const isEconomicActivitiesExpanded = ref(true)
  const isFinancialInformationExpanded = ref(true)
  const isBankAccountsExpanded = ref(true)
  const isSourceOfFundsExpanded = ref(true)

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
    legal_people_fund_sources,
    defaultIconsLucide,
    formElementRef,
    models,
    isEconomicActivitiesExpanded,
    isFinancialInformationExpanded,
    isBankAccountsExpanded,
    isSourceOfFundsExpanded,
    formatCurrencyString,
  }
}

export default useCorporateForm
