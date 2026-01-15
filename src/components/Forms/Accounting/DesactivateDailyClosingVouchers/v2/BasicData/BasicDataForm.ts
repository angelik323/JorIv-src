// vue - pinia
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'

// interfaces
import { IDesativateDailyClosingVouchersCreate } from '@/interfaces/customs/accounting/DesactivateDailyClosingVouchersV2'
import { IBusinessAvailableListItem } from '@/interfaces/customs/accounting/DesactivateDailyClosingVouchersV2'
import { IFieldFilters } from '@/interfaces/customs'
import { IBaseTableProps } from '@/interfaces/global'

// composables
import { useRules } from '@/composables/useRules'
import { useUtils } from '@/composables/useUtils'

// stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useDesactivateDailyClousingVouchersStore } from '@/stores/accounting/desactivate-daily-clousing-vouchers'
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'

const useBasicDataForm = (emits: Function) => {
  const { is_required } = useRules()
  const { formatParamsCustom, formatDate, subtractDaysFromDate } = useUtils()
  const { _getListBusinessAvailable } =
    useDesactivateDailyClousingVouchersStore('v2')

  const { accounting_account_structures, business_trusts_for_period_opening } =
    storeToRefs(useAccountingResourceStore('v1'))

  const { _getResources } = useResourceManagerStore('v1')

  const models = ref<IDesativateDailyClosingVouchersCreate>({
    current_period: '',
    accounting_structure_id: undefined,
    from_business: undefined,
    from_business_code: undefined,
    to_business: undefined,
    to_business_code: undefined,
    last_closing_day: '',
    revert_balances_date: '',
    opening_reason: '',
    business_ids: [],
  })

  const filterRef = ref()
  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'current_period',
      label: 'Periodo actual*',
      type: 'q-date',
      value: null,
      mask: 'YYYY-MM',
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM',
      rules: [
        (val: string) => is_required(val, 'El periodo actual es obligatorio'),
      ],
    },
    {
      name: 'accounting_structure_id',
      label: 'Estructura contable*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: accounting_account_structures,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
      rules: [
        (val: string) =>
          is_required(val, 'La estructura contable es obligatoria'),
      ],
    },
    {
      name: 'from_business',
      label: 'Desde negocio*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: business_trusts_for_period_opening,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
      rules: [(val: string) => is_required(val, 'El negocio es obligatorio')],
    },
    {
      name: 'last_closing_day',
      label: 'Fecha de última actualización*',
      type: 'q-date',
      value: null,
      mask: 'YYYY-MM-DD',
      class: 'col-12 col-md-4',
      disable: true,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      rules: [
        (val: string) =>
          is_required(val, 'La fecha de última actualización es obligatoria'),
      ],
    },
    {
      name: 'to_business',
      label: 'Hasta negocio*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: business_trusts_for_period_opening,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
      rules: [(val: string) => is_required(val, 'El negocio es obligatorio')],
    },
    {
      name: 'revert_balances_date',
      label: 'Desactualiza saldos a*',
      type: 'q-date',
      value: null,
      mask: 'YYYY-MM-DD',
      class: 'col-12 col-md-4',
      disable: true,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      rules: [(val: string) => is_required(val)],
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const handleCleanFilters = () => {
    filtersFormat.value = {}
    tableBusinessAvailableProps.value.rows = []
  }

  const changeValuesFilter = (values: Record<string, string>) => {
    if (values['filter[current_period]']) {
      models.value.current_period = values['filter[current_period]']
    }
    if (values['filter[accounting_structure_id]']) {
      models.value.accounting_structure_id = Number(
        values['filter[accounting_structure_id]']
      )
    }
    if (values['filter[from_business]']) {
      models.value.from_business = Number(values['filter[from_business]'])
    }
    if (values['filter[to_business]']) {
      models.value.to_business = Number(values['filter[to_business]'])
    }
    if (values['filter[last_closing_day]']) {
      models.value.last_closing_day = values['filter[last_closing_day]']
    }
    if (values['filter[revert_balances_date]']) {
      models.value.revert_balances_date = values['filter[revert_balances_date]']
    }
  }

  const tableBusinessAvailableProps = ref<
    IBaseTableProps<IBusinessAvailableListItem>
  >({
    title: 'Listado de negocios habilitados',
    loading: false,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'business',
        required: true,
        label: 'Negocio',
        align: 'left',
        field: 'negocio',
        sortable: true,
      },
      {
        name: 'period',
        required: true,
        label: 'Periodo actual',
        align: 'left',
        field: 'periodo_actual',
        sortable: true,
      },
      {
        name: 'is_period_consolidated',
        required: true,
        label: '¿Periodo consolidado?',
        align: 'left',
        field: (row) => (row.afecta_consolidacion ? 'Sí' : 'No'),
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const listAction = async (filters: string = '') => {
    tableBusinessAvailableProps.value.rows = []
    tableBusinessAvailableProps.value.loading = true
    const { data_list_business_available, pages } =
      await _getListBusinessAvailable(filters)
    tableBusinessAvailableProps.value.rows = data_list_business_available.map(
      (item) => {
        return {
          ...item,
          id: item.id_negocio,
        }
      }
    )
    tableBusinessAvailableProps.value.pages = pages
    tableBusinessAvailableProps.value.loading = false
  }

  const handleFilter = ($filters: Record<string, string>) => {
    filtersFormat.value = {
      'filter[current_period]': $filters['filter[current_period]'],
      'filter[accounting_structure_id]':
        $filters['filter[accounting_structure_id]'],
      'filter[from_business_code]': models.value.from_business_code || '',
      'filter[to_business_code]': models.value.to_business_code || '',
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const updatePage = async (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const updateRows = (rows: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rows,
      page: 1,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const getDataForm = () => {
    return models.value
  }

  const handleSelected = (selected: IBusinessAvailableListItem[]) => {
    models.value.business_ids = selected.map((item) => item.id)
  }

  const isFormValid = computed(() => {
    return (
      models.value.current_period !== '' &&
      models.value.accounting_structure_id !== undefined &&
      models.value.from_business !== undefined &&
      models.value.to_business !== undefined &&
      models.value.last_closing_day !== '' &&
      models.value.revert_balances_date !== '' &&
      (models.value.business_ids?.length ?? 0) > 0
    )
  })

  watch(
    isFormValid,
    (isValid) => {
      emits('validateForm', isValid)
    },
    { immediate: true }
  )

  onMounted(async () => {
    await _getResources(
      {
        accounting: ['accounting_account_structures'],
      },
      '',
      'v2'
    )
  })

  watch(
    () => [models.value.accounting_structure_id, models.value.current_period],
    () => {
      filterRef.value.setFieldValueByName('from_business', null)
      filterRef.value.setFieldValueByName('to_business', null)
      if (models.value.accounting_structure_id && models.value.current_period) {
        _getResources(
          {
            accounting: ['business_trusts_for_period_opening'],
          },
          `filter[daily_closing]=true${
            models.value.current_period
              ? `&filter[current_period]=${models.value.current_period}`
              : ''
          }${
            models.value.accounting_structure_id
              ? `&filter[accounting_structure_id]=${models.value.accounting_structure_id}`
              : ''
          }`,
          'v2'
        )
      }
    }
  )

  watch(
    () => [models.value.from_business, models.value.to_business],
    () => {
      const from_business = business_trusts_for_period_opening.value.find(
        (element) => element.id === models.value.from_business
      )
      const to_business = business_trusts_for_period_opening.value.find(
        (element) => element.id === models.value.to_business
      )

      models.value.from_business_code = from_business?.business_code ?? ''
      models.value.to_business_code = to_business?.business_code ?? ''

      if (
        from_business &&
        (from_business?.account_structures?.length ?? 0) > 0
      ) {
        const last_closing_day =
          from_business.account_structures[0].last_closing_day
        filterRef.value.setFieldValueByName(
          'last_closing_day',
          formatDate(last_closing_day, 'YYYY-MM-DD')
        )
        filterRef.value.setFieldValueByName(
          'revert_balances_date',
          subtractDaysFromDate(last_closing_day, 1, 'YYYY-MM-DD')
        )
      }
    }
  )

  return {
    filterRef,
    filterConfig,
    tableBusinessAvailableProps,
    handleFilter,
    handleCleanFilters,
    updatePage,
    updateRows,
    getDataForm,
    changeValuesFilter,
    handleSelected,
  }
}

export default useBasicDataForm
