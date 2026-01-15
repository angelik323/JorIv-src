// vue - quasar - router - pinia
import { useRouter } from 'vue-router'
import { onBeforeUnmount, onMounted, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

// store
import { useRecordTransfersStore } from '@/stores/trust-business/record-transfers'
import { useResourceManagerStore } from '@/stores/resources-manager'

// composables
import { useMainLoader, useS3Documents, useAlert } from '@/composables'

// utils
import { defaultIconsLucide } from '@/utils'

// interfaces
import { IFile, ITabs } from '@/interfaces/global'
import { IRecordTransfersCreate } from '@/interfaces/customs/trust-business/RecordTransfers'

const useRecordTransfersCreate = () => {
  // imports
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { showAlert } = useAlert()
  const {
    data_information_form,
    data_documents_form,
    selectedThird,
    data_assignees_list,
    data_final_list,
    participations,
    record_tranfers_request,
    documents_request,
  } = storeToRefs(useRecordTransfersStore('v1'))

  const { _saveDocumentsS3 } = useS3Documents()

  const {
    _setDataInformationForm,
    _createRecordTransfers,
    _addFile,
    _updateDocuments,
    _clearData,
    _setDataRecordTransfersList,
  } = useRecordTransfersStore('v1')

  const keys = {
    trust_business: ['participant_types', 'third_parties'],
  }

  const keysFilter = {
    trust_business: ['business_trusts&filter[effect]=true'],
  }

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const headerProps = {
    title: 'Crear registro de cesión',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Negocios fiduciarios',
      },
      {
        label: 'Registrar cesiones',
        route: 'RecordTransfersList',
      },
      {
        label: 'Crear',
      },
    ],
  }

  // tabs
  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos*',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'documents',
      label: 'Documentos*',
      icon: defaultIconsLucide.book,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const makeDataRequest = (): IRecordTransfersCreate => {
    const dataFilter = data_final_list.value?.filter((item) =>
      data_assignees_list.value?.some((other) => other.id === item.id)
    )

    return {
      transfer_type: `${data_information_form.value?.participant_type_id ?? 0}`,
      transferee_id: selectedThird.value?.id ?? 0,
      transferee_percentage: Number(
        participations.value[selectedThird.value?.id ?? 0]
      ),
      participants: dataFilter?.map((item) => ({
        transfer_percentage: item.received_percentage ?? 0,
        final_percentage: Number(item.percentage_participation),
        third_party_id: item.id ?? 0,
      })),
    }
  }

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  const tabActive = ref(tabs.value[0].name)

  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const formInformation = ref()
  const formDocuments = ref()

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keys)
    await _getResources(keysFilter)
    openMainLoader(false)
  })

  onUnmounted(async () => {
    _setDataInformationForm(null)
    _clearData()
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
    _resetKeys(keysFilter)
    _clearData()
    _setDataInformationForm(null)
    _setDataRecordTransfersList()
    record_tranfers_request.value = null
    documents_request.value = null
  })

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
    } else {
      showAlert(`Aún no se ha distribuido el total del porcentaje a ceder entre los cesionarios`, 'error')
    }
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const handleDocumentsUpload = async (
    id: number,
    files: IFile[]
  ): Promise<void> => {
    const documentIds: string[] = []
    const uploadUrls: string[] = []
    const filesToUpload: IFile[] = []

    for (const file of files) {
      if (file) {
        const { success, documentId, uploadUrl } = await _addFile(id, {
          name: file.name,
          document_type: file.type,
        })

        if (!success || !documentId || !uploadUrl) continue

        documentIds.push(documentId.toString())
        uploadUrls.push(uploadUrl)
        filesToUpload.push(file)
      }
    }

    if (!uploadUrls.length || !filesToUpload.length) return

    await _saveDocumentsS3(uploadUrls, filesToUpload, false)
    await _updateDocuments(id, {
      documents: documentIds,
      is_validated: true,
    })
  }

  const onSubmit = async () => {
    if (await validateForms()) {
      openMainLoader(true)
      const payload: IRecordTransfersCreate = makeDataRequest()
      const id_create = await _createRecordTransfers(
        data_information_form.value?.business_id ?? 0,
        payload
      )
      if (id_create && data_documents_form.value.length) {
        await handleDocumentsUpload(id_create, data_documents_form.value)

        router.push({
          name: 'RecordTransfersList',
          query: {
            reload: 1,
          },
        })
      }
      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }
  }

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    formInformation,
    formDocuments,
    onSubmit,
    handlerGoTo,
    backTab,
    nextTab,
  }
}

export default useRecordTransfersCreate
