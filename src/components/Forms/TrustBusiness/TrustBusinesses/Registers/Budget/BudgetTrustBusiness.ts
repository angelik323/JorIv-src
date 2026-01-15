// vue - pinia
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'

// interfaces
import { IBusinessBudget } from '@/interfaces/customs/trust-business/TrustBusinesses'
import { ActionType } from '@/interfaces/global'

// composables
import { useUtils } from '@/composables/useUtils'

// stores
import {
  useBudgetResourceStore,
  useResourceManagerStore,
} from '@/stores/resources-manager'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business/'
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'

// constants
import { month_list, clousings } from '@/constants'

const { _getResources } = useResourceManagerStore('v1')
const { budget_mapping_parameters, areas_resposabilities_codes } = storeToRefs(
  useBudgetResourceStore('v1')
)

const { budget_mhcp_codes, business_trust_third_parties } = storeToRefs(
  useTrustBusinessResourceStore('v1')
)
const { budget_structures_generate } = storeToRefs(
  useAccountingResourceStore('v1')
)
const isEmpty = useUtils().isEmptyOrZero

const useBudgetTrustBusiness = (
  props: {
    action: ActionType
    data?: IBusinessBudget | null
  },
  emit: Function
) => {
  const models = ref<IBusinessBudget>({
    validity: null,
    current_month: null,
    last_closing_date: null,
    closing_type: null,
    mhcp_section_code: null,
    budget_structure_id: null,
    generic_area_id: null,
    expense_authorizer_id: null,
    current_month_id: null,
    id: null,
    budget_structure_code: null,
    budget_structure: {
      id: null,
      code: null,
      code_name: null,
      label: null,
    },
  })

  const keys = {
    budget: [
      'accounting_budget_mapping_parameters',
      'areas_resposabilities_codes',
    ],
    trust_business: ['budget_mhcp_codes', 'business_trust_third_parties'],
    accounting: ['budget_structures_generate'],
  }

  const budget_trust_business_form_ref = ref()

  const _setValueModel = () => {
    if (props.data) {
      models.value = { ...props.data }
    }
  }

  const _setFormView = () => {
    if (props.data) {
      models.value = {
        ...props.data,
      }
    }
  }

  const handlerActionForm = (action: ActionType) => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: _setValueModel,
      view: _setFormView,
    }
    actionHandlers[action]?.()
  }

  const closingTypeLabel = computed(() => {
    const closingItem = clousings.find(
      (item) => item.value === models.value.closing_type
    )
    return closingItem?.label
  })

  watch(
    () => models.value,
    () => {
      if (isEmpty(models.value)) {
        emit('update:models', null)
      } else {
        emit('update:models', models.value)
      }
    },
    {
      deep: true,
    }
  )

  onMounted(async () => {
    await _getResources(keys)
    handlerActionForm(props.action)
  })

  return {
    models,
    budget_trust_business_form_ref,
    budget_mapping_parameters,
    budget_structures_generate,
    areas_resposabilities_codes,
    month_list,
    clousings,
    budget_mhcp_codes,
    business_trust_third_parties,
    closingTypeLabel,
  }
}

export default useBudgetTrustBusiness
