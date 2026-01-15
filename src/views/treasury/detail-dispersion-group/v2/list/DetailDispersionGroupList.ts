//vue - quasar
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IFieldFilters } from '@/interfaces/customs'
import { IBaseTableProps } from '@/interfaces/global'
import {
  IDispersionDetailGroupResponse,
  IDispersionBreakdownGroupResponsev2,
  IDetailDispersionGroupRequestV2,
} from '@/interfaces/customs/treasury/DetailDispersionGroup'

//composables - constants
import { useAlert, useMainLoader, useRules, useUtils } from '@/composables'

import { dispersion_options } from '@/constants/resources/index'

//stores
import {
  useResourceManagerStore,
  useFicResourceStore,
} from '@/stores/resources-manager'
import { useDetailDispersionGroupStore } from '@/stores/treasury/detail-dispersion-group/'

const useDetailDispersionGroupList = () => {
  const { formatParamsCustom, formatCurrencyString, formatDate } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { is_required } = useRules()
  const { showAlert } = useAlert()
  const { offices } = storeToRefs(useFicResourceStore('v1'))
  const detailDispersionGroupStore = useDetailDispersionGroupStore('v2')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { dispersion_detail_list, dispersion_breakdown_list } = storeToRefs(
    detailDispersionGroupStore
  )

  const {
    _showActionV2,
    _createActionV2,
    _listDetailActionV2,
    _listBreakdownActionV2,
  } = detailDispersionGroupStore

  const selectedBreakdownRow = ref<IDispersionBreakdownGroupResponsev2 | null>(
    null
  )
  const selectedDetailRow = ref<IDispersionDetailGroupResponse | null>(null)
  const selectedRowIdBreakdown = ref<(number | { id: number })[]>([])
  const filtersFormat = ref<Record<string, string | number>>({})
  const selectedRadioBreakdown = ref<string | null>(null)
  const selectedRowIdDetail = ref<number | null>()
  const selectedGroup = ref(false)
  const filtersRef = ref()

  let perPage = 20

  const descriptionData = ref({
    bank: '',
    bankAccount: '',
    bankBranch: '',
    third_party_name: '',
  })

  const headerProperties = {
    title: 'Grupo de dispersión',
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
        label: 'Grupo de dispersión',
        route: 'DetailDispersionGroupList',
      },
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'option',
      label: '',
      type: 'q-option-group',
      value: 'GMF',
      options: dispersion_options['gmf'],
      class: 'col-12',
      disable: false,
      clean_value: true,
      rules: [(val: string) => is_required(val, 'Debe seleccionar una opción')],
    },
    {
      name: 'office',
      label: 'Oficina*',
      type: 'q-select',
      value: null,
      options: offices,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
      rules: [(val: string) => is_required(val, 'La oficina es requerida')],
    },
    {
      name: 'name_office',
      label: 'Nombre de la oficina',
      type: 'q-input',
      value: '',
      class: 'col-12 col-md-4',
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      name: 'date',
      label: 'Fecha*',
      type: 'q-date',
      value: useUtils().formatDate(new Date().toISOString(), 'YYYY-MM-DD'),
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      placeholder: 'YYYY-MM-DD',
      rules: [(val: string) => is_required(val)],
      navigation_max_year: new Date().getFullYear().toString(),
      navigation_min_year: '1000/01',
      option_calendar: ($event) =>
        useUtils().isDateAllowed($event, holidays.value),
      onNavigation: async ({ year }: { year: number }) => {
        handlerHolidays(year)
      },
    },
  ])

  const tablePropertiesDetail = ref<
    IBaseTableProps<IDispersionDetailGroupResponse>
  >({
    title: 'Detalle',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'radio_button',
        align: 'center',
        label: '',
        field: () => null,
        sortable: true,
      },
      {
        name: 'id',
        align: 'left',
        label: '#',
        field: 'id',
        sortable: true,
      },
      {
        name: 'business',
        align: 'left',
        label: 'Negocio',
        field: 'business',
        sortable: true,
      },
      {
        name: 'business_name',
        align: 'left',
        label: 'Nombre del negocio',
        field: 'business_name',
        sortable: true,
      },
      {
        name: 'means_of_payment',
        align: 'left',
        label: 'Forma de pago',
        field: (row) => `${row.method_payment_code} - ${row.means_of_payment}`,
        sortable: true,
      },
      {
        name: 'type_mean_of_payments',
        align: 'left',
        label: 'Tipo de forma de pago',
        field: 'type_mean_of_payments',
        sortable: true,
      },
      {
        name: 'bank_code',
        align: 'left',
        label: 'Banco',
        field: 'bank_code',
        sortable: true,
      },
      {
        name: 'bank_name',
        align: 'left',
        label: 'Nombre del banco',
        field: 'bank_name',
        sortable: true,
      },
      {
        name: 'bank_account',
        align: 'left',
        label: 'Cuenta bancaria',
        field: 'bank_account',
        sortable: true,
      },
      {
        name: 'number_associated_payments',
        align: 'left',
        label: 'Número de pagos asociados',
        field: 'number_associated_payments',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })

  const tablePropertiesBreakdown = ref<
    IBaseTableProps<IDispersionBreakdownGroupResponsev2>
  >({
    title: 'Desglose',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'checkbox_button',
        align: 'center',
        label: '',
        field: () => null,
        sortable: true,
      },
      {
        name: 'id',
        align: 'left',
        label: '#',
        field: 'id',
        sortable: true,
      },
      {
        name: 'authorized_document_type_id',
        align: 'left',
        label: 'Número',
        field: (row) => row.record_expense_id || '-',
        sortable: true,
      },
      {
        name: 'business',
        align: 'left',
        label: 'Negocio',
        field: 'business',
        sortable: true,
      },
      {
        name: 'means_of_payment',
        align: 'left',
        label: 'Forma de pago',
        field: 'means_of_payment',
        sortable: true,
      },
      {
        name: 'bank_name',
        align: 'left',
        label: 'Banco origen',
        field: 'bank_name',
        sortable: true,
      },
      {
        name: 'bank_account_type',
        align: 'left',
        label: 'Tipo de cuenta origen',
        field: (row) => row.bank_account_type || '-',
        sortable: true,
      },
      {
        name: 'bank_account',
        align: 'left',
        label: 'Cuenta bancaria origen',
        field: (row) => `${row.bank_account} - ${row.bank_account_name}`,
        sortable: true,
      },
      {
        name: 'fund',
        align: 'left',
        label: 'Fondo',
        field: (row) => row.fund || '-',
        sortable: true,
      },
      {
        name: 'investment_plan',
        align: 'left',
        label: 'Plan de inversión',
        field: (row) => row.investment_plan || '-',
        sortable: true,
      },
      {
        name: 'payment_order',
        align: 'left',
        label: 'Orden de pago',
        field: (row) => row.payment_order || '-',
        sortable: true,
      },
      {
        name: 'monetary_order',
        align: 'left',
        label: 'Orden monetaria',
        field: (row) => row.monetary_order || '-',
        sortable: true,
      },
      {
        name: 'validity',
        align: 'left',
        label: 'Vigencia',
        field: (row) => row.validity || '-',
        sortable: true,
      },
      {
        name: 'date',
        align: 'left',
        label: 'Fecha',
        field: 'date',
        sortable: true,
        format: (val) => formatDate(val, 'YYYY-MM-DD'),
      },
      {
        name: 'type_document',
        align: 'left',
        label: 'Tipo de documento',
        field: (row) => row.type_document || '-',
        sortable: true,
      },
      {
        name: 'third_party_name',
        align: 'left',
        label: 'Beneficiario',
        field: (row) => row.third_party_name || '-',
        sortable: true,
      },
      {
        name: 'beneficiary_bank_name',
        align: 'left',
        label: 'Banco destino',
        field: (row) => row.beneficiary_bank_name || '-',
        sortable: true,
      },
      {
        name: 'beneficiary_bank_account_type',
        align: 'left',
        label: 'Tipo de cuenta destino',
        field: 'beneficiary_bank_account_type',
        sortable: true,
      },
      {
        name: 'beneficiary_bank_account',
        align: 'left',
        label: 'Cuenta bancaria destino',
        field: (row) => row.beneficiary_bank_account_number || '-',
        sortable: true,
      },
      {
        name: 'office',
        align: 'left',
        label: 'Oficina',
        field: 'office',
        sortable: true,
      },
      {
        name: 'value',
        align: 'left',
        label: 'Valor',
        field: (row) => formatCurrencyString(row.value) || '-',
        sortable: true,
      },
      {
        name: 'gmf',
        align: 'left',
        label: 'GMF',
        field: (row) => row.gmf || '-',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })

  const holidays = ref<string[]>([])

  const getBreakdownOption = (): string | null => {
    const option = filtersFormat.value['filter[option]']
    return option ? String(option) : null
  }
  const handlerHolidays = async (year: number) => {
    holidays.value = await useUtils().getHolidaysByYear(year)
  }

  const updatePaginationAndReload = (
    page: number,
    loadFn: (filters: string) => void
  ) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page,
    }
    loadFn(formatParamsCustom(filtersFormat.value))
  }

  const updatePaginationAndReloadPerRows = (
    rowsPerPage: number,
    loadFn: (filters: string) => void
  ) => {
    perPage = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: perPage,
    }
    loadFn(formatParamsCustom(filtersFormat.value))
  }

  const loadData = async (filters: string, type: 'detail' | 'breakdown') => {
    openMainLoader(true)
    if (type === 'detail') await _listDetailActionV2(filters)
    else {
      selectedBreakdownRow.value = null
      selectedRowIdBreakdown.value = []
      await _listBreakdownActionV2(filters)
    }
    openMainLoader(false)
  }

  const onChangeFilter = async (values: Record<string, string | number>) => {
    const selectedOfficeId = values['filter[office]']
    if (!selectedOfficeId) return

    filtersRef.value?.setFieldValueByName('office', selectedOfficeId)

    const selectedOffice = offices.value.find(
      (office) => Number(office.value) === Number(selectedOfficeId)
    )

    if (selectedOffice) {
      filtersRef.value?.setFieldValueByName(
        'name_office',
        selectedOffice.office_description ?? ''
      )
    }
  }

  const handleFilter = ($filters: {
    'filter[option]': string
    'filter[office]': number
    'filter[office_name]': string
    'filter[date]': string
  }) => {
    if (!$filters['filter[option]']) {
      showAlert('Debe seleccionar una opción antes de buscar.', 'warning')
      return
    }
    filtersFormat.value = { ...$filters }
    loadData(formatParamsCustom(filtersFormat.value), 'detail')
  }

  const handleFilterBreakdown = ($filters: {
    'filter[option]': string
    'filter[method_payment_id]': number
    'filter[bank_id]': number
    'filter[bank_account_id]': number
    'filter[office_id]': number
    'filter[business_id]': number
  }) => {
    loadData(formatParamsCustom($filters), 'breakdown')
  }

  const handleClearFilters = () => {
    filterConfig.value.forEach((filter) => {
      filter.value = null
    })

    filtersRef.value?.clearFilters?.()

    tablePropertiesDetail.value.rows = []
    selectedRowIdDetail.value = null

    tablePropertiesBreakdown.value.rows = []
    selectedRowIdBreakdown.value = []
    filtersRef.value.cleanFiltersByNames(['date'])
  }

  const handleUpdatePageDetail = (page: number) =>
    updatePaginationAndReload(page, (filters) => loadData(filters, 'detail'))

  const handleUpdatePerPageDetail = (rowsPage: number) =>
    updatePaginationAndReloadPerRows(rowsPage, (filters) =>
      loadData(filters, 'detail')
    )

  const handleUpdatePageBreakdown = (page: number) =>
    updatePaginationAndReload(page, (filters) => loadData(filters, 'breakdown'))

  const handleUpdatePerPageBreakdown = (rowsPage: number) =>
    updatePaginationAndReloadPerRows(rowsPage, (filters) =>
      loadData(filters, 'breakdown')
    )

  const handleSubmitGroupDispersion = async () => {
    if (!selectedDetailRow.value || !selectedRowIdBreakdown.value?.length)
      return

    const {
      method_payment_id = 0,
      bank_id = 0,
      bank_account_id = 0,
    } = selectedDetailRow.value || {}

    const payload: IDetailDispersionGroupRequestV2[] =
      selectedRowIdBreakdown.value.map((row) => {
        const breakdown = row as IDispersionBreakdownGroupResponsev2

        return {
          id: breakdown.id ?? null,
          value: breakdown.value ?? '0.00',
          gmf: breakdown.gmf ?? '0.00',

          record_expense_id: breakdown.record_expense_id ?? null,
          bank_transfer_id: breakdown.bank_transfer_id ?? null,

          method_payment_id,
          bank_id,
          bank_account_id,

          authorized_document_type_id:
            breakdown.authorized_document_type_id ?? null,

          beneficiary_bank_account: breakdown.beneficiary_bank_account ?? null,
          beneficiary_bank_id: breakdown.beneficiary_bank_id ?? null,
          nit_third_party_id: breakdown.nit_third_party_id ?? null,

          group: selectedGroup.value,
        }
      })

    const success = await _createActionV2(payload)

    if (success) {
      await loadData(formatParamsCustom(filtersFormat.value), 'detail')

      tablePropertiesBreakdown.value.rows = []
      selectedRowIdBreakdown.value = []
      selectedBreakdownRow.value = null
    }
  }

  const handleChangeFilters = () => {
    if (!selectedDetailRow.value) return

    const option = getBreakdownOption()
    if (!option) return

    const filters = {
      'filter[option]': option,
      'filter[method_payment_id]': selectedDetailRow.value.method_payment_id,
      'filter[bank_id]': selectedDetailRow.value.bank_id,
      'filter[bank_account_id]': selectedDetailRow.value.bank_account_id,
      'filter[office_id]': Number(filtersFormat.value['filter[office]']),
      'filter[business_id]': selectedDetailRow.value.business_id,
    }

    handleFilterBreakdown(filters)
  }

  watch(selectedRadioBreakdown, handleChangeFilters)

  watch(selectedRowIdDetail, (newVal) => {
    selectedRowIdBreakdown.value = []
    if (newVal !== null) {
      const selected = tablePropertiesDetail.value.rows.find(
        (row) => row.id === newVal
      )

      selectedDetailRow.value = selected ?? null

      if (!selectedDetailRow.value) return

      const option = getBreakdownOption()
      if (!option) return

      const filters = {
        'filter[option]': option,
        'filter[method_payment_id]': selectedDetailRow.value.method_payment_id,
        'filter[bank_id]': selectedDetailRow.value.bank_id,
        'filter[bank_account_id]': selectedDetailRow.value.bank_account_id,
        'filter[office_id]': Number(filtersFormat.value['filter[office]']),
        'filter[business_id]': selectedDetailRow.value.business_id,
      }

      handleFilterBreakdown(filters)
    } else {
      selectedDetailRow.value = null
    }
  })

  watch(selectedRowIdBreakdown, async (newVal) => {
    if (newVal && newVal.length > 0) {
      const first = newVal[0]
      const selectedId = typeof first === 'object' ? first.id : first

      const selected = tablePropertiesBreakdown.value.rows.find(
        (row) => row.id === selectedId
      )

      selectedBreakdownRow.value = selected ?? null

      if (!selected) return

      const data = await _showActionV2({
        id: selectedId,
        record_expense_id: selected.record_expense_id ?? null,
        bank_transfer_id: selected.bank_transfer_id ?? null,
      })

      if (data) {
        descriptionData.value = {
          bank: data.bank ?? '-',
          bankAccount: data.bankAccount ?? '-',
          bankBranch: data.bankBranch ?? '-',
          third_party_name: data.third_party_name ?? '-',
        }
      }
    } else {
      selectedBreakdownRow.value = null
      descriptionData.value = {
        bank: '',
        bankAccount: '',
        bankBranch: '',
        third_party_name: '',
      }
    }
  })

  watch(
    () => dispersion_detail_list.value,
    () => (tablePropertiesDetail.value.rows = dispersion_detail_list.value)
  )

  watch(
    () => dispersion_breakdown_list.value,
    () => {
      tablePropertiesBreakdown.value.rows =
        dispersion_breakdown_list.value as IDispersionBreakdownGroupResponsev2[]
    }
  )
  const hasSelectedRows = computed(
    () => (selectedRowIdBreakdown.value?.length ?? 0) > 0
  )

  onMounted(async () => {
    openMainLoader(true)
    handlerHolidays(new Date().getFullYear())
    await _getResources({ fics: ['offices'] })

    openMainLoader(false)
  })

  onBeforeUnmount(() => _resetKeys({ fics: ['offices'] }))

  return {
    filtersRef,
    filterConfig,
    handleFilter,
    selectedGroup,
    onChangeFilter,
    descriptionData,
    hasSelectedRows,
    headerProperties,
    selectedDetailRow,
    handleClearFilters,
    dispersion_options,
    selectedRowIdDetail,
    tablePropertiesDetail,
    selectedRowIdBreakdown,
    handleUpdatePageDetail,
    selectedRadioBreakdown,
    tablePropertiesBreakdown,
    handleUpdatePageBreakdown,
    handleUpdatePerPageDetail,
    handleSubmitGroupDispersion,
    handleUpdatePerPageBreakdown,
  }
}

export default useDetailDispersionGroupList
