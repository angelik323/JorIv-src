import { useMainLoader, useRouteValidator } from '@/composables'
import { useBankStructuresStore } from '@/stores'
import { formatParamsCustom } from '@/utils'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const useFormatDefinitionList = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()

  const {
    data_format_definition_list,
    pages_format_definition,
    filtersFormat,
  } = storeToRefs(useBankStructuresStore('v1'))
  const {
    _getListFormatDefinition,
    _setSelectFormatDefinition,
    _createFormatDefinition,
    _deleteFormatDefinition,
    _updateFormatDefinition,
  } = useBankStructuresStore('v1')
  const { validateRouter } = useRouteValidator()

  const isOpenExpansionItem = ref(true)
  const canCreateFormatDefinition = ref(false)
  const tableFormatDefinitionList = ref()

  const formModalRef = ref()
  const formModalConfig = ref({
    title: 'Definición de formato',
    id: null as number | null,
    action: 'create' as 'create' | 'edit',
  })

  const textActionOnFormModal = computed(() => {
    return formModalConfig.value.action === 'create' ? 'Crear' : 'Actualizar'
  })

  const deleteModalRef = ref()
  const deleteModalConfig = ref({
    title: 'Advertencia',
    description: '¿Desea eliminar la definición de formato?',
    id: null as number | null,
  })

  const tableProperties = ref({
    title: 'Definición de formato',
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
        name: 'code',
        required: true,
        label: 'Código',
        align: 'left',
        field: 'code',
        sortable: true,
      },
      {
        name: 'status',
        required: true,
        label: 'Estado',
        align: 'left',
        field: (row) => row.status.id,
        sortable: true,
      },
      {
        name: 'origin',
        required: true,
        label: 'Origen',
        align: 'left',
        field: (row) => row.origin.name,
        sortable: true,
      },
      {
        name: 'format_type',
        required: true,
        label: 'Tipo de formato',
        align: 'left',
        field: (row) => row.formatType.name,
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
    rows: data_format_definition_list.value,
    pages: pages_format_definition,
    wrapCells: true,
  })

  const updatePage = (pageNumber: number) => {
    const filters = {
      ...filtersFormat.value,
      page: pageNumber as number,
    }
    listAction(filters)
  }

  const updateRowsPerPage = (rowsPerPage: number) => {
    const filters = {
      ...filtersFormat.value,
      page: 1 as number,
      rows: rowsPerPage as number,
    }
    listAction(filters)
  }

  const listAction = async (
    filters: Record<string, string | number | boolean>
  ) => {
    tableProperties.value.rows = []
    tableProperties.value.loading = true
    const queryString = formatParamsCustom(filters)
    await _getListFormatDefinition(queryString)
    tableProperties.value.loading = false
  }

  const handleSelected = ({ selected }: { selected: { id: number }[] }) => {
    _setSelectFormatDefinition(selected[0]?.id || null)
  }

  const formFormatDefinition = ref()

  const validateForm = async () => {
    return (await formFormatDefinition.value?.validateForm()) ?? false
  }

  const onSubmit = async () => {
    if (await validateForm()) {
      openMainLoader(true)

      let isSuccess = false
      if (formModalConfig.value.action === 'create') {
        isSuccess = await _createFormatDefinition()
      } else if (
        formModalConfig.value.action === 'edit' &&
        formModalConfig.value.id
      ) {
        isSuccess = await _updateFormatDefinition(formModalConfig.value.id)
      }

      if (isSuccess) {
        await formModalRef.value.closeModal()
        listAction(filtersFormat.value)
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
    await _deleteFormatDefinition(deleteModalConfig.value.id)
    await listAction(filtersFormat.value)
    openMainLoader(false)
  }

  const handlerGoTo = (goURL: string, id?: number) => {
    router.push({ name: goURL, params: { id } })
  }

  watch(filtersFormat, (newFilter) => {
    if (!newFilter['clear']) {
      listAction(newFilter)
    }
    canCreateFormatDefinition.value = newFilter['filter[bank]'] ? true : false
  })

  watch(data_format_definition_list, () => {
    tableFormatDefinitionList.value.clearSelection()
    _setSelectFormatDefinition(null)
    isOpenExpansionItem.value = true
    tableProperties.value.rows = data_format_definition_list.value
  })

  return {
    tableProperties,
    isOpenExpansionItem,
    canCreateFormatDefinition,
    formModalRef,
    formModalConfig,
    formFormatDefinition,
    deleteModalRef,
    deleteModalConfig,
    textActionOnFormModal,
    tableFormatDefinitionList,
    updatePage,
    updateRowsPerPage,
    handleSelected,
    onSubmit,
    handleOptions,
    handleDelete,
    handlerGoTo,
    validateRouter,
  }
}

export default useFormatDefinitionList
