// Vue - Vue Router
import { useRoute } from 'vue-router'
import { ref, computed } from 'vue'

// Composables
import { useGoToUrl, useMainLoader } from '@/composables'

// Stores
import { useBulkUploadFicsStore } from '@/stores/fics/bulk-upload'

const BulkUploadAuthorize = () => {
  const route = useRoute()
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()

  const bulkUploadStore = useBulkUploadFicsStore('v1')

  const modalType = ref<'reject' | 'authorize'>('reject')
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

  const handleGoToBack = () =>
    goToURL('FicsBulkUploadList', undefined, { reload: true })

  const modalConfig = computed(() => {
    return {
      title: modalType.value === 'reject' ? 'Rechazar' : 'Autorización parcial',
      label:
        modalType.value === 'reject'
          ? 'Motivo para rechazar'
          : 'Motivo para autorización parcial',
      placeholder: 'Inserte',
    }
  })

  const onSubmitReject = () => {
    modalType.value = 'reject'
    actionReason.value = ''
    actionModalRef.value?.openModal()
  }

  const onSubmitAuthorize = () => {
    modalType.value = 'authorize'
    actionReason.value = ''
    actionModalRef.value?.openModal()
  }

  const getSelectedLineNumbers = (): number[] =>
    authorizeFormRef.value?.getSelectedLineNumbers?.() ?? []

  const executeAction = async () => {
    openMainLoader(true)
    const selectedLineNumbers = getSelectedLineNumbers()

    let success = false

    if (modalType.value === 'reject') {
      success = await bulkUploadStore._rejectMonetaryOperationBulk(
        bulkUploadId,
        selectedLineNumbers,
        actionReason.value
      )
    } else {
      success = await bulkUploadStore._authorizeMonetaryOperationBulk(
        bulkUploadId,
        selectedLineNumbers,
        actionReason.value
      )
    }

    if (success) {
      actionModalRef.value?.closeModal()
      handleGoToBack()
    }
    openMainLoader(false)
  }

  return {
    modalConfig,
    bulkUploadId,
    actionReason,
    executeAction,
    handleGoToBack,
    onSubmitReject,
    actionModalRef,
    authorizeFormRef,
    onSubmitAuthorize,
    headerBreadcrumbs,
  }
}

export default BulkUploadAuthorize
