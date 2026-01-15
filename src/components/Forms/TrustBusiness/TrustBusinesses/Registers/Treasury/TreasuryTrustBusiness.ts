// vue - pinia
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'

// stores
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'

// interfaces
import { IBusinessTreasury } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'

// composables
import { useCalendarRules } from '@/composables'
import { useUtils } from '@/composables'
import { default_yes_no } from '@/constants/resources'

const useTreasuryTrustBusiness = (
  props: {
    action: ActionType
    data?: IBusinessTreasury | null
  },
  emit: Function
) => {
  const { cash_flow_structures, close_treasurie, collection_structure } =
    storeToRefs(useTrustBusinessResourceStore('v1'))

  const { only_last_day_month } = useCalendarRules()

  const models = ref<IBusinessTreasury>({
    closing: null,
    last_close_date: null,
    has_cash_flow: null,
    can_bank_reconciliation: null,
    cash_flow_structure_id: null,
    last_conciliation_date: null,
    has_collection_structure: null,
    has_box_structure: null,
    collection_structure_id: null,
    box_structure_id: null,
  })

  const treasury_trust_business_form_ref = ref()

  const _setValueModel = () => {
    if (props.data) {
      models.value = { ...props.data }
    }
  }

  const _setFormView = () => {
    if (props.data) {
      const data = { ...props.data }
      models.value = {
        ...data,
      }
    }
  }

  const handlerActionForm = (action: 'create' | 'edit' | 'view') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: _setValueModel,
      view: _setFormView,
    }
    actionHandlers[action]?.()
  }

  watch(
    () => models.value,
    () => {
      if (useUtils().isEmptyObject(models.value)) {
        emit('update:models', null)
      } else {
        emit('update:models', models.value)
      }
    },
    {
      deep: true,
    }
  )

  watch(
    () => models.value.can_bank_reconciliation,
    (val) => {
      if (!val) {
        models.value.last_conciliation_date = null
      }
    }
  )

  watch(
    () => models.value.has_cash_flow,
    (val) => {
      if (!val) {
        models.value.cash_flow_structure_id = null
      }
    }
  )

  watch(
    () => models.value.has_collection_structure,
    (val) => {
      if (!val) {
        models.value.collection_structure_id = null
      }
    }
  )

  watch(
    () => models.value.has_box_structure,
    (val) => {
      if (!val) {
        models.value.box_structure_id = null
      }
    }
  )

  onMounted(() => {
    handlerActionForm(props.action)
  })

  return {
    models,
    close_treasurie,
    cash_flow_structures,
    default_yes_no,
    treasury_trust_business_form_ref,
    collection_structure,
    only_last_day_month,
  }
}

export default useTreasuryTrustBusiness
