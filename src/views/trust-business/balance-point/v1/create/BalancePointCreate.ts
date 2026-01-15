// Composables
import { useMainLoader, useS3Documents, useUtils } from '@/composables'

// Interfaces
import { IBalancePointCreatePayload } from '@/interfaces/customs/trust-business/BalancePoint'
import { IFileField, IUploadedFile } from '@/interfaces/global/File'
import { ITabs } from '@/interfaces/global/Tabs'

// Stores
import { useBalancePointStore } from '@/stores/trust-business/balance-point'
import { useResourceManagerStore } from '@/stores/resources-manager'

// Vue
import { storeToRefs } from 'pinia'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const useBalancePointCreate = () => {
  const router = useRouter()
  const { defaultIconsLucide } = useUtils()
  const { openMainLoader } = useMainLoader()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _saveDocumentsS3, getExtensionFromMimeType } = useS3Documents()

  const {
    headerPropsDefault,
    data_documents_form,
    data_balance_point_basic_data_form,
    data_balance_point_mandate_form,
  } = storeToRefs(useBalancePointStore('v1'))
  const { _createBalancePoint, _addBalancePointFile, _setDataDocumentsForm } =
    useBalancePointStore('v1')
  const headerProperties = {
    ...headerPropsDefault.value,
    title: 'Crear punto de equilibrio',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Crear',
      },
    ],
  }

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
      label: 'Encargos',
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

  const handleDocumentsUpload = async (
    businessId: number,
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
    const balancePointId = await _createBalancePoint(payload)
    if (balancePointId) {
      // Subida de documentos
      const documentFiles = data_documents_form.value?.documentFiles
      if (documentFiles?.length) {
        await handleDocumentsUpload(balancePointId, documentFiles)
        _setDataDocumentsForm(null) // Limpiar documentos cargados
      }

      router.push({ name: 'BalancePointList', query: { reload: 1 } })
    }
    openMainLoader(false)
  }

  const keys = {
    trust_business: ['equilibrium_points_business_trust'],
  }

  onMounted(async () => {
    _setDataDocumentsForm(null)
    _getResources(keys)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  return {
    headerProperties,
    tabs,
    tabActive,
    tabActiveIdx,
    defaultIconsLucide,
    basicDataFormRef,
    mandateFormRef,
    nextTab,
    backTab,
    onSubmit,
  }
}

export default useBalancePointCreate
