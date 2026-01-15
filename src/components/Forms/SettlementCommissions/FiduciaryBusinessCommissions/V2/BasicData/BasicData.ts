import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ActionType } from '@/interfaces/global'
import { IFiduciaryBusinessCommissionsFormV2 } from '@/interfaces/customs/settlement-commissions/FiduciaryBusinessCommissionsV2'
import { IAccountingParameterOption } from '@/interfaces/customs/resources/Settlement-commissions'

// Composables
import { useRules, useUtils } from '@/composables'

//Constants
import {
  commissionTypeMap,
  CommissionConfigKeyCode,
} from '@/constants/resources/settlement-commisssion'

// Stores
import { useSettlementCommissionsResourceStore } from '@/stores/resources-manager/settlement-commissions'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useBasicDataForm = (
  props: {
    action: ActionType
    data: IFiduciaryBusinessCommissionsFormV2 | null
  },
  emit: Function
) => {
  const {
    is_required,
    max_length,
    only_number,
    only_number_with_max_integers_and_decimals,
    percentage_between,
    only_number_with_decimals,
  } = useRules()

  const {
    commission_types,
    third_party_billings,
    accounting_parameters,
    billing_trusts,
    calculation_bases,
  } = storeToRefs(useSettlementCommissionsResourceStore('v1'))

  const { business_trusts_value_is_code } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )

  const { _getResources } = useResourceManagerStore('v1')
  const { formatCurrencyString, isEmptyOrZero } = useUtils()

  const formElementRef = ref()

  const initialModelsValues: IFiduciaryBusinessCommissionsFormV2 = {
    business_trust_id: null,
    business_id: null,
    start_date: null,

    commission_type_id: null,
    commission_class_catalog_name: null,
    commission_type_catalog_name: null,
    observation: null,
    description: null,
    calculation_type: null,
    minimum_wage_amount: 1423500,
    fixed_value: null,
    base_commission_amount: null,
    commission_percentage: null,
    colllection: null,
    code_movement: null,
    periodicity: null,

    billing_trust_id: null,
    start_date_period: null,
    end_date_period: null,
    generate_iva: null,
    iva: null,
    generated_source: null,
    source_percentage: null,
    generated_ica: null,
    ica_percentage: null,
    generated_network_iva: null,
    network_iva_percentage: null,
    third_party_billings_id: null,
    business_code: null,
    commission_transaction: null,
    count_salaries: null,
    accounting_parameters_id: null,
    count_transaction: null,
    billing_trust_label: null,
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const _setValueModel = () => {
    if (!props.data) return
    Object.assign(models.value, props.data)
  }

  const opsCalculationTypes = computed(() => {
    const selectedType = commission_types.value.find(
      (ct) => ct.value === models.value.commission_type_id
    )

    if (!selectedType) return []

    const { code } = selectedType

    const configKey = String(code) as CommissionConfigKeyCode

    const allowedTypes = commissionTypeMap[configKey] || []

    return calculation_bases.value
      .filter((option) => allowedTypes.includes(option.value))
      .sort((a, b) => a.label.localeCompare(b.label))
  })

  const clearDataOnChangeTypeCalculation = () => {
    if (
      !models.value.count_salaries &&
      !models.value.base_commission_amount &&
      !models.value.colllection
    ) {
      models.value.count_salaries = null
      models.value.base_commission_amount = null
      models.value.colllection = null
    }
  }

  const resetCommissionFields = () => {
    models.value.calculation_type = null
    models.value.commission_percentage = null
    models.value.commission_transaction = null
    models.value.count_transaction = null
    models.value.count_salaries = null
    models.value.fixed_value = null
    models.value.colllection = null
    models.value.description = null
    models.value.observation = null
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
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  watch(
    () => models.value.business_trust_id,
    (val, oldVal) => {
      if (val === oldVal) return

      const selectedBusiness = business_trusts_value_is_code.value.find((bt) => bt.value === val)

      if (selectedBusiness) {
        models.value.start_date = selectedBusiness?.start_date ?? null
        models.value.business_id = selectedBusiness?.id ?? null
      } else {
        models.value = { ...initialModelsValues }
        emit('update:data', null)
      }
    },
    { immediate: props.action === 'edit' }
  )

  watch(
    () => models.value.commission_type_id,
    (val, oldVal) => {
      if (val === oldVal) return

      const selectedType = commission_types.value.find((ct) => ct.value === val)

      if (!selectedType) {
        resetCommissionFields()
        models.value.commission_class_catalog_name = null
        models.value.commission_type_catalog_name = null
        return
      }

      if (oldVal) {
        resetCommissionFields()
      }

      models.value.commission_class_catalog_name =
        selectedType?.commission_class_catalog?.name || null

      models.value.commission_type_catalog_name =
        selectedType?.commission_type_catalog?.name || null
    },
    { immediate: props.action === 'edit' }
  )

  const calculateBaseAmount = (
    val: IFiduciaryBusinessCommissionsFormV2
  ): number | null => {
    const type = val.calculation_type
    if (type === 'smmlv') {
      return Number(val.minimum_wage_amount) * Number(val.count_salaries)
    }
    if (type === 'vf') {
      return Number(val.fixed_value)
    }

    return null
  }

  watch(
    () => models.value.calculation_type,
    (val) => {
      if (!val) return
      clearDataOnChangeTypeCalculation()
    }
  )

  const applyBillingTrustData = (billingTrust?: IAccountingParameterOption) => {
    const bt = billingTrust?.billing_trust
    models.value.code_movement = billingTrust?.business_movement_name_snapshot ?? null

    Object.assign(models.value, {
      periodicity: bt?.periodicity ?? null,
      start_date_period: bt?.start_date ?? null,
      end_date_period: bt?.end_date ?? null,
      generate_iva: billingTrust?.generates_iva ? 'si' : billingTrust?.generates_iva === undefined ? null : 'no',
      iva: billingTrust?.iva ? Number(billingTrust?.iva) : null,
      generated_source: billingTrust?.has_retefuente ? 'si' : billingTrust?.has_retefuente === undefined ? null : 'no',
      source_percentage: billingTrust?.retefuente ? Number(billingTrust?.retefuente) : null,
      generated_ica: billingTrust?.has_reteica ? 'si' : billingTrust?.has_reteica === undefined ? null : 'no',
      ica_percentage: billingTrust?.reteica ? Number(billingTrust?.reteica) : null,
      generated_network_iva: billingTrust?.has_reteiva ? 'si' : billingTrust?.has_reteiva === undefined ? null : 'no',
      network_iva_percentage: billingTrust?.reteiva ? Number(billingTrust?.reteiva) : null,
    })
  }

  const syncBillingTrustData = () => {
    const selectedBillingTrust = accounting_parameters.value.find(
      (bt) => bt.billing_trusts_id === models.value.billing_trust_id
    )

    applyBillingTrustData(selectedBillingTrust as IAccountingParameterOption)
  }

  watch(
    () => models.value,
    async (val) => {
      if (!val) return
      if (val.calculation_type) {
        const baseAmount = calculateBaseAmount(val)
        if (baseAmount !== null) {
          val.base_commission_amount = baseAmount
        }
      }
    },
    { deep: true }
  )

  watch(
    () => [models.value.business_trust_id, models.value.business_id],
    async ([businessTrustId, businessId], [oldBusinessTrustId, oldBusinessId]) => {
      if (businessTrustId === oldBusinessTrustId && businessId === oldBusinessId) return
      if (!businessTrustId || !businessId) return

      await Promise.all([
        _getResources(
          { settlement_commissions: ['third_party_billings'] },
          `filter[business_code_snapshot]=${businessTrustId}`
        ),
        _getResources(
          { settlement_commissions: ['billing_trusts'] },
          `business_id=${businessId}`
        ),
      ])
    },
    { deep: true }
  )

  watch(
    () => models.value.billing_trust_id,
    async (val) => {
      if (val) {
        await _getResources(
          { settlement_commissions: ['accounting_parameters'] },
          `filter[billing_trusts_id]=${val}`
        )
      }

      syncBillingTrustData()
    },
    { deep: true }
  )

  return {
    formElementRef,
    models,
    is_required,
    max_length,
    business_trusts_value_is_code,
    opsCalculationTypes,
    formatCurrencyString,
    commission_types,
    third_party_billings,
    accounting_parameters,
    billing_trusts,
    only_number,
    only_number_with_max_integers_and_decimals,
    percentage_between,
    only_number_with_decimals,
  }
}

export default useBasicDataForm
