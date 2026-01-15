// Vue - Pinia
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IAccountsPayableNotificationForm } from '@/interfaces/customs/accounts-payable/AccountsPayableNotifications'
import { ITrustBusinessItemList } from '@/interfaces/customs/trust-business/v2/TrustBusinessManagement'
import { IBaseTableProps } from '@/interfaces/global/Table'
import { ActionType } from '@/interfaces/global/Action'
import { TrustBusinessStatusID } from '@/interfaces/global/TrustBusiness'

// Composables
import { useUtils } from '@/composables'

//Stores
import { useAccountsPayableResourceStore } from '@/stores/resources-manager/accounts-payable'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useUserResourceStore } from '@/stores/resources-manager/users'
import { useTrustBusinessStore } from '@/stores/trust-business'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useBasicDataForm = (
  props: {
    data?: IAccountsPayableNotificationForm | null
    preloadBusinnessTrust?: ITrustBusinessItemList[]
    action: ActionType
  },
  emit: Function
) => {
  const { _getTrustBusinessList } = useTrustBusinessStore('v2')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { trust_business_list, trust_business_pages } = storeToRefs(
    useTrustBusinessStore('v2')
  )

  const { business_trust_types, business_trust_only_subtypes } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )

  const {
    notification_modules,
    notification_processes,
    notification_subprocesses,
    notification_channels,
  } = storeToRefs(useAccountsPayableResourceStore('v1'))

  const { user_roles } = storeToRefs(useUserResourceStore('v1'))

  const isBusinessListEmpty = ref(true)
  const showState = ref(false)

  const basicDataFormRef = ref()
  const searchBusiness = ref('')

  const { isEmptyOrZero, formatParamsCustom } = useUtils()

  const models = ref<IAccountsPayableNotificationForm>({
    notification_number: '',
    module: '',
    process: '',
    sub_process: '',
    recipients: null,
    channels: [],
    message: '',
    has_businesses: false,
    business_type_ids: null,
    business_sub_type_ids: [],
    selected_business_trust: [],
  })

  const selectedRows = ref<ITrustBusinessItemList[]>([])

  const tableProps = ref<IBaseTableProps<ITrustBusinessItemList>>({
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        field: 'id',
        sortable: true,
        align: 'left',
      },
      {
        name: 'business',
        required: false,
        label: 'Código/Negocio',
        field: (row) => `${row.business_code} - ${row.name}`,
        align: 'left',
        sortable: true,
      },
      {
        name: 'business_type_ids',
        required: false,
        label: 'Tipo de negocio',
        field: (row) => row.type?.name,
        align: 'left',
        sortable: true,
      },
      {
        name: 'status',
        required: false,
        label: 'Estado',
        align: 'left',
        field: (row) => row.status?.id,
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const listAction = async (
    filters: Record<string, string | number | null>
  ) => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    const queryString = formatParamsCustom({
      ...filters,
      'filter[status_id]': `${TrustBusinessStatusID.VALID},${TrustBusinessStatusID.LIQUIDATION}`,
    })
    await _getTrustBusinessList(queryString)
    tableProps.value.loading = false
  }

  const filtersFormat = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  const searchIsDisabled = computed(() => {
    if (!models.value.business_type_ids) return true
    if (
      !models.value.has_businesses ||
      models.value.business_type_ids.length === 0
    ) {
      return true
    }
    return false
  })

  const handleSearch = async () => {
    filtersFormat.value = {
      page: 1,
      rows: 20,
    }

    searchBusiness.value = ''

    if (
      models.value.business_type_ids &&
      models.value.business_type_ids.length > 0
    ) {
      filtersFormat.value['filter[business_type_id]'] =
        models.value.business_type_ids.toString()
    }

    if (
      models.value.business_sub_type_ids &&
      models.value.business_sub_type_ids.length > 0
    ) {
      filtersFormat.value['filter[business_subtype_id]'] =
        models.value.business_sub_type_ids.toString()
    }

    await listAction(filtersFormat.value)

    showState.value = true
    isBusinessListEmpty.value = tableProps.value.rows.length === 0
  }

  const updatePage = (page: number) => {
    filtersFormat.value.page = page
    listAction(filtersFormat.value)
  }

  const updateRowsPerPage = (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows
    listAction(filtersFormat.value)
  }

  const key_processes = {
    accounts_payable: ['notification_processes'],
  }

  watch(
    () => models.value.module,
    (val, oldVal) => {
      if (!val) {
        _resetKeys(key_processes)
        models.value.process = null
        return
      }
      _getResources(key_processes, `filter[module]=${val}`)
      if (oldVal === '') return
      models.value.process = null
    }
  )

  const key_subprocesses = {
    accounts_payable: ['notification_subprocesses'],
  }

  watch(
    () => models.value.process,
    (val, oldVal) => {
      if (!val) {
        _resetKeys(key_subprocesses)
        models.value.sub_process = null
        return
      }
      _getResources(key_subprocesses, `filter[process]=${val}`)
      if (oldVal === '') return
      models.value.sub_process = null
    }
  )

  watch(
    () => models.value.has_businesses,
    (val) => {
      if (!val) {
        models.value.business_type_ids = null
        models.value.business_sub_type_ids = []
        models.value.selected_business_trust = []
        tableProps.value.rows = []
        showState.value = false
        isBusinessListEmpty.value = true
        searchBusiness.value = ''
      }
    }
  )

  const key_business_trust_subtypes = {
    trust_business: ['business_trust_only_subtypes'],
  }
  watch(
    () => models.value.business_type_ids,
    (val, oldVal) => {
      _resetKeys(key_business_trust_subtypes)
      if (oldVal) {
        models.value.business_sub_type_ids = []
      }

      if (!val || val.length === 0) {
        searchBusiness.value = ''
        return
      }
      _getResources(
        key_business_trust_subtypes,
        `filter[business_type_id]=${val.join(',')}`
      )
    }
  )

  const handleSearchDebounced = (val: string | null) => {
    let debounceTimer: ReturnType<typeof setTimeout> | null = null
    const q = (val ?? '').trim()

    if (debounceTimer) {
      clearTimeout(debounceTimer)
      debounceTimer = null
    }

    if (
      !q &&
      models.value.has_businesses &&
      models.value.business_type_ids &&
      models.value.business_type_ids.length > 0
    ) {
      filtersFormat.value = {
        page: 1,
        rows: 20,
      }
      listAction(filtersFormat.value)
      return
    }

    debounceTimer = setTimeout(() => {
      filtersFormat.value.page = 1
      filtersFormat.value['filter[search]'] = q
      listAction(filtersFormat.value)
    }, 500)
  }

  watch(
    () => searchBusiness.value,
    (val) => {
      handleSearchDebounced(val)
    }
  )

  watch(
    () => models.value,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    {
      deep: true,
    }
  )

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
    () => props.preloadBusinnessTrust,
    (val) => {
      if (!val) return
      if (val.length === 0) return
      tableProps.value.rows = val
      isBusinessListEmpty.value = tableProps.value.rows.length === 0
    },
    { deep: true, immediate: true }
  )

  watch(
    () => trust_business_list.value,
    (val) => {
      tableProps.value.rows = val
      tableProps.value.pages.currentPage =
        trust_business_pages.value.currentPage
      tableProps.value.pages.lastPage = trust_business_pages.value.lastPage
    },
    { deep: true }
  )

  const keys = {
    accounts_payable: ['notification_processes', 'notification_subprocesses'],
  }

  onMounted(() => {
    if (props.action === 'view') {
      showState.value = true
    }
  })

  onBeforeUnmount(() => _resetKeys(keys))

  return {
    basicDataFormRef,
    models,
    notification_modules,
    notification_processes,
    notification_subprocesses,
    notification_channels,
    user_roles,
    business_trust_types,
    business_trust_only_subtypes,
    searchIsDisabled,
    searchBusiness,
    isBusinessListEmpty,
    showState,
    tableProps,
    selectedRows,
    handleSearch,
    updatePage,
    updateRowsPerPage,
  }
}

export default useBasicDataForm
