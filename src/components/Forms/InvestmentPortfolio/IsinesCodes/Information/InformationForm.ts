// vue | quasar | router
import { computed, onBeforeMount, onUnmounted, ref, watch } from 'vue'

// stores
import { storeToRefs } from 'pinia'
import {
  useInvestmentPortfolioResourceStore,
  useIsinesCodesStore,
  useResourceManagerStore,
} from '@/stores'

// utils
import { ActionType } from '@/interfaces/global'
import { IIsinesCodesForm } from '@/interfaces/customs'
import {
  investment_portfolio_isines_modality,
  investment_portfolio_isines_rates_behaviors,
  investment_portfolio_isines_title_classes,
} from '@/constants'
import { useAlert, useMainLoader, useUtils } from '@/composables'

const useInformationForm = (props: {
  action: ActionType
  data?: IIsinesCodesForm | null
}) => {
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _setDataInformationForm } = useIsinesCodesStore('v1')
  const { data_information_form } = storeToRefs(useIsinesCodesStore('v1'))
  const {
    isines_administrators_codes,
    isines_rates_behaviors,
    isines_titles_classes,
    isines_perioricities,
    isines_interest_rates,
    emitter_anna_codes,
  } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))

  const { getFutureDateByYears } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { showAlert } = useAlert()

  const keys = {
    investment_portfolio: ['emitter_anna_codes'],
  }

  // props
  const formElementRef = ref()
  const initialModelsValues: IIsinesCodesForm = {
    id: null,
    description: '',
    isin_code: '',
    mnemonic: '',
    issuer_code: '',
    administrator_code: '',
    title_class: '',
    issue_date: '',
    maturity_date: '',
    perioricity: '',
    rate_type: '',
    issuance_series: '',
    issuance_year: null,
    fixed_rate_value: null,
    rate_code: '',
    rate_behavior: '',
    observation: '',
    isin_code_history: null,
    modality: '',
    spread: '',
  }

  const models = ref<IIsinesCodesForm>({
    ...initialModelsValues,
  })

  // handlers / actions
  const handlerActionForm = (action: ActionType) => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: data_information_form.value ? _setValueModel : setFormEdit,
      view: _setFormView,
    }
    actionHandlers[action]?.()
  }

  const setFormData = (data: IIsinesCodesForm) => {
    models.value.isin_code = data.isin_code ?? ''
    models.value.description = data.description ?? ''
    models.value.mnemonic = data.mnemonic ?? ''
    models.value.issuer_code = data.issuer_code ?? ''
    models.value.title_class = data.title_class ?? ''
    models.value.issue_date = data.issue_date ?? ''
    models.value.maturity_date = data.maturity_date ?? ''
    models.value.perioricity = data.perioricity ?? ''
    models.value.rate_type = data.rate_type ?? ''
    models.value.administrator_code = data.administrator_code ?? ''
    models.value.issuance_series = data.issuance_series ?? ''
    models.value.issuance_year = data.issuance_year ?? null
    models.value.fixed_rate_value = data.fixed_rate_value ?? null
    models.value.rate_code = data.rate_code ?? ''
    models.value.rate_behavior = data.rate_behavior ?? ''
    models.value.observation = data.observation ?? ''
    models.value.isin_code_history = data.isin_code_history ?? null
    models.value.modality = data.modality ?? ''
    models.value.spread = data.spread ?? ''
  }

  const setFormEdit = async () => {
    clearForm()
    if (props.data) setFormData(props.data)
  }

  const _setFormView = async () => {
    if (!data_information_form.value) return

    Object.assign(models.value, data_information_form.value)
  }

  const _setValueModel = () => {
    if (!data_information_form.value) return

    Object.assign(models.value, data_information_form.value)
  }

  const clearForm = () => {
    Object.assign(models.value, initialModelsValues)
  }

  const handleFetchAnnaCodes = async (code: string) => {
    openMainLoader(true)
    await _getResources(keys, `filter[search]=${code}`)
    openMainLoader(false)

    if (emitter_anna_codes.value.length === 0) {
      showAlert('No se encontraron códigos de emisor', 'warning')
      return
    }

    showAlert('Códigos de emisor obtenidos exitosamente', 'success')
  }

  // Computed properties
  const isShareOrHoldingsTitleClass = computed<boolean>(() => {
    if (
      models.value.title_class ===
        investment_portfolio_isines_title_classes.shares ||
      models.value.title_class ===
        investment_portfolio_isines_title_classes.holdings
    ) {
      return true
    }

    return false
  })

  const isFixedRate = computed<boolean | null>({
    get: () => {
      if (
        models.value.rate_type ===
        investment_portfolio_isines_rates_behaviors.fixed
      )
        return true
      if (
        models.value.rate_type ===
        investment_portfolio_isines_rates_behaviors.variable
      )
        return false

      return null
    },
    set: (val) => {
      models.value.rate_type = val
        ? investment_portfolio_isines_rates_behaviors.fixed
        : investment_portfolio_isines_rates_behaviors.variable
    },
  })

  const isInAdvanceModality = computed<boolean | null>({
    get: () => {
      if (
        models.value.modality ===
        investment_portfolio_isines_modality.in_advance
      )
        return true

      if (
        models.value.modality === investment_portfolio_isines_modality.expired
      )
        return false

      return null
    },
    set: (val) => {
      models.value.modality = val
        ? investment_portfolio_isines_modality.in_advance
        : investment_portfolio_isines_modality.expired
    },
  })

  const computedIsinesRateBehavior = computed(() => {
    return isines_rates_behaviors.value.map((option) => {
      if (
        isFixedRate.value === true &&
        option.value === investment_portfolio_isines_rates_behaviors.variable
      )
        return { ...option, disable: true }

      if (
        isFixedRate.value === false &&
        option.value === investment_portfolio_isines_rates_behaviors.fixed
      )
        return { ...option, disable: true }

      return { ...option, disable: false }
    })
  })

  // lifecycle hooks
  onUnmounted(async () => {
    _setDataInformationForm(null)
    _resetKeys(keys)
  })

  onBeforeMount(async () => {
    handlerActionForm(props.action)
  })

  // watchers
  watch(
    () => models.value.isin_code,
    async (code) => {
      if (!code || code.length < 6) {
        models.value.issuer_code = ''
        _resetKeys(keys)
        return
      }

      if (code.length === 6 && props.action === 'create')
        await handleFetchAnnaCodes(code)

      return
    },
  )

  watch(
    isFixedRate,
    () => {
      if (isFixedRate.value === false) {
        models.value.fixed_rate_value = 0
        models.value.rate_behavior =
          investment_portfolio_isines_rates_behaviors.variable
      }

      if (isFixedRate.value === true) {
        models.value.rate_code = ''
        models.value.rate_behavior =
          investment_portfolio_isines_rates_behaviors.fixed
      }
    },
    { immediate: true },
  )

  watch(
    () => data_information_form.value,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    },
    { deep: true, immediate: true },
  )

  watch(isShareOrHoldingsTitleClass, (value) => {
    if (!value) return

    isFixedRate.value = null
    isInAdvanceModality.value = null

    models.value.maturity_date = ''
    models.value.perioricity = ''
    models.value.fixed_rate_value = null
    models.value.rate_type = ''
    models.value.rate_code = ''
    models.value.rate_behavior = ''
    models.value.modality = ''
    models.value.spread = ''
  })

  return {
    isines_administrators_codes,
    computedIsinesRateBehavior,
    isShareOrHoldingsTitleClass,
    isines_titles_classes,
    emitter_anna_codes,
    isines_perioricities,
    formElementRef,
    isines_interest_rates,
    isFixedRate,
    isInAdvanceModality,
    models,
    investment_portfolio_isines_modality,
    getFutureDateByYears,
  }
}

export default useInformationForm
