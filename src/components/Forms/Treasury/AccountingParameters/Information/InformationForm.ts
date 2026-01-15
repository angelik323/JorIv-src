import { IAccountingParameters } from '@/interfaces/customs'
import { useAccountingParamaterStore, useResourceStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { onMounted, ref, onUnmounted, watch } from 'vue'
import { isEmptyOrZero } from '@/utils'

const useInformationForm = (props: {
  action: 'create' | 'edit'
  data?: IAccountingParameters[]
}) => {
  const { data_information_form, idSelected, cash_flow_structure } =
    storeToRefs(useAccountingParamaterStore('v1'))
  const { _setDataInformationForm, _getAccountParameters } =
    useAccountingParamaterStore('v1')

  const { _getResourcesTreasuries } = useResourceStore('v1')
  const {
    account_chart_id,
    third_party_id,
    aux_type,
    cost_center_structure_id,
  } = storeToRefs(useResourceStore('v1'))
  const cash_flow_structure_id = ref()
  const formInformation = ref()
  const keys = [
    'counter_auxiliary_type',
    'third_parties',
    `accounting_block_collections_charts&accounting_blocks_collection_id=${idSelected.value}`,
  ]
  const models = ref<{
    account_chart_id: number | null | string
    cost_center_id: number | string
    aux_type: string
    third_party_id: number | string
    cash_flow_structure_id: number | string
    contra_account_chart_id: number | string | null
    contra_cost_center_id: number | string
    contra_aux_type: string | number
    contra_third_party_id: number | string
    contra_cash_flow_structure_id: number | string
  }>({
    account_chart_id: null,
    cost_center_id: '',
    aux_type: '',
    third_party_id: '',
    cash_flow_structure_id: '',
    contra_account_chart_id: null,
    contra_cost_center_id: '',
    contra_aux_type: '',
    contra_third_party_id: '',
    contra_cash_flow_structure_id: '',
  })

  const handleActionForm = (action: 'create' | 'edit') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: data_information_form.value ? _setValueModel : setFormEdit,
    }
    actionHandlers[action]?.()
  }
  const _setValueModel = () => {
    if (data_information_form.value) {
      models.value.account_chart_id =
        data_information_form.value.account_chart ?? ''
      models.value.cost_center_id =
        data_information_form.value.cost_center ?? ''
      models.value.aux_type = data_information_form.value.aux_type ?? ''
      models.value.third_party_id =
        data_information_form.value.third_party ?? ''
      models.value.cash_flow_structure_id =
        data_information_form.value.cash_flow_structure ?? ''
      models.value.contra_account_chart_id =
        data_information_form.value.contra_account_chart ?? null
      models.value.contra_cost_center_id =
        data_information_form.value.contra_cost_center ?? ''
      models.value.contra_aux_type =
        data_information_form.value.contra_aux_type ?? ''
      models.value.contra_third_party_id =
        data_information_form.value.contra_third_party_id ?? ''
      models.value.contra_cash_flow_structure_id =
        data_information_form.value.contra_cash_flow_structure_id ?? ''
    }
  }

  const setFormEdit = () => {
    clearForm()
    const data = data_information_form.value
    if (data) {
      models.value.account_chart_id = data.account_chart_id ?? null
      models.value.cost_center_id = data.cost_center_id ?? ''
      models.value.aux_type = data.aux_type ?? ''
      models.value.third_party_id = data.third_party_id ?? ''
      models.value.cash_flow_structure_id = data.cash_flow_structure_id ?? ''
      models.value.contra_account_chart_id =
        data.contra_account_chart_id ?? null
      models.value.contra_cost_center_id = data.contra_cost_center_id ?? ''
      models.value.contra_aux_type = data.contra_aux_type ?? ''
      models.value.contra_third_party_id = data.contra_third_party_id ?? ''
      models.value.contra_cash_flow_structure_id =
        data.contra_cash_flow_structure_id ?? ''
    }
  }

  const clearForm = () => {
    models.value.account_chart_id = null
    models.value.cost_center_id = ''
    models.value.aux_type = ''
    models.value.third_party_id = ''
    models.value.cash_flow_structure_id = ''
    models.value.contra_account_chart_id = null
    models.value.contra_cost_center_id = ''
    models.value.contra_aux_type = ''
    models.value.contra_third_party_id = ''
    models.value.contra_cash_flow_structure_id = ''
  }

  onMounted(async () => {
    await _getAccountParameters(idSelected.value)
    await _getResourcesTreasuries(`keys[]=${keys.join('&keys[]=')}`)

    if (props.action === 'create') {
      handleActionForm(props.action)
    }
  })
  onUnmounted(async () => {
    _setDataInformationForm(null)
  })

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handleActionForm(props.action)
      }
    },
    { deep: true }
  )

  watch(
    () => data_information_form.value,
    (newVal) => {
      if (newVal && props.action === 'edit') {
        handleActionForm(props.action)
      }
    },
    { immediate: true }
  )

  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setDataInformationForm(null)
      } else {
        _setDataInformationForm({ ...models.value } as IAccountingParameters)
      }
    },
    { deep: true }
  )

  watch(
    () => cash_flow_structure.value,
    (newVal) => {
      if (newVal) {
        cash_flow_structure_id.value = [
          {
            label: newVal.name,
            value: newVal.id,
          },
        ]
      } else {
        cash_flow_structure_id.value = []
      }
    },
    { immediate: true }
  )

  return {
    models,
    aux_type,
    third_party_id,
    cash_flow_structure_id,
    account_chart_id,
    formInformation,
    cost_center_structure_id,
  }
}

export default useInformationForm
