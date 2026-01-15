// vue
import { onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

// interfaces
import { ITabs } from '@/interfaces/global/Tabs'
import {
  IDocumentsRegister,
  IRegisterForm,
} from '@/interfaces/customs/fixed-assets/v1/Register'

// composables
import { useGoToUrl, useMainLoader, useRouteValidator } from '@/composables'
import { useAlert } from '@/composables/useAlert'
import { useUtils } from '@/composables/useUtils'
import { useS3Documents } from '@/composables/useS3Documents'

// stores
import { useRegisterStore } from '@/stores/fixed-assets/register'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useRegisterCreate = () => {
  // imports
  const { defaultIconsLucide, cleanEmptyFields } = useUtils()
  const { showAlert } = useAlert()
  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()
  const { goToURL } = useGoToUrl()

  // principal data store
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { headerPropsDefault } = storeToRefs(useRegisterStore('v1'))
  const { _createRegister, _getPresignedUrls } = useRegisterStore('v1')

  const { _saveDocumentsS3, getExtensionFromMimeType } = useS3Documents()

  // keys

  const keys = {
    fixed_assets: [
      'register',
      'fixed_asset_distribution_type',
      'formated_locations',
      'formated_third_parties',
      'fixed_asset_statuses',
      'fixed_asset_record_type',
      'transactions_configuration_subtypes',
      'fixed_asset_reference',
      'configuration_type',
      'uge',
      'fixed_asset_measurement_model',
    ],
    third_party: ['third_parties'],
  }
  const trustBusinessKeys = {
    trust_business: ['business_trusts'],
  }

  // breadcrumb
  const headerPropsCreate = {
    title: `Crear ${headerPropsDefault.value.title.toLowerCase()}`,
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      ...[
        {
          label: 'Crear',
          route: 'RegisterCreate',
        },
      ],
    ],
  }

  // form refs
  const formInformationRef = ref()
  const formDocumentsRef = ref()

  // data children
  const informationFormData = ref<IRegisterForm | null>(null)
  const documentsFormData = ref<IDocumentsRegister[]>([])

  const setInformationFormData = (data: IRegisterForm | null) => {
    informationFormData.value = data
  }

  const setDocumentsFormData = (data: IDocumentsRegister[]) => {
    documentsFormData.value = data
  }

  // tabs
  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
    {
      name: 'documents',
      label: 'Documentos',
      icon: defaultIconsLucide.file,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const [initialTab] = tabs.value
  const tabActive = ref(initialTab.name)
  const tabActiveIdx = ref(tabs.value.indexOf(initialTab))

  const validateForms = async (): Promise<boolean> => {
    const currentTabName = tabs.value[tabActiveIdx.value]?.name

    if (!currentTabName) return false

    switch (currentTabName) {
      case 'information':
        return (await formInformationRef.value?.validateForm()) ?? false

      case 'documents':
        return (await formDocumentsRef.value?.validateForm()) ?? false

      default:
        return false
    }
  }

  const validateDocumentsRequired = (): boolean => {
    if (!documentsFormData.value || documentsFormData.value.length === 0) {
      showAlert(
        'Debe adjuntar al menos 1 documento',
        'warning',
        undefined,
        3000
      )
      return false
    }
    return true
  }

  const nextTab = async () => {
    const isValid = await validateForms()

    if (!isValid) {
      showAlert(
        `Complete correctamente la sección: ${
          tabs.value[tabActiveIdx.value].label
        }`,
        'warning',
        undefined,
        3000
      )
      return
    }

    tabActiveIdx.value += 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value -= 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  // actions

  const makeDataRequest = (): IRegisterForm => {
    return cleanEmptyFields(
      {
        ...informationFormData.value!,
      },
      true
    ) as IRegisterForm
  }

  const onSubmit = async () => {
    if (!validateDocumentsRequired()) return

    openMainLoader(true)

    // 1. Procesar documentos primero (si existen)
    let documentIds: number[] = []

    if (documentsFormData.value && documentsFormData.value.length > 0) {
      documentIds = await handleDocumentsUpload(documentsFormData.value)

      if (documentIds.length === 0) {
        showAlert('Error al procesar los documentos', 'error')
        openMainLoader(false)
        return
      }
    }

    // 2. Preparar payload con los document_ids
    const payload: IRegisterForm = makeDataRequest()

    if (documentIds.length > 0) {
      payload.document_ids = documentIds
    }

    // 3. Crear el registro
    const registerId = await _createRegister(payload)

    openMainLoader(false)

    if (registerId) {
      goToURL('RegisterList')
    }
  }

  const handleDocumentsUpload = async (
    files: IDocumentsRegister[]
  ): Promise<number[]> => {
    if (!files || files.length === 0) return []

    // 1. Preparar metadata de los archivos
    const documentsMetadata: IDocumentsRegister[] = files.map((fileField) => ({
      name: fileField.file?.name ?? fileField.name ?? '',
      document_type: getExtensionFromMimeType(fileField.file?.type ?? ''),
      file_size: fileField.file?.size ?? fileField.size ?? 0,
    }))

    // 2. Obtener firmas prefirmadas
    const presignedData = await _getPresignedUrls(documentsMetadata)

    if (!presignedData || presignedData.length === 0) {
      showAlert('Error al obtener URLs de carga', 'error')
      return []
    }

    // 3. Preparar arrays para subida a S3
    const uploadUrls: string[] = []
    const filesToUpload: File[] = []
    const documentIds: number[] = []

    presignedData.forEach((presigned, index) => {
      const file = files[index].file

      if (!file || !presigned.upload_url || !presigned.document_id) return

      uploadUrls.push(presigned.upload_url)
      filesToUpload.push(file as File)
      documentIds.push(presigned.document_id)
    })

    // 4. Subir archivos a S3
    if (uploadUrls.length > 0 && filesToUpload.length > 0) {
      await _saveDocumentsS3(uploadUrls, filesToUpload)
    }

    // 5. Retornar los document_ids para el payload del create
    return documentIds
  }

  // lifecycle
  onBeforeMount(async () => {
    openMainLoader(true)
    await Promise.all([
      _getResources(keys),
      _getResources(trustBusinessKeys, 'filter[effect]=true'),
    ])

    openMainLoader(false)
  })

  onMounted(() => {
    informationFormData.value = null
    documentsFormData.value = []
  })

  onBeforeUnmount(async () => {
    await _resetKeys(keys)
  })

  return {
    formInformationRef,
    formDocumentsRef,
    informationFormData,
    documentsFormData,

    headerPropsCreate,
    defaultIconsLucide,

    tabs,
    tabActive,
    tabActiveIdx,

    backTab,
    nextTab,
    onSubmit,

    validateRouter,
    goToURL,

    setInformationFormData,
    setDocumentsFormData,
  }
}

export default useRegisterCreate
