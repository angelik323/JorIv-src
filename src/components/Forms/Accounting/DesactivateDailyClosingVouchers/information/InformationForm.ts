// pinia | vue
import { storeToRefs } from 'pinia'
import { onBeforeUnmount, onMounted, onUnmounted, ref, watch } from 'vue'

// stores
import {
  useAccountingResourceStore,
  useDesactivateDailyClousingVouchersStore,
  useResourceManagerStore,
} from '@/stores'
import { IDesativateDailyClosingVouchersCreate } from '@/interfaces/customs'

const useInformationForm = () => {
  const { data_information_form } = storeToRefs(
    useDesactivateDailyClousingVouchersStore('v1')
  )
  const { _setDataInformationForm } =
    useDesactivateDailyClousingVouchersStore('v1')

  const {
    account_structures_active_revert_vouchers,
    daily_closing_business_by_account_structure,
  } = storeToRefs(useAccountingResourceStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const models = ref<IDesativateDailyClosingVouchersCreate>({
    structure: undefined,
    from_business_trust_id: undefined,
    from_business_trust_code: '',
    to_business_trust_id: undefined,
    to_business_trust_code: '',
    last_closing_day: '',
    revert_balances_date: '',
  })

  const getKeys = () => {
    return {
      accounting: [
        `daily_closing_business_by_account_structure&filter[accounting_structure_id]=${models.value?.structure}`,
      ],
    }
  }

  const formInformation = ref()

  const isEmpty = (obj: Record<string, any>): boolean => {
    return Object.values(obj).every(
      (value) => value === 0 || value === '' || value === null
    )
  }

  const clearForm = async () => {
    models.value.structure = undefined
    models.value.from_business_trust_id = undefined
    models.value.to_business_trust_id = undefined
    models.value.last_closing_day = ''
    models.value.revert_balances_date = ''
  }

  const _setValueModel = async () => {
    clearForm()
    if (data_information_form.value) {
      models.value = { ...data_information_form.value }
    }
  }

  onMounted(async () => {
    _setValueModel()
  })

  onBeforeUnmount(() => {
    _resetKeys(getKeys())
  })

  onUnmounted(async () => {
    _setDataInformationForm(null)
  })

  watch(
    () => models.value,
    () => {
      if (isEmpty(models.value)) {
        _setDataInformationForm(null)
      } else {
        _setDataInformationForm({ ...models.value })
      }
    },
    { deep: true }
  )

  watch(
    () => models.value.from_business_trust_id,
    () => {
      const search = daily_closing_business_by_account_structure.value.find(
        (element) => element.id === models.value.from_business_trust_id
      )
      models.value.from_business_trust_code = search?.business_code

      models.value.last_closing_day = search?.account?.last_closing_day ?? ''
    }
  )

  watch(
    () => models.value.to_business_trust_id,
    () => {
      models.value.to_business_trust_code =
        daily_closing_business_by_account_structure.value.find(
          (element) => element.id === models.value.to_business_trust_id
        )?.business_code
    }
  )

  watch(
    () => models.value?.structure,
    async (val) => {
      if (val) {
        models.value.from_business_trust_id = undefined
        models.value.to_business_trust_id = undefined
        await _getResources(getKeys())
      }
    },
    { immediate: true, deep: true }
  )

  return {
    models,
    formInformation,
    account_structures_active_revert_vouchers,
    daily_closing_business_by_account_structure,
  }
}

export default useInformationForm
