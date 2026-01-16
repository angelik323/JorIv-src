import { ref, computed } from 'vue'
import axios, { CancelTokenSource } from 'axios'

//Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import {
  IFiduciaryBusinessCommissionsFileItem,
  IFiduciaryBusinessCommissionsFileResponseError,
} from '@/interfaces/customs/settlement-commissions/FiduciaryBusinessCommissionsV2'

import {
  useAlert,
  useMainLoader,
  useUtils,
  useGoToUrl,
} from '@/composables'

//Stores
import { useFiduciaryBusinessCommissionsStore } from '@/stores/settlement-commissions/fiduciary-business-commissions'

const useFiduciaryBusinessCommissionsImport = () => {
  const { defaultIconsLucide } = useUtils()

  // imports
  const { openMainLoader } = useMainLoader()
  const { showAlert } = useAlert()
  const { goToURL } = useGoToUrl()

  const {
    _getFormatExcel,
    _bulkUploadFiduciaryBusinessCommissions,
    _exportErrorFile,
  } = useFiduciaryBusinessCommissionsStore('v2')

  // refs
  const attachDocumentRef = ref()
  const progressValue = ref(0)
  const statusImport = ref(false)
  const alertModalRef = ref()
  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '¿Desea eliminar el documento?',
    statusId: null as number | null,
    showBtnConfirm: true,
    showBtnCancel: true,
    showCloseBtn: true,
  })
  const cancelTokenSource = ref<CancelTokenSource | null>(null)
  const url_file = ref(
    {
      url: '',
      name: '',
    }
  )


  // props
  const headerProps = {
    title: 'Cargar comisiones',
    subtitle: '',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Contabilidad',
        route: '',
      },
      {
        label: 'Plan de cuentas',
        route: 'ChartAccountsList',
      },
      {
        label: 'Crear',
        route: 'ChartAccountsCreate',
      },
      {
        label: 'Importar',
        route: 'ChartAccountsImport',
      },
    ],
  }

  const uploadProps = {
    title: 'Cargar archivo',
    styleCustom: 'width: 100%',
    labelBtn: 'Seleccione el archivo para subir',
    multiple: false,
    bordered: false,
    accept: '.xlsx',
  }

  const tableProps = ref<IBaseTableProps<IFiduciaryBusinessCommissionsFileItem>>({
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
        name: 'name',
        required: false,
        label: 'Nombre',
        align: 'left',
        field: 'name',
        sortable: true,
      },
      {
        name: 'total',
        required: false,
        label: 'Total de registros',
        align: 'center',
        field: 'total',
        sortable: true,
      },

      {
        name: 'status',
        required: false,
        label: 'Estado de cargue',
        align: 'center',
        field: () => '',
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: () => '',
      },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })

  const hasFileLoaded = computed(() => tableProps.value.rows.length > 0)

  const addedFiles = async (files: File[]) => {
    if (cancelTokenSource.value) {
      cancelTokenSource.value.cancel('Nueva carga iniciada')
    }

    cancelTokenSource.value = axios.CancelToken.source()

    const file = files[0]
    progressValue.value = 0

    tableProps.value.rows = [
      {
        id: Date.now(),
        name: file.name,
        total: 0,
        status: 'LOADING',
      },
    ]

    await uploadFile(file)

  }

  const uploadFile = async (file: File) => {
    try {
      await changeBarNumber(70)

      if (!cancelTokenSource.value) return;

      const formData = new FormData()
      formData.append('file', file)

      const response = await _bulkUploadFiduciaryBusinessCommissions(
        formData,
        cancelTokenSource.value.token
      )

      if (!cancelTokenSource.value) return

      await changeBarNumber(100)
      progressValue.value = 1

      if (response.success) {
        if (tableProps.value.rows.length > 0) {
          tableProps.value.rows[0].status = 'SUCCESS'
          tableProps.value.rows[0].total = response.data.created_count
        }
        showAlert(response.message, 'success')
      }
    } catch (error) {
      const errorResponse = (error as IFiduciaryBusinessCommissionsFileResponseError).response

      if (axios.isCancel(error)) {
        tableProps.value.rows = []
        progressValue.value = 0
      } else {
        showAlert('Error al cargar el archivo', 'error')

        if (tableProps.value.rows.length > 0) {
          tableProps.value.rows[0].status = 'ERROR'

          url_file.value = {
            url: errorResponse?.data?.data?.error_file_url,
            name: errorResponse?.data?.data?.error_filename,
          }
        }
      }
    } finally {
      cancelTokenSource.value = null
    }
  }

  const changeBarNumber = (targetPercentage: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      let current = progressValue.value * 100

      const interval = setInterval(() => {
        if (!cancelTokenSource.value) {
          clearInterval(interval)
          reject(new axios.Cancel('CANCELLED'))
          return;
        }

        if (current >= targetPercentage) {
          clearInterval(interval)
          resolve()
          return
        }

        current++
        progressValue.value = current / 100
      }, 50)
    })
  }

  const deleteFiles = async () => {
    await alertModalRef.value.openModal()
  }

  const downloadTemplateExcel = async () => {
    await _getFormatExcel()
  }

  const downloadResponseExcel = async () => {
    const blob = await _exportErrorFile(url_file.value?.name)

    if (!blob) return

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'errores_cargue_comisiones.xlsx'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    openMainLoader(false)
  }

  const onSubmit = async () => {
    alertModalConfig.value = {
      title: 'Creando comisiones... este proceso puede tardar unos segundos',
      description: 'Por favor, espere mientras se cargan y procesan los datos. No cierre esta pàgina.',
      statusId: null,
      showBtnConfirm: false,
      showBtnCancel: false,
      showCloseBtn: false,
    }

    await alertModalRef.value.openModal()

    setTimeout(() => {
      goToURL('BusinessTrustCommissionsList')
      openMainLoader(false)
    }, 3000)
  }

  const handleDeleteFile = async () => {
    if (cancelTokenSource.value) {
      cancelTokenSource.value.cancel('Archivo eliminado por el usuario');
      cancelTokenSource.value = null;
    }

    await alertModalRef.value.closeModal();
    attachDocumentRef.value?.removeFilesRemote();
    tableProps.value.rows = [];
    progressValue.value = 0;
  }

  return {
    headerProps,
    uploadProps,
    attachDocumentRef,
    tableProps,
    progressValue,
    statusImport,
    defaultIconsLucide,
    addedFiles,
    deleteFiles,
    onSubmit,
    downloadTemplateExcel,
    downloadResponseExcel,
    hasFileLoaded,
    alertModalRef,
    alertModalConfig,
    handleDeleteFile,
    goToURL,
  }
}

export default useFiduciaryBusinessCommissionsImport
