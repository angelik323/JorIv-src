// Vue - Pinia
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Utils
import { TIMEOUT_ALERT } from '@/constants/alerts'

// Interfaces
import { ActionType } from '@/interfaces/global'
import {
  IForeignExchangeSalesBuy,
  IForeignExchangeSalesView,
} from '@/interfaces/customs/investment-portfolio/ForeignExchangeSaleBuy'

// Composables
import { useUtils, useAlert } from '@/composables'

// Stores
import { useInvestmentPortfolioResourceStore } from '@/stores/resources-manager/investment-portfolio'
import { useForeignExchangeSalesStore } from '@/stores/investment-portfolio'
import { useTreasuryResourceStore } from '@/stores/resources-manager/treasury'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useForeignExchangeForm = (props: {
  action: ActionType
  id?: number
  hasLoadedData: boolean
  opType?: 'BUY' | 'SELL'
}) => {
  const { showAlert } = useAlert()

  const {
    operation_type,
    investment_portfolio,
    paper_types_form_parameters,
    coins,
    investment_portfolio_banks,
    issuer_counterparty_all,
  } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))

  const { bank_account } = storeToRefs(useTreasuryResourceStore('v1'))

  const { _getResources } = useResourceManagerStore('v1')

  const salesStore = useForeignExchangeSalesStore('v1')
  const { foreign_exchange_sales_detail } = storeToRefs(salesStore)

  const form = ref<
    Partial<IForeignExchangeSalesBuy & IForeignExchangeSalesView>
  >({
    investment_portfolio_id: undefined,
    investment_description: '',
    operation_type_id: undefined,
    operation_type_description: '',
    paper_type_id: undefined,
    origin_currency_id: undefined,
    destination_currency_id: undefined,
    origin_bank_id: undefined,
    origin_bank_account_id: undefined,
    destination_bank_id: undefined,
    destination_bank_account_id: undefined,
    issuer_counterparty_id: undefined,
    issuer_counterparty_description: '',
    profit_loss_sale: 0,
    operation_date: '',
    origin_amount: undefined,
    official_rate: undefined,
    negotiated_rate: undefined,
    description: '',
    type: 'SELL',
  })

  const foreignExchangeForm = ref()
  const isView = computed(() => props.action === 'view')

  const defaultOperationDate = computed<string>(() =>
    form.value.operation_date
      ? useUtils().formatDate(form.value.operation_date, 'YYYY-MM-DD')
      : useUtils().formatDate(new Date().toISOString(), 'YYYY-MM-DD')
  )

  const onSelectPortfolio = (portfolioId: number) => {
    form.value.investment_portfolio_id = portfolioId
  }

  const onSelectCounterparty = (counterpartyId: number) => {
    form.value.issuer_counterparty_id = counterpartyId
  }

  onMounted(() => {
    if (!form.value.operation_date)
      form.value.operation_date = defaultOperationDate.value
  })

  const validateForm = () => foreignExchangeForm.value?.validate()
  const getPayloadData = (): Partial<IForeignExchangeSalesBuy> => ({
    ...form.value,
    operation_date: useUtils().formatDate(
      form.value.operation_date ?? '',
      'YYYY-MM-DD'
    ),
  })

  const submit = async () => {
    const ok = await validateForm()
    if (!ok) {
      showAlert(
        'Revisa los campos obligatorios',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
      return
    }
    showAlert(
      'Registro preparado correctamente',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  }

  watch(
    () => form.value.investment_portfolio_id,
    async (pid) => {
      if (!pid) return
      const filters = `investment_portfolio_id=${pid}`
      await _getResources(
        { investment_portfolio: ['investment_portfolio_banks'] },
        filters
      )
    }
  )

  watch(
    [() => form.value.investment_portfolio_id, investment_portfolio],
    ([id]) => {
      const sel = (investment_portfolio.value ?? []).find(
        (i) => String(i.value ?? i.id) === String(id)
      )
      form.value.investment_description = sel?.description ?? sel?.name ?? ''
    },
    { immediate: true }
  )

  watch(
    () => form.value.operation_type_id,
    (id) => {
      const sel = (operation_type.value ?? []).find(
        (i) => String(i.value ?? i.id) === String(id)
      )
      form.value.operation_type_description =
        sel?.description ?? sel?.name ?? sel?.label ?? ''
    },
    { immediate: true }
  )

  watch(
    [() => form.value.issuer_counterparty_id, issuer_counterparty_all],
    ([id]) => {
      const idStr = id != null ? String(id) : ''
      const sel = (issuer_counterparty_all.value ?? []).find(
        (i) => String(i.value) === idStr
      )
      form.value.issuer_counterparty_description = sel?.label ?? ''
    },
    { immediate: true }
  )

  watch(
    () => form.value.origin_currency_id,
    (id) => {
      if (isView.value) return
      const sel = (coins.value ?? []).find(
        (i) => String(i.value) === String(id)
      )
      const rate =
        sel?.coin_value != null && sel?.coin_value !== ''
          ? Number(sel.coin_value)
          : 0
      form.value.origin_amount = isFinite(rate) ? rate : 0
      form.value.official_rate = isFinite(rate) ? rate : 0
    },
    { immediate: true }
  )

  onMounted(() => {
    form.value.type = (props.opType ?? 'SELL') as 'BUY' | 'SELL'
    if (!form.value.operation_date)
      form.value.operation_date = defaultOperationDate.value
  })

  const isBuy = computed(() => (props.opType ?? form.value.type) === 'BUY')
  const isSell = computed(() => (props.opType ?? form.value.type) === 'SELL')

  const destinationAmount = ref<number>(0)
  const destinationAmountDisplay = computed(() => destinationAmount.value)

  const recalcDerived = () => {
    if (isView.value) return
    const origin = Number(form.value.origin_amount ?? 0)
    const off = Number(form.value.official_rate ?? 0)
    const neg = Number(form.value.negotiated_rate ?? 0)
    if (isBuy.value) {
      destinationAmount.value = origin * (isFinite(neg) ? neg : 0)
    } else {
      form.value.profit_loss_sale =
        (isFinite(off) && isFinite(neg) ? off - neg : 0) *
        (isFinite(origin) ? origin : 0)
    }
  }

  watch(
    [
      () => form.value.origin_amount,
      () => form.value.official_rate,
      () => form.value.negotiated_rate,
      isBuy,
      isSell,
    ],
    recalcDerived,
    { immediate: true }
  )

  watch(
    () => props.opType,
    (val) => {
      form.value.type = (val ?? 'SELL') as 'BUY' | 'SELL'
      recalcDerived()
    },
    { immediate: true }
  )

  const applyViewData = (val: IForeignExchangeSalesView) => {
    if (!val) return

    form.value.id = val.id
    form.value.operation_date = val.operation_date
    form.value.operation_number = val.operation_number

    form.value.investment_portfolio_id = val.investment_portfolio_id
    form.value.investment_portfolio_code = val.investment_portfolio_code
    form.value.investment_description =
      val.investment_portfolio_description ?? ''

    form.value.operation_type_id = val.operation_type_id
    form.value.operation_type_code = val.operation_type_code
    form.value.operation_type_description = val.operation_type_description ?? ''

    form.value.origin_bank_id = val.origin_bank_id
    form.value.origin_bank_name = val.origin_bank_name
    form.value.destination_bank_id = val.destination_bank_id
    form.value.destination_bank_name = val.destination_bank_name

    form.value.origin_bank_account_name = val.origin_bank_account_name ?? ''
    form.value.destination_bank_account_name =
      val.destination_bank_account_name ?? ''

    form.value.issuer_counterparty_name = val.issuer_counterparty_name ?? ''
    form.value.issuer_counterparty_description =
      val.issuer_counterparty_name ?? ''

    form.value.paper_type_id = val.paper_type_id
    form.value.paper_type_code = val.paper_type_code

    form.value.status = val.status

    form.value.origin_currency_code = val.origin_currency_code
    form.value.destination_currency_code = val.destination_currency_code

    form.value.origin_amount = Number(val.origin_amount) || 0
    form.value.official_rate = Number(val.official_rate) || 0
    form.value.negotiated_rate = Number(val.negotiated_rate) || 0
    form.value.profit_loss_sale = Number(val.profit_loss) || 0

    form.value.type = (val.type ?? 'SELL') as 'BUY' | 'SELL'

    form.value.description = val.description ?? ''
  }

  watch(
    foreign_exchange_sales_detail,
    (val) => {
      if (isView.value && val)
        applyViewData(val as unknown as IForeignExchangeSalesView)
    },
    { immediate: true }
  )

  return {
    form,
    foreignExchangeForm,
    isView,
    defaultOperationDate,
    foreign_exchange_sales_detail,
    investment_portfolio,
    operation_type,
    paper_types_form_parameters,
    coins,
    investment_portfolio_banks,
    bank_account,
    issuer_counterparty_all,
    destinationAmountDisplay,
    onSelectPortfolio,
    onSelectCounterparty,
    isBuy,
    isSell,
    validateForm,
    getPayloadData,
    submit,
  }
}

export default useForeignExchangeForm
