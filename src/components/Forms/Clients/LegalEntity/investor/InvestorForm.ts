import { QTable } from 'quasar'
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useClientsStore } from '@/stores'
import { ILegalClientInvestor } from '@/interfaces/customs/Clients'

const useInvestorForm = (props: any) => {
  const { data_investor_legal_form } = storeToRefs(useClientsStore('v1'))
  const { _setDataLegalCLientsInvestor } = useClientsStore('v1')

  const formInvestor = ref()

  const models = ref({
    investors: [] as any[],
  })

  const isEmpty = (obj: Record<string, any>): boolean => {
    return Object.values(obj).every(
      (value) => value === 0 || value === '' || value === null
    )
  }

  const handlerActionForm = (action: 'create' | 'edit' | 'view') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: data_investor_legal_form.value ? _setValueModel : setFormEdit,
      view: setFormView,
    }

    actionHandlers[action]?.()
  }

  const setFormView = () => {
    clearForm()
    const data: ILegalClientInvestor = props.data
    if (data) {
      models.value.investors = data?.investors ?? []
    }
  }

  const setFormEdit = () => {
    clearForm()
    const data: ILegalClientInvestor = props.data
    if (data) {
      models.value.investors = data?.investors ?? []
    }
  }

  const _setValueModel = () => {
    if (data_investor_legal_form.value) {
      models.value = { ...data_investor_legal_form.value }
    }
  }

  const clearForm = () => {
    models.value.investors = []
  }

  const tableProps = ref({
    title: 'Lista de inversionistas agregados',
    loading: false,
    columns: [
      {
        name: 'number',
        required: false,
        label: '#',
        align: 'left',
        field: '',
        sortable: true,
      },
      {
        name: 'name',
        required: true,
        label: 'Nombre',
        align: 'left',
        field: (row: any) => `${row.name}`,
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: [] as any[],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  const fetchInvestors = () => {
    tableProps.value.rows = []
    tableProps.value.loading = true

    tableProps.value.rows = []

    tableProps.value.loading = false
  }

  onMounted(async () => {
    fetchInvestors()
    handlerActionForm(props.action)
  })

  watch(
    () => [models.value.investors],
    () => {
      if (isEmpty(models.value)) {
        _setDataLegalCLientsInvestor(null)
      } else {
        _setDataLegalCLientsInvestor({
          investors: models.value.investors ?? [],
        })
      }
    }
  )

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    }
  )

  return { models, formInvestor, tableProps }
}

export default useInvestorForm
