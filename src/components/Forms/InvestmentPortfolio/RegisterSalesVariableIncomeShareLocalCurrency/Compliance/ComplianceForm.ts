import { ref, watch } from 'vue'
import { QForm } from 'quasar'
import { IComplianceForm, CommissionBase } from '@/interfaces/customs'
import { storeToRefs } from 'pinia'
import { useInvestmentPortfolioResourceStore } from '@/stores'
import { useUtils } from '@/composables'

const useComplianceForm = () => {
  const { round2, round6, cleanCurrencyDotOnly } = useUtils()

  const complianceFormRef = ref<QForm | null>(null)

  const commissionBase = ref<CommissionBase>(null)
  const commissionInput = ref<number | null>(null)

  const { oldest_unit_value_by_emitter, available_titles_by_emitter } =
    storeToRefs(useInvestmentPortfolioResourceStore('v1'))

  const formData = ref<IComplianceForm>({
    purchase_unit_value: null,
    available_units_by_issuer: null,
    sale_quantity: null,
    sale_unit_value: null,
    sale_value: null,
    commission_value: null,
    total_operation_value: null,
    profit_or_loss_value: null,
  })

  const resetForm = () => {
    formData.value = {
      purchase_unit_value: null,
      available_units_by_issuer: null,
      sale_quantity: null,
      sale_unit_value: null,
      sale_value: null,
      commission_value: null,
      total_operation_value: null,
      profit_or_loss_value: null,
    } as IComplianceForm

    commissionBase.value = null
    commissionInput.value = null
  }

  const recalc = () => {
    const qty = cleanCurrencyDotOnly(formData.value.sale_quantity ?? 0)
    const unitSale = cleanCurrencyDotOnly(formData.value.sale_unit_value ?? 0)
    const unitPurchase = cleanCurrencyDotOnly(
      formData.value.purchase_unit_value ?? 0
    )

    const sale = round2(qty * unitSale)
    formData.value.sale_value = sale

    let commission = 0
    const hasCommission =
      commissionBase.value !== null && commissionInput.value !== null

    if (hasCommission) {
      if (commissionBase.value === 'Porcentaje') {
        const pct =
          (cleanCurrencyDotOnly(commissionInput.value ?? 0) || 0) / 100
        commission = round2(sale * pct)
      } else if (commissionBase.value === 'Valor de unidad') {
        commission = round2(
          cleanCurrencyDotOnly(commissionInput.value ?? 0) || 0
        )
      }
    } else {
      commission = 0
    }
    formData.value.commission_value = commission

    formData.value.total_operation_value = round2(sale + commission)

    const pnl = qty * (unitSale - unitPurchase)
    formData.value.profit_or_loss_value = round6(pnl)
  }

  watch(
    () => [
      formData.value.sale_quantity,
      formData.value.sale_unit_value,
      formData.value.purchase_unit_value,
      commissionBase.value,
      commissionInput.value,
    ],
    recalc,
    { immediate: true }
  )

  const setPurchaseUnitValue = (
    issuerCounterpartyId: number | null,
    classAction: string | null
  ) => {
    if (!issuerCounterpartyId || !classAction) {
      formData.value.purchase_unit_value = null
      return
    }

    const match = oldest_unit_value_by_emitter.value.find(
      (item) =>
        item.issuers_counterparty_id === Number(issuerCounterpartyId) &&
        item.action_class === classAction
    )

    formData.value.purchase_unit_value = match ? Number(match.unit_value) : null
  }

  const setAvailableUnitsByIssuerFromEmitter = (
    issuerCounterpartyId: number | null,
    classAction: string | null
  ) => {
    if (!issuerCounterpartyId || !classAction) {
      formData.value.available_units_by_issuer = null
      return
    }

    const match = available_titles_by_emitter.value.find(
      (item) =>
        item.issuers_counterparty_id === Number(issuerCounterpartyId) &&
        item.action_class === classAction
    )

    formData.value.available_units_by_issuer = match
      ? Number(match.available_balance)
      : null
  }

  const setAvailableUnitsByIssuer = (value: number | null) => {
    formData.value.available_units_by_issuer = value
  }

  const setCommissionFromEmitter = (
    commission_base_bool: boolean | null | undefined,
    percentage_or_fixed_value: number | string | null | undefined
  ) => {
    const hasBase = typeof commission_base_bool === 'boolean'
    const val =
      percentage_or_fixed_value === null ||
      percentage_or_fixed_value === undefined
        ? null
        : Number(percentage_or_fixed_value)
    const hasValue = typeof val === 'number' && !Number.isNaN(val)

    if (!hasBase || !hasValue) {
      commissionBase.value = null
      commissionInput.value = null
      return
    }

    commissionBase.value = commission_base_bool
      ? 'Porcentaje'
      : 'Valor de unidad'
    commissionInput.value = val
  }

  const setCommissionParams = (base: CommissionBase, value: number | null) => {
    commissionBase.value = base
    commissionInput.value = value
  }

  return {
    complianceFormRef,
    formData,
    oldest_unit_value_by_emitter,
    available_titles_by_emitter,
    setAvailableUnitsByIssuerFromEmitter,
    resetForm,
    recalc,
    setPurchaseUnitValue,
    setAvailableUnitsByIssuer,
    setCommissionFromEmitter,
    setCommissionParams,
  }
}

export default useComplianceForm
