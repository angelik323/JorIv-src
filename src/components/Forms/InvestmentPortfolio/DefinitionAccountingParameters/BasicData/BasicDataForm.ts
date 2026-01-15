import { onBeforeMount, ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { isEmptyOrZero } from '@/utils'
import { IDefinitionAccountingParametersForm } from '@/interfaces/customs'
import { ActionType, ActionHandlers } from '@/interfaces/global'
import {
  useDefinitionAccountingParametersStore,
  useTrustBusinessResourceStore,
  useAccountingResourceStore,
  useResourceManagerStore,
} from '@/stores'
import { useMainLoader } from '@/composables'

const useBasicDataForm = (props: {
  action: ActionType
  data?: IDefinitionAccountingParametersForm | null
}) => {
  const { _getResources } = useResourceManagerStore('v1')

  const { definition_accounting_parameters_view } = storeToRefs(
    useDefinitionAccountingParametersStore('v1'),
  )

  const { openMainLoader } = useMainLoader()

  const { _setDefinitionAccountingParametersForm } =
    useDefinitionAccountingParametersStore('v1')

  const { business_trust_types, business_trusts_value_is_code } = storeToRefs(
    useTrustBusinessResourceStore('v1'),
  )

  const { account_structures_available, cost_center } = storeToRefs(
    useAccountingResourceStore('v1'),
  )

  const keys = {
    trust_business: ['business_trusts'],
  }

  const formElementRef = ref()

  const models = ref<IDefinitionAccountingParametersForm>({
    system_code: null,
    business_group: null,
    accounting_structure: null,
    cost_center: null,
    company_code: null,
    bussiness_description: null,
    details: [],
  })

  const isView = computed(() => props.action === 'view')

  const handlerActionForm = (action: ActionType) => {
    const data =
      definition_accounting_parameters_view.value ?? props.data ?? null
    const actionHandlers: ActionHandlers = {
      create: () => setForm(null),
      edit: async () => {
        await setForm(data)
      },
      view: () => setForm(data),
    }
    actionHandlers[action]?.()
  }

  const setForm = (data: IDefinitionAccountingParametersForm | null) => {
    if (data) {
      models.value = {
        ...data,
      }
    }
  }

  const handleSelectCompanyCode = (value: number) => {
    models.value.company_code = value.toString()
    models.value.bussiness_description =
      business_trusts_value_is_code.value.find((item) => item.value === value)
        ?.name ?? ''
  }

  const handleSelectBusinessGroup = async (business_group: number | null) => {
    models.value.business_group = business_group
    models.value.company_code = null
    models.value.bussiness_description = null
    openMainLoader(true)

    if (business_group)
      await _getResources(keys, `filter[business_type_id]=${business_group}`)

    openMainLoader(false)
  }

  onBeforeMount(async () => {
    await handlerActionForm(props.action)
  })

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    },
  )

  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setDefinitionAccountingParametersForm(null)
      } else {
        _setDefinitionAccountingParametersForm({ ...models.value })
      }
    },
    { deep: true },
  )

  return {
    models,
    formElementRef,
    isView,
    business_trust_types,
    business_trusts_value_is_code,
    account_structures_available,
    cost_center,
    handleSelectBusinessGroup,
    handleSelectCompanyCode,
  }
}

export default useBasicDataForm
