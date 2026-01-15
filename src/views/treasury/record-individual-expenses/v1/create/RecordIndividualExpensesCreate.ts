import { useGoToUrl } from '@/composables'
import {
  IDetailOfIndividualExpensesFilterRequest,
  IDetailOfIndividualExpensesRequest,
} from '@/interfaces/customs'
import router from '@/router'
import {
  useRecordIndividualExpensesStore,
  useTreasuryResourceStore,
} from '@/stores'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const useRecordIndividualExpensesCreate = () => {
  const detailOfIndividualBasicDataRef = ref()
  const {
    data_list,
    data_information_form,
    successValidateDetail,
    successValidateCreate,
    is_editing,
  } = storeToRefs(useRecordIndividualExpensesStore('v1'))

  const { active_third_parties } = storeToRefs(useTreasuryResourceStore('v1'))
  const { _postRecordIndividualExpensesValidateDetail } =
    useRecordIndividualExpensesStore('v1')
  const { goToURL } = useGoToUrl()

  const headerProperties = ref({
    title: 'Detalle egresos individuales',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Tesorería',
        route: 'RecordIndividualExpensesCreate',
      },
      {
        label: 'Egresos individuales',
        route: 'RecordIndividualExpensesCreate',
      },
      {
        label: 'Detalle',
        route: 'RecordIndividualExpensesCreate',
      },
    ],
  })

  const validateForm = async () => {
    return (await detailOfIndividualBasicDataRef.value?.validateForm()) ?? false
  }

  const getModels = async () => {
    return (await detailOfIndividualBasicDataRef.value?.getModels()) ?? false
  }

  const maxId = () =>
    data_list.value.reduce(
      (max, item) => (item.id != null ? Math.max(max, item.id) : max),
      0
    )

  const handlerGoTo = (goURL: string) => {
    goToURL(goURL)

    successValidateCreate.value = !successValidateCreate.value
    is_editing.value = false
  }

  const onSubmit = async () => {
    successValidateDetail.value = false
    if (await validateForm()) {
      const models = await getModels()
      const validateDetail = {
        ...(data_information_form.value as IDetailOfIndividualExpensesFilterRequest),
        details: [
          {
            ...models,
            identification_authorized:
              active_third_parties.value.find(
                (item) => item.id === models.value.identification_authorized
              )?.document ?? null,
          } as IDetailOfIndividualExpensesRequest,
        ],
      }

      await _postRecordIndividualExpensesValidateDetail(validateDetail)


      if (successValidateDetail.value) {
        const item = {
          ...models,
          id: maxId() + 1,
        }
        data_list.value = [...data_list.value, item]

        router.push({
          name: 'RecordIndividualExpensesList',
        })
      }
    }
  }

  return {
    headerProperties,
    detailOfIndividualBasicDataRef,
    onSubmit,
    handlerGoTo,
  }
}

export default useRecordIndividualExpensesCreate
