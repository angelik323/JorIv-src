// Vue
import { useRoute } from 'vue-router'
import { ref, computed } from 'vue'

// Composables
import { useAlert, useGoToUrl } from '@/composables'

// Stores
import { useBulkUploadFicsStore } from '@/stores/fics/bulk-upload'

const BulkUploadCancellation = () => {
  const { showAlert } = useAlert()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const bulkUploadStore = useBulkUploadFicsStore('v1')

  const modalType = ref<'authorize'>('authorize')
  const authorizeFormRef = ref()
  const actionReason = ref('')
  const actionModalRef = ref()

  const bulkUploadId = route.params.id as string

  const headerBreadcrumbs = {
    title: 'Autorizar cargue masivo',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Cargues masivos',
        route: 'FicsBulkUploadList',
      },
      {
        label: 'Autorizar',
        route: 'FicsBulkUploadAuthorize',
      },
      {
        label: `${bulkUploadId}`,
      },
    ],
  }

  const modalConfig = computed(() => {
    return {
      title: 'Autorización parcial',
      label: 'Motivo para autorización parcial',
      placeholder: 'Inserte',
    }
  })

  const handleGoToBack = () =>
    goToURL('FicsBulkUploadList', undefined, { reload: true })

  const onSubmitAuthorize = () => {
    modalType.value = 'authorize'
    actionReason.value = ''
    actionModalRef.value?.openModal()
  }

  const getSelectedLineNumbers = (): number[] =>
    authorizeFormRef.value?.getSelectedLineNumbers?.() ?? []

  const executeAction = async () => {
    const selectedLineNumbers = getSelectedLineNumbers()

    const models = authorizeFormRef.value?.models
    if (!models?.account_id) {
      showAlert('Debe seleccionar una cuenta pagadora', 'warning')
      return
    }

    if (selectedLineNumbers.length === 0) {
      showAlert('No hay operaciones seleccionadas', 'warning')
      return
    }

    let success = false

    success = await bulkUploadStore._authorizeMonetaryOperationBulk(
      bulkUploadId,
      selectedLineNumbers,
      actionReason.value,
      models.account_id
    )

    if (success) {
      actionModalRef.value?.closeModal()
      handleGoToBack()
    }
  }

  return {
    modalConfig,
    bulkUploadId,
    actionReason,
    executeAction,
    handleGoToBack,
    actionModalRef,
    authorizeFormRef,
    onSubmitAuthorize,
    headerBreadcrumbs,
  }
}

export default BulkUploadCancellation
