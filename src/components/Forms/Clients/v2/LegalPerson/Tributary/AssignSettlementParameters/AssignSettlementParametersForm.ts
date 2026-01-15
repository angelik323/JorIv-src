// Vue - Pinia - Router - Quasar
import { ref, watch } from 'vue'

// Interfaces
import { ActionType } from '@/interfaces/global'
import {
  IAssignSettlementParametersForm,
  ISettlementFormula,
  ISettlementFormulaItem,
  ISettlementFormulaTax,
} from '@/interfaces/customs/clients/Clients'

// Composables
import { useRules } from '@/composables'

const useAssignSettlementParametersForm = (
  props: {
    action: ActionType
    assignDataForm: IAssignSettlementParametersForm | null
    selectedSettlementFormulasList: ISettlementFormula[] | null
  },
  emit: Function
) => {
  const formAssignSettlementParametersRef = ref()
  const assignSettlementFormulasList = ref<ISettlementFormula[]>([])

  const models = ref<IAssignSettlementParametersForm>({
    third_party: null,
    fiscal_responsibility: null,
    vat_responsibility: false,
    reteiva_concept: null,
    reteiva_concept_tax_rate: null,
    iva_concept: null,
    iva_concept_tax_rate: null,
  })

  const setValueModel = (data: IAssignSettlementParametersForm | null) => {
    if (data) {
      Object.assign(models.value, data)
    }
  }

  const onUpdateAssignSettlementFormulasList = (
    value: ISettlementFormula[]
  ) => {
    assignSettlementFormulasList.value = value
  }

  const onUpdateSelectedRow = (row: ISettlementFormulaItem) => {
    if (!row.id) return

    const rivTax = row.taxes.find(
      (tax: ISettlementFormulaTax) => tax.tax_type === 'RIV'
    )
    const ivaTax = row.taxes.find(
      (tax: ISettlementFormulaTax) => tax.tax_type === 'IVA'
    )

    models.value.reteiva_concept =
      rivTax?.concept?.description ?? 'No registrado'
    models.value.reteiva_concept_tax_rate =
      rivTax?.concept?.percentage?.toString() ?? null
    models.value.iva_concept = ivaTax?.concept?.description ?? 'No registrado'
    models.value.iva_concept_tax_rate =
      ivaTax?.concept?.percentage?.toString() ?? null
  }

  const onSubmit = async () => {
    await emit(
      'update:selected-settlement-formulas-list',
      assignSettlementFormulasList.value
    )
    setTimeout(() => {
      emit('close:modal')
    }, 200)
  }

  watch(
    () => props.assignDataForm,
    (val) => {
      if (!val) return
      setValueModel(val)
    },
    { deep: true, immediate: true }
  )

  return {
    models,
    formAssignSettlementParametersRef,
    useRules,

    onSubmit,
    onUpdateAssignSettlementFormulasList,
    onUpdateSelectedRow,
  }
}

export default useAssignSettlementParametersForm
