// core
import { ref, onMounted, watch, computed, onBeforeUnmount } from 'vue'
import { QTable } from 'quasar'

// stores
import { storeToRefs } from 'pinia'
import {
  useAccountingResourceStore,
  useAccoutingReportStore,
  useOpeningRecordStore,
  useResourceManagerStore,
} from '@/stores'

// interfaces y constantes
import {
  IAccountingReportModel,
  IOpeningRecord,
  IOpeningRecordModel,
  ReportTypes,
} from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'

// utils
import { defaultIconsLucide, fullName } from '@/utils'
import { useUtils, useMainLoader } from '@/composables'

const useAccoutingReportForm = (
  props: {
    action: ActionType
    data?: IOpeningRecordModel
  },
  emits: Function
) => {
  const utils = useUtils()
  const { openMainLoader } = useMainLoader()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const {
    structure_levels_report,
    business_trusts_basic,
    amount_types,
    accounts_by_structure,
    structure_by_business,
    template,
  } = storeToRefs(useAccountingResourceStore('v1'))

  const financial = useAccoutingReportStore(
    'v1',
    'financial'
  ) as ReportTypes['financial']

  const { opening_bussines_list } = storeToRefs(useOpeningRecordStore('v1'))

  const keys = {
    accounting: ['business_trusts_basic', 'amount_types'],
  }

  const openingReportForm = ref()
  const isEdit = computed(() => props.action === 'edit')
  const selectedBusiness = ref()
  const showTable = ref(false)

  const defaultPeriod = computed(() => {
    if (selectedBusiness.value?.account?.current_period) {
      return useUtils().formatDate(
        selectedBusiness.value.account.current_period,
        'YYYY-MM'
      )
    }
    return useUtils().formatDate(new Date().toISOString(), 'YYYY-MM')
  })

  const models = ref<IAccountingReportModel>({
    report_template_id: '',
    level: '',
    from_account: '',
    to_account: '',
    business_id: 0,
    account_structure_id: '',
    structure_by_business: 0,
    amount_type: '',
    from_period: '',
    to_period: '',
  })

  if (props.action === 'edit' && props.data) {
    models.value = { ...models.value, ...props.data }
  }

  const pagination = ref({
    page: 1,
    rowsPerPage: 5,
  })

  const validate = async () => {
    const result = await openingReportForm.value?.validate?.()
    return result
  }

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: IOpeningRecord[]
    pages: { currentPage: number; lastPage: number }
  }>({
    title: 'Listado de reporte financiero',
    loading: false,
    columns: [
      {
        name: 'account_code',
        label: 'Cuenta',
        field: 'account_code',
        sortable: true,
        style: 'width: 150px',
        align: 'center',
        headerStyle: 'text-align: center;',
      },
      {
        name: 'account_name',
        label: 'Nombre de la cuenta',
        field: 'account_name',
        sortable: true,
        style: 'width: 150px',
        align: 'center',
        headerStyle: 'text-align: center;',
      },
      {
        name: 'initial_balance',
        label: 'Saldo inicial',
        field: 'initial_balance',
        sortable: true,
        style: 'width: 150px',
        align: 'center',
        headerStyle: 'text-align: center;',
      },
      {
        name: 'debit',
        label: 'Débito',
        field: 'debit',
        sortable: true,
        style: 'width: 150px',
        align: 'center',
        format: (val) =>
          utils.formatCurrencyString(val, { currency: 'COP', locale: 'es-CO' }),
      },
      {
        name: 'credit',
        label: 'Crédito',
        field: 'credit',
        sortable: false,
        style: 'width: 150px',
        align: 'center',
        headerStyle: 'text-align: center;',
        format: (val) =>
          utils.formatCurrencyString(val, { currency: 'COP', locale: 'es-CO' }),
      },
      {
        name: 'total',
        label: 'Saldo final',
        field: 'total',
        sortable: false,
        style: 'width: 150px',
        align: 'center',
        headerStyle: 'text-align: center;',
        format: (val) =>
          utils.formatCurrencyString(val, { currency: 'COP', locale: 'es-CO' }),
      },
    ],

    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })

  const setFormData = () => {
    if (!props.data) return
  }

  const getFormData = () => {
    const data = JSON.parse(JSON.stringify(models.value))

    return data
  }

  onMounted(async () => {
    await _getResources(keys)
    _getResources({ accounting: ['template'] }, '', 'v2'), setFormData()
  })

  watch(
    () => models.value.business_id,
    async (newBusinessId) => {
      if (!newBusinessId) return

      const filters = `filter[business_id]=${newBusinessId}`

      await _getResources({ accounting: ['structure_by_business'] }, filters)

      models.value.account_structure_id = ''
      models.value.level = ''
      models.value.from_account = ''
      models.value.to_account = ''
    }
  )

  watch(
    () => models.value.account_structure_id,
    async (structureId) => {
      if (!structureId) return

      const filterAccounts = new URLSearchParams()
      filterAccounts.append('filter[account_structure_id]', String(structureId))
      await Promise.all([
        _getResources(
          { accounting: ['structure_levels'] },
          `filter[id]=${structureId}`,
          'v2'
        ),

        _getResources(
          { accounting: ['accounts_by_structure'] },
          filterAccounts.toString(),
          'v1'
        ),
      ])

      models.value.level = ''
      models.value.from_account = ''
      models.value.to_account = ''
    }
  )

  watch(
    () => props.data,
    () => setFormData()
  )

  watch(models, () => emits('update'), { deep: true })

  const handleContinue = async () => {
    openMainLoader(true)
    const filters = {
      business_trust_id: models.value.business_id,
      level: models.value.level,
      amount_type: models.value.amount_type,
      period: models.value.from_period,
      last_period: models.value.to_period,
      report_template_id: models.value.report_template_id,
      accounting_structure_id: models.value.account_structure_id,
    }

    const result = await financial._getComparativeStatementBalance(filters)
    openMainLoader(false)
    if (result) {
      emits('enable-preview-tab')
    }
  }

  const isFormValid = computed(() => {
    const m = models.value
    return (
      !!m.business_id &&
      !!m.level &&
      !!m.amount_type &&
      !!m.from_period &&
      !!m.to_period
    )
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  return {
    openingReportForm,
    models,
    isEdit,
    pagination,
    defaultIconsLucide,
    defaultPeriod,
    tableProps,
    business_trusts_basic,
    template,
    structure_by_business,
    structure_levels_report,
    amount_types,
    accounts_by_structure,
    fullName,
    selectedBusiness,
    isFormValid,
    opening_bussines_list,
    showTable,
    validate,
    handleContinue,
    getFormData,
  }
}

export default useAccoutingReportForm
