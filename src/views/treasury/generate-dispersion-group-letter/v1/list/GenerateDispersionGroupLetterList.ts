import { ref, onMounted, watch, onBeforeMount, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import {
  useDispersionLetterStore,
  useFicResourceStore,
  useResourceManagerStore,
  useTreasuryResourceStore,
} from '@/stores'
import {
  ITreasuryGenerateDispersionGroupLetter,
  IDetailGroupItem,
  IFieldFilters,
} from '@/interfaces/customs'

import { useRules, useMainLoader, useUtils, useAlert } from '@/composables'

const useGenerateDispersionGroupLetterList = () => {
  const {
    dispersion_group_letter_list,
    dispersion_group_letter_pages,
    dispersion_group_letter_details,
    dispersion_group_letter_details_pages,
  } = storeToRefs(useDispersionLetterStore('v1'))

  const { openMainLoader } = useMainLoader()

  const { formatParamsCustom, formatCurrency, formatDate } = useUtils()

  const { showAlert } = useAlert()

  // Acciones del store
  const {
    _getListGroupAction,
    _getDetailGroupAction,
    _generateLetter,
    _generateAuthorization,
  } = useDispersionLetterStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { offices } = storeToRefs(useFicResourceStore('v1'))

  const {
    dispersion_letter_status,
    dispersion_letter_business,
    dispersion_letter_banks,
  } = storeToRefs(useTreasuryResourceStore('v1'))

  const { letter_format_options } = storeToRefs(useTreasuryResourceStore('v1'))

  const holidays = ref<string[]>([])
  const lastBankId = ref<number | string | null>(null)
  const selectedFormats = ref<Record<number, string | number>>({})

  const handlerHolidays = async (year: number) => {
    holidays.value = await useUtils().getHolidaysByYear(year)
  }

  const headerProps = {
    title: 'Generar cartas grupo de dispersión',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Tesorería' },
      {
        label: 'Generar cartas grupo de dispersión',
        route: 'GenerateDispersionGroupLetterList',
      },
    ],
  }

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: ITreasuryGenerateDispersionGroupLetter[]
    pages: { currentPage: number; lastPage: number }
  }>({
    title: 'Grupo de dispersión para generar carta',
    loading: false,
    columns: [
      { name: 'select', label: '', field: 'select', align: 'center' },
      { name: 'id', label: '#', field: 'id', align: 'left', sortable: true },
      {
        name: 'business_code',
        label: 'Negocio',
        field: 'business_code',
        align: 'left',
        sortable: true,
      },
      {
        name: 'business_name',
        label: 'Nombre negocio',
        field: 'business_name',
        align: 'left',
        sortable: true,
      },
      {
        name: 'bank_code',
        label: 'Banco',
        field: 'bank_code',
        align: 'left',
        sortable: true,
      },
      {
        name: 'bank_name',
        label: 'Nombre banco',
        field: 'bank_name',
        align: 'left',
        sortable: true,
      },
      {
        name: 'bank_account',
        label: 'Cuenta bancaria',
        field: 'bank_account',
        align: 'left',
        sortable: true,
      },
      {
        name: 'group',
        label: 'Grupo dispersión',
        field: 'group',
        align: 'left',
        sortable: true,
      },
      {
        name: 'turns',
        label: 'Cantidad giros',
        field: 'turns',
        align: 'left',
        sortable: true,
      },
      {
        name: 'date',
        label: 'Fecha',
        field: 'date',
        align: 'left',
        sortable: true,
      },
      {
        name: 'status',
        label: 'Estado',
        field: 'status',
        align: 'left',
        sortable: true,
      },
      {
        name: 'value_group',
        label: 'Valor grupo',
        field: (row) => formatCurrency(row.value_group ?? '0'),
        align: 'left',
        sortable: true,
      },
      {
        name: 'gmf',
        label: 'GMF',
        field: 'gmf',
        align: 'left',
        sortable: true,
      },
      {
        name: 'format',
        label: 'Formato',
        field: 'format',
        align: 'left',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })

  const detailTableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: IDetailGroupItem[]
  }>({
    title: 'Detalle de pagos del grupo de dispersión',
    loading: false,
    columns: [
      { name: 'id', label: '#', field: 'id', align: 'left', sortable: true },
      {
        name: 'date',
        label: 'Fecha registro',
        field: 'date',
        align: 'left',
        sortable: true,
      },
      {
        name: 'business',
        label: 'Negocio',
        field: 'business',
        align: 'left',
        sortable: true,
      },
      {
        name: 'voucher_type',
        label: 'Tipo comprobante',
        field: 'voucher_type',
        align: 'left',
        sortable: true,
      },
      {
        name: 'validity',
        label: 'Periodo',
        field: 'validity',
        align: 'left',
        sortable: true,
      },
      {
        name: 'found',
        label: 'Fondo',
        field: 'found',
        align: 'left',
        sortable: true,
      },
      {
        name: 'plain_investment',
        label: 'Plan de inversión',
        field: 'plain_investment',
        align: 'left',
        sortable: true,
      },
      {
        name: 'third_party_document',
        label: 'Beneficiario',
        field: 'third_party_document',
        align: 'left',
        sortable: true,
      },
      {
        name: 'bank',
        label: 'Banco',
        field: 'bank',
        align: 'left',
        sortable: true,
      },
      {
        name: 'beneficiary_bank_account',
        label: 'Cuenta destino',
        field: 'beneficiary_bank_account',
        align: 'left',
        sortable: true,
      },
      {
        name: 'bank_branch',
        label: 'Sucursal',
        field: 'bank_branch',
        align: 'left',
        sortable: true,
      },
      {
        name: 'gmf',
        label: 'GMF',
        field: 'gmf',
        align: 'center',
        sortable: true,
      },
      {
        name: 'value',
        label: 'Valor',
        field: (row) => formatCurrency(row.value ?? '0'),
        align: 'right',
        sortable: true,
      },
    ],
    rows: [],
  })

  const groupSelected = ref<number | null>(null)

  const getBanksByBusiness = async (businessId: number | null) => {
    if (businessId) {
      await _getResources(
        {
          treasury: [`dispersion_letter_banks&business_id=${businessId}`],
        },
        '',
        'v2'
      )
    } else {
      _resetKeys({ treasury: ['dispersion_letter_banks'] })
    }
  }

  const filtersRef = ref()

  const filters = ref<IFieldFilters[]>([
    {
      name: 'validity',
      label: 'Vigencia*',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-6 col-md-3',
      placeholder: '',
      mask: '####',
      clean_value: true,
      disable: false,
      rules: [
        (v: string) => useRules().is_required(v, 'La vigencia es requerida'),
        (v: string) => useRules().only_number(v),
        (v: string) => useRules().min_length(v, 4),
        (v: string) => useRules().max_length(v, 4),
      ],
    },
    {
      name: 'status',
      label: 'Estado de impresion*',
      type: 'q-option-group',
      radioType: 'radio',
      value: 96,
      options: dispersion_letter_status,
      clean_value: true,
      disable: false,
      class: 'col-xs-12 col-sm-6 col-md-9',
    },
    {
      name: 'business',
      label: 'Negocio',
      type: 'q-select',
      value: null,
      autocomplete: true,
      options: dispersion_letter_business,
      clean_value: true,
      disable: false,
      class: 'col-xs-12 col-sm-6 col-md-3',
      onChange: getBanksByBusiness,
    },
    {
      name: 'business_name',
      label: 'Nombre negocio',
      type: 'q-input',
      value: '',
      disable: true,
      clean_value: true,
      class: 'col-xs-12 col-sm-6 col-md-3',
    },
    {
      name: 'office',
      label: 'Oficina*',
      type: 'q-select',
      value: null,
      autocomplete: true,
      options: offices,
      class: 'col-xs-12 col-sm-6 col-md-3',
      placeholder: 'Seleccione',
      clean_value: true,
      disable: false,
      rules: [
        (v: string) => useRules().is_required(v, 'La oficina es requerida'),
      ],
    },
    {
      name: 'office_name',
      label: 'Nombre oficina',
      type: 'q-input',
      value: '',
      disable: true,
      clean_value: true,
      class: 'col-xs-12 col-sm-6 col-md-3',
    },
    {
      name: 'bank',
      label: 'Banco',
      type: 'q-select',
      value: null,
      autocomplete: true,
      options: dispersion_letter_banks,
      clean_value: true,
      disable: false,
      class: 'col-xs-12 col-sm-6 col-md-4',
    },
    {
      name: 'bank_name',
      label: 'Nombre banco',
      type: 'q-input',
      value: '',
      disable: true,
      clean_value: true,
      class: 'col-xs-12 col-sm-6 col-md-4',
    },
    {
      name: 'group_date',
      label: 'Fecha generación grupo de dispersión*',
      type: 'q-date',
      value: formatDate(new Date().toISOString(), 'YYYY-MM-DD') ?? null,
      clean_value: true,
      disable: false,
      class: 'col-xs-12 col-sm-12 col-md-4',
      rules: [
        (v: string) =>
          useRules().is_required(
            v,
            'La fecha generación grupo de dispersión es requerida'
          ),
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

  const showTable = ref(false)
  const showModalDissolution = ref(false)
  const modalDissolutionRef = ref()

  const reasonDissolution = ref('')

  const filtersFormat = ref<Record<string, string | number>>({})

  const selectedItems = ref<ITreasuryGenerateDispersionGroupLetter[]>([])

  const alertModalRef = ref()

  const setKeyName = (key_name: string, key_value: string) => {
    // Actualiza el filtro visual
    const keyFilter = filters.value.find((f) => f.name === key_name)
    if (keyFilter) keyFilter.value = key_value

    filtersRef.value?.setFieldValueByName(key_name, key_value)
  }

  const handleShowMoreFilters = (showMore: boolean) => {
    const hiddenFilters = ['bank', 'bank_name', 'group_date']
    filters.value.forEach((field) => {
      if (hiddenFilters.includes(field.name)) {
        field.hide = !showMore
      }
    })
  }

  const handleFilter = async ($filters: {
    'filter[business]': string
    'filter[office]': string
    'filter[bank]': string
    'filter[status]': string
    'filter[group_date]': string
    'filter[validity]': string
    'filter[business_name]': string
    'filter[office_name]': string
    'filter[bank_name]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
    }

    if ('filter[business_name]' in $filters) {
      delete filtersFormat.value['filter[business_name]']
    }
    if ('filter[office_name]' in $filters) {
      delete filtersFormat.value['filter[office_name]']
    }
    if ('filter[bank_name]' in $filters) {
      delete filtersFormat.value['filter[bank_name]']
    }

    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const listAction = async (filters: string = '') => {
    openMainLoader(true)
    tableProps.value.loading = true
    await _getListGroupAction(filters)
    tableProps.value.loading = false
    openMainLoader(false)
  }

  const getDetailDispersionGroup = async (groupId: number) => {
    if (!groupId) return
    openMainLoader(true)
    await _getDetailGroupAction(`filter[group_id]=${groupId}`)
    openMainLoader(false)
  }

  const openModalLetterGeneration = async () => {
    showModalDissolution.value = true
  }

  const closeModalLetterGeneration = async () => {
    showModalDissolution.value = false
  }

  const confirmDissolution = async () => {
    openMainLoader(true)
    const success = await _generateAuthorization({
      group_id: groupSelected.value as number,
      motives: reasonDissolution.value,
      action: 'delete',
    })

    openMainLoader(false)
    if (success) {
      closeModalLetterGeneration()
      reasonDissolution.value = ''
      groupSelected.value = null
      await listAction('&' + formatParamsCustom(filtersFormat.value))
    }
  }

  const handleClickDissolution = () => {
    openModalLetterGeneration()
  }

  const handleGenerateLetters = async () => {
    if (!groupSelected.value)
      return showAlert('Seleccione un grupo para generar la carta.', 'error')

    const formatSelected = selectedFormats.value[groupSelected.value]

    if (!formatSelected)
      return showAlert('Seleccione un formato para generar la carta.', 'error')

    openMainLoader(true)

    await _generateLetter({
      group_id: groupSelected.value,
      format_id: Number(formatSelected),
    })

    openMainLoader(false)
  }

  const onChangeFilter = async (
    values: Record<string, string | number | null | undefined>
  ) => {
    // --- Negocio ---
    const selectedBusinessId = values['filter[business]'] ?? null
    if (selectedBusinessId) {
      const business = dispersion_letter_business.value.find(
        (b) => b.value === selectedBusinessId
      )

      setKeyName('business_name', business ? business.label : '')
      values['filter[business_name]'] = business ? business.label : ''
    } else {
      values['filter[business_name]'] = ''
      values['filter[bank]'] = null
      values['filter[bank_name]'] = ''
      setKeyName('business_name', '')
      setKeyName('bank', '')
      setKeyName('bank_name', '')
    }

    // --- Oficina ---
    const selectedOfficeId = values['filter[office]'] ?? null
    if (selectedOfficeId) {
      const office = offices.value.find((o) => o.id === selectedOfficeId)

      setKeyName('office_name', office ? office.name : '')
      values['filter[office_name]'] = office ? office.name : ''
    } else {
      values['filter[office_name]'] = ''
      setKeyName('office_name', '')
    }

    // --- Banco ---
    const selectedBankId = values['filter[bank]'] ?? null

    if (selectedBankId !== lastBankId.value) {
      lastBankId.value = selectedBankId

      if (selectedBankId) {
        const bank = dispersion_letter_banks.value.find(
          (b) => b.value === selectedBankId
        )

        setKeyName('bank_name', bank ? bank.label : '')
        values['filter[bank_name]'] = bank ? bank.label : ''

        await _getResources(
          {
            treasury: [`letter_format_codes&filter[bank_id]=${selectedBankId}`],
          },
          '',
          'v2'
        )
      } else {
        values['filter[bank_name]'] = ''
        setKeyName('bank_name', '')
      }
    }
  }

  const handleClear = () => {
    tableProps.value.rows = []
    dispersion_group_letter_details.value = []
    groupSelected.value = null
  }

  const letterFormatOptionsDesc = computed(() => {
    return [...(letter_format_options.value ?? [])].sort(
      (a, b) => Number(b.value) - Number(a.value)
    )
  })

  onMounted(async () => {
    await _getResources(
      {
        treasury: ['dispersion_letter_status', 'dispersion_letter_business'],
      },
      '',
      'v2'
    )

    _getResources({ fics: ['offices'] })
  })

  onBeforeMount(() => {
    handlerHolidays(new Date().getFullYear())
  })

  watch(dispersion_group_letter_list, () => {
    tableProps.value.rows = dispersion_group_letter_list.value
  })

  watch(dispersion_group_letter_pages, () => {
    tableProps.value.pages = {
      currentPage: dispersion_group_letter_pages.value.currentPage || 1,
      lastPage: dispersion_group_letter_pages.value.lastPage || 1,
    }
  })

  watch(dispersion_group_letter_details, () => {
    detailTableProps.value.rows = dispersion_group_letter_details.value
  })

  return {
    headerProps,
    tableProps,
    filters,
    filtersRef,
    selectedItems,
    modalDissolutionRef,
    showModalDissolution,
    showTable,
    reasonDissolution,
    detailTableProps,
    letterFormatOptionsDesc,
    selectedFormats,
    handleClickDissolution,
    onChangeFilter,
    confirmDissolution,
    handleGenerateLetters,
    handleFilter,
    handleShowMoreFilters,
    groupSelected,
    getDetailDispersionGroup,
    dispersion_group_letter_details_pages,
    openModalLetterGeneration,
    alertModalRef,
    closeModalLetterGeneration,
    handleClear,
    // handleUpdateFilters,
    // updatePage,
    // updatePerPage,
  }
}

export default useGenerateDispersionGroupLetterList
