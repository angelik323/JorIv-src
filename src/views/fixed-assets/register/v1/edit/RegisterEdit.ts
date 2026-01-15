// vue
import { onBeforeMount, onBeforeUnmount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// interfaces
import { ITabs } from '@/interfaces/global/Tabs'
import {
  IDocumentsRegister,
  IRegisterForm,
  IRegisterResponse,
} from '@/interfaces/customs/fixed-assets/v1/Register'

// composables
import { useGoToUrl, useMainLoader } from '@/composables'
import { useAlert } from '@/composables/useAlert'
import { useUtils } from '@/composables/useUtils'
import { useS3Documents } from '@/composables/useS3Documents'

// stores
import { useRegisterStore } from '@/stores/fixed-assets/register'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useRegisterEdit = () => {
  //imports
  const route = useRoute()
  const { defaultIconsLucide, cleanEmptyFields } = useUtils()
  const { showAlert } = useAlert()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  // principal data store
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { headerPropsDefault } = storeToRefs(useRegisterStore('v1'))
  const { _updateRegister, _getPresignedUrls, _getRegisterById } =
    useRegisterStore('v1')

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
  const searchId = +route.params.id
  const headerPropsEdit = {
    title: `Editar ${headerPropsDefault.value.title.toLowerCase()}`,
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      ...[
        {
          label: 'Editar',
          route: 'RegisterEdit',
        },
        {
          label: `${searchId}`,
        },
      ],
    ],
  }

  // form refs
  const formInformationRef = ref()
  const formDocumentsRef = ref()
  const initialDocumentsData = ref<IDocumentsRegister[]>([])

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

  const handleDocumentsUpload = async (
    files: IDocumentsRegister[]
  ): Promise<number[]> => {
    // Filtrar solo documentos NUEVOS (los que tienen file pero no tienen id del backend)
    const newDocuments = files.filter((doc) => doc.file && !doc.id)

    if (newDocuments.length === 0) return []

    // 1. Preparar metadata de los archivos nuevos
    const documentsMetadata: IDocumentsRegister[] = newDocuments.map(
      (fileField) => ({
        name: fileField.file?.name ?? fileField.name ?? '',
        document_type: getExtensionFromMimeType(fileField.file?.type ?? ''),
        file_size: fileField.file?.size ?? fileField.size ?? 0,
      })
    )

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
      const file = newDocuments[index].file

      if (!file || !presigned.upload_url || !presigned.document_id) return

      uploadUrls.push(presigned.upload_url)
      filesToUpload.push(file as File)
      documentIds.push(presigned.document_id)
    })

    // 4. Subir archivos a S3
    if (uploadUrls.length > 0 && filesToUpload.length > 0) {
      await _saveDocumentsS3(uploadUrls, filesToUpload)
    }

    // 5. Retornar los document_ids de los nuevos documentos
    return documentIds
  }

  const onSubmit = async () => {
    if (!validateDocumentsRequired()) return

    openMainLoader(true)

    // 1. Obtener IDs de documentos existentes que NO fueron eliminados
    const existingDocumentIds = documentsFormData.value
      .filter((doc) => doc.id)
      .map((doc) => doc.id!)

    // 2. Procesar documentos nuevos (si existen)
    const newDocumentIds = await handleDocumentsUpload(documentsFormData.value)

    // 3. Combinar IDs existentes + nuevos
    const allDocumentIds = [...existingDocumentIds, ...newDocumentIds]

    // 4. Preparar payload
    const payload: IRegisterForm = makeDataRequest()

    // 5. Agregar document_ids solo si hay documentos
    if (allDocumentIds.length > 0) {
      payload.document_ids = allDocumentIds
    }

    // 6. Actualizar el registro
    const success = await _updateRegister(payload, searchId)

    openMainLoader(false)

    if (success) {
      goToURL('RegisterList')
    }
  }

  // lifecycle
  onBeforeMount(async () => {
    openMainLoader(true)

    await Promise.all([
      _getResources(keys),
      _getResources(trustBusinessKeys, 'filter[effect]=true'),
      _getRegisterById(searchId),
    ])

    const registerData: IRegisterResponse = await _getRegisterById(searchId)

    if (registerData) {
      const transformedData: IRegisterForm = {
        ...registerData,
        created_by_name: registerData.created_by?.name,
        updated_by_name: registerData.updated_by?.name,
        configuration_type_id: registerData.configuration_type?.id,
        configuration_subtype_id: registerData.configuration_subtype?.id,
        business_trust_id: registerData.business_trust?.id,
        business_trust: { ...registerData.business_trust },
        purchase: registerData.transaction?.description,
        responsible_id: registerData.responsible?.id,
        location_id: registerData.location?.location_type_id,
        status_id: registerData.status?.id,
        account: { ...registerData.transaction },
        transaction_value: registerData.transaction?.transaction_value,
        asset_transaction_id: registerData.transaction?.id,
        document_ids: registerData.documents.map(
          (doc) => doc.documentable_id as number
        ),
        asset_contributors:
          registerData.contributors?.map((contributor) => ({
            id: contributor.id ?? null,
            nit: contributor.nit ?? null,
            description: contributor.description ?? null,
            guarantee_percentage: contributor.percentage ?? null,
            distribution_type: contributor.distribution_type ?? null,
          })) ?? [],
      }
      informationFormData.value = transformedData
      documentsFormData.value = registerData.documents.map((doc) => ({
        ...doc,
        name: doc.original_name,
      }))
      initialDocumentsData.value = JSON.parse(
        JSON.stringify(transformedData.asset_documents ?? [])
      )
    }

    openMainLoader(false)
  })

  onBeforeUnmount(async () => {
    await _resetKeys(keys)
  })

  return {
    defaultIconsLucide,

    headerPropsEdit,
    tabs,
    tabActive,
    tabActiveIdx,

    formInformationRef,
    formDocumentsRef,
    informationFormData,
    documentsFormData,

    setInformationFormData,
    setDocumentsFormData,

    goToURL,
    nextTab,
    backTab,
    onSubmit,
  }
}

export default useRegisterEdit
