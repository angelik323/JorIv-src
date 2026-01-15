import { useGoToUrl, useMainLoader, useRules, useUtils } from '@/composables'
import {
  FilterSourceItem,
  IFieldFilters,
  IFilterMappingConfig,
  ICheckBankAccountMovementItem,
  ICheckBankAccountMovementRequest,
} from '@/interfaces/customs'
import {
  useCheckBankAccountMovementStore,
  useResourceManagerStore,
  useTreasuryResourceStore,
} from '@/stores'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { onBeforeUnmount, onMounted, ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'

const useCheckBankAccountMovementList = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { formatPeriod } = useUtils()
  const selectorFromBusiness = ref<string | null>(null)
  const selectorToBusiness = ref<string | null>(null)
  const selectorFromBank = ref<string | null>(null)
  const selectorToBank = ref<string | null>(null)
  const from_date = ref<string | null>(null)
  const to_date = ref<string | null>(null)

  const {
    bank_account_movements_from_business,
    bank_account_movements_to_business,
    bank_account_movements_from_bank,
    bank_account_movements_to_bank,
    bank_account_movements_from_bank_account,
    bank_account_movements_to_bank_account,
  } = storeToRefs(useTreasuryResourceStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const {
    data_check_bank_account_movement,
    headerPropsDefault,
    pages,
    rowSelectedCheckBankAccountMovementRequest,
  } = storeToRefs(useCheckBankAccountMovementStore('v1'))
  const {
    _getListCheckBankAccountMovement,
    _exportXlsxCheckBankAccountMovementList,
    _getDetailCheckBankAccountMovement,
  } = useCheckBankAccountMovementStore('v1')
  const headerProperties = headerPropsDefault.value

  const holidays = ref<string[]>([])
  const hideFilters = ref<boolean>(true)
  const handlerHolidays = async (year: number) => {
    holidays.value = await useUtils().getHolidaysByYear(year)
  }

  const filterComponentRef = ref()
  const tableListRef = ref()

  const onFilterBusiness = async (business_id: string) => {
    selectorFromBusiness.value = business_id
    const movement_to_business_keys = {
      treasury: ['bank_account_movements_to_business'],
    }

    const keysToReset = {
      treasury: ['bank_account_movements_to_business'],
    }

    _resetKeys(keysToReset)

    if (business_id) {
      const bank_account_movements_to_business = `filter[min_business]=${business_id}`
      await _getResources(
        movement_to_business_keys,
        bank_account_movements_to_business,
        'v2'
      )
    }
    filterComponentRef.value.cleanFiltersByNames([
      'from_business_name',
      'to_business_code',
      'to_business_name',
      'from_bank_code',
      'from_bank_name',
      'to_bank_code',
      'to_bank_name',
      'from_account_number',
      'from_account_name',
      'to_account_number',
      'to_account_name',
    ])
  }

  const onFilterFromBank = async (bank_id: string) => {
    selectorToBusiness.value = bank_id
    const movement_to_bank_keys = {
      treasury: ['bank_account_movements_from_bank'],
    }

    const keysToReset = {
      treasury: ['bank_account_movements_from_bank'],
    }

    _resetKeys(keysToReset)

    if (bank_id) {
      const bank_account_movements_to_bank = `from_business_code=${selectorFromBusiness.value}&to_business_code=${bank_id}`
      await _getResources(
        movement_to_bank_keys,
        bank_account_movements_to_bank,
        'v2'
      )
    }
    filterComponentRef.value.cleanFiltersByNames([
      'to_business_name',
      'from_bank_code',
      'from_bank_name',
      'to_bank_code',
      'to_bank_name',
      'from_account_number',
      'from_account_name',
      'to_account_number',
      'to_account_name',
    ])
  }

  const onFilterToBank = async (bank_id: string) => {
    selectorFromBank.value = bank_id
    const movement_to_bank_keys = {
      treasury: ['bank_account_movements_to_bank'],
    }

    const keysToReset = {
      treasury: ['bank_account_movements_to_bank'],
    }

    _resetKeys(keysToReset)

    if (bank_id) {
      const bank_account_movements_to_bank = `from_business_code=${selectorFromBusiness.value}&to_business_code=${selectorToBusiness.value}&filter[min_bank]=${bank_id}`
      await _getResources(
        movement_to_bank_keys,
        bank_account_movements_to_bank,
        'v2'
      )
    }
    filterComponentRef.value.cleanFiltersByNames([
      'from_bank_name',
      'to_bank_code',
      'to_bank_name',
      'from_account_number',
      'from_account_name',
      'to_account_number',
      'to_account_name',
    ])
  }

  const onFilterFromBankAccount = async (bank_id: string) => {
    selectorToBank.value = bank_id

    const movement_to_bank_keys = {
      treasury: ['bank_account_movements_from_bank_account'],
    }

    const keysToReset = {
      treasury: ['bank_account_movements_from_bank_account'],
    }

    _resetKeys(keysToReset)

    if (bank_id) {
      const bank_account_movements_to_bank = `from_bank_code=${selectorFromBank.value}&to_bank_code=${selectorToBank.value}&from_business_code=${selectorFromBusiness.value}&to_business_code=${selectorToBusiness.value}`
      await _getResources(
        movement_to_bank_keys,
        bank_account_movements_to_bank,
        'v2'
      )
    }
    filterComponentRef.value.cleanFiltersByNames([
      'to_bank_name',
      'from_account_number',
      'from_account_name',
      'to_account_number',
      'to_account_name',
    ])
  }

  const onFilterToBankAccount = async (bank_id: string) => {
    const movement_to_bank_keys = {
      treasury: ['bank_account_movements_to_bank_account'],
    }

    const keysToReset = {
      treasury: ['bank_account_movements_to_bank_account'],
    }

    _resetKeys(keysToReset)

    if (bank_id) {
      const bank_account_movements_to_bank = `from_bank_code=${selectorFromBank.value}&to_bank_code=${selectorToBank.value}&filter[min_bank_account]=${bank_id}&from_business_code=${selectorFromBusiness.value}&to_business_code=${selectorToBusiness.value}`
      await _getResources(
        movement_to_bank_keys,
        bank_account_movements_to_bank,
        'v2'
      )
    }
    filterComponentRef.value.cleanFiltersByNames([
      'from_account_name',
      'to_account_number',
      'to_account_name',
    ])
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'from_business_code',
      label: 'Desde negocio*',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3',
      disable: false,
      options: bank_account_movements_from_business,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
      rules: [
        (v: string) => useRules().is_required(v, 'El campo es requerido'),
      ],
      onChange: onFilterBusiness,
    },
    {
      name: 'from_business_name',
      label: 'Nombre negocio',
      type: 'q-input',
      value: '',
      class: 'col-xs-12 col-sm-12 col-md-3',
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      name: 'to_business_code',
      label: 'Hasta negocio*',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3',
      disable: false,
      options: bank_account_movements_to_business,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
      rules: [
        (v: string) => useRules().is_required(v, 'El campo es requerido'),
      ],
      onChange: onFilterFromBank,
    },
    {
      name: 'to_business_name',
      label: 'Nombre negocio',
      type: 'q-input',
      value: '',
      class: 'col-xs-12 col-sm-12 col-md-3',
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      name: 'from_bank_code',
      label: 'Desde banco*',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3',
      disable: false,
      options: bank_account_movements_from_bank,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
      rules: [
        (v: string) => useRules().is_required(v, 'El campo es requerido'),
      ],
      onChange: onFilterToBank,
      hide: true,
    },
    {
      name: 'from_bank_name',
      label: 'Nombre banco',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3',
      disable: true,
      placeholder: '-',
      clean_value: true,
      hide: true,
    },
    {
      name: 'to_bank_code',
      label: 'Hasta banco*',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3',
      disable: false,
      options: bank_account_movements_to_bank,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
      rules: [
        (v: string) => useRules().is_required(v, 'El campo es requerido'),
      ],
      onChange: onFilterFromBankAccount,
      hide: true,
    },
    {
      name: 'to_bank_name',
      label: 'Nombre banco',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3',
      disable: true,
      placeholder: '-',
      clean_value: true,
      hide: true,
    },
    {
      name: 'from_account_number',
      label: 'Desde cuenta*',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3',
      disable: false,
      options: bank_account_movements_from_bank_account,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
      rules: [
        (v: string) => useRules().is_required(v, 'El campo es requerido'),
      ],
      onChange: onFilterToBankAccount,
      hide: true,
    },
    {
      name: 'from_account_name',
      label: 'Nombre cuenta',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3',
      disable: true,
      placeholder: '-',
      clean_value: true,
      hide: true,
    },
    {
      name: 'to_account_number',
      label: 'Hasta cuenta*',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3',
      disable: false,
      options: bank_account_movements_to_bank_account,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
      rules: [
        (v: string) => useRules().is_required(v, 'El campo es requerido'),
      ],
      hide: true,
    },
    {
      name: 'to_account_name',
      label: 'Nombre cuenta',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3',
      disable: true,
      placeholder: '-',
      clean_value: true,
      hide: true,
    },
    {
      name: 'from_date',
      label: 'Desde fecha*',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6',
      disable: false,
      clean_value: true,
      hide: false,
      rules: [
        (v: string) => useRules().is_required(v, 'El campo es requerido'),
      ],
      navigation_max_year: new Date().getFullYear().toString(),
      navigation_min_year: '1000/01',
      option_calendar: ($event) =>
        useUtils().isDateAllowed($event, holidays.value),
      onNavigation: async ({ year }: { year: number }) => {
        handlerHolidays(year)
      },
    },
    {
      name: 'to_date',
      label: 'Hasta fecha*',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6',
      disable: false,
      clean_value: true,
      hide: false,
      rules: [
        (v: string) => useRules().is_required(v, 'El campo es requerido'),
      ],
      navigation_max_year: new Date().getFullYear().toString(),
      navigation_min_year: '1000/01',
      option_calendar: ($event) =>
        useUtils().isDateAllowed($event, holidays.value),
      onNavigation: async ({ year }: { year: number }) => {
        handlerHolidays(year)
      },
    },
  ])
  const filtersFormat = ref<Record<string, unknown>>({})

  // Configuración para mapear filtros con sus respectivos datos y campos de destino
  const filterMappingConfig: Record<string, IFilterMappingConfig> = {
    'filter[from_business_code]': {
      source: bank_account_movements_from_business,
      targetField: 'from_business_name',
      property: 'name',
    },
    'filter[to_business_code]': {
      source: bank_account_movements_to_business,
      targetField: 'to_business_name',
      property: 'name',
    },
    'filter[from_bank_code]': {
      source: bank_account_movements_from_bank,
      targetField: 'from_bank_name',
      property: 'name',
    },
    'filter[to_bank_code]': {
      source: bank_account_movements_to_bank,
      targetField: 'to_bank_name',
      property: 'name',
    },
    'filter[from_account_number]': {
      source: bank_account_movements_from_bank_account,
      targetField: 'from_account_name',
      property: 'name',
    },
    'filter[to_account_number]': {
      source: bank_account_movements_to_bank_account,
      targetField: 'to_account_name',
      property: 'name',
    },
  }

  /**
   * Función para actualizar campos dependientes basados en la selección de filtros
   * @param filterKey - Clave del filtro seleccionado
   * @param filterValue - Valor del filtro seleccionado
   */
  const updateDependentField = (
    filterKey: string,
    filterValue: string | number
  ) => {
    const config =
      filterMappingConfig[filterKey as keyof typeof filterMappingConfig]

    if (!config || !filterComponentRef.value) return

    const selectedItem = config.source.value.find(
      (item: FilterSourceItem) => item.value === filterValue
    )

    if (selectedItem) {
      const propertyValue =
        selectedItem[config.property as keyof FilterSourceItem] || ''
      filterComponentRef.value.setFieldValueByName(
        config.targetField,
        propertyValue
      )
    }
  }

  const fromBusiness = ref<number>(0)
  const toBusiness = ref<number>(0)
  const fromBank = ref<number>(0)
  const toBank = ref<number>(0)

  const onChangeFilter = async (values: Record<string, string | number>) => {
    // Procesar todos los filtros que tienen configuración de mapeo
    Object.keys(filterMappingConfig).forEach((filterKey) => {
      const filterValue = values[filterKey]
      if (filterValue) {
        updateDependentField(filterKey, filterValue)
      }
    })

    if (values['filter[from_business_code]']) {
      fromBusiness.value = values['filter[from_business_code]'] as number
    }
    if (values['filter[to_business_code]']) {
      toBusiness.value = values['filter[to_business_code]'] as number
    }
    if (values['filter[from_bank_code]']) {
      fromBank.value = values['filter[from_bank_code]'] as number
    }
    if (values['filter[to_bank_code]']) {
      toBank.value = values['filter[to_bank_code]'] as number
    }
  }

  const tableProperties = ref({
    title: 'Detalles',
    loading: false,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'center',
        field: 'id',
        sortable: true,
      },
      {
        name: 'bussiness',
        required: true,
        label: 'Negocio',
        align: 'left',
        field: (row) =>
          `${row.business_trust?.name} - ${row.business_trust?.business_code}`,
        sortable: true,
      },
      {
        name: 'bank',
        required: true,
        label: 'Banco',
        align: 'left',
        field: (row) => row.bank?.description ?? '-',
        sortable: true,
      },
      {
        name: 'bank_account',
        required: true,
        label: 'Cuenta bancaria',
        align: 'left',
        field: (row) => row.bank_account?.account_number ?? '-',
        sortable: true,
      },
      {
        name: 'bank_account_name',
        required: true,
        label: 'Nombre cuenta bancaria',
        align: 'left',
        field: (row) => row.bank_account?.account_name ?? '-',
        sortable: true,
      },
      {
        name: 'date',
        required: true,
        label: 'Fecha',
        align: 'left',
        field: 'date',
        sortable: true,
      },
      {
        name: 'concept',
        required: true,
        label: 'Concepto',
        align: 'left',
        field: 'concept',
        sortable: true,
      },
      {
        name: 'nature',
        required: true,
        label: 'Naturaleza',
        align: 'left',
        field: 'nature',
        sortable: true,
      },
      {
        name: 'value',
        required: true,
        label: 'Valor',
        align: 'right',
        field: (row) => useUtils().formatCurrency(row.value),
        sortable: true,
      },
      {
        name: 'third',
        required: true,
        label: 'Tercero',
        align: 'left',
        field: (row) => row.third_party?.document ?? '-',
        sortable: true,
      },
      {
        name: 'coin',
        required: true,
        label: 'Moneda',
        align: 'left',
        field: 'coin',
        sortable: true,
      },
      {
        name: 'trm',
        required: true,
        label: 'TRM',
        align: 'right',
        field: (row) => useUtils().formatCurrency(Number(row.trm ?? 0)),
        sortable: true,
      },
      {
        name: 'foreign_currency_value',
        required: true,
        label: 'Valor extranjero',
        align: 'right',
        field: (row) =>
          useUtils().formatCurrency(Number(row.foreign_currency_value ?? 0)),
        sortable: true,
      },
      {
        name: 'voucher',
        required: true,
        label: 'Comprobante',
        align: 'left',
        field: (row) => row.voucher?.accounting_consecutive ?? '-',
        sortable: true,
      },
      {
        name: 'voucher_number',
        required: true,
        label: 'N. Comprobante',
        align: 'left',
        field: (row) =>
          `${row.receipt_types?.code} - ${row.receipt_types?.name}`,
        sortable: true,
      },
    ] as QTable['columns'],
    rows: data_check_bank_account_movement.value,
    pages: pages,
    wrapCells: true,
  })

  const listAction = async () => {
    tableProperties.value.rows = []
    tableProperties.value.loading = true
    const queryString = useUtils().formatParamsCustom(filtersFormat.value)
    await _getListCheckBankAccountMovement(queryString ? '&' + queryString : '')
    tableProperties.value.loading = false
  }

  const handleClearFilters = () => {
    tableProperties.value.rows = []
    rowSelectedCheckBankAccountMovement.value = null
    tableListRef.value?.clearSelection()
    rowSelectedCheckBankAccountMovementRequest.value = null
  }

  const handleShowMoreFilters = () => {
    hideFilters.value = !hideFilters.value

    const endIndex = Math.min(11, filterConfig.value.length - 1)
    for (let i = 4; i <= endIndex; i++) {
      filterConfig.value[i].hide = hideFilters.value
    }
  }

  const handleFilterSearch = ($filters: Record<string, unknown>) => {
    const keysToRemove = [
      'filter[from_business_name]',
      'filter[from_bank_name]',
      'filter[from_account_name]',
      'filter[to_business_name]',
      'filter[to_bank_name]',
      'filter[to_account_name]',
    ]
    tableListRef.value?.clearSelection()
    rowSelectedCheckBankAccountMovement.value = null
    rowSelectedCheckBankAccountMovementRequest.value = null

    const newFilters = useUtils().removeObjectKeys($filters, keysToRemove)

    filtersFormat.value = {
      ...newFilters,
    }
    from_date.value = newFilters['filter[from_date]'] as string
    to_date.value = newFilters['filter[to_date]'] as string
    listAction()
  }

  const updatePage = (pageNumber: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: pageNumber as number,
    }
    listAction()
  }
  const updateRowsPerPage = (rowsPerPage: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: 1 as number,
      rows: rowsPerPage as number,
    }
    listAction()
  }

  const buildAdditionalModuleQuery = () => {
    const query: Record<string, string> = {}

    if (filtersFormat.value['filter[from_date]']) {
      query.from_date = filtersFormat.value['filter[from_date]'] as string
    }

    if (filtersFormat.value['filter[to_date]']) {
      query.to_date = filtersFormat.value['filter[to_date]'] as string
    }

    return query
  }

  const handlerGoTo = (goURL: string, isAdditionalModule = false) => {
    const query = isAdditionalModule ? buildAdditionalModuleQuery() : {}

    router.push({ name: goURL, query })
  }

  const rowSelectedCheckBankAccountMovement =
    ref<ICheckBankAccountMovementRequest | null>(null)

  // Computed property to check if download button should be disabled
  const isDownloadDisabled = computed(() => {
    // Check if table has data
    const hasTableData =
      tableProperties.value.rows && tableProperties.value.rows.length > 0

    return !hasTableData
  })

  const handleSelected = async ({
    selected,
  }: {
    selected: ICheckBankAccountMovementItem[]
  }) => {
    if (selected && selected.length > 0) {
      rowSelectedCheckBankAccountMovement.value =
        rowSelectedCheckBankAccountMovementRequest.value

      await _getDetailCheckBankAccountMovement(
        selected[0].id,
        from_date.value,
        to_date.value
      )
      //Scroll to details section
      setTimeout(() => {
        const detailsSection = document.getElementById(
          'check-bank-account-movement-details'
        )
        if (detailsSection) {
          detailsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest',
          })
        }
      }, 100)
    } else {
      rowSelectedCheckBankAccountMovement.value = null
    }
  }

  const downloadExcel = async () => {
    openMainLoader(true)
    const queryString = useUtils().formatParamsCustom(filtersFormat.value)
    await _exportXlsxCheckBankAccountMovementList(queryString)
    openMainLoader(false)
  }

  const isTreasuryVoucherDisabled = computed(() => {
    const selected = rowSelectedCheckBankAccountMovement.value
    if (!selected) return true

    const treasury = selected.treasury_movement

    const requiredFields = [
      treasury?.office_id,
      selected.business_trust?.id,
      treasury?.receipt_types.id,
      treasury?.sub_receipt_types.id,
      treasury?.date,
      treasury?.voucher.accounting_consecutive,
      treasury?.periodo,
    ]

    const hasMissingFields = requiredFields.some(
      (field) => field === null || field === undefined
    )

    return hasMissingFields
  })

  const treasuryReceipt = () => {
    const selectedRow = rowSelectedCheckBankAccountMovement.value
    if (!selectedRow) return

    goToURL('CheckTreasuryReceiptList', undefined, {
      office_id: selectedRow.treasury_movement?.office_id,
      business_id: selectedRow.business_trust?.id,
      original_status: Number('71'),
      original_voucher_id: selectedRow.treasury_movement?.receipt_types.id,
      original_subvoucher_id:
        selectedRow.treasury_movement?.sub_receipt_types.id,
      original_date: selectedRow.treasury_movement?.date,
      original_consecutive:
        selectedRow.treasury_movement?.voucher.accounting_consecutive ?? '',
      original_period: formatPeriod(
        selectedRow.treasury_movement?.periodo ?? ''
      ),
    })
  }

  onMounted(async () => {
    handlerHolidays(new Date().getFullYear())
    await _getResources(
      {
        treasury: ['bank_account_movements_from_business'],
      },
      '',
      'v2'
    )
  })

  onBeforeUnmount(() => {
    data_check_bank_account_movement.value = []
    _resetKeys({
      treasury: [
        'bank_account_movements_from_business',
        'bank_account_movements_to_business',
        'bank_account_movements_from_bank',
        'bank_account_movements_to_bank',
        'bank_account_movements_from_bank_account',
        'bank_account_movements_to_bank_account',
      ],
    })
  })

  watch(data_check_bank_account_movement, (newDataCheckBankAccountMovement) => {
    if (newDataCheckBankAccountMovement) {
      tableProperties.value.rows = newDataCheckBankAccountMovement
    }
  })

  watch(
    () => rowSelectedCheckBankAccountMovementRequest.value,
    (newValue) => {
      rowSelectedCheckBankAccountMovement.value = newValue
    },
    { immediate: true }
  )

  return {
    headerProperties,
    tableProperties,
    filterConfig,
    rowSelectedCheckBankAccountMovement,
    isDownloadDisabled,
    filterComponentRef,
    tableListRef,
    isTreasuryVoucherDisabled,
    handleClearFilters,
    handleFilterSearch,
    updatePage,
    updateRowsPerPage,
    handlerGoTo,
    onChangeFilter,
    downloadExcel,
    handleSelected,
    treasuryReceipt,
    handleShowMoreFilters,
  }
}

export default useCheckBankAccountMovementList
