// Vue - pinia
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IAutomaticDebitSettingsForm } from '@/interfaces/customs/billing-portfolio/AutomaticDebitSettings'
import { ITabs } from '@/interfaces/global'

// Composables
import { useAlert, useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useAutomaticDebitSettingsStore } from '@/stores/billing-portfolio/automatic-debit-settings'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useAutomaticDebitSettingsCreate = () => {
  const { _createAutomaticDebit } = useAutomaticDebitSettingsStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { headerPropsDefault } = storeToRefs(
    useAutomaticDebitSettingsStore('v1')
  )

  // Data de formularios
  const basic_data_form = ref<IAutomaticDebitSettingsForm | null>(null)

  // Referencias a formularios
  const basicDataFormRef = ref()

  const { defaultIconsLucide, cleanEmptyFields } = useUtils()
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()
  const { showAlert } = useAlert()

  const keys = {
    trust_business: ['business_trusts'],
  }

  const headerProps = {
    title: 'Crear débito automático',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Crear',
        route: 'AutomaticDebitCreate',
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'basic-data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  // Datos básicos form
  const makeBaseInfoRequest = (data: IAutomaticDebitSettingsForm | null) => {
    if (!data) return {}

    const zeroFields: Record<string, number> = {}
    if (data.automatic_debit === 'no') zeroFields.automatic_debit = 0

    const request: Partial<IAutomaticDebitSettingsForm> = {
      business_trust_id: data.business_trust_id,
      automatic_debit: data.automatic_debit === 'si' ? 1 : 0,
      source: data.source,
      business_code_snapshot: data.business_code_snapshot,
      business_name_snapshot: data.business_name_snapshot,
      collective_investment_fund_id: data.collective_investment_fund_id,
      investment_plan_id: data.investment_plan_id,
      account_bank_id: data.account_bank_id,
      account_id: data.account_id,
      document: data.list_documents?.[0]?.file,
    }

    const cleanedRequest = cleanEmptyFields(request)

    return { ...cleanedRequest, ...zeroFields }
  }

  const makeDataRequest = () => {
    const apiRequestBody: Partial<IAutomaticDebitSettingsForm> = {
      ...makeBaseInfoRequest(basic_data_form.value),
    }

    return apiRequestBody
  }

  const validateForms = async () => {
    let valid: boolean = false
    const forms = [basicDataFormRef]

    try {
      valid = (await forms[tabActiveIdx]?.value?.validateForm()) ?? false
    } catch {
      valid = false
    }
    return valid
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return
    if (!basic_data_form.value?.list_documents?.[0]?.file) {
      showAlert('¡Debes cargar un documento!', 'error')
      return
    }

    openMainLoader(true)
    const payload = makeDataRequest()
    const success = await _createAutomaticDebit(payload)
    if (success) {
      goToURL('AutomaticDebitList')
    }
    openMainLoader(false)
  }

  watch(
    () => [
      basic_data_form.value?.source,
      basic_data_form.value?.business_trust_id,
    ],
    ([source, businessTrustId], [oldSource, oldBusinessTrustId]) => {
      if (!basic_data_form.value) return

      if (source === oldSource && businessTrustId === oldBusinessTrustId) {
        return
      }

      basic_data_form.value.collective_investment_fund_id = null
      basic_data_form.value.investment_plan_id = null
      basic_data_form.value.account_bank_id = null
      basic_data_form.value.account_id = null

      _resetKeys({
        treasury: ['banks', 'treasury_bank_accounts_with_name'],
        fics: ['funds', 'fiduciary_investment_plans'],
      })

      if (!source || !businessTrustId) return

      if (source === 'account') {
        _getResources({ treasury: ['banks'] }, `id=${businessTrustId}`)
      } else if (source === 'investment_plan') {
        _getResources(
          { fics: ['funds'] },
          `business_trust_id=${businessTrustId}`
        )
      }
    }
  )

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keys, 'filter[status_id]=57,59')
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  return {
    basic_data_form,
    basicDataFormRef,
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,

    onSubmit,
    goToURL,
  }
}

export default useAutomaticDebitSettingsCreate
