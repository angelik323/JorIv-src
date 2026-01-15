import { IBank } from '@/interfaces/customs/BankAccountGenerator'
import { useResourceStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { reactive, toRefs, computed, watch, ref } from 'vue'

export const useBankAccountGenerator = (props: any) => {
  const { banks, bank_branches, bank_types } = storeToRefs(
    useResourceStore('v1')
  )
  const formValues = reactive<IBank>({
    bank_id: '' as string,
    account_number: '' as string,
    type: '' as string,
    city: '' as string,
    branch: '' as string,
    branch_id: 0 as number,
    bank_code: '' as string,
  })
  const isEditing = computed(() => !!props.itemToEdit)

  // props
  const { rules } = toRefs(props)
  const combinedRules = computed(() => [...(rules.value || [])])

  const loadItem = ref(false)

  watch(
    () => props.itemToEdit,
    (newValue: IBank) => {
      loadItem.value = false
      if (newValue) {
        formValues.bank_id = newValue.bank_id
        formValues.account_number = newValue.account_number
        formValues.type = newValue.type
        formValues.city = newValue.city
        formValues.branch = newValue.branch
        formValues.branch_id = newValue.branch_id
        formValues.bank_code = newValue.bank_code

        setTimeout(() => {
          loadItem.value = true
        }, 2000)
      }
    },
    { immediate: true }
  )

  watch(
    () => formValues.bank_id,
    () => {
      if (loadItem.value) {
        formValues.branch = ''
        formValues.bank_code = ''

        if (formValues.bank_id) {
          const bank_code =
            banks.value.find((bank) => bank.value === formValues.bank_id)
              ?.code ?? ''

          formValues.bank_code = bank_code ?? ''
        }
      }
    }
  )

  watch(
    () => formValues.branch,
    () => {
      if (loadItem.value) {
        const branch = bank_branches.value.find(
          (branch: any) => branch.value === formValues.branch
        )

        formValues.city = branch?.city?.name ?? ''
      }
    }
  )

  const clearAll = () => {
    formValues.bank_id = undefined
    formValues.account_number = undefined
    formValues.type = undefined
  }

  return {
    formValues,
    combinedRules,
    isEditing,
    bank_branches,
    banks,
    bank_types,
    clearAll,
  }
}
