import { QTable } from 'quasar'
import { defaultIconsLucide, formatParamsCustom } from '@/utils'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useResourceStore, useMovementCodeStore } from '@/stores'
import { IFieldFilters, IMovementCodes } from '@/interfaces/customs'
import { useMainLoader, useRouteValidator } from '@/composables'

const useTreasureMovementCodesList = () => {
  const { _getMovementCodes, _deleteMovementCodes, _getAllMovementCodes } =
    useMovementCodeStore('v1')
  const { movement_codes_list, movement_codes_pages, all_movement_codes } =
    storeToRefs(useMovementCodeStore('v1'))
  const {
    receipt_type,
    nature_movement_codes_list,
    operation_movement_codes_list,
  } = storeToRefs(useResourceStore('v1'))

  const { _getResourcesTreasuries } = useResourceStore('v1')

  const { codeOptions, descriptionOptions } = storeToRefs(
    useMovementCodeStore('v1')
  )
  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()
  const router = useRouter()
  const alertModalRef = ref()
  const keysMenu = ['nature', 'operation']
  const filtersFormat = ref<Record<string, string | number>>({})
  let perPage = 20

  const headerProps = {
    title: 'Códigos de movimiento de tesorería',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Tesorería', route: '' },
      {
        label: 'Códigos de movimientos de tesorería',
        route: 'TreasuryMovementCodesList',
      },
    ],
  }

  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '¿Desea eliminar el código de movimiento?',
    id: null as number | null,
  })

  const models = ref({
    codigo: '' as string | null,
    descripcion: '' as string | null,
    naturaleza: '',
    operacion: '',
  })

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: IMovementCodes[]
    pages: typeof movement_codes_pages
    rowsPerPage: number
  }>({
    title: 'Listado de códigos de movimiento de tesorería',
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
        required: false,
        label: 'Código',
        align: 'left',
        field: 'code',
        sortable: true,
      },
      {
        name: 'description',
        required: false,
        label: 'Descripción',
        align: 'left',
        field: (row) => row.description.toUpperCase(),
        sortable: true,
      },
      {
        name: 'operation',
        required: false,
        label: 'Operación',
        align: 'left',
        field: 'operation',
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
        sortable: false,
        style: 'width: 150px;',
      },
    ] as QTable['columns'],
    rows: [],
    pages: movement_codes_pages,
    rowsPerPage: perPage,
  })

  const handleFilter = ($filter: {
    'filter[code]': string
    'filter[description]': string
    'filter[nature]': string
    'filter[operation]': string
  }) => {
    filtersFormat.value = {
      ...$filter,
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
  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  const handleClear = async () => {
    tableProps.value.rows = []
    models.value.codigo = null
    models.value.descripcion = null
    models.value.naturaleza = ''
    models.value.operacion = ''
    filtersFormat.value = {}
  }

  const listAction = async (filters: string = '') => {
    tableProps.value.loading = true
    tableProps.value.rows = []
    await _getMovementCodes(filters)
    tableProps.value.loading = false
  }

  const openAlertModal = (id: number) => {
    alertModalConfig.value.id = id
    alertModalRef.value.openModal()
  }

  const modelsTyped = models as Record<string, any>

  const filters = ref<IFieldFilters[]>([
    {
      name: 'code',
      label: 'Código',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      autocomplete: true,
      options: codeOptions,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'description',
      label: 'Descripción',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: descriptionOptions,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'nature',
      label: 'Naturaleza',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: nature_movement_codes_list,
      disable: false,
      autocomplete: false,
      clean_value: false,
      placeholder: 'Seleccione',
    },
    {
      name: 'operation',
      label: 'Operación',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: operation_movement_codes_list,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
  ])
  const changeStatus = async () => {
    openMainLoader(true)
    await alertModalRef.value.closeModal()
    if (!alertModalConfig.value.id) return
    await _deleteMovementCodes(alertModalConfig.value.id)
    await listAction()
    openMainLoader(false)
  }

  onMounted(async () => {
    _getAllMovementCodes()
    _getResourcesTreasuries(`keys[]=${keysMenu.join('&keys[]=')}`)
    tableProps.value.rows = []
  })
  watch(
    () => movement_codes_list.value,
    () => {
      tableProps.value.rows = [...movement_codes_list.value]
    },
    { deep: true }
  )

  watch(
    () => movement_codes_pages.value,
    () => {
      tableProps.value.pages = movement_codes_pages.value
    }
  )

  watch(
    () => all_movement_codes.value,
    (data) => {
      codeOptions.value = data
        .filter((item) => item.code !== undefined && item.code !== null)
        .map((item) => ({
          label: item.code && item.description ? `${item.code} - ${item.description}`: '',
          value: String(item.code ?? ''),
        }))
      descriptionOptions.value = data
        .filter(
          (item) => item.description !== undefined && item.description !== null
        )
        .map((item) => ({
          label: String(item.description ?? ''),
          value: String(item.description ?? ''),
        }))
    },
    { immediate: true }
  )

  watch(
    filters,
    (fields) => {
      fields.forEach((f) => {
        if (
          f.autocomplete &&
          (typeof f.value === 'object' || typeof f.value === 'undefined')
        ) {
          f.value =
            f.value && typeof f.value.value === 'string' ? f.value.value : null
        }
      })
    },
    { deep: true }
  )

  return {
    // Estados
    models,
    headerProps,
    tableProps,
    defaultIconsLucide,
    alertModalConfig,
    alertModalRef,
    nature_movement_codes_list,
    operation_movement_codes_list,
    receipt_type,
    codeOptions,
    descriptionOptions,
    filters,
    modelsTyped,

    //Metodos
    handleFilter,
    updatePage,
    updatePerPage,
    handleClear,
    handlerGoTo,
    openAlertModal,
    changeStatus,
    validateRouter,
  }
}

export default useTreasureMovementCodesList
