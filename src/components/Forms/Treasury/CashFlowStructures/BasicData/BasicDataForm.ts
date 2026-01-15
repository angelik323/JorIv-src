import { ICashFlowStructures } from '@/interfaces/customs'
import { IResource } from '@/interfaces/global'
import { useUtils } from '@/composables'
import { useResourceStore, useCashFlowStructuresStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import { ref } from 'vue'

const useBasicDataForm = () => {
  const {
    account_structures,
    cash_flow_structure_types,
    cash_flow_structure_natures,
    cash_flow_structure_activity_groups,
  } = storeToRefs(useResourceStore('v1'))

  const { data_basic_cash_flow_structure } = storeToRefs(
    useCashFlowStructuresStore('v1')
  )
  const { _setDataBasicCashFlowStructures } = useCashFlowStructuresStore('v1')

  const account_structure_select = ref<IResource>()
  const basicDataFormRef = ref()

  const models = ref<ICashFlowStructures>({
    account_structure_id: null,
    account_structure: null,
    account_code: null,
    account_purpose: null,
    name: null,
    code: null,
    type: null,
    nature: null,
    activity_group: null,
  })

  watch(
    () => data_basic_cash_flow_structure.value,
    (newValue: any) => {
      if (newValue) {
        models.value = newValue
        const account_structure = account_structures.value.find(
          (account_structure) =>
            account_structure.label === newValue.account_code
        )
        models.value.account_structure_id =
          (account_structure?.value as number) || null
        models.value.account_code = account_structure?.label || null
        models.value.account_structure = account_structure?.structure || null
        models.value.account_purpose = account_structure?.purpose || null
      }
    }
  )

  watch(
    () => account_structure_select.value,
    (newValue) => {
      models.value.account_structure_id = (newValue?.value as number) || null
      models.value.account_code = newValue?.label || null
      models.value.account_structure = newValue?.structure || null
      models.value.account_purpose = newValue?.purpose || null
    }
  )

  watch(
    () => [
      models.value.account_structure_id,
      models.value.account_structure,
      models.value.account_purpose,
      models.value.account_code,
      models.value.code,
      models.value.name,
      models.value.code,
      models.value.type,
      models.value.nature,
      models.value.activity_group,
    ],
    () => {
      if (useUtils().isEmptyOrZero(models.value)) {
        _setDataBasicCashFlowStructures(null)
      } else {
        _setDataBasicCashFlowStructures(models.value)
      }
    }
  )

  return {
    models,
    account_structures,
    account_structure_select,
    cash_flow_structure_types,
    cash_flow_structure_natures,
    cash_flow_structure_activity_groups,
    basicDataFormRef,
  }
}

export default useBasicDataForm
