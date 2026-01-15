import { IBankBranchesList } from '@/interfaces/customs'
import { useBankBranchesStore, useResourceStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'

const useBankBrankBranchesBasicData = (props: any) => {
  const BankBranchesBasicDataRef = ref()
  const isAddressGeneratorOpen = ref(false)
  const { data_information_form } = storeToRefs(useBankBranchesStore('v1'))
  const { _setDataBasicBankBranches } = useBankBranchesStore('v1')
  const { cities, status } = storeToRefs(useResourceStore('v1'))
  const statusBankBranches = [
    ...status.value.filter((item) => item.value !== 0),
  ]
  const dirty = ref(true)

  const models = ref<{
    code: string | null
    name: string | null
    address: string | null
    city_id: number | null
    status_id?: number
  }>({
    code: '',
    name: '',
    address: '',
    city_id: 0,
    status_id: 0,
  })
  const updateOfficeName = (value: string) => {
    models.value.name = value.toUpperCase()
  }

  const handlerActionForm = (action: 'create' | 'edit') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: data_information_form.value ? _setValueModel : setFormEdit,
    }
    actionHandlers[action]?.()
  }

  const setFormEdit = () => {
    clearForm()

    const data: IBankBranchesList = props.data
    if (!data) {
      dirty.value = false
      return
    }
    models.value.address = data.address ?? ''
    models.value.code = data.code ?? null
    models.value.city_id = data.city_id ?? ''
    models.value.name = data.name ?? null
    models.value.status_id = data.status_id ?? ''
  }

  const clearForm = () => {
    models.value.address = ''
    models.value.code = ''
    models.value.city_id = null
    models.value.name = ''
    models.value.status_id = 0
  }

  const _setValueModel = () => {
    if (data_information_form.value) {
      models.value = {
        ...data_information_form.value,
        city_id: Number(data_information_form.value.city_id),
        status_id: Number(data_information_form.value.status_id),
      }
    }
  }
  const isEmpty = (obj: Record<string, any>): boolean => {
    return Object.values(obj).every(
      (value) => value === 0 || value === '' || value === null
    )
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
      if (isEmpty(models.value)) {
        _setDataBasicBankBranches(null)
      } else {
        _setDataBasicBankBranches({
          code: models.value.code ?? '',
          name: models.value.name ?? '',
          address: models.value.address ?? '',
          city_id: models.value.city_id ?? '',
          status_id: models.value.status_id ?? 0,
        })
      }
    },
    { deep: true }
  )

  onMounted(async () => {
    handlerActionForm(props.action)
  })

  return {
    BankBranchesBasicDataRef,
    models,
    isAddressGeneratorOpen,
    cities,
    statusBankBranches,
    updateOfficeName,
  }
}

export default useBankBrankBranchesBasicData
