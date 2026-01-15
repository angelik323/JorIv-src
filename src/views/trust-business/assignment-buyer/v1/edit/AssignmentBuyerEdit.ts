// vue - quasar
import { onMounted, onBeforeUnmount, ref, onBeforeMount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
import {
  IAssigneeCedents,
  IAssignmentBuyer,
  IAssignmentBuyerCreate,
  IPaymentPlanAssignmentBuyer,
} from '@/interfaces/customs/trust-business/AssignmentBuyer'
import { IResponseDocuments } from '@/interfaces/customs/trust-business/RecordTransfers'

const useAssignmentBuyerEdit = () => {
  const router = useRouter()
  const route = useRoute()

  const assignmentBuyerId = +route.params.id

  const { showAlert } = useAlert()

  // imports
  const { openMainLoader } = useMainLoader()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const {
    _updateAction,
    _clearData,
    _addFile,
    _getByIdAction,
    _deleteActionFile,
  } = useAssignmentBuyerStore('v1')

  const { _saveDocumentsS3, getExtensionFromMimeType } = useS3Documents()

  const {
    data_information_form,
    data_documents_form,
    data_response,
    selectedThirdId,
    data_tables,
  } = storeToRefs(useAssignmentBuyerStore('v1'))

  const response_map = ref<IAssignmentBuyer>()
  const response_map_documents = ref<IResponseDocuments[]>([])

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
    title: 'Editar cesión de comprador',
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
        label: 'Editar',
      },
      {
        label: `${assignmentBuyerId}`,
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
      id: assignmentBuyerId,
      business_trust_property_id:
        data_information_form.value?.business_trust_property_id ?? 0,
      assignees: data_information_form.value?.assignees ?? [],
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

  const handleDeleteFiles = async () => {
    const attachments = data_response.value?.attachments
    if (!attachments) return

    attachments.forEach(async (element) => {
      await _deleteActionFile(element.id, false)
    })
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
    await _updateAction(assignmentBuyerId, data)

    await handleDocumentsUpload(
      data_documents_form.value ?? [],
      assignmentBuyerId
    )

    await handleDeleteFiles()

    openMainLoader(false)
    goToList()

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  // lifecycle hooks
  const allKeys = [keys, keys2, keys3]

  onBeforeMount(async () => {
    openMainLoader(true)
    await _getByIdAction(assignmentBuyerId)
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  })

  onMounted(async () => {
    openMainLoader(true)
    await Promise.all(allKeys.map((k) => _getResources(k)))
    openMainLoader(false)
  })

  onBeforeUnmount(async () => {
    await Promise.all(allKeys.map((k) => _resetKeys(k)))
    _clearData()
  })

  watch(
    () => data_response.value,
    async () => {
      const data = data_response.value

      if (!data) return

      response_map.value = {
        id: data.id,
        business_trust_id: data.business_trust?.id ?? null,
        business_trust_name: data.business_trust?.name ?? '',
        real_estate_project_id: data.project?.id ?? null,
        real_estate_project_name: data.project?.name ?? '',
        project_stage_id: data.project_stage?.id ?? null,
        project_stage_name: `${data.project_stage?.stage_number}`,
        business_trust_property_id: data.business_trust_property_id ?? null,
        business_trust_property_name: data.property?.nomenclature ?? '',
        status_id: data.status_id?.id ?? null,
        assignees:
          data.assignees.map((item: IAssigneeCedents) => ({
            third_party_id: item.id,
          })) ?? [],
      }

      data_tables.value = {
        buyers:
          data.cedents.map((item: IAssigneeCedents) => ({
            id: item.id,
            third_party_id: item.id,
            buyer: item,
            name: item.name,
            third_party: {
              id: item.id,
              document_number: item.document ?? '',
              document_type: item.document_type.name ?? '',
              email: item.email ?? '',
            },
          })) ?? [],
        payment_plans: data.payment_plan.map(
          (item: IPaymentPlanAssignmentBuyer) => ({
            ...item,
          })
        ),
      }

      response_map_documents.value = data.attachments ?? []

      selectedThirdId.value =
        data.cedents.find((c: IAssigneeCedents) => c.is_cedent)?.id ?? null
    },
    { deep: true }
  )

  return {
    headerProps,
    tabs,
    defaultIconsLucide,
    tabActive,
    tabActiveIdx,
    formInformation,
    formDocuments,
    response_map,
    response_map_documents,

    nextTab,
    backTab,
    onSubmit,
    goToList,
  }
}
export default useAssignmentBuyerEdit
