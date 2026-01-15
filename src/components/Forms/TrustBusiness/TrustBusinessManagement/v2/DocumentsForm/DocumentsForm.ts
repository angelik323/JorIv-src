// vue - pinia
import { computed, onMounted, ref, watch } from 'vue'

// interfaces
import { ActionType } from '@/interfaces/global/Action'
import { IDocumentsTrustBusiness } from '@/interfaces/customs/trust-business/v2/TrustBusinessManagement'

// composables
import { useAlert, useUtils } from '@/composables'
import { useTrustBusinessStore } from '@/stores/trust-business/trust-businesses'
const { showAlert } = useAlert()
const { downloadBlobXlxx } = useUtils()

const useDocumentsForm = (
  props: {
    action: ActionType
    data?: IDocumentsTrustBusiness[] | null
    entityId?: number | string
  },
  emit: Function
) => {
  // imports
  const { _deleteTrustBusinessDocuments } = useTrustBusinessStore('v2')

  // computed
  const is_active_button = computed(
    () => props.action === 'create' || props.action === 'edit'
  )

  const is_view = computed(() => props.action === 'view')

  const isLoading = ref(true)

  const models = ref<{ documents: IDocumentsTrustBusiness[] }>({
    documents: [],
  })

  // init
  const _setValueModel = () => {
    if (props.data) {
      models.value.documents = props.data.map(
        (item: IDocumentsTrustBusiness) => ({
          ...item,
          field_name:
            contractual_documents.find(
              (ls) => ls.business_document_type === item.business_document_type
            )?.name ??
            business_structure_documents.find(
              (ls) => ls.business_document_type === item.business_document_type
            )?.name ??
            null,
        })
      )
    }
  }

  // actions
  const contractual_documents = [
    {
      name: 'Contrato fiduciario',
      is_required: true,
      show_button: is_active_button.value,
      business_document_type: 'fiduciary_contract',
      business_document_section: 'contractual_documents',
    },
    {
      name: 'Otros sí al contrato de fiducia',
      is_required: false,
      show_button: is_active_button.value,
      business_document_type: 'others_agree_trust_agreement',
      business_document_section: 'contractual_documents',
    },
    {
      name: 'Cesiones',
      is_required: false,
      show_button: is_active_button.value,
      business_document_type: 'transfers',
      business_document_section: 'contractual_documents',
    },
    {
      name: 'Anexos',
      is_required: false,
      show_button: is_active_button.value,
      business_document_type: 'annexes',
      business_document_section: 'contractual_documents',
    },
    {
      name: 'Actas',
      is_required: false,
      show_button: is_active_button.value,
      business_document_type: 'proceedings',
      business_document_section: 'contractual_documents',
    },
    {
      name: 'Escrituras',
      is_required: false,
      show_button: is_active_button.value,
      business_document_type: 'scriptures',
      business_document_section: 'contractual_documents',
    },
  ]

  const business_structure_documents = [
    {
      name: 'Check-List de estructuración',
      is_required: true,
      show_button: is_active_button.value,
      business_document_type: 'structuring_checklist',
      business_document_section: 'business_structure_documents',
    },
    {
      name: 'Flujos financiero',
      is_required: true,
      show_button: is_active_button.value,
      business_document_type: 'financial_flows',
      business_document_section: 'business_structure_documents',
    },
    {
      name: 'Prospecto',
      is_required: true,
      show_button: is_active_button.value,
      business_document_type: 'prospect',
      business_document_section: 'business_structure_documents',
    },
    {
      name: 'Ficha SFC',
      is_required: true,
      show_button: is_active_button.value,
      business_document_type: 'SFC_tab',
      business_document_section: 'business_structure_documents',
    },
    {
      name: 'Matriz de riesgo',
      is_required: true,
      show_button: is_active_button.value,
      business_document_type: 'risk_matrix',
      business_document_section: 'business_structure_documents',
    },
    {
      name: 'Ficha de estructuración de negocio',
      is_required: true,
      show_button: is_active_button.value,
      business_document_type: 'business_structuring_sheet',
      business_document_section: 'business_structure_documents',
    },
  ]

  const handleUploadFile = async (
    name_to_set: string,
    business_document_type: string,
    business_document_section: string
  ) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.pdf, .tiff, .tif'

    input.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement
      const file = target.files?.[0]
      if (!file) return
      const newDocument: IDocumentsTrustBusiness = {
        document_type: business_document_type,
        field_name: name_to_set,
        name: file.name,
        upload_date: new Date().toISOString().split('T')[0],
        file,
        business_document_type: business_document_type,
        business_document_section: business_document_section,
        is_new: true,
        to_delete: false,
      }
      if (
        models.value.documents.some(
          (doc) =>
            doc.business_document_type === business_document_type &&
            doc.file?.name === file.name
        )
      )
        return showAlert('El archivo ya ha sido añadido.', 'warning')
      models.value.documents.push(newDocument)
    }

    input.click()
    input.value = ''
  }

  const select_rows_by_type = (business_document_type: string) => {
    return models.value.documents.filter(
      (document) => document.business_document_type === business_document_type
    )
  }

  const delete_action = () => {
    models.value.documents = models.value.documents.filter(
      (document) => document !== alertModalConfig.value.row
    )

    if (!alertModalConfig.value.row?.is_new && props.entityId) {
      _deleteTrustBusinessDocuments(Number(props.entityId), [
        alertModalConfig.value.row?.id ?? 0,
      ])
    } else {
      showAlert('Registro eliminado exitosamente', 'success')
    }

    alertModalRef.value.closeModal()
  }

  const download_action = async (row: IDocumentsTrustBusiness) => {
    if (row.file) await downloadBlobXlxx(row.file, row.file?.name)
  }

  // modal
  const alertModalRef = ref()
  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '',
    row: null as IDocumentsTrustBusiness | null,
  })

  const openAlertModal = async (row: IDocumentsTrustBusiness) => {
    alertModalConfig.value.row = row
    alertModalConfig.value.description =
      '¿Está seguro de eliminar el documento?'
    await alertModalRef.value.openModal()
  }

  const validateForm = async () => {
    const requiredDocuments = contractual_documents
      .filter((doc) => doc.is_required)
      .concat(business_structure_documents.filter((doc) => doc.is_required))

    for (const reqDoc of requiredDocuments) {
      const exists = models.value.documents.some(
        (doc) =>
          doc.business_document_type === reqDoc.business_document_type &&
          doc.to_delete !== true &&
          (doc.file != null || doc.is_new === false)
      )
      if (!exists) {
        showAlert(
          `Cargue por lo menos un documento en la sección ${reqDoc.name.toLowerCase()}`,
          'warning'
        )
        return false
      }
    }

    return true
  }

  // lifecycles
  onMounted(async () => {
    isLoading.value = true
    await _setValueModel()
    isLoading.value = false
  })

  // watchs
  watch(
    () => models.value,
    () => {
      if (models.value.documents.length === 0) {
        emit('update:models', [])
      } else {
        emit('update:models', models.value.documents)
      }
    },
    {
      deep: true,
    }
  )

  return {
    models,
    contractual_documents,
    business_structure_documents,
    is_view,
    alertModalRef,
    alertModalConfig,

    openAlertModal,
    handleUploadFile,
    select_rows_by_type,
    showAlert,
    delete_action,
    download_action,
    validateForm,
  }
}

export default useDocumentsForm
