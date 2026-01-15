// vue | quasar | router
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { QTable } from 'quasar'

// store
import { storeToRefs } from 'pinia'
import {
  useCheckDeliveryStore,
  useResourceManagerStore,
  useTreasuryResourceStore,
} from '@/stores'

// composables
import { useMainLoader, useRules } from '@/composables'

// utils
import { defaultIconsLucide, formatParamsCustom } from '@/utils'
import { useUtils } from '@/composables/useUtils'
import {
  ICheckDeliveryFilter,
  ICheckDeliveryList,
  IFieldFilters,
} from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'

const useCheckDeliveryList = () => {
  // store
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { business_trust, business_bank_accounts_check } = storeToRefs(
    useTreasuryResourceStore('v1')
  )
  const { _getApiCheckDelivery, _confirmCheckDelivery } =
    useCheckDeliveryStore('v1')
  const { data_check_delivery_list, data_check_delivery_pages } = storeToRefs(
    useCheckDeliveryStore('v1')
  )

  // utils
  const { openMainLoader } = useMainLoader()

  // props
  const accountOptions = ref()
  const alertModalRef = ref()
  const filterFormat = ref()
  const selectedsRowIds = ref<number[]>([])
  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'business_id',
      label: 'Negocio*',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      options: business_trust,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
      rules: [
        (val: string) => useRules().is_required(val, 'Negocio es requerido'),
      ],
    },
    {
      name: 'bank_id',
      label: 'Banco*',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      options: business_bank_accounts_check,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
      rules: [
        (val: string) => useRules().is_required(val, 'Banco es requerido'),
      ],
    },
    {
      name: 'account',
      label: 'Cuenta bancaria*',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      options: accountOptions,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
      rules: [
        (val: string) =>
          useRules().is_required(val, 'Cuenta bancaria es requerido'),
      ],
    },
  ])
  const tableProps = ref({
    title: 'Listado de entrega de cheques',
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
        format: (item) => item || '-',
      },

      {
        name: 'isDelivered',
        required: false,
        label: 'Entregado',
        align: 'left',
        field: 'isDelivered',
        sortable: true,
        format: (item) => item || '-',
      },
      {
        name: 'check_number',
        required: false,
        label: 'Cheque',
        align: 'left',
        field: 'check_number',
        sortable: true,
        format: (item) => item || '-',
      },
      {
        name: 'status',
        required: false,
        label: 'Estado',
        align: 'left',
        field: 'status',
        sortable: true,
        format: (_, item) => item.status?.name || '-',
      },
      {
        name: 'expense_date',
        required: false,
        label: 'Fecha de egreso',
        align: 'left',
        field: 'expense_date',
        sortable: true,
        format: (item) => item || '-',
      },
      {
        name: 'value',
        required: false,
        label: 'Valor',
        align: 'left',
        field: 'value',
        sortable: true,
        format: (item) => useUtils().formatCurrencyString(item) || '-',
      },
      {
        name: 'delivery_date',
        required: false,
        label: 'Fecha de entrega',
        align: 'left',
        field: 'delivery_date',
        sortable: true,
        format: (item) => item || '-',
      },
      {
        name: 'document_number',
        required: false,
        label: 'Documento del autorizado',
        align: 'left',
        field: 'document_number',
        sortable: true,
        format: (_, item) => item.authorized_document?.name || '-',
      },
      {
        name: 'identification',
        required: false,
        label: 'Identificación autorizado',
        align: 'left',
        field: 'identification',
        sortable: true,
        format: (_, item) => item.authorized_identification || '-',
      },
      {
        name: 'instructions',
        required: false,
        label: 'Instrucciones',
        align: 'left',
        field: 'instructions',
        sortable: true,
        format: (item) => item || '-',
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: [] as ICheckDeliveryList[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const headerBreadcrumbs = {
    title: 'Entrega de cheques',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Tesorería',
        route: '',
      },
      {
        label: 'Entrega de cheques',
        route: '',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))
  const tabActive = ref(filteredTabs.value[0].name)

  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  // handlers / actions
  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getApiCheckDelivery(filters)
    tableProps.value.loading = false
  }

  const handlerSearch = ($filters: {
    'filter[business_id]': string
    'filter[bank_id]': string
    'filter[account]': string
  }) => {
    filterFormat.value = {
      bank_account_id: $filters['filter[account]'],
      bank_id: $filters['filter[bank_id]'],
      business_id: $filters['filter[business_id]'],
    }

    const queryString = formatParamsCustom(filterFormat.value)

    listAction(`&${queryString}`)
  }

  const updatePage = (page: number) => {
    if (!filterFormat.value) return

    const queryString = formatParamsCustom({
      ...filterFormat.value,
      page,
    })

    listAction(`&${queryString}`)
  }

  const updateRows = (per_page: number) => {
    const queryString = formatParamsCustom({
      ...filterFormat.value,
      rows: per_page,
    })

    listAction(`&${queryString}`)
  }

  const selectBusiness = async (businessVal: number, _: number) => {
    await _getResources(
      {
        treasury: ['business_bank_accounts'],
      },
      `business_bank_accounts&business_id=${businessVal}`,
      'v2'
    )
  }

  const resetBySelectOffice = () => {
    business_bank_accounts_check.value = []
    accountOptions.value = []

    const bankField = filterConfig.value.find(
      (field) => field.name === 'bank_id'
    )
    if (bankField) bankField.value = null

    const accountField = filterConfig.value.find(
      (field) => field.name === 'account'
    )
    if (accountField) accountField.value = null
  }

  const onExpenseCheckUpdate = ($filters: ICheckDeliveryFilter) => {
    const currentBusiness = $filters['filter[business_id]']
    const currentBank = $filters['filter[bank_id]']

    if (
      currentBusiness &&
      currentBusiness !== filterFormat.value['filter[business_id]']
    ) {
      currentBusiness
        ? selectBusiness(Number(currentBusiness), Number(currentBank))
        : resetBySelectOffice()
    }
    if (currentBank && currentBank !== filterFormat.value['filter[bank_id]']) {
      const selectedBank = business_bank_accounts_check.value.find(
        (item) => item.value === currentBank
      )
      accountOptions.value = selectedBank?.payload.account
    }

    filterFormat.value = {
      ...$filters,
    }
  }

  // checkbox table
  const onCheck = (row: ICheckDeliveryList, checked: boolean) => {
    const id = Number(row.id)

    if (checked) {
      if (!selectedsRowIds.value.includes(id)) {
        selectedsRowIds.value.push(id)
      }
    } else {
      selectedsRowIds.value = selectedsRowIds.value.filter(
        (itemId) => itemId !== id
      )
    }
  }

  // modal
  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '',
    entityId: null as number | null,
  })

  const openAlertModal = async () => {
    alertModalConfig.value.description = setAlertModalDescription()
    await alertModalRef.value.openModal()
  }

  const setAlertModalDescription = () => {
    return `¿Desea confirmar la entrega?`
  }

  const confirmDelivery = async () => {
    await alertModalRef.value.closeModal()

    openMainLoader(true)
    await _confirmCheckDelivery({ check_ids: [...selectedsRowIds.value] })
    const queryString = formatParamsCustom(filterFormat.value)
    await listAction(`&${queryString}`)
    openMainLoader(false)
  }

  const handlerClear = () => {
    tableProps.value.rows = []
  }

  // lifecycle hooks
  const keys = ['business_trust', 'business_bank_accounts_check']

  onBeforeUnmount(() => _resetKeys({ treasury: keys }))
  onMounted(async () => {
    await _getResources({ treasury: keys })
  })

  // watch
  watch(
    () => data_check_delivery_list.value,
    () => {
      const transformed = data_check_delivery_list.value.map((item) => ({
        ...item,
        isDelivered: !!item.isDelivered,
      }))
      tableProps.value.rows = transformed
      tableProps.value.pages = data_check_delivery_pages.value
    },
    { deep: true }
  )

  return {
    defaultIconsLucide,
    headerBreadcrumbs,
    alertModalConfig,
    selectedsRowIds,
    alertModalRef,
    filterConfig,
    filteredTabs,
    tabActiveIdx,
    tableProps,
    tabActive,
    onExpenseCheckUpdate,
    confirmDelivery,
    openAlertModal,
    handlerSearch,
    handlerClear,
    updatePage,
    updateRows,
    onCheck,
  }
}

export default useCheckDeliveryList
