import { ref, onBeforeMount, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useAutomaticDebitSettingsStore } from '@/stores/billing-portfolio/automatic-debit-settings'

// Interfaces
import {
  IAutomaticDebitSettingsForm,
  IAutomaticDebitSettingsResponse,
} from '@/interfaces/customs/billing-portfolio/AutomaticDebitSettings'
import { ITabs } from '@/interfaces/global'

const useAutomaticDebitSettingsView = () => {
  const { _getByIdAutomaticDebit, _clearData } =
    useAutomaticDebitSettingsStore('v1')
  const { headerPropsDefault, automatic_debit_response } = storeToRefs(
    useAutomaticDebitSettingsStore('v1')
  )

  // Data de formularios
  const basic_data_form = ref<IAutomaticDebitSettingsForm | null>(null)

  // Referencias a formularios
  const basicDataFormRef = ref()

  const route = useRoute()
  const searchId = +route.params.id
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide, formatDate } = useUtils()

  const headerProps = {
    title: 'Ver débito automático',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Ver',
        route: 'AutomaticDebitView',
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
        },
      ],
      document: null,

      updated_at: formatDate(updated_at, 'YYYY-MM-DD') ?? null,
      is_active: is_active ? 'Activo' : 'Inactivo',
    }
  }

  const onSubmit = async () => {
    goToURL('AutomaticDebitList')
  }

  onBeforeMount(async () => {
    _clearData()
    openMainLoader(true)
    await _getByIdAutomaticDebit(searchId)
    openMainLoader(false)
  })

  watch(
    () => automatic_debit_response.value,
    (val) => {
      if (!val) return
      setFormEdit(val)
    }
  )

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

export default useAutomaticDebitSettingsView
