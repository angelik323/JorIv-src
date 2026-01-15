// Vue - Pinia - Router - Quasar
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QRejectedEntry } from 'quasar'

// Composables
import {
  useAlert,
  useMainLoader,
  useS3Documents,
  useUtils,
} from '@/composables'

// Interfaces
import { ActionType, IBaseTableProps, IUploadedFile } from '@/interfaces/global'
import {
  IContractPolicyAttachment,
  IContractRegistrationCoverage,
  IContractRegistrationGeneralDataForm,
  IContractRegistrationPolicies,
  IContractRegistrationPoliciesForm,
  IDocumentContract,
  IGeneratePresignedUrlContractRegistration,
} from '@/interfaces/customs/derivative-contracting/ContractRegistration'

// Stores
import { useDerivativeContractingResourceStore } from '@/stores/resources-manager/derivative-contracting'
import { useThirdPartyResourceStore } from '@/stores/resources-manager/third-party'
import { useContractRegistrationStore } from '@/stores/derivative-contracting/contract-registration'

const usePoliciesForm = (
  props: {
    action: ActionType
    data?: IContractRegistrationGeneralDataForm | null
  },
  emit: Function
) => {
  const { policies, risk_list, policy_status } = storeToRefs(
    useDerivativeContractingResourceStore('v1')
  )

  const { _generatePresignedUrl } = useContractRegistrationStore('v1')

  const { _saveDocumentsS3 } = useS3Documents()

  const { third_parties } = storeToRefs(useThirdPartyResourceStore('v1'))

  const { showAlert } = useAlert()
  const {
    isEmptyOrZero,
    defaultIconsLucide,
    getBlobFromUrl,
    getMaxId,
    downloadFile,
    formatCurrencyString,
    formatDate,
  } = useUtils()
  const { openMainLoader } = useMainLoader()

  const formElementRef = ref()
  const viewerFileComponentRef = ref()
  const alertModalRef = ref()
  const attachDocumentRef = ref()
  const policyFormElementRef = ref()
  const alertModalConfig = ref<IContractRegistrationPoliciesForm>({
    id: null as number | null,
    action: 'Crear',
    policie_id: null,
    policie: null,
    insurer_id: null,
    insurance: null,
    policy_number: null,
    beneficiary_id: null,
    beneficiary: null,
    insured_value: null,
    start_date: null,
    end_date: null,
    status_id: null,

    coverages: [],
    attachments: [],
  })

  const selectedRowsPolicies = ref<IContractRegistrationPolicies[]>([])

  const models = ref<Partial<IContractRegistrationGeneralDataForm>>({
    contract_policies: [],
    total_available_balance: null,
    total_committed_balance: null,
    total_outstanding_balance: null,
  })

  const tablePropertiesPolicies = ref<
    IBaseTableProps<IContractRegistrationPolicies>
  >({
    title: 'Pólizas',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'beneficiary',
        required: true,
        label: 'Aseguradora',
        align: 'left',
        field: 'beneficiary',
        sortable: true,
      },
      {
        name: 'policy_number',
        required: true,
        label: 'Póliza Nr',
        align: 'left',
        field: 'policy_number',
        sortable: true,
      },
      {
        name: 'insurance',
        required: true,
        label: 'Beneficiario',
        align: 'left',
        field: 'insurance',
        sortable: true,
      },
      {
        name: 'insured_value',
        required: true,
        label: 'Valor asegurado',
        align: 'left',
        field: 'insured_value',
        sortable: true,
        format: (val) =>
          formatCurrencyString(val, { currency: 'COP', locale: 'es-CO' }) ?? '',
      },
      {
        name: 'start_date',
        required: true,
        label: 'Fecha inicio vigencia',
        align: 'left',
        field: 'start_date',
        sortable: true,
      },
      {
        name: 'end_date',
        required: true,
        label: 'Fecha fin vigencia',
        align: 'left',
        field: 'end_date',
        sortable: true,
      },
      {
        name: 'status_id',
        required: true,
        label: 'Estado',
        align: 'left',
        field: 'status_id',
        sortable: false,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'left',
        field: 'id',
        sortable: false,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const tablePropertiesDocumentsContractPolicies = ref<
    IBaseTableProps<IContractPolicyAttachment>
  >({
    title: 'Documentos adjuntos',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'file_name',
        required: true,
        label: 'Nombre archivo',
        align: 'left',
        field: 'file_name',
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
        label: 'Estado archivo',
        align: 'left',
        field: 'status_id',
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'left',
        field: 'id',
        sortable: false,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const tablePropertiesCoverage = ref<
    IBaseTableProps<IContractRegistrationCoverage>
  >({
    title: 'Coberturas',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'risk_name',
        required: true,
        label: 'Nombre riesgo',
        align: 'left',
        field: 'risk_name',
        sortable: true,
      },
      {
        name: 'minimum_percentage',
        required: true,
        label: '% Mínimo',
        align: 'left',
        field: 'minimum_percentage',
        sortable: true,
      },
      {
        name: 'coverage_percentage',
        required: true,
        label: '% Cubrimiento',
        align: 'left',
        field: 'coverage_percentage',
        sortable: true,
      },
      {
        name: 'maximum_coverage_value',
        required: true,
        label: 'Valor maximo cubrimiento',
        align: 'left',
        field: 'maximum_coverage_value',
        sortable: true,
      },
      ...(props.action === 'view'
        ? []
        : [
            {
              name: 'actions',
              required: true,
              label: 'Acciones',
              align: 'left',
              field: 'id',
              sortable: false,
            } as const,
          ]),
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const tablePropertiesDocumentsPolicies = ref<
    IBaseTableProps<IDocumentContract>
  >({
    title: 'Documento adjunto',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'file_name',
        required: true,
        label: 'Nombre archivo',
        align: 'left',
        field: 'file_name',
        sortable: true,
      },
      {
        name: 'status_id',
        required: true,
        label: 'Estado archivo',
        align: 'left',
        field: 'status_id',
        sortable: true,
      },
      {
        name: 'creation_data',
        required: true,
        label: 'Datos de creación',
        align: 'left',
        field: 'creation_data',
        sortable: true,
      },
      ...(props.action === 'view'
        ? []
        : [
            {
              name: 'actions',
              required: true,
              label: 'Acciones',
              align: 'left',
              field: 'id',
              sortable: false,
            } as const,
          ]),
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const setValueModel = () => {
    Object.assign(models.value, props.data)
  }

  watch(
    () => props.data,
    (val) => {
      if (!val) return
      setValueModel()
    },
    { deep: true, immediate: true }
  )

  watch(
    () => models.value,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  const handleOpenModalCreatePolicies = async () => {
    clearAlertModal()

    await alertModalRef.value.openModal()
  }

  const handleAddPolicies = async () => {
    if (!(await policyFormElementRef.value.validate())) return

    const { action, id, ...configData } = alertModalConfig.value

    const policies = {
      id: id ?? getMaxId(models.value.contract_policies ?? []) + 1,
      policie_id: configData.policie_id ?? null,
      policie: configData.policie ?? '',
      insurer_id: configData.insurer_id ?? null,
      insurance: configData.insurance ?? '',
      policy_number: configData.policy_number ?? '',
      beneficiary_id: configData.beneficiary_id ?? null,
      beneficiary: configData.beneficiary ?? '',
      insured_value: String(configData.insured_value ?? ''),
      start_date: configData.start_date ?? '',
      end_date: configData.end_date ?? '',
      status_id: Number(configData.status_id),
      coverages: tablePropertiesCoverage.value.rows || [],
      attachments: tablePropertiesDocumentsContractPolicies.value.rows || [],
      is_new_policie: action === 'Crear',
    }

    if (action === 'Editar') {
      const index = models.value.contract_policies?.findIndex(
        (it) => it.id === id
      )

      if (index !== undefined && index > -1) {
        models.value.contract_policies![index] = policies
      }
    } else {
      models.value.contract_policies?.push(policies)
    }

    clearAlertModal()
    await alertModalRef.value.closeModal()
  }

  const clearAlertModal = () => {
    tablePropertiesCoverage.value.rows = []
    tablePropertiesDocumentsPolicies.value.rows = []
    alertModalConfig.value = {
      id: null,
      action: 'Crear',
      policie_id: null,
      policie: null,
      insurer_id: null,
      insurance: null,
      policy_number: null,
      beneficiary_id: null,
      beneficiary: null,
      insured_value: null,
      start_date: null,
      end_date: null,
      status_id: null,
      coverages: [],
      attachments: [],
    }
  }

  const handleDeletePolicies = (id: number) => {
    models.value.contract_policies = models.value.contract_policies?.filter(
      (item) => item.id !== id
    )
  }

  const handleEditPolicies = (id: number) => {
    const policy = models.value.contract_policies?.find(
      (item) => item.id === id
    )

    if (policy) {
      alertModalConfig.value = {
        ...policy,
        id: Number(policy.id),
        action: 'Editar',
        policie_id: Number(policy.policie_id),
        policie: policy.policie ?? '',
        insurer_id: Number(policy.insurer_id),
        insurance: policy.insurance ?? '',
        policy_number: policy.policy_number ?? '',
        beneficiary_id: Number(policy.beneficiary_id),
        insured_value: Number(policy.insured_value),
        status_id: Number(policy.status_id),

        coverages: policy.coverages || [],
        attachments: policy.attachments || [],
      }

      tablePropertiesCoverage.value.rows = policy.coverages || []
      alertModalConfig.value.attachments = policy.attachments || []
    }
    alertModalRef.value.openModal()
  }

  const handleViewPolicies = (id: number) => {
    const policy = models.value.contract_policies?.find(
      (item) => item.id === id
    )
    if (policy) {
      alertModalConfig.value = {
        ...policy,
        id: Number(policy.id),
        action: 'Ver',
        policie_id: Number(policy.policie_id),
        policie: policy.policie ?? '',
        insurer_id: Number(policy.insurer_id),
        insurance: policy.insurance ?? '',
        policy_number: policy.policy_number ?? '',
        beneficiary_id: Number(policy.beneficiary_id),
        insured_value: Number(policy.insured_value),
        status_id: Number(policy.status_id),
        coverages: policy.coverages || [],
        attachments: policy.attachments || [],
      }

      tablePropertiesCoverage.value.rows = policy.coverages || []
      alertModalConfig.value.attachments = policy.attachments || []
    }
    alertModalRef.value.openModal()
  }

  const handleAddCoverage = async () => {
    tablePropertiesCoverage.value.rows?.push({
      id: getMaxId(tablePropertiesCoverage.value.rows ?? []) + 1,
      risk_id: null,
      risk_name: '',
      minimum_percentage: 0,
      coverage_percentage: 0,
      maximum_coverage_value: 0,
    } as IContractRegistrationCoverage)
  }

  const handleDeleteCoverage = (id: number) => {
    tablePropertiesCoverage.value.rows =
      tablePropertiesCoverage.value.rows?.filter((item) => item.id !== id)
  }

  const handleDeleteDocumentPolicies = (id: number) => {
    models.value.contract_policies = models.value.contract_policies?.map(
      (policy) => {
        return {
          ...policy,
          attachments: policy.attachments?.filter((doc) => doc.id !== id),
        }
      }
    )

    tablePropertiesDocumentsPolicies.value.rows =
      tablePropertiesDocumentsPolicies.value.rows?.filter(
        (doc) => doc.id !== id
      )
  }

  const viewFile = async (fileProxy: string | null) => {
    if (!fileProxy) {
      return showAlert(`No hay archivo para mostrar`, 'error', undefined, 1000)
    }

    try {
      const blob = await getBlobFromUrl(fileProxy)
      await viewerFileComponentRef.value.showFile(blob)
    } catch (error) {
      showAlert(`Error al procesar el archivo`, 'error', undefined, 3000)
      return error
    }
  }

  const addedFiles = async (files: IUploadedFile[]) => {
    try {
      const existingDocuments = alertModalConfig.value.attachments || []

      const uploadPromises = files.map(async (file, index) => {
        try {
          const payload: IGeneratePresignedUrlContractRegistration = {
            annex_document_id: alertModalConfig.value.policie_id || 0,
            file_type: file.type,
            name: file.name,
            file_size: file.size,
          }

          const response = await _generatePresignedUrl(payload)

          if (!response) {
            throw new Error(`No se pudo generar URL para ${file.name}`)
          }

          await _saveDocumentsS3([response.upload_url], [file])

          return {
            id: getMaxId(existingDocuments) + index + 1,
            document_id: response.document_id ?? null,
            creation_data: formatDate(new Date()?.toString(), 'DD-MM-YYYY'),
            original_name: file.name,
            file_name: file.name,
            file_path: response.upload_url,
            file: file,
            is_new_document: true,
            status_id: 75,
            size: file.size,
            is_validated: true,
          } as IDocumentContract
        } catch (error) {
          return null
        }
      })

      const uploadedFiles = await Promise.all(uploadPromises)

      const successfulUploads = uploadedFiles.filter(
        (doc): doc is IDocumentContract => doc !== null
      )

      alertModalConfig.value.attachments = [
        ...(alertModalConfig.value.attachments || []),
        ...successfulUploads,
      ]
    } catch (error) {
      showAlert('Error al procesar los archivos', 'error', undefined, 3000)
    }
  }

  const rejectedFiles = (fileRejected: QRejectedEntry[]) => {
    if (fileRejected[0]?.failedPropValidation === 'accept')
      showAlert('¡Tipo de archivo no permitido!', 'error')
  }

  const handleRemoveFile = (id: number) => {
    const filteredDocuments = alertModalConfig.value.attachments?.filter(
      (file) => file.id !== id
    )
    if (filteredDocuments) {
      alertModalConfig.value.attachments = filteredDocuments
      attachDocumentRef.value?.removeFilesRemote()
    }
  }

  const handleViewFile = async (url: string, original_name: string) => {
    openMainLoader(true)
    await downloadFile(url, original_name)
    openMainLoader(false)
  }

  const handleSelectedRowsPolicies = (
    selected: IContractRegistrationPolicies[] | null
  ) => {
    tablePropertiesDocumentsPolicies.value.rows =
      selected?.[0]?.attachments?.map((item) => ({
        ...item,
        creation_data: item.creation_data,
        file_name: item.file_name || '',
        status_id: item.status_id || 75,
      })) || []
  }

  watch(
    () => alertModalConfig.value?.attachments,
    (val) => {
      tablePropertiesDocumentsContractPolicies.value.rows =
        val?.map((doc) => ({
          ...doc,
          id: Number(doc.id),
          file_name: doc.file_name || '',
          total: 1,
          status_id: doc.status_id || 75,
        })) || []
    },
    { immediate: ['edit', 'view'].includes(props.action) }
  )

  watch(
    () => models.value.contract_policies,
    (val) => {
      if (!val) return

      tablePropertiesPolicies.value.rows = val.map((policy) => ({
        ...policy,
        id: Number(policy.id),
        policy_number: policy.policy_number ?? '',
        beneficiary: policy.beneficiary ?? '',
        insured_value: Number(policy.insured_value),
        insurance: policy.insurance ?? '',
        start_date: policy.start_date ?? '',
        end_date: policy.end_date ?? '',
        status_id: Number(policy.status_id),
        coverages: policy.coverages || [],
        attachments:
          policy.attachments?.map((doc) => ({
            ...doc,
            file_name: doc.original_name ?? doc.file_name ?? '',
            status_id: doc.status_id ?? 75,
          })) || [],
      }))
    },
    { deep: true, immediate: true }
  )

  return {
    formElementRef,
    tablePropertiesPolicies,
    tablePropertiesDocumentsPolicies,
    tablePropertiesCoverage,
    tablePropertiesDocumentsContractPolicies,
    defaultIconsLucide,
    alertModalRef,
    policyFormElementRef,
    alertModalConfig,
    viewerFileComponentRef,
    policies,
    third_parties,
    risk_list,
    selectedRowsPolicies,
    policy_status,

    handleAddCoverage,
    handleDeleteCoverage,
    handleOpenModalCreatePolicies,
    handleAddPolicies,
    handleDeletePolicies,
    handleViewPolicies,
    handleEditPolicies,
    handleDeleteDocumentPolicies,
    viewFile,
    addedFiles,
    rejectedFiles,
    handleRemoveFile,
    handleViewFile,
    handleSelectedRowsPolicies,
    formatCurrencyString,
  }
}

export default usePoliciesForm
