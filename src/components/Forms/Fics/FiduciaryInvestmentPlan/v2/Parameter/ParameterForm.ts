// Vue - Pinia
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ActionType } from '@/interfaces/global'
import {
  IFiduciaryInvestmentPlansForm,
  IFiduciaryInvestmentPlansPropsForm,
} from '@/interfaces/customs/fics/FiduciaryInvestmentPlans'

// Composables
import { useRules } from '@/composables'
import { useUtils } from '@/composables'

// Stores
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useFiduciaryInvestmentPlanStore } from '@/stores/fics/fiduciary-investment-plan'
import { useFicResourceStore } from '@/stores/resources-manager/fics'

const useParameterForm = (props: IFiduciaryInvestmentPlansPropsForm) => {
  const { only_number, only_number_with_max_integers_and_decimals } = useRules()
  const { isEmptyOrZero, formatCurrency } = useUtils()

  const { _setDataForm, _loadFicProfilesByFund } =
    useFiduciaryInvestmentPlanStore('v1')
  const {
    data_form,
    fic_manager_profiles,
    fic_advisor_profiles,
    has_types_participation,
  } = storeToRefs(useFiduciaryInvestmentPlanStore('v1'))
  const { fic_business_lines, funts_to_investment_plans } = storeToRefs(
    useFicResourceStore('v1')
  )
  const { business_trusts_with_code } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )

  const formParameter = ref()
  const radioHasWebOperations = ref(false)
  const radioPenalty = ref(false)
  const radioPenaltyDisabled = ref(false)
  const radioHasTrustManagement = ref(false)
  const models = ref<IFiduciaryInvestmentPlansForm>({
    holder_identification: {
      email_address: '',
      phone: '',
      residential_address: '',
      funding_source: '',
    },
    parameters: {
      fic_manager_user_id: null,
      fic_advisor_user_id: null,
      has_web_operations: false,
      penalty: false,
      has_trust_management: false,
      percentage: undefined,
    },
  })

  const previousFundId = ref(data_form.value?.collective_investment_fund_id)

  const filteredBusinessLines = computed(() => {
    const selectedFundId = data_form.value?.collective_investment_fund_id

    if (!selectedFundId) {
      return fic_business_lines.value
    }

    const filtered = fic_business_lines.value.filter(
      (businessLine: {
        fund_id?: number
        value?: string | number
        label?: string
      }) => {
        return businessLine.fund_id === selectedFundId
      }
    )

    const currentBusinessLineId = models.value.parameters?.fic_business_line_id
    if (currentBusinessLineId) {
      const isValidSelection = filtered.some(
        (bl) => bl.value === currentBusinessLineId
      )

      if (!isValidSelection) {
        if (models.value.parameters) {
          models.value.parameters.fic_business_line_id = undefined
        }
        if (data_form.value?.parameters) {
          data_form.value.parameters.fic_business_line_id = undefined
        }
      }
    }

    return filtered
  })

  const handlerActionForm = (action: ActionType) => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: setValueModel,
      edit: data_form.value ? setValueModel : setFormEdit,
      view: setFormView,
    }
    actionHandlers[action]?.()
  }

  const setValueModel = () => {
    if (data_form.value) {
      data_form.value.parameters = {
        ...data_form.value.parameters,
        fic_manager_user_id:
          data_form.value.parameters?.fic_manager_user_id ??
          data_form.value.parameters?.fic_manager_user?.id,
        fic_advisor_user_id:
          data_form.value.parameters?.fic_advisor_user_id ??
          data_form.value.parameters?.fic_advisor_user?.id,
        business_trust_id:
          data_form.value.parameters?.business_trust_id ??
          data_form.value.parameters?.business_trust?.id,
        has_web_operations:
          data_form.value.parameters?.has_web_operations ?? false,
        penalty: data_form.value.parameters?.penalty ?? false,
        has_trust_management:
          data_form.value.parameters?.has_trust_management ?? false,
        percentage: data_form.value.parameters?.percentage ?? undefined,
      }

      if (props.action === 'edit') {
        data_form.value.parameters = {
          ...data_form.value.parameters,
          fic_manager_user_id:
            data_form.value.parameters?.fic_manager_user
              ?.fic_profile_manager_id,
          fic_advisor_user_id:
            data_form.value.parameters?.fic_advisor_user
              ?.fic_profile_advisor_id,
          fic_business_line_id:
            data_form.value.parameters?.fic_business_line?.id,
        }
      }

      radioHasWebOperations.value =
        data_form.value.parameters.has_web_operations ??
        radioHasWebOperations.value
      radioPenalty.value =
        data_form.value.parameters.penalty ?? radioPenalty.value
      radioHasTrustManagement.value =
        data_form.value.parameters.has_trust_management ??
        radioHasTrustManagement.value

      models.value = { ...data_form.value }
    }
  }

  const setFormView = () => {
    if (props.data) {
      props.data.parameters = {
        ...props.data.parameters,
        fic_manager_user_id:
          props.data.parameters?.fic_manager_user_id ??
          props.data.parameters?.fic_manager_user?.id,
        fic_advisor_user_id:
          props.data.parameters?.fic_advisor_user_id ??
          props.data.parameters?.fic_advisor_user?.id,
        business_trust_id:
          props.data.parameters?.business_trust_id ??
          props.data.parameters?.business_trust?.id,
        has_web_operations: props.data.parameters?.has_web_operations ?? false,
        penalty: props.data.parameters?.penalty ?? false,
        has_trust_management:
          props.data.parameters?.has_trust_management ?? false,
      }

      radioHasWebOperations.value =
        props.data.parameters.has_web_operations ?? radioHasWebOperations.value
      radioPenalty.value = props.data.parameters.penalty ?? radioPenalty.value
      radioHasTrustManagement.value =
        props.data.parameters.has_trust_management ??
        radioHasTrustManagement.value

      models.value = { ...props.data }
    }
  }

  const setFormEdit = () => {
    if (props.data) {
      props.data.parameters = {
        ...props.data.parameters,
        fic_manager_user_id:
          props.data.parameters?.fic_manager_user_id ??
          props.data.parameters?.fic_manager_user?.id,
        fic_advisor_user_id:
          props.data.parameters?.fic_advisor_user_id ??
          props.data.parameters?.fic_advisor_user?.id,
        business_trust_id:
          props.data.parameters?.business_trust_id ??
          props.data.parameters?.business_trust?.id,
        has_web_operations: props.data.parameters?.has_web_operations ?? false,
        penalty: props.data.parameters?.penalty ?? false,
        has_trust_management:
          props.data.parameters?.has_trust_management ?? false,
      }

      radioHasWebOperations.value =
        props.data.parameters.has_web_operations ?? radioHasWebOperations.value
      radioPenalty.value = props.data.parameters.penalty ?? radioPenalty.value
      radioHasTrustManagement.value =
        props.data.parameters.has_trust_management ??
        radioHasTrustManagement.value

      models.value = { ...props.data }
    }
  }

  const setParameterValue = <
    K extends keyof NonNullable<IFiduciaryInvestmentPlansForm['parameters']>
  >(
    key: K,
    value: NonNullable<IFiduciaryInvestmentPlansForm['parameters']>[K]
  ) => {
    models.value.parameters = {
      ...models.value.parameters,
      [key]: value,
    }
  }

  onMounted(async () => {
    handlerActionForm(props.action)
  })

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    }
  )

  watch(
    () => models.value,
    () => {
      if (!models.value) {
        models.value = {
          holder_identification: {
            email_address: '',
            phone: '',
            residential_address: '',
            funding_source: '',
          },
          parameters: {
            fic_manager_user_id: null,
            has_web_operations: false,
            penalty: false,
            has_trust_management: false,
          },
        }
      }

      if (isEmptyOrZero(models.value)) {
        _setDataForm(null)
      } else {
        _setDataForm({ ...models.value })
      }
    },
    { deep: true }
  )

  watch(
    () => models.value.parameters?.fic_manager_user_id,
    () => {
      if (models.value.parameters?.fic_manager_user_id) {
        const user = fic_manager_profiles.value.filter(
          (item: { value: string | number; label: string }) =>
            item.value == models.value.parameters?.fic_manager_user_id
        )

        if (user.length > 0) {
          models.value.parameters.fic_manager_user_name = user[0].label
        }
      }
    },
    { deep: true }
  )

  watch(
    () => models.value.parameters?.fic_advisor_user_id,
    () => {
      if (models.value.parameters?.fic_advisor_user_id) {
        const user = fic_advisor_profiles.value.filter(
          (item: { value: string | number; label: string }) =>
            item.value == models.value.parameters?.fic_advisor_user_id
        )

        if (user.length > 0) {
          models.value.parameters.fic_advisor_user_name = user[0].label
        }
      }
    },
    { deep: true }
  )

  watch(
    () => data_form.value?.collective_investment_fund_id,
    (newFundId) => {
      if (newFundId !== previousFundId.value) {
        if (models.value.parameters) {
          models.value.parameters.fic_business_line_id = undefined
        }

        if (data_form.value?.parameters) {
          data_form.value.parameters.fic_business_line_id = undefined
        }

        previousFundId.value = newFundId
      }
    },
    { immediate: false }
  )

  watch(
    () => data_form.value?.collective_investment_fund_id,
    async (newFundId) => {
      if (newFundId) {
        await _loadFicProfilesByFund(newFundId)

        const selectedFund = funts_to_investment_plans.value.find((fund) => {
          return fund.id === newFundId
        })

        if (selectedFund?.fic_parameters?.[0]) {
          const ficParameters = selectedFund
            .fic_parameters[0] as (typeof selectedFund.fic_parameters)[0] & {
            penalty?: boolean | null
          }

          if (
            ficParameters.penalty !== undefined &&
            ficParameters.penalty !== null
          ) {
            const penaltyValue = Boolean(ficParameters.penalty)
            radioPenalty.value = penaltyValue
            radioPenaltyDisabled.value = true
            setParameterValue('penalty', penaltyValue)

            if (
              ficParameters.pernalty_percentage !== undefined &&
              ficParameters.pernalty_percentage !== null
            ) {
              setParameterValue(
                'percentage',
                String(ficParameters.pernalty_percentage)
              )
            }
          } else {
            radioPenaltyDisabled.value = true
          }
        } else {
          radioPenaltyDisabled.value = true
        }
      }
    },
    { immediate: true }
  )

  return {
    models,
    formParameter,
    formatCurrency,
    fic_manager_profiles,
    fic_advisor_profiles,
    filteredBusinessLines,
    has_types_participation,
    business_trusts_with_code,
    radioHasWebOperations,
    radioPenalty,
    radioPenaltyDisabled,
    radioHasTrustManagement,
    only_number,
    only_number_with_max_integers_and_decimals,
    setParameterValue,
  }
}

export default useParameterForm
