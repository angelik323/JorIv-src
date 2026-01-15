// Vue - Vue Router
import { useRoute } from 'vue-router'
import { ref, computed } from 'vue'

// Composables
import { useGoToUrl } from '@/composables'

// Stores
import { useBulkUploadFicsStore } from '@/stores/fics/bulk-upload'

const BulkUploadAnnular = () => {
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const { _annularBulkUpload } = useBulkUploadFicsStore('v1')

  const modalType = ref<'annular'>('annular')
  const authorizeFormRef = ref()
  const actionModalRef = ref()

  const bulkUploadId = route.params.id as string

  const headerBreadcrumbs = {
    title: 'Anular cargue masivo',
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
      title: '¿Desea anular este cargue masivo?',
    }
  })

  const handleGoToBack = () =>
    goToURL('FicsBulkUploadList', undefined, { reload: true })

  const onSubmitAnnular = () => {
    modalType.value = 'annular'
    actionModalRef.value?.openModal()
  }

  const executeAction = async () => {
    let success = false

    success = await _annularBulkUpload(bulkUploadId)

    if (success) {
      actionModalRef.value?.closeModal()
      handleGoToBack()
    }
  }

  return {
    modalConfig,
    bulkUploadId,
    executeAction,
    actionModalRef,
    handleGoToBack,
    onSubmitAnnular,
    authorizeFormRef,
    headerBreadcrumbs,
  }
}

export default BulkUploadAnnular
