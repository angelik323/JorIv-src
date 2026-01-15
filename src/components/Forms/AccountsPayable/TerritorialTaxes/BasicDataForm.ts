// Vue - Pinia
import { ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ActionType } from '@/interfaces/global'
import {
  ITerritorialTaxesForm,
  ITerritorialTaxesItem,
} from '@/interfaces/customs/accounts-payable/TerritorialTaxes'

// Composables
import { useUtils, useRules } from '@/composables'

// Stores
import { useAccountsPayableResourceStore } from '@/stores/resources-manager/accounts-payable'
import { useThirdPartyResourceStore } from '@/stores/resources-manager/third-party'
import { useTerritorialTaxesStoreV1 } from '@/stores/accounts-payable/territorial-taxes/territorial-taxes-v1'

const useBasicDataForm = (props: {
  data?: ITerritorialTaxesItem | null
  action: ActionType
}) => {
  const { isEmptyOrZero } = useUtils()
  const { is_required } = useRules()

  const { settlement_concept, ica_activity_statuses } = storeToRefs(
    useAccountsPayableResourceStore('v1')
  )
  const { cities, third_parties } = storeToRefs(
    useThirdPartyResourceStore('v1')
  )

  const basicDataFormRef = ref()

  const { _setFormData } = useTerritorialTaxesStoreV1()

  const models = ref<{
    settlement_concept_id: number | null
    city_id: number | null
    third_party_id: number | null
    status_id: number | null
    liquidation_concept_description: string
    city_description: string
    beneficiary_description: string
  }>({
    settlement_concept_id: null,
    city_id: null,
    third_party_id: null,
    status_id: null,
    liquidation_concept_description: '-',
    city_description: '-',
    beneficiary_description: '-',
  })

  const isEditMode = computed(() => props.action === 'edit')

  const nameFromLabel = (label: string) => {
    const s = String(label ?? '')
    const sep = ' - '
    const i = s.indexOf(sep)
    const onlyName = i >= 0 ? s.slice(i + sep.length) : s
    return onlyName.toUpperCase()
  }

  watch(
    () => models.value.settlement_concept_id,
    (val) => {
      const label =
        settlement_concept.value.find((o) => o.value === val)?.label ?? '-'
      models.value.liquidation_concept_description = label.toUpperCase()
    }
  )

  watch(
    () => models.value.city_id,
    (val) => {
      const label = cities.value.find((o) => o.value === val)?.label ?? '-'
      models.value.city_description = nameFromLabel(label)
    }
  )

  watch(
    () => models.value.third_party_id,
    (val) => {
      const label =
        third_parties.value.find((o) => o.value === val)?.label ?? '-'
      models.value.beneficiary_description = nameFromLabel(label)
    }
  )

  const setFormEdit = () => {
    if (!props.data) return
    const d = props.data
    models.value.settlement_concept_id = d.settlement_concept?.id ?? null
    models.value.city_id = d.city?.id ?? null
    models.value.third_party_id = d.third_party?.id ?? null
    models.value.status_id = d.status?.id ?? null
  }

  watch(
    () => models.value,
    (val) => {
      const payload: ITerritorialTaxesForm = {
        settlement_concept_id: val.settlement_concept_id,
        city_id: val.city_id,
        third_party_id: val.third_party_id,
      }

      if (isEditMode.value) {
        payload.status_id = val.status_id
      }

      const isEmpty = isEmptyOrZero(val as unknown as Record<string, unknown>)
      _setFormData(isEmpty ? null : payload)
    },
    { deep: true }
  )

  watch(
    () => props.data,
    (v) => v && setFormEdit(),
    { immediate: true }
  )

  return {
    basicDataFormRef,
    models,
    settlement_concepts: settlement_concept,
    cities,
    third_parties,
    ica_activity_statuses,
    isEditMode,

    // rules
    is_required,
  }
}

export default useBasicDataForm