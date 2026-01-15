// Vue - Pinia - Quasar
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Interfaces
import { IConsolidatedInvestment } from '@/interfaces/customs/fics/ConsolidatedInvestment'

// Composables
import { useGoToUrl, useUtils } from '@/composables'

// Stores
import { useConsolidatedInvestmentStore } from '@/stores/fics/consolidated-investment'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useConsolidatedInvestmentList = () => {
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()

  const consolidatedInvestmentStore = useConsolidatedInvestmentStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const {
    consolidator_funds_list,
    consolidator_funds_pages,
    consolidator_funds_compartments_list,
    consolidator_funds_compartments_pages,
  } = storeToRefs(consolidatedInvestmentStore)
  const {
    _listAction,
    _createAction,
    _deleteAction,
    _createActionAssign,
    _listActionCompartments,
  } = consolidatedInvestmentStore

  const customColumns = ['radio_button', 'actions']

  const keys = {
    accounting: ['business_trusts_basic'],
    fics: ['funds'],
  }

  const selectedFundId = ref<number | null>(null)
  const informationFormRefAssign = ref()
  const openModalAssign = ref(false)
  const informationFormRef = ref()
  const openModal = ref(false)
  const alertModalRef = ref()
  const selectedRow = ref(0)

  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '¿Desea eliminar el compartimiento?',
    id: null as number | null,
  })

  const onSelectionChange = async (id: number) => {
    selectedRow.value = id

    if (id) {
      const fundId = selectedRow.value
      selectedFundId.value = fundId
      await _listActionCompartments(fundId)
    } else {
      selectedFundId.value = null
      tablePropertiesBehavior.value.rows = []
    }
  }

  const headerProperties = {
    title:
      'Creación fondo de inversión consolidador y asignación compartimentos',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label:
          'Creación fondo de inversión consolidador y asignación compartimentos',
        route: 'ConsolidatedInvestmentList',
      },
    ],
  }

  const tableProperties = ref({
    loading: false,
    columns: [
      {
        name: 'radio_button',
        required: true,
        label: '',
        align: 'center',
        field: 'radio_button',
        sortable: true,
      },
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'code',
        required: true,
        label: 'Código fondo',
        align: 'left',
        field: 'code',
        sortable: true,
      },
      {
        name: 'description',
        required: true,
        label: 'Descripción fondo',
        align: 'left',
        field: 'description',
        sortable: true,
      },
      {
        name: 'type',
        required: true,
        label: 'Negocio',
        align: 'left',
        field: (row) =>
          `${row.business_trusts?.business_code || ''} - ${
            row.business_trusts?.name || ''
          }`,
        sortable: true,
      },
    ] as QTable['columns'],
    selection: 'multiple',
    rows: [] as IConsolidatedInvestment[],
    pages: consolidator_funds_pages,
  })

  const tablePropertiesBehavior = ref({
    loading: false,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: 'compartment_id',
        sortable: true,
      },
      {
        name: 'fund_code',
        required: true,
        label: 'Código fondo',
        align: 'left',
        field: 'fund_code',
        sortable: true,
      },
      {
        name: 'fund_name',
        required: true,
        label: 'Descripción fondo',
        align: 'left',
        field: 'fund_name',
        sortable: true,
      },
      {
        name: 'business_code',
        required: true,
        label: 'Negocio',
        align: 'left',
        field: 'business_code',
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
    selection: 'multiple',
    rows: consolidator_funds_compartments_list,
    pages: consolidator_funds_compartments_pages,
  })

  const loadData = async (filters: string = 'paginate=1') => {
    tableProperties.value.loading = true

    await _listAction(filters)

    setTimeout(() => (tableProperties.value.loading = false), 1000)
  }

  const handleOptions = async (option: string, id: number) => {
    if (option === 'view') goToURL('ConsolidatedInvestmentView', id)
    else if (option === 'edit') goToURL('ConsolidatedInvestmentEdit', id)
  }

  const handleCreate = async () => {
    const formComponent = informationFormRef.value

    if (!formComponent) return

    const isValid = await formComponent.validateForm?.()

    if (!isValid) return

    const payload = formComponent.getPayload?.()

    if (
      !payload?.code ||
      !payload?.description ||
      !payload?.business_trust_id
    ) {
      return
    }

    const success = await _createAction(payload)

    if (success) {
      openModal.value = false
      await loadData()
    }
  }

  const handleAssign = async () => {
    const formComponent = informationFormRefAssign.value

    if (!formComponent) return

    const isValid = await formComponent.validateForm?.()
    if (!isValid) return

    const formPayload = formComponent.getPayload?.()
    if (!formPayload?.collective_investment_fund_id) return

    const payload = {
      consolidator_fund_id: selectedRow.value,
      collective_investment_fund_id: formPayload.collective_investment_fund_id,
    }

    const success = await _createActionAssign(payload)

    if (success) {
      openModalAssign.value = false
      await _listActionCompartments(selectedRow.value)
    }
  }

  const handleGoToCreate = () => (openModal.value = true)

  const deleteRowValidation = async (id: number): Promise<void> => {
    if (id) {
      alertModalConfig.value.id = id
      await alertModalRef.value.openModal()
    }
  }

  const handleDelete = async () => {
    if (!alertModalConfig.value.id) return

    const success = await _deleteAction(alertModalConfig.value.id)

    if (success) {
      if (selectedRow.value != null) {
        await _listActionCompartments(selectedRow.value)

        tablePropertiesBehavior.value.rows = [
          ...consolidator_funds_compartments_list.value,
        ]
      } else {
        await loadData()
      }
    }

    await alertModalRef.value.closeModal()
  }

  const handleUpdatePage = async (page: number, type?: string) => {
    if (type !== 'detail') await loadData(`page=${page}&paginate=1`)
    else await _listActionCompartments(selectedRow.value, `page=${page}`)
  }

  const handleUpdateRowsPerPage = async (
    rowsPerPage: number,
    type?: string
  ) => {
    if (type !== 'detail') await loadData(`rows=${rowsPerPage}&paginate=1`)
    else await _listActionCompartments(selectedRow.value, `rows=${rowsPerPage}`)
  }

  onMounted(async () => {
    await loadData()

    await _getResources({
      trust_business: ['business_trusts'],
      fics: ['funds'],
    })
  })

  onBeforeUnmount(() => _resetKeys(keys))

  watch(
    () => consolidator_funds_list.value,
    () => {
      tableProperties.value.rows = consolidator_funds_list.value
      tableProperties.value.pages = consolidator_funds_pages.value
    }
  )

  return {
    openModal,
    selectedRow,
    handleCreate,
    handleAssign,
    handleDelete,
    handleOptions,
    customColumns,
    alertModalRef,
    selectedFundId,
    openModalAssign,
    tableProperties,
    handleUpdatePage,
    headerProperties,
    alertModalConfig,
    handleGoToCreate,
    onSelectionChange,
    informationFormRef,
    defaultIconsLucide,
    deleteRowValidation,
    handleUpdateRowsPerPage,
    tablePropertiesBehavior,
    informationFormRefAssign,
  }
}

export default useConsolidatedInvestmentList
