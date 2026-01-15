import { useMainLoader, useRouteValidator } from '@/composables'
import { useBankStructuresStore } from '@/stores'
import { formatParamsCustom } from '@/utils'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { computed, ref, watch } from 'vue'

const useRecordTypeList = () => {
  const { openMainLoader } = useMainLoader()

  const { data_record_type_list, pages_record_type, selectIdFormatDefinition } =
    storeToRefs(useBankStructuresStore('v1'))
  const {
    _getListRecordType,
    _setSelectIdRecordType,
    _createRecordType,
    _deleteRecordType,
    _updateRecordType,
  } = useBankStructuresStore('v1')
  const { validateRouter } = useRouteValidator()

  const isOpenExpansionItem = ref(false)
  const canCreateRecordType = ref(false)
  const tableRecordTypeList = ref()

  const formModalRef = ref()
  const formModalConfig = ref({
    title: 'Tipo de registro',
    id: null as number | null,
    action: 'create' as 'create' | 'edit',
  })

  const textActionOnFormModal = computed(() => {
    return formModalConfig.value.action === 'create' ? 'Crear' : 'Actualizar'
  })

  const deleteModalRef = ref()
  const deleteModalConfig = ref({
    title: 'Advertencia',
    description: '¿Desea eliminar el tipo de registro?',
    id: null as number | null,
  })

  const tableProperties = ref({
    title: 'Tipo de registro',
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
        name: 'order',
        required: true,
        label: 'Órden ',
        align: 'left',
        field: 'order',
        sortable: true,
      },
      {
        name: 'type_record_name',
        required: true,
        label: 'Nombre del tipo de registro',
        align: 'left',
        field: 'name',
        sortable: true,
      },
      {
        name: 'record_type',
        required: true,
        label: 'Tipo de registro',
        align: 'left',
        field: (row) => row.type.name,
        sortable: true,
      },
      {
        name: 'longitude',
        required: true,
        label: 'Longitud',
        align: 'left',
        field: 'length',
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
    rows: data_record_type_list.value,
    pages: pages_record_type,
    wrapCells: true,
  })

  const updatePage = (pageNumber: number) => {
    const filters = {
      ...(selectIdFormatDefinition.value
        ? { 'filter[record_type]': selectIdFormatDefinition.value }
        : {}),
      page: pageNumber as number,
    }
    listAction(filters)
  }

  const updateRowsPerPage = (rowsPerPage: number) => {
    const filters = {
      ...(selectIdFormatDefinition.value
        ? { 'filter[record_type]': selectIdFormatDefinition.value }
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
    await _getListRecordType(queryString)
    tableProperties.value.loading = false
  }

  const handleSelected = ({ selected }: { selected: { id: number }[] }) => {
    _setSelectIdRecordType(selected[0]?.id || null)
  }

  const formRecordType = ref()
  const validateForm = async () => {
    return (await formRecordType.value?.validateForm()) ?? false
  }

  const onSubmit = async () => {
    if (await validateForm()) {
      openMainLoader(true)

      let isSuccess = false
      if (formModalConfig.value.action === 'create') {
        isSuccess = await _createRecordType()
      } else if (
        formModalConfig.value.action === 'edit' &&
        formModalConfig.value.id
      ) {
        isSuccess = await _updateRecordType(formModalConfig.value.id)
      }

      if (isSuccess) {
        await formModalRef.value.closeModal()
        listAction({
          'filter[bank_structure]': selectIdFormatDefinition.value || 0,
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
    await _deleteRecordType(deleteModalConfig.value.id)
    await listAction({
      'filter[bank_structure]': selectIdFormatDefinition.value || 0,
    })
    openMainLoader(false)
  }

  watch(selectIdFormatDefinition, (newSelectIdFormatDefinition) => {
    if (newSelectIdFormatDefinition) {
      listAction({ 'filter[bank_structure]': newSelectIdFormatDefinition || 0 })
    }
    canCreateRecordType.value = newSelectIdFormatDefinition ? true : false
  })

  watch(data_record_type_list, (newDataRecordTypeList) => {
    if (newDataRecordTypeList) {
      tableRecordTypeList.value.clearSelection()
      tableProperties.value.rows = newDataRecordTypeList
    }

    isOpenExpansionItem.value = newDataRecordTypeList.length > 0
  })

  return {
    tableProperties,
    isOpenExpansionItem,
    canCreateRecordType,
    formModalRef,
    formModalConfig,
    textActionOnFormModal,
    formRecordType,
    deleteModalRef,
    deleteModalConfig,
    tableRecordTypeList,
    handleSelected,
    updatePage,
    updateRowsPerPage,
    onSubmit,
    handleOptions,
    handleDelete,
    validateRouter,
  }
}

export default useRecordTypeList
