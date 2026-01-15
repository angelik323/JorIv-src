import { ref, watch, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { formatParamsCustom } from '@/utils'
import { useStructureTypesStore, useResourceStore } from '@/stores'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

import {
  IFieldFilters,
  IStructureType,
  IStructureTypeFilters,
} from '@/interfaces/customs'
import { useRouteValidator } from '@/composables'

const useStructureTypeList = () => {
  const router = useRouter()
  const { validateRouter } = useRouteValidator()

  const structureTypesStore = useStructureTypesStore('v1')

  const {
    structure_types_list,
    structure_types_pages,
    selected_structure_type,
  } = storeToRefs(useStructureTypesStore('v1'))

  const { _toggleStructureTypeStatus, _selectStructureType } =
    useStructureTypesStore('v1')

  const { status } = storeToRefs(useResourceStore('v1'))

  const headerProps = {
    title: 'Tipos de estructuras',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad' },
      { label: 'Tipos de estructuras', route: 'StructureTypeList' },
    ],
  }

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: IStructureType[]
    pages: { currentPage: number; lastPage: number }
  }>({
    title: 'Listado de tipos de estructuras',
    loading: false,
    columns: [
      { name: 'id', label: '#', align: 'left', field: 'id', sortable: true },
      {
        name: 'code',
        label: 'Código',
        align: 'left',
        field: (row) => row.code,
        sortable: true,
      },
      {
        name: 'name',
        label: 'Nombre',
        align: 'left',
        field: (row) => row.name,
        sortable: true,
      },
      {
        name: 'status',
        label: 'Estado',
        align: 'left',
        field: (row) => row.status,
        sortable: true,
      },
      {
        name: 'actions',
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })

  const filters = ref<IFieldFilters[]>([
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-6 q-py-md',
      options: status.value,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-6 q-py-md',
      prepend_icon: 'mdi-magnify',
      disable: false,
      clean_value: true,
      placeholder: 'Buscar por código o nombre',
    },
  ])

  const modelFilters = ref<IStructureTypeFilters>({
    status: null,
    search: null,
    page: 1,
    rows: 10,
  })

  const structureTypeStatus = computed(() => {
    const id = selected_structure_type.value?.status?.id
    return id === 1 ? 'inactivar' : 'activar'
  })

  const handleUpdateFilters = (data: IStructureTypeFilters) => {
    modelFilters.value = data
    const q = formatParamsCustom(modelFilters.value)
    listAction(q ? '&' + q : '')
  }

  const listAction = async (params = '') => {
    tableProps.value.loading = true
    await structureTypesStore._getListAction(params)
    tableProps.value.loading = false
  }

  const updatePage = (page: number) => {
    modelFilters.value.page = page
    const q = formatParamsCustom(modelFilters.value)
    listAction(q ? '&' + q : '')
  }

  const updatePerPage = (rowsPerPage: number) => {
    modelFilters.value.rows = rowsPerPage
    const q = formatParamsCustom(modelFilters.value)
    listAction(q ? '&' + q : '')
  }

  const handleGoTo = (routeName: string) => {
    router.push({ name: routeName })
  }

  const handleOptions = (option: string, row: IStructureType) => {
    if (option === 'edit') {
      router.push({ name: 'StructureTypeEdit', params: { id: row.id } })
    }
    if (option === 'toggle') {
      _selectStructureType(row)
      _toggleStructureTypeStatus()
    }
  }

  const alertModalRef = ref<InstanceType<typeof AlertModalComponent> | null>(
    null
  )

  const selectStructureType = (row: IStructureType) => {
    structureTypesStore._selectStructureType(row)
    alertModalRef.value?.openModal()
  }

  const toggleStructureTypeStatus = async () => {
    alertModalRef.value?.closeModal()
    await structureTypesStore._toggleStructureTypeStatus()
    updatePage(tableProps.value.pages.currentPage)
  }

  onMounted(async () => {
    await useResourceStore('v1').getResources('keys[]=status')
  })

  watch(structure_types_list, () => {
    tableProps.value.rows = structure_types_list.value
  })

  watch(structure_types_pages, () => {
    tableProps.value.pages = {
      currentPage: structure_types_pages.value.currentPage,
      lastPage: structure_types_pages.value.lastPage,
    }
  })

  return {
    headerProps,
    tableProps,
    selected_structure_type,
    filters,
    alertModalRef,
    structureTypeStatus,
    selectStructureType,
    toggleStructureTypeStatus,
    handleUpdateFilters,
    handleOptions,
    handleGoTo,
    updatePage,
    updatePerPage,
    _toggleStructureTypeStatus,
    _selectStructureType,
    validateRouter,
  }
}

export default useStructureTypeList
