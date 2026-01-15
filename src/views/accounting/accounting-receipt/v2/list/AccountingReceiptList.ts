// vue - router - quasar - pinia
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// interfaces
import {
  IFieldFilters,
  IAccountingReceiptItem,
  IAccountingReceiptFilter,
  IBusinessTrustAccountStructure,
} from '@/interfaces/customs'

// composables - utils
import {
  useMainLoader,
  useRouteValidator,
  useRules,
  useUtils,
} from '@/composables'
import { defaultIconsLucide, formatParamsCustom } from '@/utils'

// stores
import {
  useAccountingReceiptsStore,
  useResourceManagerStore,
  useAccountingResourceStore,
} from '@/stores'

const useAccountingReceiptList = () => {
  const { openMainLoader } = useMainLoader()

  const {
    _getAccountingReceiptList,
    _cleanAccountingReceiptsData,
    _annulateAccountingReceipt,
  } = useAccountingReceiptsStore('v2')
  const { accounting_receipt_list, accounting_receipt_pages } = storeToRefs(
    useAccountingReceiptsStore('v2')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const {
    business_trust_label,
    receipt_types_manual_without_cancellation_subtypes,
    voucher_consecutives_by_business_trust_and_receipt_type,
    voucher_statuses_v2,
  } = storeToRefs(useAccountingResourceStore('v1'))

  const router = useRouter()
  const { validateRouter } = useRouteValidator()

  const keys = {
    accounting: ['voucher_status', 'cost_center'],
  }

  const keysV2 = {
    accounting: [
      'receipt_types_manual_without_cancellation_subtypes',
      'voucher_statuses_v2',
    ],
  }

  let perPage = 20
  const showMore = ref<boolean>(false)
  const filtersFormat = ref<Record<string, string | number>>({})
  const filtersRef = ref()
  const selectedBusiness = ref()
  const selectedAccountStructure = ref<
    {
      id: number
      value: number
      label: string
      accounting_structure: string
    }[]
  >([])
  const selectedStructure = computed(() => {
    return selectedAccountStructure.value.find(
      (structure) =>
        structure.value ===
        filtersFormat.value['filter[account_structure_code]']
    )
  })

  const tableProps = ref({
    title: 'Listado de comprobantes',
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'period',
        required: true,
        label: 'Periodo',
        align: 'left',
        field: (row: IAccountingReceiptItem) =>
          `${useUtils().formatDate(row.registration_date, 'MM/YYYY')}`,
        sortable: true,
      },
      {
        name: 'business',
        required: true,
        label: 'Negocio',
        align: 'left',
        field: (row: IAccountingReceiptItem) =>
          `${row.business_trust.business_code} - ${row.business_trust.name}`,
        sortable: true,
      },
      {
        name: 'structure',
        required: true,
        label: 'Estructura contable',
        align: 'left',
        field: () => `${selectedStructure?.value?.label || ''}`,
        sortable: true,
      },
      {
        name: 'cost_center',
        required: true,
        label: 'Centro de costos',
        align: 'left',
        field: (row: IAccountingReceiptItem) =>
          `${row.voucher_data?.[0]?.cost_center?.code ?? ''} - ${
            row.voucher_data?.[0]?.cost_center?.name ?? ''
          }`,
        sortable: true,
      },
      {
        name: 'type',
        required: true,
        label: 'Tipo de comprobante',
        align: 'left',
        field: (row: IAccountingReceiptItem) => `${row.receipt_type.name}`,
        sortable: true,
      },
      {
        name: 'consecutive',
        required: false,
        label: 'Consecutivo',
        align: 'left',
        field: (row: IAccountingReceiptItem) => `${row.code}`,
        sortable: true,
      },
      {
        name: 'voided',
        required: false,
        label: 'Anulado',
        align: 'left',
        field: 'voided',
        sortable: true,
      },
      {
        name: 'status',
        required: true,
        label: 'Estado',
        align: 'left',
        field: (row: IAccountingReceiptItem) => `${row.status_id}`,
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: [] as IAccountingReceiptItem[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const headerProps = {
    title: 'Comprobantes contables',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Contabilidad',
        route: '',
      },
      {
        label: 'Comprobantes contables',
        route: '',
      },
    ],
    btn: {
      label: 'Crear',
      icon: defaultIconsLucide.plusCircle,
    },
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'initial_date',
      label: 'Fecha Inicial*',
      type: 'q-date',
      value: router.currentRoute.value.query.from_date ?? null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      mask: 'YYYY-MM-DD',
      rules: [
        (v: string) =>
          useRules().is_required(v, 'La fecha inicia es requerida'),
      ],
    },
    {
      name: 'final_date',
      label: 'Fecha Final*',
      type: 'q-date',
      value: router.currentRoute.value.query.to_date ?? null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      mask: 'YYYY-MM-DD',
      rules: [
        (v: string) => useRules().is_required(v, 'La fecha final es requerida'),
      ],
    },
    {
      name: 'business_trust_id',
      label: 'Negocio*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: business_trust_label,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      rules: [
        (v: string) => useRules().is_required(v, 'El negocio es requerido'),
      ],
    },
    {
      name: 'account_structure_code',
      label: 'Estructura contable*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: selectedAccountStructure,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
      rules: [
        (v: string) =>
          useRules().is_required(v, 'La estructura contable es requerida'),
      ],
    },
    {
      name: 'receipt_type_id',
      label: 'Tipo de comprobante',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3 q-py-sm',
      options: receipt_types_manual_without_cancellation_subtypes,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
      hide: true,
    },
    {
      name: 'code',
      label: 'Consecutivo',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3 q-py-sm',
      options: voucher_consecutives_by_business_trust_and_receipt_type,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
      hide: true,
    },
    {
      name: 'status',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3 q-py-sm',
      options: voucher_statuses_v2,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: true,
    },
  ])

  const handleShowFilters = () => {
    showMore.value = !showMore.value
    const hiddenFilters = ['receipt_type_id', 'code', 'status']

    filterConfig.value.forEach((field) => {
      if (hiddenFilters.includes(field.name)) {
        field.hide = !showMore.value
      }
    })
  }

  const handleFieldChange = (
    currentFilters: Record<string, string | number | null>
  ) => {
    const business_trust_id = currentFilters['filter[business_trust_id]']
    const receipt_type_id = currentFilters['filter[receipt_type_id]']
    const account_structure_code =
      currentFilters['filter[account_structure_code]']
    const queryParams = new URLSearchParams()
    selectedBusiness.value = null
    if (business_trust_id !== null && business_trust_id !== undefined) {
      queryParams.append('filter[business_trust_id]', String(business_trust_id))
      selectedBusiness.value = business_trust_label.value.find(
        (business) => business.id === parseInt(String(business_trust_id))
      )
      if (selectedBusiness) {
        if (
          selectedBusiness.value?.account?.business_trust_account_structure
            .length > 0
        ) {
          selectedAccountStructure.value =
            selectedBusiness.value?.account?.business_trust_account_structure.map(
              (item: IBusinessTrustAccountStructure) => ({
                id: item.account_structure.id,
                value: item.account_structure.code,
                label: `${item.account_structure.code} - ${item.account_structure.purpose}`,
                accounting_structure: `${item.account_structure.purpose} - ${item.type}`,
              })
            ) ?? null
        } else {
          selectedAccountStructure.value = [
            {
              id: selectedBusiness.value?.account?.accounting_structure?.id,
              value:
                selectedBusiness.value?.account?.accounting_structure?.code,
              label: `${selectedBusiness.value?.account?.accounting_structure?.code} - ${selectedBusiness.value?.account?.accounting_structure?.purpose}`,
              accounting_structure: `${selectedBusiness.value?.account?.accounting_structure?.purpose} - Principal`,
            },
          ]
        }
        const isValidStructure = selectedAccountStructure.value?.some(
          (item) => item.value === account_structure_code
        )
        if (!isValidStructure) {
          filtersRef.value?.cleanFiltersByNames?.(['account_structure_code'])
        }
      }
    } else {
      filtersRef.value?.cleanFiltersByNames?.(['account_structure_code'])
    }
    if (receipt_type_id !== null && receipt_type_id !== undefined) {
      queryParams.append('filter[receipt_type_id]', String(receipt_type_id))
    }
    const queryString = queryParams.toString()
    if (business_trust_id !== null && business_trust_id !== undefined) {
      _getResources(
        {
          accounting: [
            'voucher_consecutives_by_business_trust_and_receipt_type',
          ],
        },
        queryString,
        'v2'
      )
    }
  }

  const handleFilter = ($filters: IAccountingReceiptFilter) => {
    filtersFormat.value = {
      ...$filters,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const clearFilters = () => {
    tableProps.value.rows = []
  }

  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
      rows: perPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const updatePerPage = (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: perPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getAccountingReceiptList(filters)
    tableProps.value.loading = false
  }

  const handleGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  watch(
    () => accounting_receipt_list.value,
    () => {
      tableProps.value.rows = accounting_receipt_list.value
    }
  )

  watch(
    () => accounting_receipt_pages.value,
    () => {
      tableProps.value.pages = accounting_receipt_pages.value
    }
  )

  const alertModalRef = ref()
  const cancelReceiptModalRef = ref()

  const selectedReceipt = ref()

  const openModal = (receipt: IAccountingReceiptItem) => {
    selectedReceipt.value = receipt
    alertModalRef.value.openModal()
  }

  const annulateDate = ref('')

  const cancelReceipt = async () => {
    if (await cancelReceiptModalRef.value.validate()) {
      openMainLoader(true)
      if (
        await _annulateAccountingReceipt(
          selectedReceipt.value.id,
          annulateDate.value
        )
      ) {
        alertModalRef.value.closeModal()
        updatePage(accounting_receipt_pages.value.currentPage)
      }
      openMainLoader(false)
    }
  }

  onMounted(async () => {
    _cleanAccountingReceiptsData()
    tableProps.value.rows = accounting_receipt_list.value
    await _getResources(keys)
    await _getResources(
      { accounting: ['business_trust'] },
      'filter[has_consolidator]=false'
    )
    await _getResources(keysV2, '', 'v2')
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
    _resetKeys(keysV2)
    _resetKeys({
      accounting: ['voucher_consecutives_by_business_trust_and_receipt_type'],
    })
  })

  return {
    // Props
    filtersRef,
    headerProps,
    tableProps,
    alertModalRef,
    cancelReceiptModalRef,
    filterConfig,
    annulateDate,
    // Methods
    handleFilter,
    clearFilters,
    handleShowFilters,
    handleGoTo,
    updatePage,
    updatePerPage,
    cancelReceipt,
    openModal,
    handleFieldChange,
    validateRouter,
  }
}

export default useAccountingReceiptList
