import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { defaultIconsLucide, formatParamsCustom } from '@/utils'
import { IFieldFilters, IAccountingReceiptItem } from '@/interfaces/customs'
import { useAccountingReceiptsStore, useResourceStore } from '@/stores'
import { QTable } from 'quasar'
import { useRouter } from 'vue-router'
import { useMainLoader, useRules, useUtils } from '@/composables'

const useAccountingReceiptList = () => {
  const { openMainLoader } = useMainLoader()
  const {
    _getAccountingReceiptList,
    _cleanAccountingReceiptsData,
    _annulateAccountingReceipt,
  } = useAccountingReceiptsStore('v1')
  const { accounting_receipt_list, accounting_receipt_pages } = storeToRefs(
    useAccountingReceiptsStore('v1')
  )
  const { business_trust, account_structures, voucher_status, cost_center } =
    storeToRefs(useResourceStore('v1'))
  const { _getAccountingResources } = useResourceStore('v1')

  const router = useRouter()

  const keys = [
    'business_trust',
    'account_structures',
    'voucher_status',
    'cost_center',
  ]

  let perPage = 20

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
        field: (row: IAccountingReceiptItem) =>
          `${row.voucher_data?.[0]?.account?.account_structure?.code ?? ''} - ${
            row.voucher_data?.[0]?.account?.account_structure?.purpose ?? ''
          }`,
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
        route: '',
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
      name: 'period',
      label: 'Periodo*',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      disable: false,
      clean_value: true,
      placeholder: 'MM/AAAA',
      mask: 'MM/YYYY',
      rules: [
        (v: string) => useRules().is_required(v, 'El periodo es requerido'),
      ],
    },
    {
      name: 'business_trust_id',
      label: 'Negocio',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4 q-py-md',
      options: business_trust,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4 q-py-md',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por código de estructura y/o finalidad',
    },
    {
      name: 'status',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4 q-py-md',
      options: voucher_status,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: true,
    },
    {
      name: 'cost_center_id',
      label: 'Centro de costos',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4 q-py-md',
      options: cost_center,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: true,
    },
    {
      name: 'account_structure_code',
      label: 'Estructura contables',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4 q-py-md',
      options: account_structures,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: true,
    },
  ])

  const handleShowFilters = (showMore: boolean) => {
    const hiddenFilters = ['status', 'cost_center_id', 'account_structure_code']
    filterConfig.value.forEach((field) => {
      if (hiddenFilters.includes(field.name)) {
        field.hide = !showMore
      }
    })
  }

  const filtersFormat = ref<Record<string, string | number>>({})

  const handleFilter = ($filters: { 'filter[search]': string }) => {
    filtersFormat.value = {
      ...$filters,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
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

  onMounted(async () => {
    _cleanAccountingReceiptsData()
    tableProps.value.rows = accounting_receipt_list.value
    _getAccountingResources(`keys[]=${keys.join('&keys[]=')}`)
  })

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

  return {
    // Props
    headerProps,
    tableProps,
    alertModalRef,
    cancelReceiptModalRef,
    filterConfig,
    annulateDate,
    // Methods
    handleFilter,
    handleShowFilters,
    handleGoTo,
    updatePage,
    updatePerPage,
    cancelReceipt,
    openModal,
  }
}

export default useAccountingReceiptList
