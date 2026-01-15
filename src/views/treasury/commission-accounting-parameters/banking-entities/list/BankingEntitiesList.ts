import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { QTable } from 'quasar'
import { storeToRefs } from 'pinia'
import { useBankingEntitiesAccountingParametersCommissionsStore } from '@/stores/treasury'
import { IBankingEntitiesAccountingParametersCommissions } from '@/interfaces/customs'
import { useMainLoader, useRouteValidator } from '@/composables'

const useBankingEntitiesList = (props: { selectID?: number }) => {
  const router = useRouter()
  const store = useBankingEntitiesAccountingParametersCommissionsStore('v1')
  const {
    _getBankingEntitiesAccountingParametersCommissionsList,
    _deleteBankingEntitiesAccountingParametersCommissions,
  } = store
  const { banking_entities_list } = storeToRefs(store)
  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()

  const headerProps = {
    title: 'Entidades bancarias',
    breadcrumbs: [{ label: '' }],
  }

  const tableProps = ref({
    loading: false,
    columns: [
      {
        name: 'id',
        label: '#',
        field: 'id',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'bank',
        label: 'Banco',
        field: (row: IBankingEntitiesAccountingParametersCommissions) =>
          row.bank?.description ?? '-',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'description',
        label: 'Descripción',
        field: 'description',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'treasury_movement_code',
        label: 'Movimiento de tesorería',
        field: (row: IBankingEntitiesAccountingParametersCommissions) =>
          typeof row.treasury_movement_code === 'object' &&
          row.treasury_movement_code
            ? `${row.treasury_movement_code.description} - ${row.treasury_movement_code.code}`
            : row.treasury_movement_code ?? '-',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'validates_collection_method',
        label: '¿Valida Forma de Recaudo?',
        field: 'validates_collection_method',
        align: 'left',
        sortable: true,
        required: true,
        format: (val: boolean) => (val ? 'Sí' : 'No'),
      },
      {
        name: 'commission_percentage',
        label: 'Porcentaje comisión',
        field: 'commission_percentage',
        align: 'left',
        sortable: true,
        required: true,
        format: (val: string) => (val ? `${parseFloat(val).toFixed(2)}%` : '-'),
      },
      {
        name: 'fixed_value',
        label: 'Valor fijo',
        field: 'fixed_value',
        align: 'left',
        sortable: true,
        required: true,
        format: (val: string) =>
          val
            ? `$${parseFloat(val).toLocaleString('es-CO', {
                minimumFractionDigits: 2,
              })}`
            : '-',
      },
      {
        name: 'commission_type',
        label: 'Tipo de comisión',
        field: 'commission_rate',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'observations',
        label: 'Observaciones',
        field: 'observations',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'actions',
        label: 'Acciones',
        field: 'actions',
        align: 'left',
        sortable: false,
        required: true,
      },
    ] as QTable['columns'],
    rows: [] as IBankingEntitiesAccountingParametersCommissions[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
    rowsPerPage: 20,
    selection: 'multiple',
    selected: ref([]),
  })

  const handlerGoTo = (goURL: string) => {
    if (props.selectID) {
      router.push({
        name: goURL,
        params: { selectID: String(props.selectID) },
      })
    }
  }

  const listAction = async (accounting_blocks_collections_id: number) => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getBankingEntitiesAccountingParametersCommissionsList('',
      accounting_blocks_collections_id
    )
    tableProps.value.loading = false
  }

  watch(
    banking_entities_list,
    (newList) => {
      tableProps.value.rows = Array.isArray(newList) ? newList : []
    },
    { immediate: true }
  )

  watch(
    () => props.selectID,
    (newId) => {
      if (newId !== undefined && newId !== null) {
        listAction(newId)
      }
    },
    { immediate: true }
  )
  const alertModalRef = ref()
  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '¿Desea eliminar la entidad bancaria seleccionada?',
    id: null as number | null,
  })

  const handleEdit = (id: number) => {
    router.push({
      name: 'BankingEntitiesAccountingParametersCommissionsEdit',
      params: { id: String(id), selectID: String(props.selectID) },
    })
  }

  const handleDelete = async (id: number) => {
    if (id) {
      alertModalConfig.value.id = id
      await alertModalRef.value.openModal()
    }
  }

  const changeStatus = async () => {
    openMainLoader(true)
    await alertModalRef.value.closeModal()
    if (!alertModalConfig.value.id) return
    await _deleteBankingEntitiesAccountingParametersCommissions(
      alertModalConfig.value.id
    )
    await listAction(props.selectID!)
    openMainLoader(false)
  }

  const deleteBankingEntity = async () => {
    await alertModalRef.value.closeModal()
    if (!alertModalConfig.value.id) return
    await _deleteBankingEntitiesAccountingParametersCommissions(
      alertModalConfig.value.id
    )
    await listAction(props.selectID!)
  }

  return {
    tableProps,
    headerProps,
    alertModalConfig,
    alertModalRef,
    deleteBankingEntity,
    handlerGoTo,
    handleEdit,
    handleDelete,
    changeStatus,
    validateRouter,
  }
}

export default useBankingEntitiesList
