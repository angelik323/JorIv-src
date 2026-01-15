// Composables
import { useMainLoader, useUtils } from '@/composables'
// Interfaces
import { IBillingAndPortfolioClousureInformationForm } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'
// Stores
import { useBillingPortfolioClosureStore } from '@/stores'
// Utils & pinia & vue
import { storeToRefs } from 'pinia'
import { computed, onBeforeMount, ref, watch } from 'vue'
// Libraries
import moment from 'moment'

const useInformationForm = (
  props: {
    action: ActionType
    data?: IBillingAndPortfolioClousureInformationForm | null
  },
  emit: Function
) => {
  const {
    billing_portfolio_clouser_response,
    billing_portfolio_clouser_validated_response,
  } = storeToRefs(useBillingPortfolioClosureStore('v1'))
  const {
    _postValidatePendingRequirements,
    _clearData,
    _getRevalidatePendingRequirements,
  } = useBillingPortfolioClosureStore('v1')

  const { openMainLoader } = useMainLoader()

  const initialModelsValues: IBillingAndPortfolioClousureInformationForm = {
    id: 0,
    period: null,
    closing_date: moment().format('YYYY-MM-DD'),
    observations: null,
    validate_requirements_checked: null,
    validations: null,
    confirmed_validated: null,
    status: undefined,
  }
  const formInformationRef = ref()
  const radioValidatePendingRequirements = ref(false)
  const radioReValidatePendingRequirements = ref(false)
  const radioConfirmPeriodValid = ref(false)
  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const _setValueModel = () => {
    if (!props.data) return
    Object.assign(models.value, props.data)

    if (props.action === 'view' || props.action === 'edit') {
      models.value.period = moment(props.data?.period).format('YYYY-MM')

      models.value.closing_date = moment(props.data?.closing_date).format(
        'YYYY-MM-DD'
      )
      radioConfirmPeriodValid.value = props.data?.confirmed_validated ?? false
    }
  }

  const validatePendingRequirementsHandler = async () => {
    if (props.action === 'view' || props.action === 'edit') return

    openMainLoader(true)
    const payload = {
      period: models.value.period,
      validate_requirements_checked: radioValidatePendingRequirements.value,
      observations: models.value.observations,
    }

    await _postValidatePendingRequirements(payload)

    openMainLoader(false)
  }

  const revalidatePendingRequirementsHandler = async () => {
    if (props.action !== 'edit') return

    openMainLoader(true)

    await _getRevalidatePendingRequirements(props.data?.id ?? 0)

    openMainLoader(false)
  }

  watch(
    () => billing_portfolio_clouser_response.value,
    (newVal) => {
      if (newVal) {
        models.value = { ...initialModelsValues, ...newVal }
        radioValidatePendingRequirements.value =
          models.value.validate_requirements_checked === true
      }
    },
    { deep: true, immediate: true }
  )

  const validatePendingRequirements = computed(
    () => !!models.value.validate_requirements_checked && !!models.value.period
  )

  // Sincroniza el modelo con la prop 'data'
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
      emit('update:data', useUtils().isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  watch(
    () => validatePendingRequirements.value,
    (val) => {
      if (!val || props.action === 'edit' || props.action === 'view') return
      validatePendingRequirementsHandler()
    },
    { immediate: true }
  )

  watch(
    () => billing_portfolio_clouser_validated_response.value,
    (val) => {
      if (!val) return
      models.value.validations =
        billing_portfolio_clouser_validated_response.value?.validations
    },
    { deep: true, immediate: true }
  )

  watch(
    () => radioReValidatePendingRequirements.value,
    (val) => {
      if (props.action === 'view' || !val) return
      revalidatePendingRequirementsHandler()
    }
  )

  onBeforeMount(() => {
    _clearData()
  })

  return {
    formInformationRef,
    models,
    radioValidatePendingRequirements,
    radioReValidatePendingRequirements,
    radioConfirmPeriodValid,
    billing_portfolio_clouser_validated_response,
  }
}
export default useInformationForm
