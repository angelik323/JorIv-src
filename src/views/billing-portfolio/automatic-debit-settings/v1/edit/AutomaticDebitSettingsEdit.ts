import { ref, onBeforeMount, watch, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

// Interfaces
import {
  IAutomaticDebitSettingsForm,
  IAutomaticDebitSettingsResponse,
} from '@/interfaces/customs/billing-portfolio/AutomaticDebitSettings'
import { ITabs } from '@/interfaces/global'

// Composables
import { useAlert, useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useAutomaticDebitSettingsStore } from '@/stores/billing-portfolio/automatic-debit-settings'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useAutomaticDebitSettingsEdit = () => {
  const { _updateAutomaticDebit, _getByIdAutomaticDebit, _clearData } =
    useAutomaticDebitSettingsStore('v1')
  const { headerPropsDefault, automatic_debit_response } = storeToRefs(
    useAutomaticDebitSettingsStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  // Data de formularios
  const basic_data_form = ref<IAutomaticDebitSettingsForm | null>(null)

  // Referencias a formularios
  const basicDataFormRef = ref()

  const isInitialLoad = ref(true)

  const route = useRoute()
  const searchId = +route.params.id
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { cleanEmptyFields, defaultIconsLucide, formatDate } = useUtils()
  const { showAlert } = useAlert()

  const keys = {
    trust_business: ['business_trusts'],
  }

  const headerProps = {
    title: 'Editar débito automático',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Editar',
        route: 'AutomaticDebitEdit',
      },
      {
        label: `${searchId}`,
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

  const setFormEdit = (data: IAutomaticDebitSettingsResponse) => {
    const {
      business_trust_id,
      business_code_snapshot,
      business_name_snapshot,
      automatic_debit,
      source,
      collective_investment_fund_id,
      collective_investment_fund_data,
      account_bank_id,
      investment_plan_id,
      account_id,
      investment_plan_data,
      account_bank_data,

      bank_data,
      document_data,
      is_active,
      updated_at,
    } = data

    basic_data_form.value = {
      business_trust_id: business_trust_id ?? null,
      business_code_snapshot: business_code_snapshot ?? null,
      business_name_snapshot: business_name_snapshot ?? null,
      automatic_debit: automatic_debit ? 'Si' : 'No',
      source: source ?? null,
      collective_investment_fund_id: collective_investment_fund_id ?? null,
      investment_plan_id: investment_plan_id ?? null,
      account_bank_id: account_bank_id ?? null,
      account_id: account_id ?? null,

      account_bank_name:
        (bank_data?.bank_code ?? '') + ' - ' + (bank_data?.description ?? ''),
      account_name:
        (account_bank_data?.account_number ?? '') +
        ' - ' +
        (account_bank_data?.account_name ?? ''),

      fund_name:
        (collective_investment_fund_data?.fund_code ?? '') +
        ' - ' +
        (collective_investment_fund_data?.fund_name ?? ''),
      plans_name: investment_plan_data ? investment_plan_data.code : null,

      list_documents: [
        {
          id: document_data.id,
          description: document_data.original_name,
          upload_date: formatDate(document_data.created_at, 'YYYY-MM-DD'),
          temporal_path: document_data.temporal_path,
          original_name: document_data.original_name,
          is_new_document: false,
        },
      ],
      document: null,

      updated_at: formatDate(updated_at, 'YYYY-MM-DD') ?? null,
      is_active: is_active ? 'Activo' : 'Inactivo',
    }
  }

  // Datos básicos form
  const makeBaseInfoRequest = (data: IAutomaticDebitSettingsForm | null) => {
    if (!data) return {}

    const zeroFields: Record<string, number> = {}
    zeroFields.automatic_debit = data.automatic_debit === 'si' ? 1 : 0
    zeroFields.is_active = data.is_active === 'Activo' ? 1 : 0
    zeroFields.is_new_document = data.list_documents?.[0]?.is_new_document
      ? 1
      : 0

    const request: Partial<IAutomaticDebitSettingsForm> = {
      business_trust_id: data.business_trust_id,
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
    if (basic_data_form.value?.list_documents?.length === 0) {
      showAlert('¡Debes cargar un documento!', 'error')
      return
    }

    openMainLoader(true)
    const payload = makeDataRequest()
    const success = await _updateAutomaticDebit(payload, searchId)
    if (success) {
      goToURL('AutomaticDebitList')
    }
    openMainLoader(false)
  }

  watch(
    () => automatic_debit_response.value,
    (val) => {
      if (!val) return
      setFormEdit(val)
    }
  )

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

      if (isInitialLoad.value) {
        isInitialLoad.value = false
      } else {
        basic_data_form.value.collective_investment_fund_id = null
        basic_data_form.value.investment_plan_id = null
        basic_data_form.value.account_bank_id = null
        basic_data_form.value.account_id = null
      }
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

  onBeforeMount(async () => {
    _clearData()
    openMainLoader(true)
    await _getByIdAutomaticDebit(searchId)
    await _getResources(keys, 'filter[status_id]=57,59')
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  return {
    automatic_debit_response,
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

export default useAutomaticDebitSettingsEdit
