// vue - pinia
import { computed, onMounted, ref, watch } from 'vue'
import { QTable } from 'quasar'
import { storeToRefs } from 'pinia'

// interfaces
import {
  IBusinessDerivedContracting,
  IDerivateWorksPlan,
} from '@/interfaces/customs/trust-business/TrustBusinesses'

// stores
import { ActionType } from '@/interfaces/global'
import { useDerivativeContractingResourceStore } from '@/stores/resources-manager/derivative-contracting'
import { useUtils } from '@/composables'

const { work_plan } = storeToRefs(useDerivativeContractingResourceStore('v1'))

const isEmpty = useUtils().isEmptyOrZero

const useDerivedContracting = (
  props: {
    action: ActionType
    data?: IBusinessDerivedContracting | null
  },
  emit: Function
) => {
  const models = ref<IBusinessDerivedContracting>({
    has_budget: null,
    has_project: null,
    has_structure_work: null,
    derivate_works_plan: [],
    works_plan: [],
  })

  const derived_contracting_trut_business_form_ref = ref()
  const currentPage = ref(1)
  const perPage = ref(10)
  const pageList = ref([10, 25, 50])

  const tableProps = ref({
    loading: false,
    title: 'Listado Plan de Obras',
    columns: [
      {
        name: 'uid',
        field: 'uid',
        required: false,
        label: '#',
        align: 'left',
      },
      {
        name: 'id',
        field: 'id',
        required: false,
        label: 'Plan de obras',
        align: 'left',
      },
      ...(props.action !== 'view'
        ? [
            {
              name: 'actions',
              required: true,
              label: 'Acciones',
              align: 'center',
              field: 'actions',
            },
          ]
        : []),
    ] as QTable['columns'],
    rows: [] as IDerivateWorksPlan[],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
    rowsPerPage: 10,
  })

  const idsInArray = computed(() =>
    models.value.derivate_works_plan.map((fl) => {
      return fl.work_plan_id
    })
  )

  const addRegister = () => {
    models.value.derivate_works_plan.unshift({
      work_plan_id: null,
    })

    const newLastPage = Math.ceil(
      models.value.derivate_works_plan.length / perPage.value
    )

    tableProps.value.pages.lastPage = newLastPage

    currentPage.value = 1
    tableProps.value.pages.currentPage = 1
    tableProps.value.pages.lastPage = Math.ceil(
      models.value.derivate_works_plan.length / perPage.value
    )
  }

  const removeRegister = (index: number) => {
    models.value.derivate_works_plan.splice(index, 1)

    const newLastPage =
      Math.ceil(models.value.derivate_works_plan.length / perPage.value) || 1
    tableProps.value.pages.lastPage = newLastPage

    if (currentPage.value > newLastPage) {
      currentPage.value = newLastPage
      tableProps.value.pages.currentPage = newLastPage
    }
    tableProps.value.pages.lastPage = Math.ceil(
      models.value.derivate_works_plan.length / perPage.value
    )
  }

  const _setValueModel = () => {
    if (props.data) {
      models.value = { ...props.data }
    }
  }

  const _setFormView = () => {
    if (props.data) {
      const data = { ...props.data }
      models.value = {
        ...data,
      }
    }
  }

  const handlerActionForm = (action: ActionType) => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: _setValueModel,
      view: _setFormView,
    }
    actionHandlers[action]?.()
  }

  const paginatedRows = computed(() => {
    const start = (currentPage.value - 1) * perPage.value
    const end = start + perPage.value
    return models.value.derivate_works_plan.slice(start, end)
  })

  const updatePage = async (page: number) => {
    currentPage.value = page
    tableProps.value.pages.currentPage = page
  }

  const updatePerPage = async (rowsPerPage: number) => {
    perPage.value = rowsPerPage
    currentPage.value = 1
    tableProps.value.pages.lastPage = Math.ceil(
      models.value.derivate_works_plan.length / rowsPerPage
    )
  }
  onMounted(async () => {
    handlerActionForm(props.action)
  })

  watch(
    () => models.value,
    () => {
      if (isEmpty(models.value)) {
        emit('update:models', null)
      } else {
        emit('update:models', models.value)
      }
    },
    {
      deep: true,
    }
  )

  watch(
    () => models.value.has_structure_work,
    (newValue) => {
      if (newValue == false) {
        models.value.works_plan = []
      }
    }
  )

  return {
    models,
    derived_contracting_trut_business_form_ref,
    tableProps,
    paginatedRows,
    updatePage,
    updatePerPage,
    addRegister,
    removeRegister,
    perPage,
    currentPage,
    pageList,
    work_plan,
    idsInArray,
  }
}

export default useDerivedContracting
