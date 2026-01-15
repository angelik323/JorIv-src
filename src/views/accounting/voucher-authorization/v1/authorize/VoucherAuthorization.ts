// Core
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Composables
import {
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
  useRules,
  useUtils,
} from '@/composables'

// Interfaces
import { QTable } from 'quasar'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import {
  IPendingVoucherItem,
  IVoucherAuthorizationPayload,
} from '@/interfaces/customs/accounting/VoucherAuthorization'

// Stores
import { useVoucherAuthorizationStore } from '@/stores/accounting/voucher-authorization'
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'
import {
  useResourceManagerStore,
  useUserResourceStore,
} from '@/stores/resources-manager'

const useVoucherAuthorization = () => {
  const {
    defaultIconsLucide,
    formatDate,
    formatCurrency,
    getCurrentDateFormatted,
  } = useUtils()
  const { is_required } = useRules()
  const { validateRouter } = useRouteValidator()
  const { openMainLoader } = useMainLoader()

  const headerProps = {
    title: 'Autorización de comprobantes',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad' },
      { label: 'Autorización de comprobantes', route: 'VoucherAuthorization' },
    ],
  }

  const {
    account_structures_active_revert_vouchers: account_structures,
    business_trusts_by_account_structure_and_equivalence: business_trust,
    voucher_consecutives_pendings_to_authorization: pending_consecutives,
    receipt_types,
    voucher_uploads,
  } = storeToRefs(useAccountingResourceStore('v1'))

  const { users_with_document } = storeToRefs(useUserResourceStore('v1'))

  const { _getPendingVouchers, _processVoucherAuthorization } =
    useVoucherAuthorizationStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const tableProps = ref({
    title: 'Listado de procesos generados',
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
        name: 'register_date',
        required: true,
        label: 'Fecha registro',
        align: 'left',
        field: (row: IPendingVoucherItem) =>
          `${formatDate(row.registration_date, 'YYYY-MM-DD')}`,
        sortable: true,
      },
      {
        name: 'business',
        required: true,
        label: 'Negocio',
        align: 'left',
        field: (row: IPendingVoucherItem) =>
          `${row.business_trust.business_code} - ${row.business_trust.name}`,
        sortable: true,
        style: useUtils().styleColumn(150),
      },
      {
        name: 'receipt_type',
        required: true,
        label: 'Tipo de comprobante',
        align: 'left',
        field: (row: IPendingVoucherItem) =>
          `${row.receipt_type.code} - ${row.receipt_type.name}`,
        sortable: true,
      },
      {
        name: 'consecutive',
        required: true,
        label: 'Consecutivo',
        align: 'left',
        field: (row: IPendingVoucherItem) => `${row.code}`,
        sortable: true,
      },
      {
        name: 'amount',
        required: true,
        label: 'Cuantía',
        align: 'left',
        field: (row: IPendingVoucherItem) => `${formatCurrency(row.amount)}`,
        sortable: true,
      },
      {
        name: 'user',
        required: true,
        label: 'Usuario que registró',
        align: 'left',
        field: (row: IPendingVoucherItem) => `${row.user?.name || '-'}`,
        sortable: true,
      },
      {
        name: 'load',
        required: true,
        label: 'Cargue',
        align: 'left',
        field: (row: IPendingVoucherItem) => `${row.load || '-'}`,
        sortable: true,
      },
      {
        name: 'status',
        required: true,
        label: 'Estado',
        align: 'left',
        field: (row: IPendingVoucherItem) => `${row.status.id}`,
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
    rows: [] as IPendingVoucherItem[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const filterComponentRef = ref()

  const filtersFormat = ref<Record<string, string | number>>({
    rows: 20,
    page: 1,
  })

  const selectStructure = (structureId: number, filterName: string) => {
    filtersFormat.value[filterName] = structureId

    filterComponentRef.value.cleanFiltersByNames([
      'from_business_trust',
      'from_business_trust_name',
      'to_business_trust',
      'to_business_trust_name',
    ])
    _resetKeys({
      accounting: ['business_trusts_by_account_structure_and_equivalence'],
    })

    if (structureId) {
      _getResources(
        {
          accounting: ['business_trusts_by_account_structure_and_equivalence'],
        },
        `filter[source_structure_id]=${structureId}`,
        'v2'
      )
    }
  }

  const selectBusiness = (businessId: number, fieldName: string) => {
    const business = business_trust.value.find(
      (item) => Number(item.value) === Number(businessId)
    )

    if (business) {
      const businessCode =
        business.code ??
        business.business_code ??
        business.label.split(' - ')[0]

      const businessName =
        business.name ?? business.label.split(' - ').slice(1).join(' - ')

      filtersFormat.value[`filter[${fieldName}]`] = businessCode
      filterComponentRef.value.setFieldValueByName(
        `${fieldName}_name`,
        businessName
      )
    } else {
      filterComponentRef.value.setFieldValueByName(`${fieldName}_name`, null)
      delete filtersFormat.value[`filter[${fieldName}]`]
    }
  }

  const sub_receipt_types = computed(
    () =>
      receipt_types.value.find(
        (receiptType) =>
          receiptType.value === filtersFormat.value['filter[receipt_type_id]']
      )?.related
  )

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'period',
      label: 'Periodo*',
      type: 'q-date',
      value: getCurrentDateFormatted('YYYY-MM'),
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM',
      mask: 'YYYY-MM',
      rules: [(v: string) => is_required(v)],
      onChange: (period: string) => {
        filtersFormat.value['filter[period]'] = period
        _getResources(
          { accounting: ['voucher_uploads'] },
          `filter[period]=${period}`,
          'v2'
        )
      },
    },
    {
      name: 'account_structure_id',
      label: 'Estructura contable',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      options: account_structures,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      onChange: selectStructure,
      rules: [],
    },
    {
      name: 'from_business_trust',
      label: 'Desde negocio',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      options: business_trust,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      custom_selection_label: 'business_code',
      onChange: (businessId: number) =>
        selectBusiness(businessId, 'from_business_trust'),
    },
    {
      name: 'from_business_trust_name',
      label: 'Nombre',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: true,
      clean_value: true,
      placeholder: '-',
      readonly: true,
    },
    {
      name: 'to_business_trust',
      label: 'Hasta negocio',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      options: business_trust,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      custom_selection_label: 'business_code',
      onChange: (businessId: number) =>
        selectBusiness(businessId, 'to_business_trust'),
    },
    {
      name: 'to_business_trust_name',
      label: 'Nombre',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: true,
      clean_value: true,
      placeholder: '-',
      readonly: true,
    },
    {
      name: 'receipt_type_id',
      label: 'Tipo de comprobante',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      options: receipt_types,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      onChange: (receiptTypeId: number) => {
        filtersFormat.value['filter[receipt_type_id]'] = receiptTypeId
      },
    },
    {
      name: 'sub_receipt_type_id',
      label: 'Subtipo de comprobante',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      options: sub_receipt_types,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'code',
      label: 'Consecutivo',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      options: pending_consecutives,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      display_label: 'label_with_date_and_type',
      custom_selection_label: 'label',
      hide: true,
    },
    {
      name: 'creator',
      label: 'Usuario',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      options: users_with_document,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      custom_selection_label: 'label_display_name',
      display_label: 'label_display_name',
      hide: true,
    },
    {
      name: 'uploaded_code',
      label: 'Cargue',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      options: voucher_uploads,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      display_value: 'code',
      hide: true,
    },
  ])

  const handleShowFilters = (showMore: boolean) => {
    const hiddenFilters = ['uploaded_code', 'creator', 'code']
    filterConfig.value.forEach((field) => {
      if (hiddenFilters.includes(field.name)) {
        field.hide = !showMore
      }
    })
  }

  const handleFilter = ($filters: Record<string, string | number>) => {
    delete $filters['from_business_trust']
    delete $filters['to_business_trust']
    delete $filters['filter[from_business_trust]']
    delete $filters['filter[to_business_trust]']

    filtersFormat.value = {
      ...filtersFormat.value,
      ...$filters,
    }
    if ($filters['filter[consecutive]']) {
      filtersFormat.value['filter[code]'] = $filters['filter[consecutive]']
      delete filtersFormat.value['filter[consecutive]']
    }
    listAction()
  }

  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
    }
    listAction()
  }

  const updatePerPage = (rowsPerPage: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rowsPerPage,
      page: 1,
    }
    listAction()
  }

  const listAction = async () => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    const pendingVouchers = await _getPendingVouchers(filtersFormat.value)
    if (pendingVouchers) {
      tableProps.value.rows = pendingVouchers.list
      tableProps.value.pages.currentPage = pendingVouchers.pages.currentPage
      tableProps.value.pages.lastPage = pendingVouchers.pages.lastPage
    }
    tableProps.value.loading = false
  }

  watch(
    () => filtersFormat.value,
    () => {
      if (
        filtersFormat.value['filter[from_business_trust]'] &&
        filtersFormat.value['filter[to_business_trust]'] &&
        filtersFormat.value['filter[receipt_type_id]'] &&
        filtersFormat.value['filter[period]']
      ) {
        const consecutiveFilters =
          `filter[from_business_trust_id]=${filtersFormat.value['filter[from_business_trust]']}&` +
          `filter[to_business_trust_id]=${filtersFormat.value['filter[to_business_trust]']}&` +
          `filter[receipt_type_id]=${filtersFormat.value['filter[receipt_type_id]']}&` +
          `filter[period]=${filtersFormat.value['filter[period]']}`

        _getResources(
          { accounting: ['voucher_consecutives_pendings_to_authorization'] },
          consecutiveFilters,
          'v2'
        )
      }
    },
    { deep: true }
  )

  const keys = {
    accounting: ['receipt_types', 'account_structures_active'],
    user: ['users'],
  }

  onMounted(async () => {
    _getResources(keys)
  })

  onBeforeUnmount(() => {
    _resetKeys({
      accounting: [
        ...keys.accounting,
        'voucher_consecutives_pendings_to_authorization',
        'business_trusts_by_account_structure_and_equivalence',
        'voucher_uploads',
      ],
      user: keys.user,
    })
  })

  const { goToURL } = useGoToUrl()

  const rejectionReason = ref('')
  const selectedVouchers = ref<number[]>([])
  const handleSelection = (selection: { selected: IPendingVoucherItem[] }) => {
    selectedVouchers.value = selection.selected?.map((item) => item.id)
  }

  const alertModalRef = ref()

  const openConfirmRejectionModal = () => {
    alertModalRef.value.openModal()
  }

  const processAuthorization = async (action: 'approve' | 'reject') => {
    openMainLoader(true)
    const payload: IVoucherAuthorizationPayload = {
      action,
      voucher_ids: [...selectedVouchers.value],
      authorization_notes: rejectionReason.value,
    }

    const isSuccess = await _processVoucherAuthorization(payload)
    if (isSuccess) {
      alertModalRef.value.closeModal()
      selectedVouchers.value = []
      filtersFormat.value.page = 1
      setTimeout(() => {
        listAction()
      }, 2000)
    }
    openMainLoader(false)
  }

  const cleanPendingVouchersData = () => {
    tableProps.value.rows = []
  }

  return {
    tableProps,
    headerProps,
    filterConfig,
    alertModalRef,
    rejectionReason,
    selectedVouchers,
    filterComponentRef,
    defaultIconsLucide,
    updatePage,
    handleFilter,
    updatePerPage,
    handleSelection,
    handleShowFilters,
    processAuthorization,
    openConfirmRejectionModal,
    cleanPendingVouchersData,
    goToURL,
    validateRouter,
  }
}

export default useVoucherAuthorization
