// vue - quasar
import { ref } from 'vue'
import { QTable } from 'quasar'

// interfaces
import { IVariableUpload } from '@/interfaces/customs/normative/CertifiedParameters'

// composables
import { useAlert } from '@/composables/useAlert'
import { useUtils } from '@/composables/useUtils'

const useUploadVariablesForm = () => {
  const MAX_FILE_SIZE_MB = 5
  const { showAlert } = useAlert()
  const { defaultIconsLucide } = useUtils()

  const signatureRef = ref()
  const waterMarkRef = ref()
  const logoRef = ref()
  const progressSignatureValue = ref(0)
  const progressWaterMarkValue = ref(0)
  const progressLogoValue = ref(0)

  const models = ref<IVariableUpload>({
    signature: null,
    watermark: null,
    logo: null,
  })

  const uploadProps = {
    styleCustom: 'width: 100%;',
    labelBtn: 'Seleccione las imágenes para subir',
    multiple: false,
    bordered: false,
    accept: '.jpg, .png, .jpeg',
  }

  const UploadLogoTableProps = ref({
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'item',
        required: false,
        label: 'Item',
        align: 'left',
        field: 'item',
        sortable: true,
      },
      {
        name: 'name',
        required: false,
        label: 'Nombre',
        align: 'left',
        field: 'name',
        sortable: true,
      },
      {
        name: 'status_id',
        required: false,
        label: 'Estado de cargue',
        align: 'center',
        field: 'status_id',
        sortable: true,
        style: {
          'max-width': '300px',
          'min-width': '300px',
          'word-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: [] as {
      id: number
      item: string
      name: string
      status_id: number
      actions?: string
    }[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const UploadSignatureTableProps = ref({
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'item',
        required: false,
        label: 'Item',
        align: 'left',
        field: 'item',
        sortable: true,
      },
      {
        name: 'name',
        required: false,
        label: 'Nombre',
        align: 'left',
        field: 'name',
        sortable: true,
      },
      {
        name: 'status_id',
        required: false,
        label: 'Estado de cargue',
        align: 'center',
        field: 'status_id',
        sortable: true,
        style: {
          'max-width': '300px',
          'min-width': '300px',
          'word-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: [] as {
      id: number
      item: string
      name: string
      status_id: number
      actions?: string
    }[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const UploadWaterMarkTableProps = ref({
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'item',
        required: false,
        label: 'Item',
        align: 'left',
        field: 'item',
        sortable: true,
      },
      {
        name: 'name',
        required: false,
        label: 'Nombre',
        align: 'left',
        field: 'name',
        sortable: true,
      },
      {
        name: 'status_id',
        required: false,
        label: 'Estado de cargue',
        align: 'center',
        field: 'status_id',
        sortable: true,
        style: {
          'max-width': '300px',
          'min-width': '300px',
          'word-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: [] as {
      id: number
      item: string
      name: string
      status_id: number
      actions?: string
    }[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const isFileTooLarge = (sizeMB: number): boolean => {
    return sizeMB > MAX_FILE_SIZE_MB
  }

  const handleLargeFile = (fieldName: string) => {
    showAlert(
      `¡El archivo de ${fieldName} supera el tamaño máximo permitido (5mb)!`,
      'error'
    )
  }

  const rejectedFiles = (fileRejected: { failedPropValidation?: string }[]) => {
    if (fileRejected[0]?.failedPropValidation === 'accept')
      showAlert(
        '¡Tipo de archivo no permitido! Solo se permiten imágenes.',
        'error'
      )
    if (fileRejected[0]?.failedPropValidation === 'duplicate')
      showAlert('¡Este archivo ya ha sido añadido!', 'error')
  }

  const changeBarNumber = (
    targetPercentage: number,
    fileType: 'signature' | 'watermark' | 'logo'
  ): Promise<void> => {
    return new Promise((resolve) => {
      const progressMap = {
        signature: progressSignatureValue,
        watermark: progressWaterMarkValue,
        logo: progressLogoValue,
      }

      const progressRef = progressMap[fileType]
      let current = progressRef.value * 100

      const interval = setInterval(() => {
        if (current >= targetPercentage) {
          clearInterval(interval)
          resolve()
          return
        }
        current++
        progressRef.value = current / 100
      }, 50)
    })
  }

  const handleSignatureFiles = async (files: File[]) => {
    const newFileSizeMB = files[0].size / (1024 * 1024)

    if (isFileTooLarge(newFileSizeMB)) {
      handleLargeFile('Firma')
      return
    }
    models.value.signature = files[0]

    UploadSignatureTableProps.value.rows = [
      {
        id: 1,
        item: 'Firma',
        name: files[0].name,
        status_id: 20, // Estado cargando
      },
    ]

    await changeBarNumber(80, 'signature')

    const statusId = 29
    UploadSignatureTableProps.value.rows[0].status_id = statusId

    if (statusId === 29) {
      progressSignatureValue.value = 1
    }
  }

  const handleWaterMarkFiles = async (files: File[]) => {
    const newFileSizeMB = files[0].size / (1024 * 1024)

    if (isFileTooLarge(newFileSizeMB)) {
      handleLargeFile('Marca de agua')
      return
    }
    models.value.watermark = files[0]

    UploadWaterMarkTableProps.value.rows = [
      {
        id: 1,
        item: 'Marca de agua',
        name: files[0].name,
        status_id: 20,
      },
    ]

    await changeBarNumber(80, 'watermark')

    const statusId = 29
    UploadWaterMarkTableProps.value.rows[0].status_id = statusId

    if (statusId === 29) {
      progressWaterMarkValue.value = 1
    }
  }

  const handleLogoFiles = async (files: File[]) => {
    const newFileSizeMB = files[0].size / (1024 * 1024)

    if (isFileTooLarge(newFileSizeMB)) {
      handleLargeFile('Logo')
      return
    }
    models.value.logo = files[0]

    UploadLogoTableProps.value.rows = [
      {
        id: 1,
        item: 'Logo',
        name: files[0].name,
        status_id: 20,
      },
    ]

    await changeBarNumber(80, 'logo')

    const statusId = 29
    UploadLogoTableProps.value.rows[0].status_id = statusId

    if (statusId === 29) {
      progressLogoValue.value = 1
    }
  }

  const deleteSignatureFiles = () => {
    models.value.signature = null
    UploadSignatureTableProps.value.rows = []
    progressSignatureValue.value = 0
    signatureRef.value?.removeFilesRemote()
  }

  const deleteWaterMarkFiles = () => {
    models.value.watermark = null
    UploadWaterMarkTableProps.value.rows = []
    progressWaterMarkValue.value = 0
    waterMarkRef.value?.removeFilesRemote()
  }

  const deleteLogoFiles = () => {
    models.value.logo = null
    UploadLogoTableProps.value.rows = []
    progressLogoValue.value = 0
    logoRef.value?.removeFilesRemote()
  }

  const getFiles = () => {
    return { ...models.value }
  }

  const validateForm = (): boolean => {
    if (
      !models.value.signature &&
      !models.value.watermark &&
      !models.value.logo
    ) {
      showAlert(
        'Debe seleccionar al menos una imagen para continuar',
        'warning'
      )
      return false
    }
    return true
  }

  return {
    signatureRef,
    waterMarkRef,
    logoRef,
    models,
    progressSignatureValue,
    progressWaterMarkValue,
    progressLogoValue,

    uploadProps,
    UploadWaterMarkTableProps,
    UploadLogoTableProps,
    UploadSignatureTableProps,

    handleSignatureFiles,
    handleWaterMarkFiles,
    handleLogoFiles,

    deleteSignatureFiles,
    deleteWaterMarkFiles,
    deleteLogoFiles,

    rejectedFiles,
    validateForm,
    getFiles,
    defaultIconsLucide,
  }
}

export default useUploadVariablesForm
