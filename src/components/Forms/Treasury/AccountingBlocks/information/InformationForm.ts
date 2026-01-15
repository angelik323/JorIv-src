import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainLoader } from '@/composables'
import { isEmptyOrZero } from '@/utils'
import { ActionType, ActionHandlers } from '@/interfaces/global'
import { IAccountingBlockInformationForm } from '@/interfaces/customs'
import {
  useTreasuryResourceStore,
  useFicResourceStore,
  useAccountingBlocksStore,
  useResourceManagerStore,
} from '@/stores'

const useInformationForm = (props: {
  action: ActionType
  data?: IAccountingBlockInformationForm | null
}) => {
  const { _getResources } = useResourceManagerStore('v1')
  const { openMainLoader } = useMainLoader()
  const { _setDataInformationForm } = useAccountingBlocksStore('v1')
  const { data_information_form } = storeToRefs(useAccountingBlocksStore('v1'))

  const {
    account_structures_block,
    treasury_movement_codes,
    accounting_account_contrapart,
    third_type,
    third_party_nit,
  } = storeToRefs(useTreasuryResourceStore('v1'))
  const { movements } = storeToRefs(useFicResourceStore('v1'))

  const keys = {
    treasury: ['accounting_account_contrapart'],
  }

  const formElementRef = ref()
  const isHandlesAccountingOffset = ref(false)
  const isMovementFundsProcesses = ref(false)

  const initialModelsValues: IAccountingBlockInformationForm = {
    account_structure_id: null,
    treasury_movement_code_id: null,
    movement_name: '',
    movement_nature: '',
    account_chart_id: null,
    third_type: '',
    third_party_id: null,
    movement_funds_processes: false,
    code_movement_funds: null,
    gmf_associate_affects: false,
    demand_investment_plan: false,
    amortizes_funds: false,
  }

  const models = ref<IAccountingBlockInformationForm>({
    ...initialModelsValues,
  })

  const handlerActionForm = (action: ActionType) => {
    const actionHandlers: ActionHandlers = {
      create: _setValueModel,
      edit: data_information_form.value ? _setValueModel : setFormEdit,
      view: _setFormView,
    }
    actionHandlers[action]?.()
  }

  const setFormData = (data: IAccountingBlockInformationForm | null) => {
    if (!data) return

    Object.assign(models.value, data)
  }

  const setFormEdit = async () => {
    clearForm()
    setFormData(props.data ?? null)
  }

  const _setFormView = async () => {
    clearForm()
    setFormData(props.data ?? null)
  }

  const _setValueModel = () => {
    if (!data_information_form.value) return

    Object.assign(models.value, data_information_form.value)
  }

  const clearForm = () => {
    Object.assign(models.value, initialModelsValues)
  }

  onMounted(() => {
    handlerActionForm(props.action)
  })

  onBeforeUnmount(() => {
    _setDataInformationForm(null)
  })

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    },
    { deep: true }
  )

  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setDataInformationForm(null)
      } else {
        _setDataInformationForm({ ...models.value })
      }
    },
    { deep: true }
  )

  watch(
    () => models.value.account_structure_id,
    async (newStructureId, oldStructureId) => {
      if (!newStructureId) {
        accounting_account_contrapart.value = []
        models.value.account_chart_id = null
        return
      }

      if (newStructureId !== oldStructureId) {
        openMainLoader(true)
        await _getResources(keys, `id_structure=${newStructureId}`)

        if (!accounting_account_contrapart.value.length) {
          models.value.account_chart_id = null
        }
        openMainLoader(false)
      }
    },
    { immediate: true }
  )

  watch(
    () => models.value.treasury_movement_code_id,
    (newValue) => {
      if (!newValue || !treasury_movement_codes.value) {
        models.value.movement_name = ''
        models.value.movement_nature = ''
        isHandlesAccountingOffset.value = true
        return
      }

      const selected = treasury_movement_codes.value.find(
        (item) => item.value === newValue
      )

      if (selected) {
        models.value.movement_name = selected.description || ''
        models.value.movement_nature = selected.nature || ''
        isHandlesAccountingOffset.value = !selected.handles_accounting_offset

        if (!selected.handles_accounting_offset) {
          models.value.account_chart_id = null
        }
      }
    },
    { immediate: true }
  )

  watch(
    () => models.value.movement_funds_processes,
    (newValue: boolean) => {
      isMovementFundsProcesses.value = newValue === true

      if (newValue !== true) {
        models.value.code_movement_funds = null
        models.value.gmf_associate_affects = false
        models.value.demand_investment_plan = false
        models.value.amortizes_funds = false
      }
    },
    { immediate: true }
  )

  return {
    models,
    formElementRef,
    account_structures_block,
    treasury_movement_codes,
    accounting_account_contrapart,
    third_type,
    third_party_nit,
    movements,
    isHandlesAccountingOffset,
    isMovementFundsProcesses,
  }
}

export default useInformationForm
