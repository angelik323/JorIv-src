// Vue - Pinia - Quasar
import { ref, watch, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Interfaces
import { IAccountingParametersAssociatedBusinessesList } from '@/interfaces/customs/fics/AssociatedBusinesses'

// Composables
import { useUtils } from '@/composables'

// Stores
import { useAccountingParametersAssociatedBusinessesStore } from '@/stores/fics/accounting-parameters/associated-businesses'
import { useAccountingParametersAccountingBlockStore } from '@/stores/fics/accounting-parameters/accounting-block'

const useAssociatedBusinessesList = () => {
  const { _getAssociatedBusinesses, _clearDataAssociatedBusinesses } =
    useAccountingParametersAssociatedBusinessesStore('v1')

  const { associated_businesses_list, associated_businesses_pages } =
    storeToRefs(useAccountingParametersAssociatedBusinessesStore('v1'))

  const { accounting_block_selected } = storeToRefs(
    useAccountingParametersAccountingBlockStore('v1')
  )

  const { defaultIconsLucide, formatParamsCustom } = useUtils()

  const tableProps = ref({
    title: 'Negocios asociados',
    customNoDataMessageTitle: 'Selecciona un bloque contable.',
    customNoDataMessageSubtitle: 'Aquí visualizará los negocios asociados.',
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'center',
        field: 'id',
        sortable: true,
      },
      {
        name: 'business_code',
        required: false,
        label: 'Negocio',
        align: 'center',
        field: 'business_code',
        sortable: true,
      },
      {
        name: 'name',
        required: false,
        label: 'Descripción',
        align: 'center',
        field: 'name',
        sortable: true,
      },
      {
        name: 'status_id',
        required: false,
        label: 'Estado',
        align: 'center',
        field: 'status_id',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IAccountingParametersAssociatedBusinessesList,
    pages: associated_businesses_pages.value,
  })

  const filtersFormat = ref<Record<string, string | number>>({
    type: String(accounting_block_selected.value?.business_group?.id || 0),
    accounting_structure: String(
      accounting_block_selected.value?.accounting_plan?.id || 0
    ),
    cost_center_structure: String(
      accounting_block_selected.value?.plan_cost_center?.id || 0
    ),
  })

  const handleFilter = async ($filters: {
    'filter[type]': string
    'filter[accounting_structure]': string
    'filter[cost_center_structure]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
    }

    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getAssociatedBusinesses(filters)
    tableProps.value.loading = false
  }

  const updatePage = async (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const updatePerPage = (rowsPerPage: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rowsPerPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  onBeforeUnmount(() => {
    _clearDataAssociatedBusinesses()
  })

  watch(
    () => associated_businesses_list.value,
    () => {
      tableProps.value.rows = associated_businesses_list.value
      tableProps.value.pages = {
        ...tableProps.value.pages,
        ...associated_businesses_pages.value,
      }
    }
  )

  watch(
    () => accounting_block_selected.value,
    (newAccountingBlock) => {
      if (newAccountingBlock) {
        handleFilter({
          'filter[type]': String(newAccountingBlock.business_group_id),
          'filter[accounting_structure]': String(
            newAccountingBlock.accounting_plan_id
          ),
          'filter[cost_center_structure]': String(
            newAccountingBlock.plan_cost_center_id ?? ''
          ),
        })
      } else tableProps.value.rows = []
    },
    { immediate: true }
  )

  return {
    tableProps,
    updatePage,
    updatePerPage,
    defaultIconsLucide,
  }
}

export default useAssociatedBusinessesList
