// Vue - Pinia
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IAutomaticDebitSettingsForm, IDocument } from '@/interfaces/customs'
import {
  ActionType,
  IBaseTableProps,
  IFileField,
  IUploadedFile,
} from '@/interfaces/global'
import { QRejectedEntry } from 'quasar'
import { MAX_FILE_SIZE_MB } from '@/constants/files'

// Composables
import { useAlert, useMainLoader, useRules, useUtils } from '@/composables'

// Stores
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useTreasuryResourceStore } from '@/stores/resources-manager/treasury'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'

const useBasicDataForm = (
  props: {
    action: ActionType
    data: IAutomaticDebitSettingsForm | null
  },
  emit: Function
) => {
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { business_trusts } = storeToRefs(useTrustBusinessResourceStore('v1'))

  const { treasury_bank_accounts_with_name, banks } = storeToRefs(
    useTreasuryResourceStore('v1')
  )

  const { funds, fiduciary_investment_plans } = storeToRefs(
    useFicResourceStore('v1')
  )

  const {
    formatDate,
    getMaxId,
    downloadFile,
    isEmptyOrZero,
    defaultIconsLucide,
  } = useUtils()
  const { is_required, max_length } = useRules()
  const { showAlert } = useAlert()
  const { openMainLoader } = useMainLoader()

  const attachDocumentRef = ref()
  const formElementRef = ref()

  const initialModelsValues: IAutomaticDebitSettingsForm = {
    business_trust_id: null,
    automatic_debit: null,
    source: null,
    document: null,
    list_documents: [],

    collective_investment_fund_id: null,
    investment_plan_id: null,
    account_bank_id: null,
    account_id: null,

    is_active: null,

    business_code_snapshot: null,
    business_name_snapshot: null,
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const tableDocumentsProperties = ref<IBaseTableProps<IDocument>>({
    title: 'Listado de documentos',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'center',
        field: 'id',
        sortable: true,
      },
      {
        name: 'description',
        required: true,
        label: 'Nombre',
        align: 'left',
        field: 'description',
        sortable: true,
      },
      {
        name: 'total',
        required: true,
        label: 'Total de registros',
        align: 'left',
        field: 'id',
        sortable: true,
        format: () => 'N/A',
      },
      {
        name: 'status_id',
        required: true,
        label: 'Estado de cargue',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'upload_date',
        required: true,
        label: 'Fecha de carga',
        align: 'left',
        field: 'upload_date',
        sortable: true,
      },
      {
        name: 'actions',
        label: 'Acciones',
        align: 'left',
        field: 'id',
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const _setValueModel = () => {
    if (!props.data) return
    models.value = { ...props.data }
  }

  const addedFiles = (file: IUploadedFile[]) => {
    const newFileSizeMB = file[0].size / (1024 * 1024)

    if (newFileSizeMB > MAX_FILE_SIZE_MB) {
      showAlert(
        `¡El archivo supera el tamaño máximo permitido (${MAX_FILE_SIZE_MB}mb)!`,
        'error'
      )
      return
    }

    if (models.value.list_documents!.length === 0) {
      addNewFile(file[0])
    } else {
      showAlert('¡Solo se pueden adjuntar 1 archivo!', 'error')
      attachDocumentRef.value?.removeFilesRemote()
    }
  }

  const addNewFile = async (file: IUploadedFile) => {
    const newFile: IDocument = {
      id: String(getMaxId(models.value.list_documents ?? []) + 1),
      description: file.name,
      file: file,
      upload_date: formatDate(new Date().toISOString(), 'YYYY-MM-DD'),
      is_new_document: true,
    }

    models.value.list_documents = [newFile]
  }

  const rejectedFiles = (fileRejected: QRejectedEntry[]) => {
    if (fileRejected[0]?.failedPropValidation === 'accept')
      showAlert('¡Tipo de archivo no permitido!', 'error')
  }

  const removeFile = (row: IFileField) => {
    const filteredDocuments = models.value.list_documents?.filter(
      (file) => file.id !== row.id
    )
    if (filteredDocuments) {
      models.value.list_documents = filteredDocuments
      attachDocumentRef.value?.removeFilesRemote()
    }
  }

  const viewFile = async (url: string, original_name: string) => {
    openMainLoader(true)
    await downloadFile(url, original_name)
    openMainLoader(false)
  }

  const getDataBusinessTrust = (id: number) => {
    const selectedTrust = business_trusts.value?.find(
      (trust) => trust.value === id
    )

    models.value.business_code_snapshot = selectedTrust?.business_code || null
    models.value.business_name_snapshot = selectedTrust?.name || null
  }

  // Sincroniza el modelo con la prop 'data'
  watch(
    () => props.data,
    (val) => {
      if (!val) return
      _setValueModel()
    },
    { deep: true, immediate: true }
  )

  watch(
    models,
    (val) => {
      // Evita bucle infinito
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  watch(
    () => models.value?.business_trust_id,
    (val, oldVal) => {
      if (val === oldVal) return
      if (val) getDataBusinessTrust(val)
    }
  )

  watch(
    () => models.value?.account_bank_id,
    async (val, oldVal) => {
      if (val === oldVal) return

      if (oldVal != null) {
        models.value.account_id = null
      }

      if (val) {
        await _getResources(
          { treasury: ['business_bank_accounts'] },
          `business_id=${models.value.business_trust_id}&filter[bank_id]=${val}`,
          'v2'
        )
      } else {
        _resetKeys({ fics: ['business_bank_accounts'] })
      }
    },
    { immediate: props.action === 'edit' }
  )

  watch(
    () => models.value?.collective_investment_fund_id,
    async (val, oldVal) => {
      if (val === oldVal) return

      if (oldVal != null) {
        models.value.investment_plan_id = null
      }

      if (val) {
        await _getResources(
          { fics: ['fiduciary_investment_plans'] },
          `collective_investment_fund_id=${val}`
        )
      } else {
        _resetKeys({ fics: ['fiduciary_investment_plans'] })
      }
    },
    { immediate: props.action === 'edit' }
  )

  watch(business_trusts, (val) => {
    if (
      !val?.length ||
      !models.value.business_trust_id ||
      props.action !== 'edit'
    )
      return
    getDataBusinessTrust(models.value.business_trust_id)
  })

  watch(
    () => models.value?.list_documents,
    (val) => {
      tableDocumentsProperties.value.rows = val || []
    },
    { immediate: ['edit', 'view'].includes(props.action) }
  )

  return {
    formElementRef,
    models,
    is_required,
    max_length,
    business_trusts,
    tableDocumentsProperties,
    attachDocumentRef,
    treasury_bank_accounts_with_name,
    banks,
    funds,
    fiduciary_investment_plans,
    defaultIconsLucide,

    addedFiles,
    rejectedFiles,
    removeFile,
    viewFile,
  }
}

export default useBasicDataForm
