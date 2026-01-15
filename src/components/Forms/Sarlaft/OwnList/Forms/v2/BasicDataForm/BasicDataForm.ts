// vue - router - quasar
import { ref, watch, onMounted, computed } from 'vue'

// interfaces
import { ActionType, IBaseTableProps } from '@/interfaces/global'
import {
  IOwnListForm,
  IOwnListThirdPartyFile,
  IOwnListLoadedListItem,
} from '@/interfaces/customs/sarlaft/OwnList'

// Composables
import { useUtils } from '@/composables/useUtils'
import { useRules } from '@/composables/useRules'
import { useAlert } from '@/composables/useAlert'

// Stores
import useOwnListStoreV1 from '@/stores/sarlaft/own-list/own-list-v1'

const useBasicDataForm = (
  props: {
    data?: IOwnListForm | null
    formType: ActionType
    filesSelected?: IOwnListThirdPartyFile | null
    loadedThirdPartyData?: IOwnListLoadedListItem[]
    showThirdPartyActions?: boolean
  },
  emit?: {
    (event: 'fileAdded', file: File): void
    (event: 'removeFile'): void
    (event: 'downloadFile', file: IOwnListThirdPartyFile): void
    (event: 'downloadTemplate'): void
    (event: 'addManualEntry'): void
    (event: 'deleteRow', row: IOwnListLoadedListItem): void
  }
) => {
  const { defaultIconsLucide } = useUtils()

  const formValues = ref({
    name_list: '' as string | null,
  })

  const formElementRef = ref()

  const fileTableProps = ref<IBaseTableProps<IOwnListThirdPartyFile>>({
    loading: false,
    columns: [
      {
        name: 'id',
        label: '#',
        field: () => 1,
        align: 'left',
        sortable: true,
      },
      {
        name: 'name',
        label: 'Nombre',
        field: 'name',
        align: 'left',
        sortable: true,
      },
      {
        name: 'totalRegisters',
        label: 'Total de registros',
        field: 'totalRegisters',
        align: 'left',
        sortable: true,
      },
      {
        name: 'state',
        label: 'Estado de cargue',
        field: (row: IOwnListThirdPartyFile) => row.key_data || '',
        align: 'left',
        sortable: true,
      },
      {
        name: 'actions',
        label: 'Acciones',
        align: 'center' as const,
        field: (row: IOwnListThirdPartyFile) => row,
        sortable: false,
      },
    ],
    rows: [] as IOwnListThirdPartyFile[],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const thirdPartyTableProps = ref<IBaseTableProps<IOwnListLoadedListItem>>({
    loading: false,
    columns: [
      {
        name: 'id',
        label: '#',
        field: 'id',
        align: 'left',
        sortable: true,
      },
      {
        name: 'identificationType',
        label: 'Tipo de identificación',
        field: 'identificationType',
        align: 'left',
        sortable: true,
      },
      {
        name: 'identificationNumber',
        label: 'Número de identificación',
        field: 'identificationNumber',
        align: 'left',
        sortable: true,
      },
      {
        name: 'name',
        label: 'Nombre',
        field: 'name',
        align: 'left',
        sortable: true,
      },
      ...(props.showThirdPartyActions
        ? [
            {
              name: 'actions',
              label: 'Acciones',
              field: (row: IOwnListLoadedListItem) => row,
              align: 'center' as const,
              sortable: false,
            },
          ]
        : []),
    ],
    rows: [],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const initData = () => {
    formValues.value = {
      name_list: '',
    }
  }

  const setFormEdit = () => {
    if (props.data) {
      formValues.value = {
        name_list: props.data.name_list,
      }
    }
  }

  const setFormView = () => {
    if (props.data) {
      formValues.value = {
        name_list: props.data.name_list,
      }
    }
  }

  const handlerActionForm = (action: ActionType) => {
    const actionHandlers: Record<ActionType, () => void> = {
      create: initData,
      edit: setFormEdit,
      view: setFormView,
    }

    actionHandlers[action]?.()
  }

  const onFileSelected = (files: File[]) => {
    if (files[0] && emit) {
      emit('fileAdded', files[0])
    }
  }

  // Delete Modal Logic
  const deleteModal = ref<{
    openModal: () => void
    closeModal: () => void
  } | null>(null)

  const onRemoveFile = () => {
    deleteModal.value?.openModal()
  }

  const confirmDelete = () => {
    if (emit) {
      emit('removeFile')
    }
    useAlert().showAlert('¡Registro eliminado exitosamente!', 'success')
    deleteModal.value?.closeModal()
  }

  const onDownloadFile = (row: IOwnListThirdPartyFile) => {
    if (emit) {
      emit('downloadFile', row)
    }
  }

  const onDownloadTemplate = () => {
    if (emit) {
      emit('downloadTemplate')
    }
  }

  const onAddManualEntry = () => {
    if (emit) {
      emit('addManualEntry')
    }
  }

  const onDeleteRow = (row: IOwnListLoadedListItem) => {
    if (emit) {
      emit('deleteRow', row)
    }
  }

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.formType)
      }
    },
    { immediate: true }
  )

  watch(
    () => props.filesSelected,
    (newFile) => {
      if (newFile) {
        fileTableProps.value.rows = [{ ...newFile }]
      } else {
        fileTableProps.value.rows = []
      }
    },
    { immediate: true }
  )

  watch(
    () => props.loadedThirdPartyData,
    (newData) => {
      if (newData) {
        thirdPartyTableProps.value.rows = [...newData]
      }
    },
    { immediate: true, deep: true }
  )

  onMounted(() => {
    handlerActionForm(props.formType)
  })

  const isValid = computed(() => {
    return (
      !!formValues.value.name_list &&
      useRules().length_between(formValues.value.name_list, 3, 100) === true
    )
  })

  const validateNameExist = (val: string) => {
    return props.formType === 'create'
      ? useRules().custom_rule(
          async (v: string) => !(await useOwnListStoreV1()._nameExist(v)),
          'El nombre/razón social ya existe'
        )(val)
      : true
  }

  return {
    formValues,
    formElementRef,
    isValid,
    fileTableProps,
    defaultIconsLucide,
    thirdPartyTableProps,
    onFileSelected,
    onRemoveFile,
    onDownloadFile,
    onDownloadTemplate,
    onAddManualEntry,
    onDeleteRow,
    validateNameExist,
    deleteModal,
    confirmDelete,
  }
}

export default useBasicDataForm
