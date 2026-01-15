// vue - router - quasar
import { ref, watch } from 'vue'

// Interfeaces
import { IAccountingSettingsInformationFormV2 } from '@/interfaces/customs/settlement-commissions/AccountingSettingsV2'
import { IBillingTrustByBusinessCodeResource } from '@/interfaces/customs/resources/Settlement-commissions'
import { ActionType } from '@/interfaces/global/Action'
import { IResource } from '@/interfaces/global'

// Composables
import { useRules, useUtils } from '@/composables'
import { storeToRefs } from 'pinia'

// Stores
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useSettlementCommissionsResourceStore } from '@/stores/resources-manager/settlement-commissions'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useBasicDataForm = (
  props: {
    action: ActionType
    data: IAccountingSettingsInformationFormV2 | null
  },
  emit: Function
) => {
  const { movement_codes_parameters } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )

  const {
    periodicities,
    billing_trusts_by_business_code,
    business_trusts_billing_trusts,
  } = storeToRefs(useSettlementCommissionsResourceStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { is_required, max_length } = useRules()
  const { isEmptyOrZero } = useUtils()

  const formElementRef = ref()

  const initialModelsValues: IAccountingSettingsInformationFormV2 = {
    accounts: null,

    business_code_snapshot: null,
    billing_trusts_id: null,

    start_date: null,
    end_date: null,

    generates_iva: null,
    has_retefuente: null,
    has_reteica: null,
    has_reteiva: null,

    iva: null,
    retefuente: null,
    reteica: null,
    reteiva: null,

    business_movement_code_snapshot: null,
    business_movement_name_snapshot: null,
    business_movement_id_snapshot: null,
    business_movement_nature_snapshot: null,

    periodicity: null,
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const _setValueModel = () => {
    if (!props.data) return
    Object.assign(models.value, props.data)
  }

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

  watch(
    () => models.value?.business_code_snapshot,
    async (val, oldVal) => {
      if (val === oldVal) return

      if (val) {
        await _getResources(
          { settlement_commissions: ['billing_trusts_by_business_code'] },
          `business_code_snapshot=${val}`
        )
        await _getResources(
          {
            trust_business: ['movement_codes'],
            // `filter[business_trust_id]=${val}`
          },
          'filter[movement]=Comisión'
        )
      } else {
        _resetKeys({
          settlement_commissions: ['billing_trusts_by_business_code'],
          trust_business: ['movement_codes_parameters'],
        })
      }
    },
    { immediate: props.action === 'edit' }
  )

  const onBusinessChange = async (val: IResource) => {
    if (val?.value) {
      Object.assign(models.value, {
        ...initialModelsValues,
        business_code_snapshot: val.value,
      })
    } else {
      Object.assign(models.value, { ...initialModelsValues })
    }
  }

  const onBillingTrustsChange = (val: IBillingTrustByBusinessCodeResource) => {
    models.value.billing_trusts_id = val?.value ?? null
    models.value.periodicity = val?.periodicity ?? null
    models.value.start_date = val?.start_date ?? null
    models.value.end_date = val?.end_date ?? null
  }

  const onBusinessMovementCodeChange = (val: IResource) => {
    models.value.business_movement_id_snapshot = val?.value ?? null

    models.value.business_movement_code_snapshot = val?.code ?? null
    models.value.business_movement_name_snapshot = val?.label ?? null
    models.value.business_movement_nature_snapshot = val?.nature ?? null
    models.value.generates_iva = val?.has_ganerate_accounting ? 'si' : 'no'
    models.value.accounts = val?.has_ganerate_accounting ? 'si' : 'no'
    models.value.iva = val?.percentage_iva ?? '0'
    models.value.has_retefuente = 'no'
    models.value.retefuente = '0'
    models.value.has_reteica = 'no'
    models.value.reteica = '0'
    models.value.has_reteiva = 'no'
    models.value.reteiva = '0'
  }

  return {
    formElementRef,
    models,
    is_required,
    max_length,
    business_trusts_billing_trusts,
    movement_codes_parameters,
    periodicities,
    billing_trusts_by_business_code,

    onBusinessChange,
    onBillingTrustsChange,
    onBusinessMovementCodeChange,
  }
}

export default useBasicDataForm
