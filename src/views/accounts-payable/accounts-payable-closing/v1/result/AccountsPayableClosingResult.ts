// Vue - Pinia
import { onMounted, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ITabs, IBaseTableProps } from '@/interfaces/global'
import { IAccountsPayableClosingBusiness } from '@/interfaces/customs/accounts-payable/AccountsPayableClosing'

// Constants
import { ACCOUNTS_PAYABLE_CLOSING_ACTION_OPTIONS } from '@/constants/resources/accounts-payable-closing'

// Composables
import { useAlert, useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useAccountsPayableClosingStore } from '@/stores/accounts-payable/accounts-payable-closing'

// utils
import { downloadBlobXlsx } from '@/utils'

const useAccountsPayableClosingResult = () => {
  // hooks
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide, formatDate } = useUtils()
  const { showAlert } = useAlert()

  // stores
  const closingStore = useAccountsPayableClosingStore('v1')
  const { confirmation_data } = storeToRefs(closingStore)
  const { _createAction, _clearConfirmationData, _downloadErrorReport } =
    closingStore

  // refs
  const basicDataFormRef = ref()
  const businessTableRef = ref()
  const errorModalRef = ref()

  // computed
  const confirmationData = computed(() => confirmation_data.value)

  const hasErrors = computed(() => {
    return tableProps.value.rows.some(
      (business) => business.status_name === 'Con error'
    )
  })

  // props
  const headerProps = {
    title: 'Crear cierre de cuentas por pagar',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas por pagar', route: '' },
      { label: 'Cierre de negocios', route: 'AccountsPayableClosingList' },
      { label: 'Crear', route: 'AccountsPayableClosingCreate' },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const tableProps = ref<IBaseTableProps<IAccountsPayableClosingBusiness>>({
    title: 'Listado de negocios',
    loading: false,
    columns: [
      {
        name: 'id',
        label: '#',
        align: 'center',
        field: 'id',
        sortable: true,
      },
      {
        name: 'code',
        required: true,
        label: 'Código / Negocio',
        align: 'left',
        field: 'code',
        sortable: true,
      },
      {
        name: 'period',
        required: true,
        label: 'Periodo',
        align: 'left',
        field: 'period',
        sortable: true,
        format: (val: string) => {
          if (!val) return '-'
          return val.replace('-', '/')
        },
      },
      {
        name: 'closing_type',
        required: true,
        label: 'Tipo de cierre',
        align: 'left',
        field: 'closure_type',
        sortable: true,
      },
      {
        name: 'last_closure_date_business',
        required: true,
        label: 'Fecha último cierre',
        align: 'left',
        field: 'last_closure_date_business',
        sortable: true,
        format: (val: string) => (val ? formatDate(val, 'YYYY-MM-DD') : '-'),
      },
      {
        name: 'closure_date',
        required: true,
        label: 'Fecha de cierre',
        align: 'left',
        field: 'closure_date',
        sortable: true,
        format: (val: string) => (val ? formatDate(val, 'YYYY-MM-DD') : '-'),
      },
      {
        name: 'status_name',
        required: true,
        label: 'Estado',
        align: 'left',
        field: 'status_name',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  // methods
  const getActionLabel = (actionType: string) => {
    return (
      ACCOUNTS_PAYABLE_CLOSING_ACTION_OPTIONS.find(
        (option) => option.value === actionType
      )?.label ?? ''
    )
  }

  const makePayloadFromConfirmation = () => {
    if (!confirmationData.value) return []

    const { form, selectedBusinesses } = confirmationData.value
    const actionLabel = getActionLabel(form.action_type ?? '')

    return selectedBusinesses.map((business) => {
      return {
        closure_type: business.closure_type,
        last_closure_date_business: business.last_closure_date_business,
        closure_date: business.closure_date ?? '',
        period: business.period ?? '',
        action_type: business.action_type || actionLabel,
        business_name: business.business_name,
        business_code: String(business.business_code),
        business_trust_id: business.business_trust_id,
        status_id: business.status_id,
        error_description: business.error_description,
      }
    })
  }

  const handleCreate = async () => {
    if (!confirmationData.value) {
      showAlert('No hay datos de confirmación disponibles', 'error')
      goToURL('AccountsPayableClosingList')
      return
    }

    const payload = makePayloadFromConfirmation()

    if (!payload.length) {
      showAlert('No fue posible construir el payload de envío', 'error')
      return
    }

    openMainLoader(true)

    const success = await _createAction(payload)

    if (success) {
      const actionLabel = getActionLabel(
        confirmationData.value?.form.action_type ?? ''
      )

      const message =
        actionLabel === 'Crear cierre'
          ? '¡Cierres creados exitosamente!'
          : '¡Cierres revertidos exitosamente!'

      showAlert(message, 'success')
      _clearConfirmationData()
      goToURL('AccountsPayableClosingList')
    } else {
      errorModalRef.value?.openModal()
    }

    openMainLoader(false)
  }

  const handlePartialProcess = async () => {
    errorModalRef.value?.closeModal()
    _clearConfirmationData()
    goToURL('AccountsPayableClosingList')
  }

  const handleCancelPartialProcess = () => {
    errorModalRef.value?.closeModal()
  }

  const handleBackToFilters = () => {
    goToURL('AccountsPayableClosingCreate')
  }

  const handleResetAndBack = () => {
    _clearConfirmationData()
    goToURL('AccountsPayableClosingCreate')
  }

  const handleDownloadErrorReport = async () => {
    if (!confirmationData.value) return

    const errorBusinesses = confirmationData.value.selectedBusinesses.filter(
      (business) => business.status_name !== 'Exitoso'
    )

    if (!errorBusinesses.length) {
      showAlert('No hay errores para reportar', 'info')
      return
    }

    openMainLoader(true)

    const arrayBuffer = await _downloadErrorReport()
    if (arrayBuffer) {
      const fileName = 'Reporte_Error_Cierre_Negocios'
      const blob = new Blob([arrayBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      downloadBlobXlsx(blob, fileName)
      showAlert('Reporte descargado exitosamente', 'success')
    }

    openMainLoader(false)
  }

  // lifecycle
  onMounted(() => {
    if (!confirmationData.value) {
      showAlert(
        'No hay datos de confirmación. Redirigiendo al listado.',
        'warning'
      )
      goToURL('AccountsPayableClosingList')
      return
    }

    tableProps.value.rows = confirmationData.value.selectedBusinesses.map(
      (business) => {
        let statusId = 75 // Verificado por defecto

        if (business.error_description || business.status_name === 'Fallido') {
          statusId = 30 // Con error
        }

        return {
          ...business,
          status_id: statusId,
          status_name: statusId === 30 ? 'Con error' : 'Verificado',
        }
      }
    )
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    basicDataFormRef,
    businessTableRef,
    tableProps,
    confirmationData,
    hasErrors,
    handleCreate,
    handleDownloadErrorReport,
    handlePartialProcess,
    handleCancelPartialProcess,
    errorModalRef,
    goToURL,
    handleBackToFilters,
    handleResetAndBack,
    defaultIconsLucide,
  }
}

export default useAccountsPayableClosingResult
