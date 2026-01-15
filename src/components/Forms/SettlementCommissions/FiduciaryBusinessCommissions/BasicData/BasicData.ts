import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IFiduciaryBusinessCommissionsForm } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'

// Composables
import { useRules, useUtils } from '@/composables'

// Stores
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useSettlementCommissionsResourceStore } from '@/stores/resources-manager/settlement-commissions'

const useBasicDataForm = (
  props: {
    action: ActionType
    data: IFiduciaryBusinessCommissionsForm | null
  },
  emit: Function
) => {
  const { _getResources } = useResourceManagerStore('v1')
  const { is_required, max_length, only_alphanumeric } = useRules()
  const { isEmptyOrZero } = useUtils()

  const {
    commission_types,
    commissions_type_catalog,
    third_party_billings,
    periodicities,
  } = storeToRefs(useSettlementCommissionsResourceStore('v1'))

  const { business_trusts_value_is_code } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )

  const formElementRef = ref()

  const initialModelsValues: IFiduciaryBusinessCommissionsForm = {
    business_code: null,
    name: null,
    commission_class_catalog_id: null,
    commission_class_catalog_name: null,
    commission_type_catalog_id: null,
    commission_type_catalog_name: null,
    periodicity: null,
    colllection: null,
    iva: null,
    observation: null,
    third_party_billings_id: null,
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const handleBusinessCodeChange = (value: string) => {
    models.value.business_code = value

    const findBusiness = business_trusts_value_is_code.value.find(
      (item) => item.value === value
    )
    if (findBusiness) {
      models.value.name = findBusiness.name
    }
  }

  const handleBusinessNameChange = (value: string) => {
    models.value.name = value

    setTimeout(() => {
      const findBusiness = business_trusts_value_is_code.value.find(
        (item) => item.name === value
      )

      if (findBusiness) {
        models.value.business_code = String(findBusiness.value)
      } else {
        models.value.business_code = null
      }
    }, 1000)
  }

  const handleCommissionTypeChange = (value: number) => {
    models.value.commission_class_catalog_id = value

    const findClass = commission_types.value.find((item) => item.value === value)

    if (findClass) {
      models.value.commission_type_catalog_id = Number(
        findClass?.commission_type_catalog?.id
      )
      if (props.action === 'create')
        models.value.observation = findClass?.description || null
    }
  }

  const _setValueModel = () => {
    if (!props.data) return
    models.value = { ...props.data }
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
    () => models.value.business_code,
    async (val) => {
      if (props.action === 'create') models.value.third_party_billings_id = null

      if (!val) return

      await _getResources(
        {
          settlement_commissions: ['third_party_billings'],
        },
        'filter[business_code_snapshot]=' + val
      )
    },
    { immediate: true }
  )

  return {
    formElementRef,
    models,
    is_required,
    max_length,
    only_alphanumeric,
    business_trusts_value_is_code,
    third_party_billings,
    commission_types,
    commissions_type_catalog,
    periodicities,

    handleBusinessCodeChange,
    handleBusinessNameChange,
    handleCommissionTypeChange,
  }
}

export default useBasicDataForm
