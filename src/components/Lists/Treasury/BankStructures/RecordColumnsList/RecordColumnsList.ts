import { useMainLoader, useRouteValidator } from '@/composables'
import { useBankStructuresStore } from '@/stores'
import { formatParamsCustom } from '@/utils'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const useRecordColumnsList = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()

  const { data_record_columns_list, pages_record_columns, selectIdRecordType } =
    storeToRefs(useBankStructuresStore('v1'))
  const {
    _getListRecordColumns,
    _createRecordColumns,
    _deleteRecordColumns,
    _updateRecordColumns,
  } = useBankStructuresStore('v1')
  const { validateRouter } = useRouteValidator()

  const isOpenExpansionItem = ref(false)
  const canCreateRecordColumns = ref(false)

  const formModalRef = ref()
  const formModalConfig = ref({
    title: 'Columna de registro',
    id: null as number | null,
    action: 'create' as 'create' | 'edit',
  })

  const textActionOnFormModal = computed(() => {
    return formModalConfig.value.action === 'create' ? 'Crear' : 'Actualizar'
  })

  const deleteModalRef = ref()
  const deleteModalConfig = ref({
    title: 'Advertencia',
    description: '¿Desea eliminar las columnas de los registros?',
    id: null as number | null,
  })

  const tableProperties = ref({
    title: 'Columnas de los registros',
    loading: false,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'center',
        field: 'id',
        sortable: true,
      },
      {
        name: 'variable_name',
        required: true,
        label: 'Campo variable',
        align: 'center',
        field: 'variable_name',
        sortable: true,
      },
      {
        name: 'structure_field_name',
        required: true,
        label: 'Nombre campo cubre en la estructura',
        align: 'center',
        field: 'structure_field_name',
        sortable: true,
      },
      {
        name: 'start_position',
        required: true,
        label: 'Posición inicial',
        align: 'center',
        field: 'start_position',
        sortable: true,
      },
      {
        name: 'dimension',
        required: true,
        label: 'Dimensión',
        align: 'center',
        field: (row) => (row.dimension !== null ? row.dimension : '-'),
        sortable: true,
      },
      {
        name: 'end_position',
        required: true,
        label: 'Posición final',
        align: 'center',
        field: (row) => (row.end_position !== null ? row.end_position : '-'),
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
    rows: data_record_columns_list.value,
    pages: pages_record_columns,
    wrapCells: true,
  })

  const updatePage = (pageNumber: number) => {
    const filters = {
      ...(selectIdRecordType.value
        ? { 'filter[record_type]': selectIdRecordType.value }
        : {}),
      page: pageNumber as number,
    }
    listAction(filters)
  }

  const updateRowsPerPage = (rowsPerPage: number) => {
    const filters = {
      ...(selectIdRecordType.value
        ? { 'filter[record_type]': selectIdRecordType.value }
        : {}),
      page: 1 as number,
      rows: rowsPerPage as number,
    }
    listAction(filters)
  }

  const listAction = async (filters: Record<string, string | number>) => {
    tableProperties.value.rows = []
    tableProperties.value.loading = true
    const queryString = formatParamsCustom(filters)
    await _getListRecordColumns(queryString)
    tableProperties.value.loading = false
  }

  const formRecordColumns = ref()
  const validateForm = async () => {
    return (await formRecordColumns.value?.validateForm()) ?? false
  }

  const onSubmit = async () => {
    if (await validateForm()) {
      openMainLoader(true)

      let isSuccess = false
      if (formModalConfig.value.action === 'create') {
        isSuccess = await _createRecordColumns()
      } else if (
        formModalConfig.value.action === 'edit' &&
        formModalConfig.value.id
      ) {
        isSuccess = await _updateRecordColumns(formModalConfig.value.id)
      }

      if (isSuccess) {
        await formModalRef.value.closeModal()
        listAction({
          'filter[record_type]': selectIdRecordType.value || 0,
        })
      }
      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }
  }

  const handleOptions = async (option: string, id?: number) => {
    switch (option) {
      case 'create':
        formModalConfig.value.action = 'create'
        await formModalRef.value.openModal()
        break
      case 'edit':
        formModalConfig.value.action = 'edit'
        formModalConfig.value.id = id || null
        await formModalRef.value.openModal()
        break
      case 'delete':
        if (id) {
          deleteModalConfig.value.id = id
          await deleteModalRef.value.openModal()
        }
        break
      default:
        break
    }
  }

  const handleDelete = async () => {
    openMainLoader(true)
    await deleteModalRef.value.closeModal()
    if (!deleteModalConfig.value.id) return
    await _deleteRecordColumns(deleteModalConfig.value.id)
    await listAction({
      'filter[record_type]': selectIdRecordType.value || 0,
    })
    openMainLoader(false)
  }

  const handlerGoTo = (goURL: string, id?: number) => {
    router.push({ name: goURL, params: { id } })
  }

  watch(selectIdRecordType, (newSelectIdRecordType) => {
    if (newSelectIdRecordType) {
      listAction({ 'filter[record_type]': newSelectIdRecordType || 0 })
    }
    canCreateRecordColumns.value = newSelectIdRecordType ? true : false
  })

  watch(data_record_columns_list, (newDataRecordColumnsList) => {
    if (newDataRecordColumnsList) {
      tableProperties.value.rows = newDataRecordColumnsList
    }

    isOpenExpansionItem.value = newDataRecordColumnsList.length > 0
  })

  return {
    tableProperties,
    isOpenExpansionItem,
    canCreateRecordColumns,
    formModalRef,
    formModalConfig,
    formRecordColumns,
    deleteModalRef,
    deleteModalConfig,
    textActionOnFormModal,
    updatePage,
    updateRowsPerPage,
    onSubmit,
    handleOptions,
    handleDelete,
    handlerGoTo,
    validateRouter,
  }
}

export default useRecordColumnsList
