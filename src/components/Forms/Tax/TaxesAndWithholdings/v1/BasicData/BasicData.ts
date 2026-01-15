import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Store
import { useTaxResourceStore } from '@/stores/resources-manager/tax'
import { useInvestmentPortfolioResourceStore } from '@/stores/resources-manager/investment-portfolio'

// Interfaces
import { ActionType } from '@/interfaces/global'
import { ITaxesAndWithholdingsForm } from '@/interfaces/customs/tax/TaxesAndWithholdings'

// Composables
import { useUtils, useRules } from '@/composables'

// Constants
import {
  tax_ambits,
  dian_tax_base,
  tax_calculations,
  tax_rounding_modes,
} from '@/constants/resources/tax'

const useInformationForm = (
  props: {
    action: ActionType
    data: ITaxesAndWithholdingsForm | null
  },
  emits: Function
) => {
  const { tax_types, dian_tax_types, jurisdictions } = storeToRefs(
    useTaxResourceStore('v1')
  )
  const { coins } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))
  const formInformationRef = ref()

  const initialModelsValues: ITaxesAndWithholdingsForm = {
    name: null,
    tax_type_id: null,
    dian_tax_type_id: null,
    jurisdiction_id: null,
    ambit: null,
    dian_tax_base: null,
    calculation: null,
    rate_percentage: null,
    base_value: null,
    rounding_step: null,
    rounding_mode: null,
    currency_code: null,
    legal_notes: null,
    invoice_label: null,
    observations: null,
    manage_periods: null,
    valid_from: null,
    valid_to: null,
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const _setValueModel = () => {
    if (!props.data) return
    models.value = { ...props.data }
  }

  const update_tax_type = (val: number | null) => {
    models.value.tax_type_id = val || null

    if (val && tax_types.value) {
      const data = tax_types.value.find((e) => e.value === val)
      models.value.tax_sign = data?.sign
      models.value.tax_scope = data?.scope
      models.value.tax_usage = data?.usage
    } else {
      models.value.tax_sign = null
      models.value.tax_scope = null
      models.value.tax_usage = null
    }
  }

  const update_currency = (val: number | null) => {
    models.value.currency_code =
      coins.value.find((e) => e.value === val)?.code ?? null
  }

  watch(
    () => props.data,
    (val) => {
      if (!val) return
      _setValueModel()
    },
    { deep: true, immediate: true }
  )

  watch(
    models,
    (val) => {
      emits('update:data', useUtils().isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  watch(
    () => tax_types.value,
    (val) => {
      if (
        val.length > 0 &&
        models.value.tax_type_id != null &&
        props.action !== 'create'
      ) {
        update_tax_type(models.value.tax_type_id)
      }
    },
    { immediate: true }
  )

  return {
    models,
    formInformationRef,
    rules: useRules(),
    tax_types,
    dian_tax_types,
    jurisdictions,
    coins,
    tax_ambits,
    dian_tax_base,
    tax_calculations,
    tax_rounding_modes,
    update_tax_type,
    update_currency,
  }
}

export default useInformationForm
