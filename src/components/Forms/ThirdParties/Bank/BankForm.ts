import { useAlert } from '@/composables'
import { IBankForm } from '@/interfaces/global'
import { useResourcesStore, useThirdPartiesStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'

export const useBankForm = (props: any, emit: Function) => {
  const { showAlert } = useAlert()

  const { _setBankForm } = useThirdPartiesStore()
  const { bankForm, thirdPartiesData } = storeToRefs(useThirdPartiesStore())
  const { banks } = storeToRefs(useResourcesStore())

  const formValues = ref<IBankForm>({
    bank_id: null as string | null,
    type: null as string | null,
    account: null as string | null,
  })

  const formattedBanks = computed(() => {
    if (props.formType == 'update')
      return banks.value.filter(
        (bank: any) =>
          bank.status_id === 1 || bank.value === bankForm.value?.bank_id
      )
    return banks.value.filter((bank: any) => bank.status_id === 1)
  })

  const submit = () => {
    emit('onContinue', 'Bank')
  }

  const setBankData = () => {
    formValues.value.bank_id =
      bankForm.value?.bank_id ?? thirdPartiesData.value?.bank?.bank.id
    formValues.value.account =
      bankForm.value?.account ?? thirdPartiesData.value?.bank?.account
    formValues.value.type =
      bankForm.value?.type ?? thirdPartiesData.value?.bank?.type
  }

  watch(formValues.value, (val) => {
    _setBankForm(val)
  })

  watch(thirdPartiesData, () => {
    if (props.formType === 'update') {
      setBankData()
    }
  })

  onMounted(async () => {
    if (props.formType === 'create') {
      if (bankForm.value) {
        setBankData()
      }
    }
    if (props.formType === 'update') {
      if (thirdPartiesData.value?.bank?.bank.status_id === 2) {
        showAlert('Banco inactivo', 'error')
      }
      setBankData()
    }
  })

  return {
    formValues,
    formattedBanks,

    submit,
  }
}
