import { QRejectedEntry, QTable } from 'quasar'
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { useAlert, useS3Documents, useUtils } from '@/composables'

import { ActionType, IUploadedFile } from '@/interfaces/global'
import {
  ILogoTable,
  IInventoryTable,
  ISignatureTable,
  IGeneratePresignedUrl,
  IReportTemplatesRequest,
} from '@/interfaces/customs'

import { useLogin as useLoginStore, useReportTemplatesStore } from '@/stores'

const useInformationForm = (props: {
  action: ActionType
  tabActive: string
  data?: IReportTemplatesRequest
}) => {
  const { _saveDocumentsS3, getExtensionFromMimeType } = useS3Documents()
  const { defaultIconsLucide, getMaxId } = useUtils()
  const {
    _deleteLogoAction,
    _updateLogoAction,
    _generateCodeAction,
    _generatePresignedUrl,
    _deleteSignatureAction,
    _updateSignatureAction,
  } = useReportTemplatesStore('v1')
  const { loggedUser } = storeToRefs(useLoginStore())
  const { showAlert } = useAlert()

  const selectedRow = ref<ILogoTable | ISignatureTable | undefined>(undefined)
  const signatureRows = ref<ISignatureTable[]>([])
  const inventoryRows = ref<IInventoryTable[]>([])
  const logoRows = ref<ILogoTable[]>([])
  const informationFormRef = ref()
  const showUpload = ref(false)
  const alertModalRef = ref()
  const imageModalRef = ref()

  const MAX_FILE_SIZE_MB = 10
  const user = loggedUser?.value?.user
  const role = loggedUser?.value?.role

  const fullName = `${user?.name} ${user?.last_name}`

  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '',
    entityId: null as number | null,
    statusId: null as boolean | null,
  })
  const uploadProps = computed(() => ({
    title: props.tabActive === 'logo' ? 'Logo' : 'Firmas',
    styleCustom: 'width: 100%',
    labelBtn: 'Seleccione las imágenes para subir',
    multiple: true,
    bordered: false,
    accept: '.png, .jpg, .jpeg',
    classNameTitle: 'text-weight-medium text-grey-6 q-mb-xs',
  }))

  const tableProperties = ref({
    title: '',
    loading: false,
    columns: [] as QTable['columns'],
    rows: [] as ILogoTable[] | ISignatureTable[] | IInventoryTable[],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const tableConfigs = {
    logo: {
      title: 'Logo institucional',
      columns: [
        {
          name: 'id',
          align: 'left',
          label: '#',
          field: 'id',
          sortable: true,
        },
        {
          name: 'image_path',
          align: 'left',
          label: 'Logo',
          field: 'image_path',
          sortable: true,
        },
        {
          name: 'app_name',
          align: 'left',
          label: 'Nombre del aplicativo',
          field: 'app_name',
          sortable: true,
          required: true,
        },
        {
          name: 'entity',
          align: 'left',
          label: 'Entidad',
          field: 'entity',
          sortable: true,
          required: true,
        },
        {
          name: 'actions',
          align: 'center',
          label: 'Acciones',
          field: 'actions',
          sortable: true,
        },
      ] as QTable['columns'],
      rows: ref<ILogoTable[]>([]),
    },
    signatures: {
      title: 'Listado de firmas',
      columns: [
        {
          name: 'id',
          align: 'left',
          label: '#',
          field: 'id',
          sortable: true,
        },
        {
          name: 'code',
          align: 'left',
          label: 'Código de firma',
          field: 'code',
          sortable: true,
          required: true,
        },
        {
          name: 'position',
          align: 'left',
          label: 'Cargo',
          field: 'position',
          sortable: true,
          required: true,
        },
        {
          name: 'name',
          align: 'left',
          label: 'Funcionario',
          field: 'name',
          sortable: true,
          required: true,
        },
        {
          name: 'is_active',
          align: 'center',
          label: 'Estado',
          field: 'is_active',
          sortable: true,
          required: true,
        },
        {
          name: 'actions',
          align: 'center',
          label: 'Acciones',
          field: 'actions',
          sortable: true,
        },
      ] as QTable['columns'],
      rows: ref<ISignatureTable[]>([]),
    },
    inventory: {
      title: 'Listado de informes',
      columns: [
        {
          name: 'id',
          align: 'left',
          label: '#',
          field: 'id',
          sortable: true,
        },
        {
          name: 'code_report',
          align: 'left',
          label: 'Código de informe*',
          field: 'code',
          sortable: true,
          required: true,
        },
        {
          name: 'name_report',
          align: 'left',
          label: 'Nombre del informe*',
          field: 'name',
          sortable: true,
          required: true,
        },
        {
          name: 'actions',
          align: 'center',
          label: 'Acciones',
          field: 'actions',
          sortable: true,
        },
      ] as QTable['columns'],
      rows: ref<IInventoryTable[]>([]),
    },
  }

  const isRowActive = (row: ISignatureTable) => row.is_active

  const isFileTooLarge = (sizeMB: number): boolean => sizeMB > MAX_FILE_SIZE_MB

  const loadData = () => {
    if (!props.data) return

    const data = props.data

    logoRows.value = data.logo
      ? [
          {
            id: data ? data.logo.id : 1,
            image_url: data.logo.image_url || '',
            image_path: data.logo.image_path || '',
            image_name: data.logo.image_name || 'Logo',
            app_name: data.logo.app_name,
            entity: data.logo.entity,
          },
        ]
      : []

    signatureRows.value = Array.isArray(data.signatures)
      ? data.signatures.map((item, index) => ({
          id: data ? item.id : index + 1,
          image_path: item.image_url,
          is_active: item.is_active,
          name: item.user?.name || '',
          position: item.user?.profile_type || '',
          code: item.code || '',
        }))
      : []

    if (data.name || data.code) {
      inventoryRows.value = [
        {
          id: 1,
          code_report: data.code || '',
          name_report: data.name || '',
        },
      ]
    }

    updateTableProperties()
  }

  const setAlertModalDescription = (isActive: boolean) => {
    const action = isActive ? 'inactivar' : 'activar'
    return `¿Desea ${action} la firma de los reportes?`
  }

  const openAlertModal = async (row: ISignatureTable) => {
    if (row.name !== fullName) {
      showAlert('Solo puedes cambiar el estado de tu propia firma.', 'warning')
      return
    }

    const currentStatus = row.is_active
    alertModalConfig.value.description = setAlertModalDescription(currentStatus)
    alertModalConfig.value.statusId = currentStatus
    alertModalConfig.value.entityId = row.id!
    await alertModalRef.value.openModal()
  }

  const handleChangeStatus = async () => {
    const { entityId } = alertModalConfig.value

    if (entityId == null) return

    const signature = signatureRows.value.find((sig) => sig.id === entityId)
    if (!signature) return

    const newStatus = !signature.is_active

    const success = await _updateSignatureAction({
      id: entityId,
      is_active: newStatus,
    })

    if (success) {
      alertModalRef.value.closeModal()

      signature.is_active = newStatus

      updateTableProperties()
    }
  }

  const handleAddFiles = async (files: IUploadedFile[], isModal: boolean) => {
    const type = props.tabActive as 'logo' | 'signatures'

    for (const file of files) {
      if (isFileTooLarge(file.size / (530 * 120))) {
        showAlert(
          `¡El archivo supera el tamaño máximo permitido (${MAX_FILE_SIZE_MB}mb)!`,
          'error'
        )
        continue
      }

      if (type === 'logo' && file.type.startsWith('image/')) {
        const img = new Image()
        const objectUrl = URL.createObjectURL(file as unknown as Blob)

        const isValid = await new Promise<boolean>((resolve) => {
          img.onload = () => {
            const valid = img.width === 530 && img.height === 120
            URL.revokeObjectURL(objectUrl)
            resolve(valid)
          }
          img.onerror = () => {
            URL.revokeObjectURL(objectUrl)
            resolve(false)
          }
          img.src = objectUrl
        })

        if (!isValid) {
          showAlert(`El logo debe tener exactamente 530x120 píxeles.`, 'error')
          continue
        }
      }

      const extension = getExtensionFromMimeType(file.type)

      if (type === 'logo') {
        await handleLogoUpload(file, extension, isModal)
      } else if (type === 'signatures') {
        await handleSignatureUpload(file, extension, isModal)
      }
    }

    updateTableProperties()
  }

  const handleLogoUpload = async (
    file: IUploadedFile,
    extension: string,
    isModal?: boolean
  ) => {
    const rows = logoRows.value

    if (!isModal) {
      if (rows.length >= 1) {
        showAlert('¡Solo se permite 1 logo por creación!', 'warning')
        return
      }

      const payload: IGeneratePresignedUrl = {
        document_type: extension,
        app_name: file.name,
        file_type: 'logo',
        name: file.name,
        entity: 'logo',
      }

      const response = await _generatePresignedUrl(payload)
      if (!response) return

      await _saveDocumentsS3([response.uploadUrl], [file])

      const newRow: ILogoTable = {
        id: getMaxId(rows) + 1,
        logo_id: response.model?.id,
        image_path: response.uploadUrl || '',
        image_name: response.fileName || '',
        app_name: '',
        entity: '',
      }

      rows.push(newRow)
    } else {
      const payload: IGeneratePresignedUrl = {
        document_type: extension,
        app_name: file.name,
        file_type: 'logo',
        name: file.name,
        entity: 'logo',
      }

      const response = await _generatePresignedUrl(payload)
      await _saveDocumentsS3([response.uploadUrl], [file])

      if (!response) return

      const success = await _updateLogoAction({
        id: selectedRow.value?.id || 0,
        image_path: response.filePath || '',
      })

      if (success) imageModalRef.value?.closeModal()
    }
  }

  const handleSignatureUpload = async (
    file: IUploadedFile,
    extension: string,
    isModal?: boolean
  ) => {
    const rows = signatureRows.value

    if (!isModal) {
      if (rows.length >= 6) {
        showAlert('¡Solo se permiten máximo 6 firmas en total!', 'warning')
        return
      }

      const exists = rows.some((row) => row.name === fullName)
      if (exists) {
        showAlert('¡Ya tienes una firma registrada!', 'warning')
        return
      }

      const payload: IGeneratePresignedUrl = {
        document_type: extension,
        file_type: 'signature',
        app_name: file.name,
        name: file.name,
        entity: 'user',
      }

      const response = await _generatePresignedUrl(payload)
      await _saveDocumentsS3([response.uploadUrl], [file])

      if (!response) return

      const generatedCode = await _generateCodeAction('FRM')

      const newRow: ISignatureTable = {
        id: getMaxId(rows) + 1,
        signature_id: response.model?.id,
        code: generatedCode.code || '',
        image_path: response.filePath || '',
        name: fullName,
        position: role,
        is_active: true,
      }

      rows.push(newRow)
    } else {
      const payload: IGeneratePresignedUrl = {
        document_type: extension,
        file_type: 'signature',
        app_name: file.name,
        name: file.name,
        entity: 'user',
      }

      const response = await _generatePresignedUrl(payload)
      await _saveDocumentsS3([response.uploadUrl], [file])

      if (!response) return

      if (props.action === 'edit') {
        const success = await _updateSignatureAction({
          id: response.model?.id || 0,
          image_path: response.filePath || '',
        })
        if (success) imageModalRef.value?.closeModal()
      } else {
        const signatureToUpdate = signatureRows.value.find(
          (s) => s.id === selectedRow.value?.id
        )
        if (signatureToUpdate) {
          signatureToUpdate.image_path = response.filePath || ''
        }
        imageModalRef.value?.closeModal()
      }
    }
  }

  const handleRejectedFiles = (fileRejected: QRejectedEntry[]) => {
    if (fileRejected[0]?.failedPropValidation === 'accept')
      showAlert('¡Tipo de archivo no permitido!', 'error')
    else if (fileRejected[0]?.failedPropValidation === 'duplicate')
      showAlert('¡Este archivo ya ha sido añadido!', 'error')
  }

  const handleOptions = async (option: string, id?: number) => {
    if (option === 'edit') handleEditRow(id || 0)
    else if (option === 'delete') handleDeleteRow(id || 0)
  }

  const handleAddRow = async () => {
    const rows = inventoryRows.value

    const generatedCode = await _generateCodeAction('INF')

    rows.push({
      id: getMaxId(rows) + 1,
      code_report: generatedCode.code || '',
      name_report: '',
    })

    updateTableProperties()
  }

  const handleEditRow = (id: number) => {
    switch (props.tabActive) {
      case 'logo':
        selectedRow.value = logoRows.value.find((row) => row.id === id)
        break
      case 'signatures':
        selectedRow.value = signatureRows.value.find((row) => row.id === id)

        if (selectedRow.value?.name !== fullName) {
          showAlert('Solo puedes editar tu propia firma.', 'warning')
          return
        }
        break
    }

    imageModalRef.value?.openModal()
  }

  const handleDeleteRow = async (id: number) => {
    switch (props.tabActive) {
      case 'logo': {
        const rowToDelete = logoRows.value.find((row) => row.id === id)
        if (!rowToDelete) {
          showAlert('El logo no fue encontrado.', 'warning')
          return
        }

        if (props.action === 'edit') {
          await _deleteLogoAction(id)
        }
        logoRows.value = logoRows.value.filter((row) => row.id !== id)

        break
      }

      case 'signatures': {
        const rowToDelete = signatureRows.value.find((row) => row.id === id)
        if (!rowToDelete) {
          showAlert('La firma no fue encontrada.', 'warning')
          return
        }

        if (rowToDelete.name !== fullName) {
          showAlert('Solo puedes eliminar tu propia firma.', 'warning')
          return
        }

        if (props.action === 'edit') {
          await _deleteSignatureAction(id)
        }
        signatureRows.value = signatureRows.value.filter((row) => row.id !== id)

        break
      }

      case 'inventory': {
        inventoryRows.value = inventoryRows.value.filter((row) => row.id !== id)
        break
      }

      default:
        showAlert('No se pudo eliminar la fila. Pestaña no válida.', 'error')
        return
    }

    updateTableProperties()
  }

  const getFilteredColumns = (columns: QTable['columns']) =>
    isView.value ? columns?.filter((col) => col.name !== 'actions') : columns

  const updateTableProperties = () => {
    const config = tableConfigs[props.tabActive as keyof typeof tableConfigs]
    if (!config) return

    tableProperties.value.title = config.title
    tableProperties.value.columns = getFilteredColumns(config.columns)

    let rows

    if (props.tabActive === 'logo') rows = logoRows.value
    else if (props.tabActive === 'signatures') rows = signatureRows.value
    else rows = inventoryRows.value

    tableProperties.value.rows = rows
  }

  const isCurrentTableComplete = (): boolean => {
    let rows: ILogoTable[] | ISignatureTable[] | IInventoryTable[] = []

    switch (props.tabActive) {
      case 'logo':
        rows = logoRows.value
        return rows.every((row) => row.app_name && row.entity)

      case 'signatures':
        rows = signatureRows.value
        return rows.every((row) => row.position && row.name)

      case 'inventory':
        rows = inventoryRows.value
        return rows.length > 0 && rows.every((row) => row.name_report)

      default:
        return false
    }
  }

  const isView = computed(() => ['view'].includes(props.action))

  watch(isView, () => updateTableProperties())

  watch(
    () => props.tabActive,
    () => updateTableProperties(),
    { immediate: true }
  )

  watch(
    () => props.data,
    () => loadData(),
    { immediate: true, deep: true }
  )

  return {
    isView,
    logoRows,
    showUpload,
    isRowActive,
    uploadProps,
    selectedRow,
    handleAddRow,
    alertModalRef,
    imageModalRef,
    signatureRows,
    inventoryRows,
    handleOptions,
    openAlertModal,
    handleAddFiles,
    tableProperties,
    alertModalConfig,
    handleChangeStatus,
    defaultIconsLucide,
    informationFormRef,
    handleRejectedFiles,
    isCurrentTableComplete,
  }
}

export default useInformationForm
