import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ActionType } from '@/interfaces/global'
import { IBusinessTrustsCommissionsWithBusiness } from '@/interfaces/customs/resources/Settlement-commissions'
import {
  ICommissionCalculationFormV2,
  ICommissionCalculationResponseV2,
} from '@/interfaces/customs/settlement-commissions/CommissionCalculationV2'

// Constants
import { calculation_types } from '@/constants/resources'
import {
  commissionTypeMap2,
  CommissionConfigKey,
} from '@/constants/resources/settlement-commisssion'

// Composables
import { useMainLoader, useRules, useUtils } from '@/composables'

// Stores
import { useSettlementCommissionsResourceStore } from '@/stores/resources-manager/settlement-commissions'
import { useCommissionCalculationStore } from '@/stores/settlement-commissions/commission-calculation'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useBasicDataForm = (
  props: {
    action: ActionType
    data: ICommissionCalculationFormV2 | null
  },
  emit: Function
) => {
  const { is_required, max_length, only_number } = useRules()

  const {
    commission_types,
    third_party_billings,
    billing_trusts,
    business_trusts_commissions_with_business,
  } = storeToRefs(useSettlementCommissionsResourceStore('v1'))

  const { openMainLoader } = useMainLoader()

  const { _getByIdCommissionCalculation } = useCommissionCalculationStore('v2')

  const { formatCurrencyString, isEmptyOrZero, formatCodeName } = useUtils()

  const { _getResources } = useResourceManagerStore('v1')

  const formElementRef = ref()

  const opsCommisionTypes = ref<{ label: string; value: number }[]>([])

  const initialModelsValues: Partial<ICommissionCalculationFormV2> = {
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

    business_trust_commission_id: null,
    commission_class_catalog_id: null,
    commission_type_catalog_id: null,
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

    const { commission_class_catalog_id } = selectedType

    const configKey = String(commission_class_catalog_id) as CommissionConfigKey

    const allowedTypes = commissionTypeMap2[configKey] || []

    return calculation_types
      .filter((option) => allowedTypes.includes(option.value))
      .map((option) => ({
        ...option,
        label:
          option.label.charAt(0).toUpperCase() +
          option.label.slice(1).toLowerCase(),
        value:
          option.value.charAt(0).toUpperCase() +
          option.value.slice(1).toLowerCase(),
      }))
  })

  // Sincroniza el modelo con la prop 'data'
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
      // Evita bucle infinito
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  const updateBusinessTrustId = async (
    val: IBusinessTrustsCommissionsWithBusiness
  ) => {
    opsCommisionTypes.value = []

    clearForm({
      business_trust_id: val?.value ?? null,
      start_date: val?.commissions?.[0]?.start_date ?? null,
      business_trust_commission_id: null,
    })

    if (!val) return

    opsCommisionTypes.value =
      val?.commissions?.map((item) => ({
        label: formatCodeName(item.code, item.name),
        value: item.business_trust_commissions_id,
      })) || []
  }

  const clearForm = (keep: Partial<ICommissionCalculationFormV2> = {}) => {
    Object.assign(models.value, {
      ...initialModelsValues,
      ...keep,
    })
  }

  watch(
    () => models.value.business_trust_id,
    async (val) => {
      if (!val) return
      await _getResources(
        { settlement_commissions: ['billing_trusts'] },
        `business_id=${val}`
      )
    }
  )

  watch(
    [
      () => models.value.business_trust_id,
      () => models.value.business_trust_commission_id,
    ],
    async ([businessTrustId, commissionTypeId]) => {
      if (!businessTrustId || !commissionTypeId) {
        clearForm({
          business_trust_id: models.value.business_trust_id,
          start_date: models.value.start_date,
          business_trust_commission_id:
            models.value.business_trust_commission_id,
        })
        return
      }
      if (['view', 'edit'].includes(props.action)) return

      openMainLoader(true)

      const result = await _getByIdCommissionCalculation(
        commissionTypeId as number
      )

      if (result) {
        const commissionData = result as ICommissionCalculationResponseV2

        const relationships = commissionData.relationships
        const business_trust_commission =
          commissionData.business_trust_commission
        const calculation = business_trust_commission?.calculation
        const accounting_parameters = relationships?.accounting_parameters

        Object.assign(models.value, {
          ...commissionData,
          business_trust_commission_id: business_trust_commission?.id,
          commission_class_catalog_name:
            relationships?.commission_class_catalog?.name,
          commission_class_catalog_id:
            relationships?.commission_class_catalog?.id,
          commission_type_catalog_name:
            relationships?.commission_type_catalog?.name,
          commission_type_catalog_id:
            relationships?.commission_type_catalog?.id,
          colllection: business_trust_commission?.collection,
          observation: business_trust_commission?.observation,
          description: business_trust_commission?.description,
          calculation_type: calculation?.calculation_type,
          minimum_wage_amount: Number(calculation?.minimum_wage_amount),
          base_commission_amount: Number(calculation?.base_commission_amount),
          commission_percentage: Number(calculation?.commission_percentage),
          commission_transaction: Number(calculation?.commission_transaction),
          count_salaries: Number(calculation?.count_salaries),
          count_transaction: Number(calculation?.count_transaction),
          fixed_value: Number(calculation?.fixed_value),

          billing_trust_id: business_trust_commission?.billing_trust_id,

          periodicity: business_trust_commission?.periodicity
            ? business_trust_commission?.periodicity
            : relationships?.billing_trust?.periodicity,
          start_date_period: relationships?.billing_trust?.start_date,
          end_date_period: relationships?.billing_trust?.end_date,

          third_party_billings_id:
            relationships?.third_party_billing?.id ?? null,
          code_movement:
            relationships?.accounting_parameters
              ?.business_movement_name_snapshot,
          generate_iva: accounting_parameters?.generates_iva ? 'Si' : 'No',
          iva: Number(accounting_parameters?.iva ?? 0),
          generated_source: accounting_parameters?.has_retefuente ? 'Si' : 'No',
          source_percentage: Number(accounting_parameters?.retefuente ?? 0),
          generated_ica: accounting_parameters?.has_reteica ? 'Si' : 'No',
          ica_percentage: Number(accounting_parameters?.reteica ?? 0),
          generated_network_iva: accounting_parameters?.has_reteiva
            ? 'Si'
            : 'No',
          network_iva_percentage: Number(accounting_parameters?.reteiva ?? 0),
        })
      }
      openMainLoader(false)
    }
  )

  return {
    formElementRef,
    models,
    is_required,
    max_length,
    opsCalculationTypes,
    formatCurrencyString,
    third_party_billings,
    billing_trusts,
    business_trusts_commissions_with_business,
    opsCommisionTypes,
    only_number,

    updateBusinessTrustId,
  }
}

export default useBasicDataForm
