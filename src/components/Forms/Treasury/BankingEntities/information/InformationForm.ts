import { storeToRefs } from 'pinia'
import { ref, onMounted, watch, nextTick } from 'vue'

import { useUtils } from '@/composables/useUtils'

import { useBankingEntitiesStore, useResourceStore } from '@/stores'
import { IBankingEntitiesList } from '@/interfaces/customs'

const useInformationForm = (props: {
  action: 'create' | 'edit' | 'view'
  data?: IBankingEntitiesList
}) => {
  
  const { data_information_form } = storeToRefs(useBankingEntitiesStore('v1'))
  const { status, third_party_nit } = storeToRefs(useResourceStore('v1'))

  const { _setDataBasicBankingEntitie, _dataBasicError } =
    useBankingEntitiesStore('v1')
  const { _getResourcesTreasuries } = useResourceStore('v1')
  const keys = ['third_party_nit']

  const { isEmptyOrZero } = useUtils()

  const statusBanking = [
    ...status.value.filter((item) => item.value !== 0),
    ...(props.action !== 'edit' ? [{ value: 55, label: 'Por autorizar' }] : []),
  ]

  const formInformation = ref()
  const dirty = ref(true)
  const models = ref<{
    description: string | null
    nit: number | null
    bank_code: string | null
    code: string | null
    status?: number
    created_at?: string | null
    created_by?: string | null
    updated_at?: string | null
    updated_by?: string | null
  }>({
    description: '',
    nit: null,
    bank_code: '',
    code: '',
    status: 0,
    created_at: '',
    created_by: '',
    updated_at: '',
    updated_by: '',
  })

  const handlerActionForm = (action: 'create' | 'edit' | 'view') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: data_information_form.value ? _setValueModel : setFormEdit,
      view: setFormView,
    }
    actionHandlers[action]?.()
  }

  const setFormView = () => {
    clearForm()
    const data = props.data
    if (data) {
      models.value.description = data.description ?? ''
      models.value.nit = Number(data.nit.nit)
      models.value.bank_code = data.bank_code ?? ''
      models.value.code = data.code ?? null
      models.value.status = data.status?.id ?? ''
      models.value.created_at = data.created_at ?? ''
      models.value.created_by = data.created_by ?? ''
      models.value.updated_at = data.updated_at ?? ''
      models.value.updated_by = data.updated_by ?? ''
    }
    _setDataBasicBankingEntitie(null)
  }

  const _setValueModel = () => {
    if (data_information_form.value) {
      models.value = { ...data_information_form.value }
    }
  }

  const setFormEdit = () => {
    clearForm()
    const data = props.data

    if (!data) {
      dirty.value = false
      return
    }
    nextTick(() => {
      models.value.description = data.description ?? ''
      models.value.nit = data.nit.id
      models.value.bank_code = data.bank_code ?? ''
      models.value.code = data.code ?? null
      models.value.status = data.status?.id ?? ''
      models.value.created_at = data.created_at ?? ''
      models.value.created_by = data.created_by ?? ''
      models.value.updated_at = data.updated_at ?? ''
      models.value.updated_by = data.updated_by ?? ''
    })
  }

  const clearForm = () => {
    models.value.description = ''
    models.value.nit = 0
    models.value.bank_code = ''
  }

  const updateDescription = (value: string) => {
    models.value.description = value.toUpperCase()
  }

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    }
  )

  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setDataBasicBankingEntitie(null)
      } else {
        _setDataBasicBankingEntitie({
          description: models.value.description ?? '',
          nit: models.value.nit ?? null,
          bank_code: models.value.bank_code ?? '',
          status: models.value.status ?? 0,
          code: models.value.code ?? '',
          created_at: models.value.created_at ?? '',
          created_by: models.value.created_by ?? '',
          updated_at: models.value.updated_at ?? '',
          updated_by: models.value.updated_by ?? '',
        })
        _dataBasicError(null)
      }
    },
    { deep: true }
  )

  onMounted(async () => {
    await _getResourcesTreasuries(`keys[]=${keys.join('&keys[]=')}`)
    handlerActionForm(props.action)
  })

  return {
    models,
    formInformation,
    statusBanking,
    third_party_nit,
    updateDescription,
  }
}
export default useInformationForm
