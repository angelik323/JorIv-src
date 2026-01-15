import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { QTable } from 'quasar'

import { IFieldFilters, IHomologationProcessItem } from '@/interfaces/customs'

import { defaultIconsLucide, formatParamsCustom } from '@/utils'
import { useRules, useRouteValidator } from '@/composables'

import {
  useAccountingResourceStore,
  useHomologationProcessStore,
  useResourceManagerStore,
} from '@/stores'

const useHomologationProcessList = () => {
  const { _getHomologationProcessList, _cleanHomologationProcessData } =
    useHomologationProcessStore('v1')
  const {
    account_structures_active_revert_vouchers: account_structures,
    vouchers_mapping_process_statuses,
    business_trusts_by_account_structure_and_equivalence: business_trust,
  } = storeToRefs(useAccountingResourceStore('v1'))
  const { homologation_process_list, homologation_process_pages } = storeToRefs(
    useHomologationProcessStore('v1')
  )
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const router = useRouter()
  const { validateRouter } = useRouteValidator()

  let perPage = 20

  const styleColumn = (width: number = 200) => ({
    'white-space': 'nowrap',
    'min-width': `${width}px`,
    'max-width': `${width}px`,
    'overflow-x': 'hidden',
    'text-overflow': 'ellipsis',
  })

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
        name: 'process',
        required: true,
        label: 'Proceso',
        align: 'left',
        field: (row: IHomologationProcessItem) => `${row.process_name}`,
        sortable: true,
        style: styleColumn(150),
      },
      {
        name: 'period',
        required: true,
        label: 'Periodo',
        align: 'left',
        field: (row: IHomologationProcessItem) => `${row.period}`,
        sortable: true,
      },
      {
        name: 'from_structure',
        required: true,
        label: 'Estructura origen',
        align: 'left',
        field: (row: IHomologationProcessItem) =>
          `${row.source_structure.code} - ${row.source_structure.purpose}`,
        sortable: true,
      },
      {
        name: 'to_structure',
        required: true,
        label: 'Estructura destino',
        align: 'left',
        field: (row: IHomologationProcessItem) =>
          `${row.destination_structure.code} - ${row.destination_structure.purpose}`,
        sortable: true,
      },
      {
        name: 'status',
        required: true,
        label: 'Estado de homologación del proceso',
        align: 'left',
        field: (row: IHomologationProcessItem) => `${row.status}`,
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
    rows: [] as IHomologationProcessItem[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const headerProps = {
    title: 'Procesos de homologación',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad' },
      { label: 'Procesos de homologación', route: 'HomologationProcessList' },
    ],
    btn: {
      label: 'Homologar',
      icon: defaultIconsLucide.plusCircle,
    },
  }

  const filterComponentRef = ref()

  const filtersFormat = ref<Record<string, string | number>>({})

  const selectStructure = (structureId: number, filterName: string) => {
    filtersFormat.value[filterName] = structureId

    _resetKeys({
      accounting: ['business_trusts_by_account_structure_and_equivalence'],
    })

    if (filtersFormat.value['filter[source_structure_id]']) {
      const structureFilter =
        `filter[source_structure_id]=${filtersFormat.value['filter[source_structure_id]']}` +
        (filtersFormat.value['filter[destination_structure_id]']
          ? `&filter[destination_structure_id]=${filtersFormat.value['filter[destination_structure_id]']}`
          : '')

      _getResources(
        {
          accounting: ['business_trusts_by_account_structure_and_equivalence'],
        },
        structureFilter,
        'v2'
      )
    }
    filterComponentRef.value.cleanFiltersByNames([
      'business_trust_end_id',
      'business_trust_start_id',
    ])
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'source_structure_id',
      label: 'Estructura origen*',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      options: account_structures,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      onChange: selectStructure,
      rules: [
        (v: string) =>
          useRules().is_required(v, 'La estrutura de origen es requerida'),
      ],
    },
    {
      name: 'destination_structure_id',
      label: 'Estructura destino',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      options: account_structures,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      onChange: selectStructure,
    },
    {
      name: 'period',
      label: 'Periodo',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM',
      mask: 'YYYY-MM',
    },
    {
      name: 'status_id',
      label: 'Estado de homologación del proceso',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4 q-py-md',
      options: vouchers_mapping_process_statuses,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: true,
    },
    {
      name: 'business_trust_start_id',
      label: 'Desde negocio',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4 q-py-md',
      options: business_trust,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: true,
    },
    {
      name: 'business_trust_end_id',
      label: 'Hasta negocio',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4 q-py-md',
      options: business_trust,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: true,
    },
  ])

  const handleShowFilters = (showMore: boolean) => {
    const hiddenFilters = [
      'status_id',
      'business_trust_start_id',
      'business_trust_end_id',
    ]
    filterConfig.value.forEach((field) => {
      if (hiddenFilters.includes(field.name)) {
        field.hide = !showMore
      }
    })
  }

  const handleFilter = ($filters: {}) => {
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
    await _getHomologationProcessList(filters)
    tableProps.value.loading = false
  }

  const getStatus = (statusName: string) => {
    const status = vouchers_mapping_process_statuses.value.find(
      (item) => item.status === statusName
    )
    return status?.id ? status.id : 1
  }

  const handleGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  const keys = {
    accounting: [
      'account_structures_active',
      'vouchers_mapping_process_statuses',
    ],
  }

  onMounted(async () => {
    _getResources(keys)
    _getResources(
      { accounting: ['vouchers_mapping_process_statuses'] },
      '',
      'v2'
    )
  })

  onBeforeUnmount(() => {
    _resetKeys({
      accounting: [...keys.accounting, 'vouchers_mapping_process_statuses'],
    })
  })

  watch(
    () => homologation_process_list.value,
    () => {
      tableProps.value.rows = homologation_process_list.value
    }
  )

  watch(
    () => homologation_process_pages.value,
    () => {
      tableProps.value.pages = homologation_process_pages.value
    }
  )

  return {
    headerProps,
    tableProps,
    filterConfig,
    filterComponentRef,
    validateRouter,
    handleFilter,
    handleGoTo,
    updatePage,
    updatePerPage,
    handleShowFilters,
    getStatus,
    _cleanHomologationProcessData,
  }
}

export default useHomologationProcessList
