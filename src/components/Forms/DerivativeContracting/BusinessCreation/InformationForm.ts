// Vue - Pinia - Router - Quasar
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Interfaces
import {
  IBusinessCreationForm,
  IBusinessPlanTable,
  IILoadedRecordPages,
} from '@/interfaces/customs/derivative-contracting/IBusinessCreation'

// Stores
import {
  useTrustBusinessResourceStore,
  useDerivativeContractingResourceStore,
} from '@/stores/resources-manager'

const useBasicDataForm = () => {
  const { business_trusts_derivate_contracting } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )

  const { work_plan } = storeToRefs(useDerivativeContractingResourceStore('v1'))

  const formElementRef = ref()

  const models = ref<IBusinessCreationForm>({
    business_trusts: null,
    manage_budget: false,
    manage_proyects: false,
    manage_works_structures: false,
    work_plan_business: [],
  })

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: IBusinessPlanTable[]
    pages: IILoadedRecordPages
  }>({
    title: 'Planes de obras de negocio',
    loading: false,
    columns: [
      { name: 'id', label: '#', field: 'id', align: 'left', sortable: true },
      {
        name: 'plan',
        label: 'Plan',
        field: 'plan',
        align: 'left',
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ],
    rows: [],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const statusDisplay = computed(() => {
    const trust = models.value.business_trusts
    const statusSource = trust?.status || trust?.staus
    return statusSource?.status ?? ''
  })

  const typeDisplay = computed(() => {
    return models.value.business_trusts?.type?.name ?? ''
  })

  const subTypeDisplay = computed(() => {
    const trust = models.value.business_trusts
    const subTypeSource = trust?.sub_type || trust?.subType
    return subTypeSource?.name ?? ''
  })

  const addPlanFromTable = (): void => {
    const newPlan: IBusinessPlanTable = {
      id: models.value.work_plan_business.length + 1,
      plan: null,
    }
    models.value.work_plan_business.push(newPlan)
    tableProps.value.rows = [...models.value.work_plan_business]
  }

  const removePlanFromTable = (index: number): void => {
    models.value.work_plan_business.splice(index, 1)
    models.value.work_plan_business.forEach((item, idx) => {
      item.id = idx + 1
    })
    tableProps.value.rows = [...models.value.work_plan_business]
  }

  const getFormData = (): IBusinessCreationForm => {
    return models.value
  }

  const resetForm = (): void => {
    models.value = {
      business_trusts: null,
      manage_budget: false,
      manage_proyects: false,
      manage_works_structures: false,
      work_plan_business: [],
    }
    tableProps.value.rows = []
  }

  return {
    models,
    formElementRef,
    tableProps,

    statusDisplay,
    typeDisplay,
    subTypeDisplay,
    business_trusts_derivate_contracting,
    work_plan,

    removePlanFromTable,
    addPlanFromTable,
    getFormData,
    resetForm,
  }
}

export default useBasicDataForm
