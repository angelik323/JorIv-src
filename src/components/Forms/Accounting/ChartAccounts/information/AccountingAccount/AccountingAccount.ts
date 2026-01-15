import { useChartAccountsStore, useResourceStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'

export const useAccountingAccount = (props: any, emit: any) => {
  const { data_modal } = storeToRefs(useChartAccountsStore('v1'))
  const { _getAccountingResources } = useResourceStore('v1')

  const { _setDataModalForm } = useChartAccountsStore('v1')

  const isModalOpen = ref(props.isOpen)
  const isEditing = computed(() => !!props.itemEdit)

  const keys = ['account_chart_types']

  const formInformationModal = ref()

  const onSubmit = async () => {
    let valid = true

    await formInformationModal.value
      ?.validateForm()
      .then((success: boolean) => {
        valid = success
      })
      .catch(() => {
        valid = false
      })

    if (valid) {
      emit('save', { ...data_modal.value }, isEditing.value)
      closeModal()
    }
  }

  const closeModal = () => {
    isModalOpen.value = false
    _setDataModalForm(null)
    emit('update:isOpen', false)
  }

  onMounted(async () => {
    await _getAccountingResources(`keys[]=${keys.join('&keys[]=')}`)
  })

  watch(
    () => props.isOpen,
    (newVal) => {
      isModalOpen.value = newVal
    }
  )

  return {
    isModalOpen,
    isEditing,
    formInformationModal,
    onSubmit,
    closeModal,
  }
}
