// Vue - pinia
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IBaseTableProps, ITabs } from '@/interfaces/global'
import {
  IErrorsOnValidate,
  IVoucherManagementUpdateForm,
} from '@/interfaces/customs/accounting/VoucherManagement'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useVoucherManagementStore } from '@/stores/accounting/voucher-management'

const useVoucherManagementUpdate = () => {
  const { defaultIconsLucide } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const { headerPropsDefault } = storeToRefs(useVoucherManagementStore('v1'))
  const { _updateVoucher, _validateVoucher, _exportXlsxErrors } =
    useVoucherManagementStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const headerProperties = {
    ...headerPropsDefault.value,
    title: 'Actualización de comprobantes',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Actualización de comprobantes',
        route: 'VoucherManagementUpdate',
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
    title: 'Resultado del proceso',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: 'index',
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
        name: 'voucher_id',
        required: true,
        label: 'Número de comprobante',
        align: 'left',
        field: 'voucher_id',
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
        field: (row) => row.errors.join(', '),
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

  const voucherManagementFormRef = ref()

  const tabActive = ref('')
  const tabActiveIdx = ref(
    tabs.findIndex((tab) => tab.name === tabActive.value)
  )

  const validateForms = async () => {
    if (tabActive.value === 'basic_data') {
      return await voucherManagementFormRef.value?.validateForm()
    }

    return true
  }

  const keys = {
    accounting: ['accounting_account_structures'],
  }

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keys, '', 'v2')
    tabActive.value = tabs[0].name
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    keys.accounting.push(
      'business_trusts_with_description_by_account_structure'
    )
    _resetKeys(keys)
  })

  const isSuccessValidate = ref<boolean | undefined>(undefined)

  const textForFieldProcessRealized = computed(() => {
    if (isSuccessValidate.value === undefined) {
      return '-'
    }
    return isSuccessValidate.value ? 'Actualizados' : 'Con novedades'
  })

  const onSubmit = async () => {
    if (!(await validateForms())) return

    const data_basic_data =
      voucherManagementFormRef.value?.getValues() as IVoucherManagementUpdateForm

    const payload = {
      ...data_basic_data,
      from_business_trust_id: data_basic_data.from_business_trust_code ?? '',
      to_business_trust_id: data_basic_data.to_business_trust_code ?? '',
    }

    openMainLoader(true)
    const responseValidation = await _validateVoucher(payload)
    isSuccessValidate.value = responseValidation.success

    if (isSuccessValidate.value) {
      tableErrorsProps.value.rows = []
      const createValidationPayload = {
        ...data_basic_data,
        businesses: responseValidation.data[0],
      }
      if (await _updateVoucher(createValidationPayload)) {
        goToURL('VoucherManagementList')
      }
    } else {
      tableErrorsProps.value.rows = responseValidation.data.map(
        (error, index) => ({
          ...error,
          index: index + 1,
        })
      ) as IErrorsOnValidate[]
    }
    openMainLoader(false)
  }

  const downloadAction = async () => {
    openMainLoader(true)
    await _exportXlsxErrors(
      tableErrorsProps.value.rows,
      'Comprobantes_con_novedades'
    )
    openMainLoader(false)
  }

  // Computed property to check if download button should be disabled
  const isDownloadDisabled = computed(() => {
    // Check if table has data
    const hasTableData =
      tableErrorsProps.value.rows && tableErrorsProps.value.rows.length > 0

    return !hasTableData
  })

  return {
    headerProperties,
    tabs,
    tabActive,
    tabActiveIdx,
    voucherManagementFormRef,
    textForFieldProcessRealized,
    tableErrorsProps,
    defaultIconsLucide,
    isDownloadDisabled,
    downloadAction,
    goToURL,
    onSubmit,
  }
}

export default useVoucherManagementUpdate
