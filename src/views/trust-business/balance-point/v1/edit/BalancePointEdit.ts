// Composables
import {
  useGoToUrl,
  useMainLoader,
  useS3Documents,
  useUtils,
} from '@/composables'

// Interfaces
import { IBalancePointCreatePayload } from '@/interfaces/customs/trust-business'
import { IFileField, IUploadedFile } from '@/interfaces/global/File'
import { ITabs } from '@/interfaces/global/Tabs'

// Stores
import { useBalancePointStore } from '@/stores/trust-business/balance-point'

// Vue
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const useBalancePointView = () => {
  const router = useRouter()
  const { defaultIconsLucide } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { _saveDocumentsS3, getExtensionFromMimeType } = useS3Documents()

  const idBalancePoint = router.currentRoute.value.params.id

  const { goToURL } = useGoToUrl()

  const {
    headerPropsDefault,
    data_balance_point_basic_data_form,
    data_balance_point_mandate_form,
    data_documents_form,
  } = storeToRefs(useBalancePointStore('v1'))
  const headerProperties = {
    ...headerPropsDefault.value,
    title: 'Editar punto de equilibrio',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Editar',
      },
      {
        label: idBalancePoint.toString(),
      },
    ],
  }
  const {
    _getBalancePointById,
    _addBalancePointFile,
    _updateBalancePoint,
    _setDataDocumentsForm,
    _deleteBalancePointFile,
  } = useBalancePointStore('v1')

  const tabs = ref<ITabs[]>([
    {
      name: 'basic_data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'mandate_data',
      label: 'Encargo',
      icon: defaultIconsLucide.ArrowLeftRight,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'summary_data',
      label: 'Resumen',
      icon: defaultIconsLucide.listCheck,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const basicDataFormRef = ref()
  const mandateFormRef = ref()

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const nextTab = async () => {
    const isValid = await validateForms()
    if (!isValid) return

    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const validateForms = async () => {
    if (tabActive.value === 'basic_data') {
      return await basicDataFormRef.value?.validateForm()
    } else if (tabActive.value === 'mandate_data') {
      return await mandateFormRef.value?.validateForm()
    }

    return true
  }

  onMounted(async () => {
    openMainLoader(true)
    if (idBalancePoint) {
      await _getBalancePointById(idBalancePoint.toString())
    }
    openMainLoader(false)
  })

  const handleDocumentsUpload = async (
    businessId: number | string,
    files: IFileField[]
  ): Promise<void> => {
    const documentIds: string[] = []
    const uploadUrls: string[] = []
    const filesToUpload: IUploadedFile[] = []

    for (const fileField of files) {
      const file = fileField.file
      if (!file) continue

      const { success, documentId, uploadUrl } = await _addBalancePointFile(
        businessId,
        {
          name: file.name,
          document_type: getExtensionFromMimeType(file.type),
        }
      )

      if (!success || !documentId || !uploadUrl) continue

      documentIds.push(documentId.toString())
      uploadUrls.push(uploadUrl)
      filesToUpload.push(file)
    }

    if (!uploadUrls.length || !filesToUpload.length) return

    await _saveDocumentsS3(uploadUrls, filesToUpload)
  }

  const makeDataRequest = () => {
    const apiRequestBody: IBalancePointCreatePayload = {
      business_trust_id:
        data_balance_point_basic_data_form.value?.business_trust_id || 0,
      business_trust_real_estate_project_stage_id:
        data_balance_point_mandate_form.value?.stage_id || 0,
      business_trust_general_order_id:
        data_balance_point_mandate_form.value?.general_mandate_id || 0,
      total_general_order:
        data_balance_point_mandate_form.value?.total_general_order || 0,
      characteristics:
        data_balance_point_basic_data_form.value?.characteristics || [],
      mandates:
        data_balance_point_mandate_form.value?.mandates.map((item) => ({
          fiduciary_mandate_id: item.id,
        })) || [],
    }

    return apiRequestBody
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)
    const payload = makeDataRequest()
    const success = await _updateBalancePoint(
      idBalancePoint.toString(),
      payload
    )
    if (success) {
      // Subida de documentos
      const documentFiles = data_documents_form.value?.documentFiles
      if (documentFiles?.length) {
        await handleDocumentsUpload(idBalancePoint.toString(), documentFiles)
      }
      // Borrado de documentos
      const documentsFilesToDelete =
        data_documents_form.value?.documentIdsToDelete
      if (documentsFilesToDelete?.length) {
        for (const idFile of documentsFilesToDelete) {
          await _deleteBalancePointFile(idFile)
        }
      }

      _setDataDocumentsForm(null)

      router.push({ name: 'BalancePointList', query: { reload: 1 } })
    }
    openMainLoader(false)
  }

  return {
    headerProperties,
    tabs,
    tabActive,
    tabActiveIdx,
    defaultIconsLucide,
    basicDataFormRef,
    mandateFormRef,
    goToURL,
    nextTab,
    backTab,
    onSubmit,
  }
}

export default useBalancePointView
