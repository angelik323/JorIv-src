//Vue - Pinia
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'

//Interfaces
import {
  IReportTemplateListLogoItem,
  IReportTemplatePayloadLogoAndSignature,
  IReportTemplateSignatureItem,
} from '@/interfaces/customs/accounting/ReportTemplates'
import { IBaseTableProps } from '@/interfaces/global/Table'
import { IUploadedFile } from '@/interfaces/global/File'
import { SignatureActions } from '@/interfaces/global/Action'

//Composables
import { useUtils } from '@/composables/useUtils'
import { useAlert } from '@/composables/useAlert'

//Stores
import { useUserResourceStore } from '@/stores/resources-manager'
import { useReportTemplatesStore } from '@/stores/accounting/report-templates/'

//Aux constants
const MAX_FILE_SIZE_MB = 5

const useImagesData = (props: {
  action: SignatureActions | string
  data?: IReportTemplatePayloadLogoAndSignature
}) => {
  //Desestructure
  const { users } = storeToRefs(useUserResourceStore('v1'))
  const {
    _createReportTemplateLogo,
    _createReportTemplateSignature,
    _deleteReportTemplateLogo,
    _deleteReportTemplateSignature,
    _updateReportTemplateLogo,
    _getShowReportTemplateLogo,
    _getShowReportTemplateSignature,
  } = useReportTemplatesStore('v2')
  const { report_template_logo_response, report_template_signature_response } =
    storeToRefs(useReportTemplatesStore('v2'))

  //Utils
  const { showAlert } = useAlert()
  const { defaultIconsLucide } = useUtils()
  const isFileTooLarge = (sizeMB: number): boolean => sizeMB > MAX_FILE_SIZE_MB

  //Models for reference images
  const modelsReferenceImages = ref<{
    app_name?: string
    image_path?: string
    user_id?: number
  }>({
    app_name: '',
    image_path: '',
    user_id: undefined,
  })

  //UploadImage properties and methods
  const attachDocumentRef = ref()
  const uploadProps = {
    title: 'Cargar archivo',
    styleCustom: 'width: 100%',
    labelBtn: 'Seleccione la imágen a subir',
    multiple: false,
    bordered: false,
    accept: '[JPG, PNG, SVG]',
  }

  const validateImportFile = async (file?: IUploadedFile[]) => {
    if (!file) return

    const newFileSizeMB = file[0].size / (1024 * 1024)
    if (isFileTooLarge(newFileSizeMB)) {
      return
    }

    modelsReferenceImages.value.image_path = file[0].name
    const transformName = file[0].name.replaceAll(':', '/')
    modelsReferenceImages.value.image_path = transformName
    const payloadLogo = {
      app_name: modelsReferenceImages.value.app_name,
      image_path: modelsReferenceImages.value.image_path,
    }

    const payloadSignature = {
      image_path: modelsReferenceImages.value.image_path,
      user_id: modelsReferenceImages.value.user_id,
    }

    if (props.action === 'logo') {
      await _createReportTemplateLogo(payloadLogo)
    } else {
      await _createReportTemplateSignature(payloadSignature)
    }
  }
  const deleteFile = async (fileId: number) => {
    tablePropertiesLogo.value.rows = tablePropertiesLogo.value.rows.filter(
      (row) => row.id !== fileId
    )
    tablePropertiesSignature.value.rows =
      tablePropertiesSignature.value.rows.filter((row) => row.id !== fileId)
    attachDocumentRef.value?.removeFilesRemote()
    await _deleteReportTemplateLogo(fileId)
  }

  const rejectedFiles = (fileRejected: { failedPropValidation?: string }[]) => {
    if (fileRejected[0]?.failedPropValidation === 'accept')
      showAlert('¡Tipo de archivo no permitido!', 'error')
    if (fileRejected[0]?.failedPropValidation === 'duplicate')
      showAlert('¡Este archivo ya ha sido añadido!', 'error')
    deleteFiles()
  }
  const deleteFiles = () => {
    attachDocumentRef.value?.removeFilesRemote()
  }

  //Change switch status
  const modifyStatus = async (id: number) => {
    if (props.action === 'logo') {
      await _updateReportTemplateLogo(id)
    } else {
      await _deleteReportTemplateSignature(id)
    }
  }

  const tablePropertiesLogo = ref<IBaseTableProps<IReportTemplateListLogoItem>>(
    {
      title: 'Listado de logos',
      loading: false,
      wrapCells: true,
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
          name: 'name',
          required: false,
          label: 'Nombre',
          align: 'left',
          field: 'name',
          sortable: true,
        },
        {
          name: 'status',
          required: false,
          label: 'Estado',
          align: 'left',
          field: (row: IReportTemplateListLogoItem) => row.status?.status ?? '',
          sortable: true,
        },
        {
          name: 'actions',
          required: false,
          label: 'Acciones',
          align: 'center',
          field: 'id',
        },
      ],
      rows: [],
      pages: { currentPage: 1, lastPage: 1 },
    }
  )

  const tablePropertiesSignature = ref<
    IBaseTableProps<IReportTemplateSignatureItem>
  >({
    title: 'Listado de firmas',
    loading: false,
    wrapCells: true,
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
        name: 'user',
        required: false,
        label: 'Usuario',
        align: 'left',
        field: (row: IReportTemplateSignatureItem) => row.user.name,
        sortable: true,
      },
      {
        name: 'status',
        required: false,
        label: 'Estado',
        align: 'left',
        field: (row: IReportTemplateSignatureItem) => row.status.status,
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        align: 'center',
        field: 'id',
      },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })

  watch(
    () => report_template_logo_response.value,
    (newVal) => {
      if (!newVal) return
      tablePropertiesLogo.value.rows = [newVal]
    },
    { deep: true }
  )

  watch(
    () => report_template_signature_response.value,
    (newVal) => {
      if (!newVal) return
      tablePropertiesSignature.value.rows = [newVal]
    },
    { deep: true }
  )

  return {
    //
    uploadProps,
    tablePropertiesLogo,
    modelsReferenceImages,
    defaultIconsLucide,
    attachDocumentRef,
    tablePropertiesSignature,
    users,
    rejectedFiles,
    validateImportFile,
    deleteFile,
    deleteFiles,
    modifyStatus,
    _getShowReportTemplateLogo,
    _getShowReportTemplateSignature,
  }
}
export default useImagesData
