import { useGoToUrl, useAlert } from '@/composables'
import router from '@/router'
import { useRecordIndividualExpensesStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const useRecordIndividualExpensesEdit = () => {
  const detailOfIndividualBasicDataRef = ref()
  const { data_list, record, is_editing } = storeToRefs(
    useRecordIndividualExpensesStore('v1')
  )
  const { goToURL } = useGoToUrl()
  const { showAlert } = useAlert()
  const headerProperties = ref({
    title: 'Editar detalle egresos individuales',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Tesorería',
        route: 'RecordIndividualExpensesEdit',
      },
      {
        label: 'Detalle egresos individuales',
        route: 'RecordIndividualExpensesEdit',
      },
      {
        label: 'Detalle',
        route: 'RecordIndividualExpensesEdit',
      },
    ],
  })

  const validateForm = async () => {
    return (await detailOfIndividualBasicDataRef.value?.validateForm()) ?? false
  }

  const getModels = async () => {
    return (await detailOfIndividualBasicDataRef.value?.getModels()) ?? false
  }

  const onSubmit = async () => {
    if (await validateForm()) {
      const models = await getModels()
      const index = data_list.value.findIndex((item) => item.id === models.id)

      if (index !== -1) {
        data_list.value[index] = models
      }

      showAlert('Registro actualizado exitosamente', 'success')

      router.push({
        name: 'RecordIndividualExpensesList',
      })
    }
    is_editing.value = false
  }

  const handlerGoTo = (goURL: string) => {
    goToURL(goURL)
    is_editing.value = false
  }

  return {
    headerProperties,
    detailOfIndividualBasicDataRef,
    record,
    onSubmit,
    handlerGoTo,
  }
}

export default useRecordIndividualExpensesEdit
