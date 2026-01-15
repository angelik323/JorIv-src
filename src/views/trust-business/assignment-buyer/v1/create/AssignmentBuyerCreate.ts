// vue - quasar
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

// composables
import { useAlert, useMainLoader, useS3Documents } from '@/composables'

// stores
import { useAssignmentBuyerStore } from '@/stores/trust-business/assignment-buyer'
import { useResourceManagerStore } from '@/stores/resources-manager'

// utils
import { defaultIconsLucide } from '@/utils'

// interfaces
import { IFile, ITabs } from '@/interfaces/global'
import { IAssignmentBuyerCreate } from '@/interfaces/customs/trust-business/AssignmentBuyer'

const useAssignmentBuyerCreate = () => {
  const router = useRouter()

  const { showAlert } = useAlert()

  // imports
  const { openMainLoader } = useMainLoader()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { _createAction, _clearData, _addFile } = useAssignmentBuyerStore('v1')

  const { _saveDocumentsS3, getExtensionFromMimeType } = useS3Documents()

  const { data_information_form, data_documents_form, selectedThirdId } =
    storeToRefs(useAssignmentBuyerStore('v1'))

  const keys = {
    trust_business: ['participant_types'],
  }

  const keys2 = {
    trust_business: ['business_trusts&filter[can_project]=true'],
  }

  const keys3 = {
    trust_business: ['third_parties'],
  }

  // props
  const headerProps = {
    title: 'Crear cesión de comprador',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Negocios fiduciarios',
      },
      {
        label: 'Cesión de comprador',
        route: 'AssignmentBuyerList',
      },
      {
        label: 'Crear',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'documents',
      label: 'Documentos*',
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

  const formInformation = ref()
  const formDocuments = ref()

  const validateForms = async () => {
    let valid: boolean = false
    const forms = [formInformation, formDocuments]

    if (tabActiveIdx.value >= 0 && tabActiveIdx.value < forms.length) {
      try {
        valid =
          (await forms[tabActiveIdx.value]?.value?.validateForm()) ?? false
      } catch {
        valid = false
      }
    }
    return valid
  }

  const nextTab = async () => {
    if (await validateForms()) {
      tabActiveIdx.value = tabActiveIdx.value + 1
      tabActive.value = tabs.value[tabActiveIdx.value].name
    }
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const makeDataRealSateProject = async (): Promise<IAssignmentBuyerCreate> => {
    return {
      business_trust_property_id:
        data_information_form.value?.business_trust_property_id ?? 0,
      assignees: selectedThirdId.value
        ? data_information_form.value?.assignees
        : [],
      cedents: [
        {
          third_party_id: selectedThirdId.value ?? 0,
        },
      ],
    }
  }

  const handleDocumentsUpload = async (
    files: File[],
    property_transfer_id: number
  ): Promise<string[]> => {
    const documentIds: string[] = []
    const uploadUrls: string[] = []
    const filesToUpload: IFile[] = []

    for (const fileField of files) {
      const file = fileField
      if (!file) continue
      const { success, documentId, uploadUrl } = await _addFile(
        file.name ?? '',
        getExtensionFromMimeType(file.type ?? ''),
        property_transfer_id
      )

      if (!success || !documentId || !uploadUrl) continue

      documentIds.push(documentId.toString())
      uploadUrls.push(uploadUrl)
      filesToUpload.push(file)
    }

    if (!uploadUrls.length || !filesToUpload.length) return []

    await _saveDocumentsS3(uploadUrls, filesToUpload, false)

    return documentIds
  }

  const goToList = () => {
    router.push({ name: 'AssignmentBuyerList', query: { reload: 1 } })
  }

  const onSubmit = async () => {
    if (!(await validateForms()))
      return showAlert(
        'Formulario incompleto. ¡Rellene todos los campos y documentos!',
        'error',
        undefined,
        3000
      )

    openMainLoader(true)

    const data: IAssignmentBuyerCreate = await makeDataRealSateProject()
    const id = await _createAction(data)

    if (!id)
      return setTimeout(() => {
        openMainLoader(false)
      }, 1000)

    await handleDocumentsUpload(data_documents_form.value ?? [], id)

    openMainLoader(false)
    goToList()

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  // lifecycle hooks
  const allKeys = [keys, keys2, keys3]

  onMounted(async () => {
    openMainLoader(true)
    await Promise.all(allKeys.map((k) => _getResources(k)))
    openMainLoader(false)
  })

  onBeforeUnmount(async () => {
    _clearData()
    await Promise.all(allKeys.map((k) => _resetKeys(k)))
  })

  return {
    headerProps,
    tabs,
    defaultIconsLucide,
    tabActive,
    tabActiveIdx,
    formInformation,
    formDocuments,
    data_information_form,

    nextTab,
    backTab,
    onSubmit,
    goToList,
  }
}
export default useAssignmentBuyerCreate
