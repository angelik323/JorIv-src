// Vue - pinia
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IBaseTableProps, ITabs } from '@/interfaces/global'
import {
  IErrorsOnValidate,
  IVoucherManagementView,
} from '@/interfaces/customs/accounting/VoucherManagement'

// Composables
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { useUtils } from '@/composables/useUtils'
import { useGoToUrl } from '@/composables/useGoToUrl'
import { useRouteValidator } from '@/composables/useRoutesValidator'

// Stores
import { useVoucherManagementStore } from '@/stores/accounting/voucher-management'
import { useRouter } from 'vue-router'

const createDefaultModels = (): IVoucherManagementView => ({
  id: 0,
  period_date: '',
  structure: '',
  from_business_trust_id: {
    id: 0,
    business_code: '',
    business_name: '',
  },
  to_business_trust_id: {
    id: 0,
    business_code: '',
    business_name: '',
  },
  daily_closing: false,
  update: '',
  day_to_update: '',
  needs_voucher: true,
  receipt_type_id: null,
  sub_receipt_type_id: null,
  status: {
    id: 0,
    status: '',
  },
  alerts: [],
})

const useVoucherManagementValidationView = () => {
  const { validateRouter } = useRouteValidator()
  const router = useRouter()
  const { defaultIconsLucide } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const models = ref<IVoucherManagementView>(createDefaultModels())

  const validationId = Number(router.currentRoute.value.params.id)

  const { headerPropsDefault } = storeToRefs(useVoucherManagementStore('v1'))
  const { _exportXlsxErrors, _getVoucherWithErrorsById } =
    useVoucherManagementStore('v1')

  const headerProperties = {
    ...headerPropsDefault.value,
    title: 'Ver validación de comprobantes',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Ver validación',
        route: 'VoucherManagementValidationView',
      },
      {
        label: validationId.toString(),
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'basic_data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ]

  const tableErrorsProps = ref<IBaseTableProps<IErrorsOnValidate>>({
    title: 'Listado de comprobantes errados',
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
        name: 'business_code',
        required: true,
        label: 'Código de negocio',
        align: 'left',
        field: 'business_code',
        sortable: true,
      },
      {
        name: 'business_name',
        required: true,
        label: 'Nombre del negocio',
        align: 'left',
        field: 'business_name',
        sortable: true,
      },
      {
        name: 'voucher_type',
        required: true,
        label: 'Número de comprobante',
        align: 'left',
        field: (row) => `${row.voucher_type} - ${row.voucher_type_name}`,
        sortable: true,
      },
      {
        name: 'voucher_sub_type',
        required: true,
        label: 'Número de sub comprobante',
        align: 'left',
        field: (row) =>
          `${row.voucher_sub_type} - ${row.voucher_sub_type_name}`,
        sortable: true,
      },
      {
        name: 'voucher_code',
        required: true,
        label: 'Número consecutivo',
        align: 'left',
        field: 'voucher_code',
        sortable: true,
      },
      {
        name: 'errors',
        required: true,
        label: 'Novedad',
        align: 'left',
        field: 'errors',
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'id',
      },
    ],
    rows: [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  const tabActive = ref('')
  const tabActiveIdx = ref(
    tabs.findIndex((tab) => tab.name === tabActive.value)
  )

  const downloadAction = async () => {
    openMainLoader(true)
    const payload = tableErrorsProps.value.rows.map((row) => ({
      ...row,
      voucher_code: row.voucher_code.toString(),
      voucher_sub_type: row.voucher_sub_type.toString(),
      voucher_type: row.voucher_type.toString(),
    }))
    await _exportXlsxErrors(payload)
    openMainLoader(false)
  }

  // Computed property to check if download button should be disabled
  const isDownloadDisabled = computed(() => {
    // Check if table has data
    const hasTableData =
      tableErrorsProps.value.rows && tableErrorsProps.value.rows.length > 0

    return !hasTableData
  })

  onMounted(async () => {
    openMainLoader(true)
    tabActive.value = tabs[0].name
    const voucherWithErrors = await _getVoucherWithErrorsById(validationId)
    tableErrorsProps.value.rows = voucherWithErrors?.alerts || []
    models.value = voucherWithErrors || createDefaultModels()
    openMainLoader(false)
  })

  return {
    models,
    headerProperties,
    tabs,
    tabActive,
    tabActiveIdx,
    isDownloadDisabled,
    defaultIconsLucide,
    tableErrorsProps,
    downloadAction,
    goToURL,
    validateRouter,
  }
}

export default useVoucherManagementValidationView
