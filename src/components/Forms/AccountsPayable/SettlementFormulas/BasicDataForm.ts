// Vue - pinia
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ISettlementFormulasForm } from '@/interfaces/customs/accounts-payable/SettlementFormulas'
import { ActionType } from '@/interfaces/global/Action'

// Composables
import { useUtils } from '@/composables'

//Store
import { useAccountsPayableResourceStore } from '@/stores/resources-manager/accounts-payable'
import { useAssetResourceStore } from '@/stores/resources-manager/assets'

const useBasicDataForm = (
  props: {
    data?: ISettlementFormulasForm | null
    action: ActionType
  },
  emit: Function
) => {
  const { isEmptyOrZero } = useUtils()

  const { settlement_concept, settlement_formula_person_types } = storeToRefs(
    useAccountsPayableResourceStore('v1')
  )

  const { fiscal_responsability } = storeToRefs(useAssetResourceStore('v1'))

  const basicDataFormRef = ref()

  const models = ref<ISettlementFormulasForm>({
    code: 0,
    person_type: '',
    fiscal_responsibility: '',
    name: '',
    applies_withholding_tax: false,
    withholding_tax_liquidation_concept: null,
    withholding_tax_liquidation_concept_description: '',
    applies_vat: false,
    vat_liquidation_concept: null,
    vat_liquidation_concept_description: '',
    applies_vat_withholding: false,
    vat_withholding_liquidation_concept: null,
    vat_withholding_liquidation_concept_description: '',
    applies_ica_withholding: false,
    applies_territorial_taxes: false,
    territorial_taxes_liquidation_concept: null,
    territorial_taxes_liquidation_concept_description: '',
  })

  const withholding_tax_liquidation_concepts = computed(() => {
    return settlement_concept.value.filter((concept) => concept.class === 'RFT')
  })
  const vat_liquidation_concepts = computed(() => {
    return settlement_concept.value.filter((concept) => concept.class === 'IVA')
  })
  const vat_withholding_liquidation_concepts = computed(() => {
    return settlement_concept.value.filter((concept) => concept.class === 'RIV')
  })
  const territorial_taxes_liquidation_concepts = computed(() => {
    return settlement_concept.value.filter((concept) => concept.class === 'ITE')
  })

  watch(
    () => models.value.applies_withholding_tax,
    (val) => {
      if (!val) {
        models.value.withholding_tax_liquidation_concept = null
        models.value.withholding_tax_liquidation_concept_description = ''
      }
    }
  )

  watch(
    () => models.value.withholding_tax_liquidation_concept,
    (val) => {
      models.value.withholding_tax_liquidation_concept_description = ''
      if (!val) return
      const selected_concept = withholding_tax_liquidation_concepts.value.find(
        (concept) => concept.value === val
      )
      if (!selected_concept) return
      models.value.withholding_tax_liquidation_concept_description =
        selected_concept.description
    }
  )

  watch(
    () => models.value.applies_vat,
    (val) => {
      if (!val) {
        models.value.vat_liquidation_concept = null
        models.value.vat_liquidation_concept_description = ''
      }
    }
  )

  watch(
    () => models.value.vat_liquidation_concept,
    (val) => {
      models.value.vat_liquidation_concept_description = ''
      if (!val) return
      const selected_concept = vat_liquidation_concepts.value.find(
        (concept) => concept.value === val
      )
      if (!selected_concept) return
      models.value.vat_liquidation_concept_description =
        selected_concept.description
    }
  )

  watch(
    () => models.value.applies_vat_withholding,
    (val) => {
      if (!val) {
        models.value.vat_withholding_liquidation_concept = null
        models.value.vat_withholding_liquidation_concept_description = ''
      }
    }
  )

  watch(
    () => models.value.vat_withholding_liquidation_concept,
    (val) => {
      models.value.vat_withholding_liquidation_concept_description = ''
      if (!val) return
      const selected_concept = vat_withholding_liquidation_concepts.value.find(
        (concept) => concept.value === val
      )
      if (!selected_concept) return
      models.value.vat_withholding_liquidation_concept_description =
        selected_concept.description
    }
  )

  watch(
    () => models.value.applies_territorial_taxes,
    (val) => {
      if (!val) {
        models.value.territorial_taxes_liquidation_concept = null
        models.value.territorial_taxes_liquidation_concept_description = ''
      }
    }
  )

  watch(
    () => models.value.territorial_taxes_liquidation_concept,
    (val) => {
      models.value.territorial_taxes_liquidation_concept_description = ''
      if (!val) return
      const selected_concept =
        territorial_taxes_liquidation_concepts.value.find(
          (concept) => concept.value === val
        )
      if (!selected_concept) return
      models.value.territorial_taxes_liquidation_concept_description =
        selected_concept.description
    }
  )

  watch(
    () => models.value,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    {
      deep: true,
    }
  )

  const _setValueModel = () => {
    if (!props.data) return
    Object.assign(models.value, props.data)
  }

  watch(
    () => props.data,
    (val) => {
      if (!val) return
      _setValueModel()
    },
    { deep: true, immediate: true }
  )

  return {
    basicDataFormRef,
    models,
    settlement_formula_person_types,
    fiscal_responsability,
    withholding_tax_liquidation_concepts,
    vat_liquidation_concepts,
    vat_withholding_liquidation_concepts,
    territorial_taxes_liquidation_concepts,
  }
}

export default useBasicDataForm
