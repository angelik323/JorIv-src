// vue
import { ref } from 'vue'

// interfaces
import type {
  IAssetTypeForm,
  IAssetSubtypeForm
} from '@/interfaces/customs/fixed-assets/ConfigurationTypeSubtypes'

export const useSubtypeActions = (model: () => IAssetTypeForm | null, onUpdate: () => void) => {
  const uidCounter = ref(1)
  const deletedSubtypes = ref<number[]>([])
  const deleteModalRef = ref()

  const deleteModalConfig = ref<{
    title: string
    rowToDelete: IAssetSubtypeForm | null
  }>({
    title: '¿Desea eliminar el registro?',
    rowToDelete: null
  })

  const addSubtype = () => {
    if (!model()) return

    const newSubtype: IAssetSubtypeForm = {
      _uid: uidCounter.value++,
      code: null,
      description: null,
      life_span: null,
      depreciation: null
    }
    model()!.subtypes.push(newSubtype)
    onUpdate()
  }

  const openDeleteSubtypeModal = (row: IAssetSubtypeForm) => {
    deleteModalConfig.value = {
      title: '¿Desea eliminar el registro?',
      rowToDelete: row
    }
    deleteModalRef.value?.openModal()
  }

  const confirmDeleteSubtype = async () => {
    if (!deleteModalConfig.value.rowToDelete || !model()) return

    const row = deleteModalConfig.value.rowToDelete

    if (row.id) {
      deletedSubtypes.value.push(row.id)
    }

    const index = model()!.subtypes.findIndex((item) => item._uid === row._uid)

    if (index !== -1) {
      model()!.subtypes.splice(index, 1)
      onUpdate()
    }

    await deleteModalRef.value?.closeModal()
    deleteModalConfig.value.rowToDelete = null
  }

  const resetDeletedSubtypes = () => {
    deletedSubtypes.value = []
  }

  return {
    uidCounter,
    deletedSubtypes,
    deleteModalRef,
    deleteModalConfig,
    addSubtype,
    openDeleteSubtypeModal,
    confirmDeleteSubtype,
    resetDeletedSubtypes
  }
}
