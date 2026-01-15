// Vue - Pinia - Quasar
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ICollectiveInvestmentFundRequest } from '@/interfaces/customs/fics/CollectiveInvestmentFunds'
import { ActionType } from '@/interfaces/global'

// Composables
import { useAlert, useMainLoader } from '@/composables'

// Utils
import { collective_investment_funds_options as select_options } from '@/constants/resources'

// Stores
import {
  useAccountingResourceStore,
  useResourceManagerStore,
  useFicResourceStore,
} from '@/stores'

const useInformationForm = (props: { action: ActionType; data?: {} }) => {
  const { consolidation_options, funds_fics } = storeToRefs(
    useFicResourceStore('v1')
  )
  const { business_trusts_basic: business } = storeToRefs(
    useAccountingResourceStore('v1')
  )
  const { _getResources } = useResourceManagerStore('v1')
  const participationHandlingDisabled = ref(false)
  const { openMainLoader } = useMainLoader()
  const informationFormRef = ref()
  const businessSelectorKey = ref(0)
  const { showAlert } = useAlert()

  const formData = ref<ICollectiveInvestmentFundRequest>({
    status_id: 1,
    fund_code: '',
    fund_name: '',
    fic_rating: '',
    fund_type_id: null,
    last_closing_date: '',
    business_trust_id: null,
    is_fund_validated: false,
    consolidation_option_id: null,
    consolidation_option_code: null,
    has_participation_types: false,
  })

  const handleFundTypeChange = (val: number) => {
    formData.value.fund_type_id = val

    if (val === 2) {
      formData.value.has_participation_types = false
      participationHandlingDisabled.value = true
    } else {
      participationHandlingDisabled.value = false
    }
  }

  const validateFundCode = async () => {
    if (!formData.value.fund_code) return

    openMainLoader(true)

    await _getResources(
      {
        fics: ['funds'],
      },
      `filter[fund_code]=${formData.value.fund_code}`
    )

    const fund = funds_fics.value?.find(
      (f) => f.fund_code === formData.value.fund_code
    )

    if (fund) {
      showAlert('El código de fondo ya existe', 'error', undefined, 3000)

      formData.value.fund_code = ''
    }

    openMainLoader(false)
  }

  const validateBusinessId = async (value: string) => {
    if (!value) return

    openMainLoader(true)

    await _getResources(
      { fics: ['funds'] },
      `filter[business_trust_id]=${value}`
    )

    const fund = funds_fics.value?.find(
      (f) => f.business_trust_id == Number(value)
    )

    if (fund) {
      showAlert(
        'El negocio se encuentra asociado a otro fondo de inversión',
        'error',
        undefined,
        3000
      )

      formData.value.business_trust_id = null

      businessSelectorKey.value++
    } else formData.value.business_trust_id = Number(value)

    openMainLoader(false)
  }

  const isView = computed(() => ['view'].includes(props.action))
  const isDisabled = computed(() => ['edit'].includes(props.action))
  const isEditable = computed(() => ['create', 'edit'].includes(props.action))

  watch(
    () => props.data,
    (newData) => {
      if (newData) {
        formData.value = {
          ...formData.value,
          ...newData,
        }
      }
    },
    { immediate: true }
  )

  return {
    isView,
    business,
    formData,
    isEditable,
    isDisabled,
    select_options,
    validateFundCode,
    validateBusinessId,
    businessSelectorKey,
    informationFormRef,
    handleFundTypeChange,
    consolidation_options,
    participationHandlingDisabled,
  }
}
export default useInformationForm
