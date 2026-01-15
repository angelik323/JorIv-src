import { onMounted, ref, watch } from 'vue'

import { storeToRefs } from 'pinia'
import { useClientsStore } from '@/stores'
import { INaturalClientInvestor } from '@/interfaces/customs/Clients'

const useInvestorForm = (props: any) => {
  const { data_investor_form } = storeToRefs(useClientsStore('v1'))
  const { _setDataNaturalClientsInvestor } = useClientsStore('v1')

  const formInvestor = ref()

  const models = ref({})

  const isEmpty = (obj: Record<string, any>): boolean => {
    return Object.values(obj).every(
      (value) => value === 0 || value === '' || value === null
    )
  }

  const handlerActionForm = (action: 'create' | 'edit' | 'view') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: data_investor_form.value ? _setValueModel : setFormEdit,
      view: setFormView,
    }

    actionHandlers[action]?.()
  }

  const setFormView = () => {
    const data: INaturalClientInvestor = props.data
    if (data) {
    }
  }

  const setFormEdit = () => {
    const data: INaturalClientInvestor = props.data
    if (data) {
    }
  }

  const _setValueModel = () => {
    if (data_investor_form.value) {
      models.value = { ...data_investor_form.value }
    }
  }

  onMounted(async () => {
    handlerActionForm(props.action)
  })

  watch(
    () => [],
    () => {
      if (isEmpty(models.value)) {
        _setDataNaturalClientsInvestor(null)
      } else {
        _setDataNaturalClientsInvestor({})
      }
    }
  )

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    }
  )

  return { models, formInvestor }
}

export default useInvestorForm
