import { onBeforeMount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { QTable } from 'quasar'
import { IFieldFilters, IScheduleDeferralItem } from '@/interfaces/customs'

import { defaultIconsLucide, formatParamsCustom } from '@/utils'

import {
  useScheduleDeferralStore,
  useResourceManagerStore,
  useAccountingResourceStore,
} from '@/stores'
import { useProcessDeferredStore } from '@/stores/accounting/process-deferred'
import { useRouteValidator } from '@/composables'

const useScheduleDeferralList = () => {
  const { _getScheduleDeferralList, _cleanScheduleDeferralsData } =
    useScheduleDeferralStore('v1')
  const { schedule_deferral_list, schedule_deferral_pages } = storeToRefs(
    useScheduleDeferralStore('v1')
  )
  const {
    deferred_schedule_business_trusts: business_trust,
    account_structures_active_revert_vouchers: account_structures,
    voucher_status,
  } = storeToRefs(useAccountingResourceStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { deferred_schedule } = storeToRefs(useProcessDeferredStore('v1'))

  const router = useRouter()
  const { validateRouter } = useRouteValidator()

  const headerProps = {
    title: 'Programar y procesar diferidos',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad' },
      {
        label: 'Programar y procesar diferidos',
        route: 'ScheduleDeferralList',
      },
    ],
    btn: {
      label: 'Programar',
      icon: defaultIconsLucide.plusCircle,
    },
  }

  let perPage = 20

  const styleColumn = (width: number = 200) => ({
    'white-space': 'pre-wrap',
    'min-width': `${width}px`,
    'max-width': `${width}px`,
    'overflow-wrap': 'break-word',
  })

  const tableProps = ref({
    title: 'Listado de diferidos',
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
        label: 'Estructura',
        align: 'left',
        field: (row: IScheduleDeferralItem) =>
          `${row.structure.code} - ${row.structure.name}`,
        sortable: true,
      },
      {
        name: 'business',
        required: true,
        label: 'Negocio',
        align: 'left',
        field: (row: IScheduleDeferralItem) =>
          `${row.business_trust.code} - ${row.business_trust.name}`,
        sortable: true,
      },
      {
        name: 'period',
        required: true,
        label: 'Periodo',
        align: 'left',
        field: (row: IScheduleDeferralItem) => `${row.period}`,
        sortable: true,
      },
      {
        name: 'receipt_type',
        required: true,
        label: 'Tipo de comprobante',
        align: 'left',
        field: (row: IScheduleDeferralItem) => `${row.receipt_type.code}`,
        sortable: true,
        style: styleColumn(100),
      },
      {
        name: 'receipt_sub_type',
        required: true,
        label: 'Sub tipo de comprobante',
        align: 'left',
        field: (row: IScheduleDeferralItem) => `${row.sub_receipt_type.code}`,
        sortable: true,
        style: styleColumn(100),
      },
      {
        name: 'status',
        required: true,
        label: 'Estado',
        align: 'left',
        field: (row: IScheduleDeferralItem) => `${row.status.id}`,
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
    rows: [] as IScheduleDeferralItem[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'period',
      label: 'Periodo',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 q-pt-none',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM',
      mask: 'YYYY-MM',
    },
    {
      name: 'account_structure_id',
      label: 'Estructura',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 q-pt-none',
      options: account_structures,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 q-pt-none',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por código de estructura y/o finalidad',
    },
    {
      name: 'business_trust_id',
      label: 'Negocio',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 q-pt-none',
      options: business_trust,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: true,
    },
    {
      name: 'status',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 q-pt-none',
      options: voucher_status,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: true,
    },
  ])

  const filtersComponentRef = ref()

  const updatedFilters = ($filter: {
    'filter[account_structure_id]': string
  }) => {
    const accountStructureId = $filter['filter[account_structure_id]']
    if (
      filtersFormat.value['filter[account_structure_id]'] !== accountStructureId
    ) {
      filtersComponentRef.value.cleanFiltersByNames(['business_trust_id'])
      if (!accountStructureId) return
      const accountStructureFilter = `filter[account_structure_id]=${accountStructureId}`
      _getResources(
        {
          accounting: ['deferred_impairment_business_trusts'],
        },
        accountStructureFilter
      )
    }

    filtersFormat.value = { ...filtersFormat.value, ...$filter }
  }

  const handleShowFilters = (showMore: boolean) => {
    const hiddenFilters = ['status', 'business_trust_id']
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
      page: 1,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getScheduleDeferralList(filters)
    tableProps.value.loading = false
  }

  const handleGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  const keys = {
    accounting: ['account_structures_active', 'voucher_status'],
    trust_business: ['business_trust_change_status', 'business_trust_statuses'],
  }

  onMounted(async () => {
    _cleanScheduleDeferralsData()
    tableProps.value.rows = schedule_deferral_list.value
    _getResources(keys)
  })

  onBeforeMount(() => {
    _resetKeys({
      accounting: [...keys.accounting, 'deferred_schedule_business_trusts'],
      trust_business: [...keys.trust_business],
    })
  })

  watch(
    () => schedule_deferral_list.value,
    () => {
      tableProps.value.rows = schedule_deferral_list.value
    }
  )

  watch(
    () => schedule_deferral_pages.value,
    () => {
      tableProps.value.pages = schedule_deferral_pages.value
    }
  )

  const goToProcessDeferred = (
    row: IScheduleDeferralItem | undefined = undefined
  ) => {
    if (row) {
      deferred_schedule.value = row
    }
    router.push({ name: 'ProcessDeferredList' })
  }

  return {
    // Props
    headerProps,
    tableProps,
    filterConfig,
    filtersComponentRef,
    // Methods
    updatedFilters,
    handleFilter,
    handleShowFilters,
    handleGoTo,
    updatePage,
    updatePerPage,
    goToProcessDeferred,
    _cleanScheduleDeferralsData,
    validateRouter,
  }
}

export default useScheduleDeferralList
