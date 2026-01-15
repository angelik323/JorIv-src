import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { defaultIconsLucide, formatParamsCustom } from '@/utils'
import { IAnnualPeriodClosingModel, IFieldFilters } from '@/interfaces/customs'
import { useResourceStore, useAnnualPeriodClosingStore } from '@/stores'
import { QTable } from 'quasar'
import { useRouter } from 'vue-router'
import { useRouteValidator } from '@/composables'

const useAnnualPeriodClosingList = () => {
  const { _getListAction, _cleanData } = useAnnualPeriodClosingStore('v1')
  const {
    business_trusts_with_description_by_account_structure,
    account_structures_with_purpose,
  } = storeToRefs(useResourceStore('v1'))
  const { period_closing_list, validation_vouchers_pages } = storeToRefs(
    useAnnualPeriodClosingStore('v1')
  )
  const { _getAccountingResources } = useResourceStore('v1')
  const router = useRouter()
  const { validateRouter } = useRouteValidator()

  const alertModalRef = ref()

  let perPage = 20

  const tableProps = ref({
    title: 'Cierre de período anual',
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
        name: 'structure',
        required: true,
        label: 'Estructura contable',
        align: 'left',
        field: (row: IAnnualPeriodClosingModel) =>
          `${row.accounting_structure}`,
        sortable: true,
      },
      {
        name: 'from',
        required: true,
        label: 'Desde negocio',
        align: 'left',
        field: (row: IAnnualPeriodClosingModel) =>
          `${row.from_business_trust?.description}`,
        sortable: true,
      },
      {
        name: 'to',
        required: true,
        label: 'Hasta negocio',
        align: 'left',
        field: (row: IAnnualPeriodClosingModel) =>
          `${row.to_business_trust?.description}`,
        sortable: true,
      },
      {
        name: 'date',
        required: true,
        label: 'Última ejecución',
        align: 'left',
        field: (row: IAnnualPeriodClosingModel) => row.executed_at,
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IAnnualPeriodClosingModel[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const headerProps = {
    title: 'Cierre de período anual',
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
        label: 'Cierre de período anual',
        route: 'AnnualPeriodClosingList',
      },
    ],
    btn: {
      label: 'Crear',
      icon: defaultIconsLucide.plusCircleOutline,
    },
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'accounting_structure_id',
      label: 'Estructura contable',
      type: 'q-select',
      value: null,
      options: account_structures_with_purpose,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'seleccione',
      autocomplete: true,
    },
    {
      name: 'from_business_trust_id',
      label: 'Desde negocio*',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      options: business_trusts_with_description_by_account_structure,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
    },
    {
      name: 'to_business_trust_id',
      label: 'Hasta negocio',
      type: 'q-select',
      value: null,
      options: business_trusts_with_description_by_account_structure,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'seleccione',
      autocomplete: true,
    },

    {
      name: 'executed_at',
      label: 'Fecha de última ejecución ',
      type: 'q-date',
      value: null,
      mask: 'YYYY-MM-DD',
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const keys = [
    'account_structures_with_purpose',
    'business_trusts_with_description_by_account_structure',
  ]

  const handleFilter = ($filters: {
    'filter[accounting_structure_id]': string
    'filter[from_business_trust_id]': string
    'filter[to_business_trust_id]': string
    'filter[executed_at]': string
  }) => {
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
    await _getListAction(filters)
    tableProps.value.loading = false
  }

  const handleGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  onMounted(async () => {
    _getAccountingResources(`keys[]=${keys.join('&keys[]=')}`)
  })

  watch(
    () => period_closing_list.value,
    () => {
      tableProps.value.rows = period_closing_list?.value
    }
  )
  watch(
    () => validation_vouchers_pages.value,
    () => {
      tableProps.value.pages = validation_vouchers_pages.value
    }
  )

  return {
    headerProps,
    tableProps,
    alertModalRef,
    filterConfig,
    account_structures_with_purpose,
    //
    _cleanData,
    handleFilter,
    handleGoTo,
    updatePage,
    updatePerPage,
    validateRouter,
  }
}

export default useAnnualPeriodClosingList
