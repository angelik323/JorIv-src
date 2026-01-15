// vue | quasar | router
import { onBeforeMount, onBeforeUnmount, ref, watch } from 'vue'
import { QTable } from 'quasar'

// store
import { storeToRefs } from 'pinia'
import {
  useDispersionGroupStore,
  useResourceManagerStore,
  useTreasuryResourceStore,
} from '@/stores'

// composables
import {
  useMainLoader,
  useRules,
  useRouteValidator,
  useUtils,
} from '@/composables'

// utils
import { formatParamsCustom } from '@/utils'
import { IDispersionGroup, IFieldFilters } from '@/interfaces/customs'

const useDispersionGroupList = () => {
  const {
    _getListAction,
    _downloadExcelDispersionGroup,
    _setDataFilters,
    _setGroupSelected,
  } = useDispersionGroupStore('v1')

  const { dispersion_group_list, dispersion_group_pages, data_filters } =
    storeToRefs(useDispersionGroupStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const {
    business_trusts_dipersion_up,
    business_trusts_dipersion_from,
    bank_account_dispersion_from,
    banks_dispersion_from,
    banks_dispersion_up,
    dispersion_group,
  } = storeToRefs(useTreasuryResourceStore('v1'))

  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()

  const hasFetchedAccounts = ref(false)

  // props
  const headerProps = {
    title: 'Consulta grupo de dispersión',
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
        label: 'Consulta grupo de dispersión',
        route: 'DispersionGroupList',
      },
    ],
  }

  const tableProps = ref({
    title: 'Consulta grupo de dispersión',
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
        name: 'business',
        required: false,
        label: 'Negocio',
        align: 'left',
        field: 'business',
        sortable: true,
      },

      {
        name: 'name_office',
        required: true,
        label: 'Nombre negocio',
        align: 'left',
        field: 'business_name',
        sortable: true,
      },
      {
        name: 'bank',
        required: true,
        label: 'Banco',
        align: 'left',
        field: 'bank_code',
        sortable: true,
      },
      {
        name: 'bank_name',
        required: true,
        label: 'Nombre banco',
        align: 'left',
        field: 'bank_name',
        sortable: true,
      },
      {
        name: 'account',
        required: true,
        label: 'Cuenta',
        align: 'left',
        field: 'account',
        sortable: true,
      },
      {
        name: 'dispersion_group',
        required: true,
        label: 'Grupo dispersión',
        align: 'left',
        field: 'dispersion_group',
        sortable: true,
      },
      {
        name: 'dispersion_type',
        required: false,
        label: 'Tipo',
        align: 'left',
        field: 'dispersion_type',
        sortable: true,
      },
      {
        name: 'validity',
        required: true,
        label: 'Vigencia',
        align: 'left',
        field: 'validity',
        sortable: true,
      },
      {
        name: 'status',
        required: true,
        label: 'Estado grupo',
        align: 'left',
        field: (row) => row.status?.status || '',
        sortable: true,
      },
      {
        name: 'turns',
        required: true,
        label: 'Giros',
        align: 'left',
        field: 'turns',
        sortable: true,
      },
      {
        name: 'status_respopnse',
        required: true,
        label: 'Estado respuesta',
        align: 'left',
        field: 'status_respopnse',
        sortable: true,
      },
      {
        name: 'status_approval',
        required: true,
        label: 'Estado aprobación',
        align: 'left',
        field: 'status_approval',
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
    rows: [] as IDispersionGroup[],
    pages: dispersion_group_pages,
  })

  const holidays = ref<string[]>([])

  const handlerHolidays = async (year: number) => {
    holidays.value = await useUtils().getHolidaysByYear(year)
  }

  const onFilterBusinessFrom = async (business_id: number) => {
    const selectedBusiness = business_trusts_dipersion_from.value.find(
      (b) => b.id === business_id
    )?.code

    const key = {
      treasury: ['business_trusts_dipersion'],
    }

    _resetKeys(key)

    if (business_id) {
      await _getResources(key, `filter[range_code]=${selectedBusiness}`)
    }
    filtersRef.value.cleanFiltersByNames(['up_business_name', 'up_business'])
  }

  const onFilterBankFrom = async (bank_id: number) => {
    const selectedBanks = banks_dispersion_from.value.find(
      (b) => b.id === bank_id
    )?.bank_code

    const key = {
      treasury: ['banks_dispersion'],
    }

    _resetKeys(key)

    if (bank_id) {
      await _getResources(key, `filter[range_code]=${selectedBanks}`)
    }
    filtersRef.value.cleanFiltersByNames(['up_bank_name', 'up_bank'])
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'from_business',
      label: 'Desde negocio',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      options: business_trusts_dipersion_from,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
      onChange: onFilterBusinessFrom,
    },
    {
      name: 'from_business_name',
      label: 'Nombre negocio',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: true,
      clean_value: true,
      placeholder: 'Inserte',
    },
    {
      name: 'up_business',
      label: 'Hasta negocio',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: false,
      options: business_trusts_dipersion_up,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
    },
    {
      name: 'up_business_name',
      label: 'Nombre negocio',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: true,
      clean_value: true,
      placeholder: 'Inserte',
    },
    {
      name: 'from_bank',
      label: 'Desde banco',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: false,
      options: banks_dispersion_from,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: true,
      autocomplete: true,
      onChange: onFilterBankFrom,
    },
    {
      name: 'from_bank_name',
      label: 'Nombre banco',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: true,
      clean_value: true,
      placeholder: 'Inserte',
      hide: true,
    },
    {
      name: 'up_bank',
      label: 'Hasta banco',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: false,
      options: banks_dispersion_up,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: true,
      autocomplete: true,
    },
    {
      name: 'up_bank_name',
      label: 'Nombre banco',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: true,
      clean_value: true,
      placeholder: 'Inserte',
      hide: true,
    },
    {
      name: 'from_account',
      label: 'Desde cuenta',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: false,
      options: bank_account_dispersion_from,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: true,
      autocomplete: true,
    },
    {
      name: 'from_account_name',
      label: 'Nombres cuenta',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: true,
      clean_value: true,
      placeholder: 'Inserte',
      hide: true,
    },
    {
      name: 'up_account',
      label: 'Hasta cuenta',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: false,
      options: bank_account_dispersion_from,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: true,
      autocomplete: true,
    },
    {
      name: 'up_account_name',
      label: 'Nombres cuenta',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: true,
      clean_value: true,
      placeholder: 'Inserte',
      hide: true,
    },
    {
      name: 'starting_date',
      label: 'Fecha inicial*',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: false,
      clean_value: true,
      placeholder: 'Inserte',
      rules: [
        (val: string) =>
          useRules().is_required(val, 'Fecha inicial es requerida'),
        useRules().date_before_or_equal_to_the_current_date,
      ],
      hide: true,
      navigation_max_year: new Date().getFullYear().toString(),
      navigation_min_year: '1000/01',
      option_calendar: ($event) =>
        useUtils().isDateAllowed($event, holidays.value),
      onNavigation: async ({ year }: { year: number }) => {
        handlerHolidays(year)
      },
    },
    {
      name: 'end_date',
      label: 'Fecha final*',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: false,
      clean_value: true,
      placeholder: 'Inserte',
      rules: [
        (val: string): true | string => {
          const startDate = filterConfig.value?.find(
            (f) => f.name === 'starting_date'
          )?.value
          if (!val || !startDate) return true
          return useRules().date_after_or_equal_to_specific_date(val, startDate)
        },
        (val: string): true | string =>
          useRules().is_required(val, 'Fecha final es requerida'),
      ],
      hide: true,
      navigation_max_year: new Date().getFullYear().toString(),
      navigation_min_year: '1000/01',
      option_calendar: ($event) =>
        useUtils().isDateAllowed($event, holidays.value),
      onNavigation: async ({ year }: { year: number }) => {
        handlerHolidays(year)
      },
    },
    {
      name: 'from_group',
      label: 'Desde grupo',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: false,
      options: dispersion_group,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: true,
      autocomplete: true,
    },
    {
      name: 'up_group',
      label: 'Hasta grupo',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: false,
      options: dispersion_group,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: true,
      autocomplete: true,
    },
  ])

  const filtersFormat = ref<Record<string, string | number | null | undefined>>(
    {}
  )
  const filtersRef = ref()

  // handlers / actions
  const handleFilter = (
    $filters: Record<string, string | number | null | undefined>
  ) => {
    filtersFormat.value = {
      ...$filters,
    }
    _setDataFilters(filtersFormat.value)
    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const listAction = async (filter: string = '') => {
    tableProps.value.loading = true
    tableProps.value.rows = []

    const pairs = filter.split('&')

    const filtered = pairs.filter((param) => !param.includes('_name')).join('&')
    openMainLoader(true)
    await _getListAction(filtered)
    openMainLoader(false)
    tableProps.value.loading = false
  }

  const onDdownloadExcel = async () => {
    const rawFilters = data_filters.value ?? {}
    const queryParams = Object.entries(rawFilters)
      .filter(
        ([key, value]) =>
          value !== undefined && value !== '' && !key.includes('_name')
      )
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`
      )
      .join('&')

    const paramsTransform = queryParams ? `${queryParams}` : ''

    openMainLoader(true)
    await _downloadExcelDispersionGroup(paramsTransform)
    openMainLoader(false)
  }

  const handleClear = () => {
    hasFetchedAccounts.value = false
    tableProps.value.rows = []
    filterConfig.value.forEach((f) => {
      f.value = null
    })
    filtersFormat.value = {}
  }

  const handlerGroupSelected = (group: IDispersionGroup | null) => {
    _setGroupSelected(group)
  }

  const into_bank_account_dispersion = ref<boolean>(true)
  const indexFields = [
    'from_bank',
    'from_bank_name',
    'up_bank',
    'up_bank_name',
    'from_account',
    'from_account_name',
    'up_account',
    'up_account_name',
    'starting_date',
    'end_date',
    'from_group',
    'up_group',
  ]

  const handleShowFilters = (showMore: boolean) =>
    filterConfig.value.forEach((field) => {
      if (indexFields.includes(field.name)) {
        field.hide = !showMore
      }
    })

  const setLocalFilterValue = (name: string, value: string | null) => {
    const field = filterConfig.value.find((f) => f.name === name)
    if (field) field.value = value
  }

  const handlerGet = async () => {
    if (
      filtersFormat.value['filter[from_business]'] &&
      filtersFormat.value['filter[up_business]'] &&
      filtersFormat.value['filter[from_bank]'] &&
      filtersFormat.value['filter[up_bank]'] &&
      into_bank_account_dispersion.value
    ) {
      const props = {
        keys: {
          treasury: ['bank_account_dispersion_from'],
        },
        filter: `bank_from_id=${filterConfig.value[4].value}&bank_to_id=${filterConfig.value[6].value}&business_from_id=${filterConfig.value[0].value}&business_to_id=${filterConfig.value[2].value}`,
      }
      openMainLoader(true)
      await _getResources(props.keys, props.filter)
      openMainLoader(false)
    }
  }

  const assignsValues = (
    name: string,
    exist: { value: string | number; name: string }
  ) => {
    filtersRef.value?.setFieldValueByName(name, exist ? exist.value : '')
    filtersRef.value?.setFieldValueByName(
      `${name}_name`,
      exist ? exist.name : ''
    )
    setLocalFilterValue(name, exist ? String(exist.value) : '')
    setLocalFilterValue(`${name}_name`, exist ? String(exist.name) : '')
  }
  const clearValues = (name: string) => {
    filtersRef.value?.setFieldValueByName(name, null)
    filtersRef.value?.setFieldValueByName(`${name}_name`, null)
    setLocalFilterValue(name, null)
    setLocalFilterValue(`${name}_name`, null)
  }

  const onChangeFilter = async (values: Record<string, string | number>) => {
    const from_business = values['filter[from_business]']
    const up_business = values['filter[up_business]']
    const from_bank = values['filter[from_bank]']
    const up_bank = values['filter[up_bank]']
    const from_account = values['filter[from_account]']
    const up_account = values['filter[up_account]']
    const starting_date = values['filter[starting_date]']
    const end_date = values['filter[end_date]']
    const from_group = values['filter[from_group]']
    const up_group = values['filter[up_group]']

    if (
      from_business &&
      from_business !== filtersFormat.value['filter[from_business]']
    ) {
      const exist = business_trusts_dipersion_from.value.find(
        (v) => v.value === from_business
      )
      if (!exist) return

      if (filtersFormat.value['filter[from_business]']) {
        assignsValues('from_business', exist)
        clearValues('from_account')
        clearValues('up_account')

        into_bank_account_dispersion.value = true
      } else {
        assignsValues('from_business', exist)
      }
    } else if (!from_business) {
      clearValues('from_business')
      clearValues('up_business')
      business_trusts_dipersion_up.value = []
    }

    if (
      up_business &&
      up_business !== filtersFormat.value['filter[up_business]']
    ) {
      const exist = business_trusts_dipersion_up.value.find(
        (v) => v.value === up_business
      )
      if (!exist) return

      if (filtersFormat.value['filter[up_business]']) {
        assignsValues('up_business', exist)
        clearValues('from_account')
        clearValues('up_account')

        into_bank_account_dispersion.value = true
      } else {
        assignsValues('up_business', exist)
      }
    } else if (!up_business) {
      clearValues('up_business')
    }

    if (from_bank && from_bank !== filtersFormat.value['filter[from_bank]']) {
      const exist = banks_dispersion_from.value.find(
        (v) => v.value === from_bank
      )
      if (!exist) return

      if (filtersFormat.value['filter[from_bank]']) {
        assignsValues('from_bank', exist)
        clearValues('from_account')
        clearValues('up_account')

        into_bank_account_dispersion.value = true
      } else {
        assignsValues('from_bank', exist)
      }
    } else if (!from_bank) {
      clearValues('from_bank')
      clearValues('up_bank')
      banks_dispersion_up.value = []
    }

    if (up_bank && up_bank !== filtersFormat.value['filter[up_bank]']) {
      const exist = banks_dispersion_up.value.find((v) => v.value === up_bank)
      if (!exist) return

      if (filtersFormat.value['filter[up_bank]']) {
        assignsValues('up_bank', exist)
        clearValues('from_account')
        clearValues('up_account')

        into_bank_account_dispersion.value = true
      } else {
        assignsValues('up_bank', exist)
      }
    }

    if (
      from_account &&
      from_account !== filtersFormat.value['filter[from_account]']
    ) {
      const exist = bank_account_dispersion_from.value.find(
        (v) => v.value === from_account
      )
      if (!exist) return

      assignsValues('from_account', exist)
    }

    if (
      up_account &&
      up_account !== filtersFormat.value['filter[up_account]']
    ) {
      const exist = bank_account_dispersion_from.value.find(
        (v) => v.value === up_account
      )
      if (!exist) return

      assignsValues('up_account', exist)
    }
    if (
      starting_date &&
      starting_date !== filtersFormat.value['filter[starting_date]']
    ) {
      filtersRef.value?.setFieldValueByName('starting_date', starting_date)
      setLocalFilterValue('starting_date', String(starting_date))
    }

    if (end_date && end_date !== filtersFormat.value['filter[end_date]']) {
      filtersRef.value?.setFieldValueByName('end_date', end_date)
      setLocalFilterValue('end_date', String(end_date))
    }

    if (
      from_group &&
      from_group !== filtersFormat.value['filter[from_group]']
    ) {
      const exist = dispersion_group.value.find((v) => v.value === from_group)
      if (!exist) return

      filtersRef.value?.setFieldValueByName('from_group', exist.value)
      setLocalFilterValue('from_group', String(exist.value))
      into_bank_account_dispersion.value = false
    }

    if (up_group && up_group !== filtersFormat.value['filter[up_group]']) {
      const exist = dispersion_group.value.find((v) => v.value === up_group)
      if (!exist) return

      filtersRef.value?.setFieldValueByName('up_group', exist.value)
      setLocalFilterValue('up_group', String(exist.value))
      into_bank_account_dispersion.value = false
    }

    filtersFormat.value = {
      ...values,
    }

    handlerGet()
  }

  const handleClearFilters = () => {
    filtersFormat.value = {}
    tableProps.value.rows = []
    filterConfig.value.forEach((f) => {
      f.value = null
      filtersRef.value?.setFieldValueByName(f.name, null)
    })
  }

  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
      rows: 20,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const updatePerPage = (rowsPerPage: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rowsPerPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  // lifecycle hooks
  onBeforeMount(() => {
    const keys = {
      treasury: [
        'business_trusts_dipersion_from',
        'banks_dispersion_from',
        'dispersion_group',
      ],
    }
    _getResources(keys)
    handlerHolidays(new Date().getFullYear())
  })

  onBeforeUnmount(() => {
    _resetKeys({
      treasury: [
        'business_trusts_dipersion_from',
        'business_trusts_dipersion_up',
        'banks_dispersion_from',
        'banks_dispersion_up',
        'bank_account_dispersion_from',
        'dispersion_group',
      ],
    })
  })

  // watchers
  watch(
    () => dispersion_group_list.value,
    () => {
      tableProps.value.rows = dispersion_group_list.value as IDispersionGroup[]
      tableProps.value.pages = dispersion_group_pages.value
    }
  )

  watch(
    () => bank_account_dispersion_from.value,
    (value) => {
      if (value.length > 0) {
        into_bank_account_dispersion.value = false
      } else {
        into_bank_account_dispersion.value = true
      }
    }
  )

  return {
    filterConfig,
    headerProps,
    tableProps,
    filtersRef,
    handlerGroupSelected,
    handleClearFilters,
    handleShowFilters,
    onDdownloadExcel,
    validateRouter,
    onChangeFilter,
    updatePerPage,
    handleFilter,
    handleClear,
    updatePage,
  }
}

export default useDispersionGroupList
