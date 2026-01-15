import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

// Utils
import { isEmptyOrZero } from '@/utils'

// Interfaces
import { IDescriptionsForm, IDescriptionsTable } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'
import { QTable } from 'quasar'

// Stores
import { useFiduciaryBusinessCommissionsStore } from '@/stores'
import { storeToRefs } from 'pinia'

const useDescriptionsForm = (
  props: {
    action: ActionType
    data: IDescriptionsForm | null
  },
  emit: Function
) => {
  const formElementRef = ref()
  const { _getByIdDescriptionsFiduciaryBusinessCommissions } =
    useFiduciaryBusinessCommissionsStore('v1')
  const {
    fiduciary_business_commissions_descriptions,
    fiduciary_business_commissions_pages,
  } = storeToRefs(useFiduciaryBusinessCommissionsStore('v1'))

  const route = useRoute()
  const searchId = +route.params.id
  let perPage = 20

  const initialModelsValues: IDescriptionsForm = {
    observation: null,
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const filtersFormat = ref<Record<string, string | number>>({})

  const tableProps = ref({
    title: 'Descripciones de las comisiones del negocio fiduciario',
    loading: false,
    columns: [
      {
        name: 'id',
        field: 'id',
        required: false,
        label: '#',
        align: 'left',
        sortable: true,
      },
      {
        name: 'description',
        field: 'description',
        required: true,
        label: 'Descripción',
        align: 'left',
        sortable: true,
      },
      ...(props.action !== 'edit'
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
    rows: [] as IDescriptionsTable[],
    pages: fiduciary_business_commissions_pages.value,
  })

  const listAction = async (filters: Record<string, string | number>) => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getByIdDescriptionsFiduciaryBusinessCommissions(searchId, filters)
    tableProps.value.loading = false
  }

  const updatePage = async (page: number) => {
    await listAction({
      ...filtersFormat.value,
      rows: perPage,
      page,
    })
  }

  const updatePerPage = async (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rowsPerPage,
      page: 1,
    }
    await listAction(filtersFormat.value)
  }

  const _setValueModel = () => {
    if (!props.data) return
    models.value = { ...props.data }
  }

  // Sincroniza el modelo con la prop 'data'
  watch(
    () => props.data,
    (val) => {
      if (!val) return
      _setValueModel()
    },
    { deep: true, immediate: true }
  )

  watch(
    models,
    (val) => {
      // Evita bucle infinito
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  watch(
    fiduciary_business_commissions_descriptions,
    () => {
      tableProps.value.rows = [
        ...fiduciary_business_commissions_descriptions.value,
      ]

      const { currentPage, lastPage } =
        fiduciary_business_commissions_pages.value

      tableProps.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  return {
    formElementRef,
    models,
    tableProps,
    updatePage,
    updatePerPage,
  }
}

export default useDescriptionsForm
