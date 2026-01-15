import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import { QTable } from 'quasar'
import { IAccountStructure, IFieldFilters } from '@/interfaces/customs'

import { status } from '@/constants/resources'

import { defaultIconsLucide, formatParamsCustom } from '@/utils'

import {
  useAccountingResourceStore,
  useAccountStructuresStore,
  useResourceManagerStore,
} from '@/stores'
import { useRouteValidator } from '@/composables'

const useAccountStructureList = () => {
  const {
    _getListAction,
    _cleanAccountStructuresData,
    _toggleAccountStructureStatus,
    _selectAccountStructure,
  } = useAccountStructuresStore('v1')
  const { account_structure_types, account_structures_code_purpose } =
    storeToRefs(useAccountingResourceStore('v1'))
  const {
    account_structures_list,
    account_structures_pages,
    selected_account_structure,
  } = storeToRefs(useAccountStructuresStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const router = useRouter()

  const alertModalRef = ref()
  const { validateRouter } = useRouteValidator()

  let perPage = 20

  const tableProps = ref({
    title: 'Listado de estructuras de cuentas',
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
        name: 'code',
        required: true,
        label: 'Código',
        align: 'left',
        field: (row: IAccountStructure) => `${row.code}`,
        sortable: true,
      },
      {
        name: 'structure',
        required: true,
        label: 'Estructura',
        align: 'left',
        field: (row: IAccountStructure) => `${row.structure}`,
        sortable: true,
      },
      {
        name: 'purpose',
        required: true,
        label: 'Finalidad',
        align: 'left',
        field: (row: IAccountStructure) => `${row.purpose}`,
        sortable: true,
      },
      {
        name: 'type',
        required: true,
        label: 'Tipo',
        align: 'left',
        field: (row: IAccountStructure) => `${row.type.value}`,
        sortable: true,
      },
      {
        name: 'status',
        required: true,
        label: 'Estado',
        align: 'left',
        field: (row: IAccountStructure) => `${row.status.id}`,
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
    rows: [] as IAccountStructure[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const headerProps = {
    title: 'Estructuras de cuentas',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad' },
      { label: 'Estructuras de cuentas', route: 'AccountStructureList' },
    ],
    btn: {
      label: 'Crear',
      icon: defaultIconsLucide.plusCircle,
    },
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'type',
      label: 'Tipo',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      options: account_structure_types,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'structure',
      label: 'Estructura',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      options: account_structures_code_purpose,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      options: status,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por código o finalidad',
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const keys = {
    accounting: [
      'account_structure_types',
      'account_structure_statuses',
      'account_structures',
    ],
  }

  const handleFilter = ($filters: {
    'filter[type_id]': string
    'filter[structure_id]': string
    'filter[status_id]': string
    'filter[search]': string
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
      page: 1,
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

  const accountStructureStatus = computed(() =>
    selected_account_structure.value?.status.id === 1 ? 'desactivar' : 'activar'
  )

  const toggleAccountStructureStatus = () => {
    _toggleAccountStructureStatus().then((status) => {
      if (status) {
        alertModalRef.value.closeModal()
        listAction()
      }
    })
  }

  const selectAccountStructure = (accountStructure: IAccountStructure) => {
    _selectAccountStructure(accountStructure)
    alertModalRef.value.openModal()
  }

  onMounted(async () => {
    _getResources(keys)
    _cleanAccountStructuresData()
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  watch(
    () => account_structures_list.value,
    () => {
      tableProps.value.rows = account_structures_list.value
    }
  )

  watch(
    () => account_structures_pages.value,
    () => {
      tableProps.value.pages = account_structures_pages.value
    }
  )

  return {
    headerProps,
    tableProps,
    alertModalRef,
    accountStructureStatus,
    filterConfig,
    //
    validateRouter,
    handleFilter,
    handleGoTo,
    toggleAccountStructureStatus,
    selectAccountStructure,
    updatePage,
    updatePerPage,
    _cleanAccountStructuresData,
  }
}

export default useAccountStructureList
