// Vue - Pinia
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ITabs, IBaseTableProps } from '@/interfaces/global'
import {
  IAccountsPayableClosingForm,
  IAccountsPayableClosingBusiness,
} from '@/interfaces/customs/accounts-payable/AccountsPayableClosing'
import type { ISelectorResources } from '@/interfaces/customs/Filters'

// Constants
import {
  ACCOUNTS_PAYABLE_CLOSING_ACTION_OPTIONS,
  ACCOUNTS_PAYABLE_CLOSING_MODE_OPTIONS,
} from '@/constants/resources/accounts-payable-closing'

// Composables
import { useAlert, useGoToUrl, useMainLoader, useUtils } from '@/composables/index'
import { transformDate } from '@/utils/index'

// Stores
import {
  useResourceManagerStore,
  useTrustBusinessResourceStore,
} from '@/stores/index'
import { useAccountsPayableClosingStore } from '@/stores/accounts-payable/accounts-payable-closing'

const useAccountsPayableClosingCreate = () => {
  // hooks
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()
  const { showAlert } = useAlert()

  // stores
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { business_trusts } = storeToRefs(useTrustBusinessResourceStore('v1'))
  const closingStore = useAccountsPayableClosingStore('v1')
  const {
    _resetBusinessList,
    _businessListAction,
    _executeAction,
    _setConfirmationData,
  } = closingStore
  const { business_list } = storeToRefs(closingStore)

  // keys
  const keys = ref({
    trust_business: ['business_trusts'],
  })

  // refs
  const basicDataFormRef = ref()
  const basic_data_form = ref<IAccountsPayableClosingForm>({
    action_type: null,
    closing_mode: null,
    closing_date: null,
    business_from: null,
    business_to: null,
  })
  const selectedBusinesses = ref<IAccountsPayableClosingBusiness[]>([])
  const businessTableRef = ref()

  // computed
  const businessOptions = business_trusts

  // props
  const headerProps = {
    title: 'Crear cierre de cuentas por pagar',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas por pagar', route: '' },
      { label: 'Cierre de negocios', route: 'AccountsPayableClosingList' },
      { label: 'Crear', route: 'AccountsPayableClosingCreate' },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const tableProps = ref<IBaseTableProps<IAccountsPayableClosingBusiness>>({
    title: 'Listado de negocios',
    loading: false,
    columns: [
      {
        name: 'id',
        label: '#',
        align: 'center',
        field: 'id',
        sortable: true,
      },
      {
        name: 'code',
        required: true,
        label: 'Código / Negocio',
        align: 'left',
        field: 'code',
        sortable: true,
      },
      {
        name: 'period',
        required: true,
        label: 'Periodo',
        align: 'left',
        field: 'period',
        sortable: true,
        format: (val: string) => {
          if (!val) return '-'
          if (val.length === 6 && /^\d{6}$/.test(val)) {
            return `${val.slice(0, 4)}/${val.slice(4)}`
          }
          return val.replace('-', '/')
        },
      },
      {
        name: 'closing_type',
        required: true,
        label: 'Tipo de cierre',
        align: 'left',
        field: 'closure_type',
        sortable: true,
      },
      {
        name: 'last_closure_date_business',
        required: true,
        label: 'Fecha último cierre',
        align: 'left',
        field: 'last_closure_date_business',
        sortable: true,
        format: (val: string) => transformDate(val, true),
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  // methods
  const getBusinessCode = (
    businessId: string | number | null
  ): string | null => {
    if (!businessId) return null
    const option = businessOptions.value.find(
      (item: ISelectorResources) => item.value === businessId
    )
    return option?.code ?? null
  }

  const handleSearch = async () => {
    const isValid = await basicDataFormRef.value?.validateForm()
    if (!isValid) return

    if (!basic_data_form.value) return

    const {
      business_from,
      business_to,
      closing_mode,
      action_type,
      closing_date,
    } = basic_data_form.value

    const businessCodeFrom = getBusinessCode(business_from)
    const businessCodeTo = getBusinessCode(business_to)

    if (!businessCodeFrom || !businessCodeTo) {
      showAlert('Los negocios seleccionados no son válidos.', 'warning')
      return
    }

    if (Number(businessCodeFrom) > Number(businessCodeTo)) {
      showAlert(
        'El negocio desde no puede ser mayor que el negocio hasta.',
        'warning'
      )
      return
    }

    const closingModeLabel =
      ACCOUNTS_PAYABLE_CLOSING_MODE_OPTIONS.find(
        (option) => option.value === closing_mode
      )?.label ?? ''

    const actionLabel =
      ACCOUNTS_PAYABLE_CLOSING_ACTION_OPTIONS.find(
        (option) => option.value === action_type
      )?.label ?? ''

    tableProps.value.loading = true
    selectedBusinesses.value = []

    openMainLoader(true)
    await _businessListAction({
      business_trust_code_since: Number(businessCodeFrom),
      business_trust_code_until: Number(businessCodeTo),
      closure_type: closingModeLabel,
      action_type: actionLabel,
      closure_date: closing_date ?? '',
      accounts_payables: [],
      closing_mode: closingModeLabel,
    })

    tableProps.value.rows = [...business_list.value]
    tableProps.value.loading = false
    openMainLoader(false)
  }

  const handleClear = () => {
    if (basic_data_form.value) {
      basic_data_form.value = {
        action_type: null,
        closing_mode: null,
        closing_date: null,
        business_from: null,
        business_to: null,
      }
    }
    selectedBusinesses.value = []
    _resetBusinessList()
    tableProps.value.rows = []
    basicDataFormRef.value?.resetForm()
  }

  const handleCreate = async () => {
    const isValid = await basicDataFormRef.value?.validateForm()
    if (!isValid) return

    if (!basic_data_form.value) return

    if (!selectedBusinesses.value.length) {
      showAlert('Debe seleccionar al menos un negocio', 'warning')
      return
    }

    const executePayload = selectedBusinesses.value.map((business) => ({
      id: business.id,
      business_trust_id: business.business_trust_id,
      closure_date: basic_data_form.value.closing_date ?? '',
    }))

    openMainLoader(true)
    const executeResults = await _executeAction(executePayload)

    if (executeResults) {
      _setConfirmationData(basic_data_form.value, executeResults)
      goToURL('AccountsPayableClosingResult')
    }

    openMainLoader(false)
  }

  // watchers
  watch(
    business_list,
    (rows) => {
      tableProps.value.rows = [...rows]
      selectedBusinesses.value = []
    },
    { deep: true }
  )

  // lifecycle
  onMounted(() => {
    openMainLoader(true)
    _getResources(keys.value)
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys.value)
    _resetBusinessList()
  })

  return {
    // configs
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,

    // refs
    basicDataFormRef,
    basic_data_form,
    businessTableRef,
    tableProps,
    selectedBusinesses,
    businessOptions,

    // methods
    handleCreate,
    handleSearch,
    handleClear,
    goToURL,
    defaultIconsLucide,
  }
}

export default useAccountsPayableClosingCreate
