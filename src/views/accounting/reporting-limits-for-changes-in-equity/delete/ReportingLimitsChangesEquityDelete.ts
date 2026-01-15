import { onBeforeMount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import {
  IFieldFilters,
  FilterFields,
  IBusinessTrustTableRow,
  IAccountStructureFilter,
} from '@/interfaces/customs'
import {
  useAccountingResourceStore,
  useResourceManagerStore,
  useReportingLimitsForChangesInEquityStore,
} from '@/stores'

const useReportingLimitsForChangesInEquityDelete = () => {
  const {
    account_structures_with_purpose,
    business_trusts_with_description_by_account_structure,
  } = storeToRefs(useAccountingResourceStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _deleteReportingLimits } =
    useReportingLimitsForChangesInEquityStore('v1')

  let lastAccountStructureId: number | null
  const selected = ref<IBusinessTrustTableRow[]>([])

  const router = useRouter()

  const headerProps = {
    title: 'Límites de reporte cambios en el patrimonio',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad', route: '' },
      {
        label: 'Límites de reporte cambios en el patrimonio',
        route: 'ReportingLimitsChangesEquityList',
      },
      { label: 'Eliminar', route: '' },
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'account_structure_id',
      label: 'Estructura contable',
      type: 'q-select',
      value: null,
      clean_value: true,
      class: 'col-12 col-md-4',
      disable: false,
      autocomplete: true,
      options: account_structures_with_purpose,
      placeholder: 'Seleccione',
    },
  ])

  const businessTableProps = ref({
    loading: false,
    columns: [
      {
        name: 'business',
        label: 'Negocio',
        align: 'left' as const,
        field: (row: IBusinessTrustTableRow) =>
          `${row.business_code} - ${row.business_description}`,
        sortable: true,
      },
    ],
    rows: [] as IBusinessTrustTableRow[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const alertModalRef = ref()
  const alertModalConfig = ref({
    title: '¿Desea eliminar los límites para el negocio seleccionado?',
    description_message: '',
    id: [] as number[],
  })

  const handleDeleteItem = async () => {
    if (!selected.value.length) return
    alertModalConfig.value.id = selected.value.map((b) => b.id)
    if (alertModalRef.value) {
      await alertModalRef.value.openModal()
    }
  }

  const filtersFormat = ref<FilterFields>({})

  const handleFilter = async (filters: IAccountStructureFilter) => {
    let accountStructureId =
      filters['filter[account_structure_id]'] ?? filters.account_structure_id

    if (typeof accountStructureId === 'object') {
      accountStructureId = accountStructureId?.id
    }
    if (!accountStructureId) return

    lastAccountStructureId = Number(accountStructureId)

    const keyBusiness = {
      accounting: [
        `business_trusts_with_description_by_account_structure&filter[account_structures_id]=${accountStructureId}&filter[only_with_equity_change_limits]=1`,
      ],
    }

    await _getResources(keyBusiness)
    businessTableProps.value.rows =
      business_trusts_with_description_by_account_structure.value as IBusinessTrustTableRow[]
  }

  const handleClear = async () => {
    filtersFormat.value = {}
    businessTableProps.value.rows = []
    filterConfig.value.forEach((f) => {
      f.value = null
    })
  }

  const handleGoTo = () => {
    router.push({ name: 'ReportingLimitsChangesEquityCreate' })
  }

  const disableDeleteButton = () => selected.value.length === 0

  const handleDestroy = async () => {
    if (!alertModalConfig.value.id.length || !lastAccountStructureId) return

    const businessIds = alertModalConfig.value.id

    const queryParams = new URLSearchParams()
    queryParams.append('account_structure_id', String(lastAccountStructureId))
    businessIds.forEach((id) => queryParams.append('business[]', String(id)))

    const success = await _deleteReportingLimits(queryParams.toString())

    if (success) {
      businessTableProps.value.rows = businessTableProps.value.rows.filter(
        (row) => !businessIds.includes(row.id)
      )
      selected.value = []
    }

    alertModalConfig.value.id = []
    if (alertModalRef.value) await alertModalRef.value.closeModal()
  }

  onMounted(async () => {
    _getResources({ accounting: ['account_structures_with_purpose'] })
  })

  onBeforeMount(async () => {
    await _resetKeys({ accounting: ['account_structures_with_purpose'] })
  })

  return {
    headerProps,
    filterConfig,
    selected,
    businessTableProps,
    alertModalConfig,
    alertModalRef,
    handleDeleteItem,
    disableDeleteButton,
    handleFilter,
    handleDestroy,
    handleGoTo,
    handleClear,
  }
}

export default useReportingLimitsForChangesInEquityDelete
