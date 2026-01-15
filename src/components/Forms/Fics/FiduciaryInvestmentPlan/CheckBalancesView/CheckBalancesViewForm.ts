// Vue - Vue Router - Pinia - Quasar
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Interfaces
import { ActionType } from '@/interfaces/global'
import {
  IFicCheckBalancesView,
  IFicCheckBalancesViewPropsForm,
  IFicCheckBalancesViewReturnsBaseRow,
} from '@/interfaces/customs/fics/FiduciaryInvestmentPlans'

// Composables
import { useGoToUrl, useUtils } from '@/composables'

// Stores
import { useFiduciaryInvestmentPlanStore } from '@/stores/fics/fiduciary-investment-plan'

const useCheckBalancesViewForm = (props: IFicCheckBalancesViewPropsForm) => {
  const {
    check_balances_basic_data_form,
    check_balances_by_date_form,
    field_last_closing_date,
  } = storeToRefs(useFiduciaryInvestmentPlanStore('v1'))
  const route = useRoute()
  const searchId = +route.params.id
  const { _exportExcelCheckBalancesView, _getByIdCheckBalancesByDate } =
    useFiduciaryInvestmentPlanStore('v1')

  const { goToURL } = useGoToUrl()
  const { formatCurrencyString } = useUtils()

  const formInformation = ref()
  const alertModalRef = ref()
  const tableProps = ref<{
    title: string
    loading: boolean
    rows: IFicCheckBalancesViewReturnsBaseRow[]
    columns: QTable['columns']
  }>({
    title: 'Ver rendimiento por base',
    loading: false,
    rows: [],
    columns: [
      {
        name: 'description',
        required: true,
        label: 'Tipo de base',
        align: 'left',
        field: 'description',
        sortable: false,
      },
      {
        name: 'attach',
        required: true,
        label: 'Saldo rendimiento',
        align: 'center',
        field: 'attach',
        sortable: false,
      },
    ],
  })

  const models = ref<IFicCheckBalancesView>({
    available_balance: '',
    cancelation_control: '',
    clearing_balance: null,
    fiduciary_investment_plan: '',
    freeze_balance: '',
    fund_code: '',
    fund_name: '',
    last_closing_date: '',
    created_at: '',
    plan_balance: '',
    reserved_balance: '',
    returns: '',
    business: '',
    participation_type: '',
    gmf: null,
    retention: null,
    penalty: null,
    net_with_tax: null,
    net_without_tax: null,
    account_holder_name: '',
    business_plan: '',
    participation_type_plan: '',
  })

  const handleGoBack = () =>
    goToURL('FiduciaryInvestmentPlanList', undefined, { reload: true })
  const handleGoControl = () =>
    goToURL('CheckBalancesControlView', undefined, { reload: true })
  const handleGoMovements = () =>
    goToURL('CheckBalancesPlanList', searchId, { reload: true })

  const openAlertModal = async () => {
    await alertModalRef.value.openModal()
  }
  const closeAlertModal = async () => {
    await alertModalRef.value.closeModal()
  }

  const formatCurrency = (data: string | number) => formatCurrencyString(data)

  const handlerActionForm = (action: ActionType) => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: setFormView,
      edit: setFormView,
      view: setFormView,
    }
    actionHandlers[action]?.()
  }

  const clearBalanceFields = () => {
    models.value.plan_balance = ''
    models.value.cancelation_control = ''
    models.value.reserved_balance = ''
    models.value.clearing_balance = null
    models.value.freeze_balance = ''
    models.value.available_balance = ''
    models.value.returns = ''

    models.value.gmf = null
    models.value.retention = null
    models.value.penalty = null
    models.value.net_with_tax = null
    models.value.net_without_tax = null
    models.value.business_plan = ''
    models.value.participation_type_plan = ''

    tableProps.value.rows = []
  }
  const setFormDataByData = () => {
    const data = check_balances_by_date_form.value
    if (data) {
      models.value.plan_balance = data.plan_balance ?? ''
      models.value.cancelation_control = data.cancelation_control ?? ''
      models.value.reserved_balance = data.reserved_balance ?? ''
      models.value.clearing_balance = data.clearing_balance ?? null
      models.value.freeze_balance = data.freeze_balance ?? ''
      models.value.available_balance = data.available_balance ?? ''
      models.value.returns = data.returns ?? ''

      models.value.gmf = data.taxes?.gmf ?? null
      models.value.retention = data.taxes?.retention ?? null
      models.value.penalty = data.taxes?.penalty ?? null
      models.value.net_with_tax = data.taxes?.net_with_tax ?? null
      models.value.net_without_tax = data.taxes?.net_without_tax ?? null
      models.value.business_plan = data.taxes?.business_trust
        ? `${data.taxes?.business_trust?.business_code} - ${data.taxes?.business_trust?.name}`
        : ''
      models.value.participation_type_plan =
        data.taxes?.participation_type ?? ''

      if (data.returns_bases) {
        tableProps.value.rows = Object.entries(data.returns_bases)
          .map(([key, value]) => {
            const baseNumber =
              key === 'base25' ? 2.5 : Number(key.replace('base', ''))
            return {
              description: String(baseNumber),
              attach: value != null ? value : '-',
              sortKey: baseNumber,
            }
          })
          .sort((a, b) => a.sortKey - b.sortKey)
      }
    } else {
      clearBalanceFields()
    }
  }
  const setFormData = () => {
    const data = check_balances_basic_data_form.value
    if (data) {
      models.value.fund_code = data.fund_code ?? ''
      models.value.fund_name = data.fund_name ?? ''
      models.value.business = data.business_trust?.business_code
        ? `${data.business_trust?.business_code} - ${data.business_trust?.name}`
        : ''
      models.value.fiduciary_investment_plan = data.plan_code ?? ''
      models.value.account_holder_name = data.holder?.document
        ? `${data.holder?.document} - ${data.holder?.name}`
        : ''
      models.value.participation_type = data.participation_type ?? ''

      models.value.last_closing_date = data.last_closing_date
        ? data.last_closing_date
        : data.operation_start_date
        ? data.operation_start_date
        : ''

      field_last_closing_date.value = data.last_closing_date
        ? data.last_closing_date
        : data.operation_start_date
        ? data.operation_start_date
        : ''
    }
  }

  const exportExcel = async () => {
    await _exportExcelCheckBalancesView(
      false,
      searchId,
      `date_query=${models.value.last_closing_date}`
    )
  }

  const setFormView = () => setFormData()

  onMounted(async () => {
    handlerActionForm(props.action)
  })

  watch(
    () => check_balances_basic_data_form.value,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    }
  )

  watch(
    () => models.value.last_closing_date,
    async (val, _oldVal) => {
      if (val) {
        field_last_closing_date.value = val
        await _getByIdCheckBalancesByDate(searchId, `date_query=${val}`)
        setFormDataByData()
      } else {
        field_last_closing_date.value = ''
        clearBalanceFields()
      }
    }
  )

  return {
    check_balances_by_date_form,
    formInformation,
    alertModalRef,
    tableProps,
    models,
    handleGoMovements,
    closeAlertModal,
    handleGoControl,
    openAlertModal,
    formatCurrency,
    handleGoBack,
    exportExcel,
  }
}

export default useCheckBalancesViewForm
