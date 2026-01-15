// vue - pinia
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

//interfaces
import {
  ICaculationFilters,
  ICalculationResponseList,
} from '@/interfaces/customs/fixed-assets/CalculationDeterioration'
import { IBaseTableProps } from '@/interfaces/global'

// composables
import {
  useGoToUrl,
  useMainLoader,
  useUtils,
  useRouteValidator,
} from '@/composables'

//stores
import { useCalculationDeteriorationStore } from '@/stores/fixed-assets/calculation-deterioration'
import { useFixedAssetsResourceStore, useResourceManagerStore } from '@/stores'

const useCalculationDeteriorationList = () => {
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()

  //stores
  const { _getCalculationList, _deleteCalculation } =
    useCalculationDeteriorationStore('v1')

  const filtersFormat = ref<Record<string, string | number>>({})
  const tableRef = ref()
  const alertModalRef = ref()

  // keys
  const keys = ref({
    fixed_assets: [
      'impairments',
      'impairments_business_trust',
      'impairments_types',
      'impairments_status',
    ],
  })

  const headerProps = {
    title: 'Cálculo de deterioro',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Activos fijos',
        route: '',
      },
      {
        label: 'Cálculo de deterioro',
        route: 'CalculationDeteriorationList',
      },
    ],
    btn: {
      label: 'Crear',

      icon: defaultIconsLucide.plusCircleOutline,
    },
  }
  const { _getResources } = useResourceManagerStore('v1')

  const {
    impairments,
    impairments_business_trust,
    impairments_types,
    impairments_status,
  } = storeToRefs(useFixedAssetsResourceStore('v1'))

  // filters
  const filterConfig = ref([
    {
      name: 'id',
      label: 'Código  deterioro',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: impairments,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'business_trust_id',
      label: 'Negocio',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      options: impairments_business_trust,
    },
    {
      name: 'configuration_types_id',
      label: 'Tipo de activo fijo',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      options: impairments_types,
    },
    {
      name: 'statuses_id',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      options: impairments_status,
      placeholder: 'Todos',
    },
  ])

  const tableProps = ref<IBaseTableProps<ICalculationResponseList>>({
    title: 'Listado de cálculo de deterioro de activos',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        label: 'Código deterioro',
        align: 'center',
        field: 'id',
        sortable: true,
      },
      {
        name: 'business_trust_id',
        label: 'Negocio',
        align: 'center',
        field: 'business_trust_id',
        sortable: true,
      },
      {
        name: 'asset',
        label: 'Activo',
        align: 'left',
        field: (row: ICalculationResponseList) => row.asset.info,
        sortable: true,
      },
      {
        name: 'configuration_type',
        label: 'Tipo configuración',
        align: 'left',
        field: (row: ICalculationResponseList) => row.configuration_type.info,
        sortable: true,
      },
      {
        name: 'configuration_subtype',
        label: 'Subtipo configuración',
        align: 'left',
        field: (row: ICalculationResponseList) =>
          row.configuration_subtype.info,
        sortable: true,
      },
      {
        name: 'book_value',
        label: 'Valor contable',
        align: 'right',
        field: 'book_value',
        sortable: true,
        format: (val: number) =>
          new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
          }).format(val),
      },
      {
        name: 'impairment_loss',
        label: 'Valor deterioro',
        align: 'right',
        field: 'impairment_loss',
        sortable: true,
        format: (val: number) =>
          new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
          }).format(val),
      },
      {
        name: 'impairment_date',
        label: 'Fecha deterioro',
        align: 'center',
        field: 'impairment_date',
        sortable: true,
      },
      {
        name: 'status_impairment',
        label: 'Estado',
        align: 'center',
        field: (row: ICalculationResponseList) => row.status_impairment.status,
        sortable: true,
      },
      {
        name: 'actions',
        label: 'Acciones',
        align: 'center',
        field: 'id',
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const alertModalConfig = ref({
    description: '',
    textBtnConfirm: 'Aceptar',
    textBtnCancel: 'Cancelar',
    id: null as null | number,
    option: 'calculation',
  })

  const openDeleteModal = async (id: number) => {
    alertModalConfig.value.description =
      '¿Confirma que desea eliminar el cálculo de deterioro seleccionado? Esta acción no se puede deshacer.'
    alertModalConfig.value.id = id
    alertModalConfig.value.option = 'calculation'

    alertModalRef.value.openModal()
  }

  const handleDelete = async () => {
    if (!alertModalConfig.value.id) return

    openMainLoader(true)
    let result = false

    if (alertModalConfig.value.option === 'calculation') {
      result = await _deleteCalculation(alertModalConfig.value.id)
    }

    if (result) {
      await alertModalRef.value.closeModal()
      await listAction(filtersFormat.value)
    }
    openMainLoader(false)
  }

  const handleFilter = async ($filters: ICaculationFilters) => {
    filtersFormat.value = { ...$filters }

    await listAction(filtersFormat.value)
  }

  const listAction = async (filters: typeof filtersFormat.value) => {
    tableProps.value.rows = []
    tableProps.value.loading = true

    tableRef.value?.clearSelection()

    const list = await _getCalculationList(filters)

    tableProps.value.rows = list?.data || []
    tableProps.value.pages = list?.pages ?? { currentPage: 1, lastPage: 1 }

    tableProps.value.loading = false
  }

  const handleClearFilters = async () => {
    tableProps.value.rows = []
  }

  onMounted(async () => {
    await _getResources(keys.value)
  })

  return {
    headerProps,
    filterConfig,
    tableProps,
    alertModalConfig,
    alertModalRef,
    handleDelete,
    openDeleteModal,
    handleFilter,
    handleClearFilters,
    goToURL,
    validateRouter,
  }
}

export default useCalculationDeteriorationList
