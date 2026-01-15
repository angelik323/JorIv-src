// Vue - pinia
import { ref, toRaw, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ActionType, IBaseTableProps } from '@/interfaces/global'
import {
  IConsolidationTree,
  IConsolidationTreeChild,
  IRequestCreateConsolidationTree,
  IRequestUpdateConsolidationTree,
} from '@/interfaces/customs/accounting/ConsolidationTree'

// Composables
import { useAlert, useUtils } from '@/composables'

// Stores
import { useConsolidationTreeStore } from '@/stores/accounting/consolidation-tree'
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'

const useBasicDataForm = (props: {
  action: ActionType
  data?: IConsolidationTree | null
}) => {
  const { showAlert } = useAlert()
  const { defaultIconsLucide, isEmptyOrZero, formatDate } = useUtils()

  const { data_basic_consolidation_tree } = storeToRefs(
    useConsolidationTreeStore('v1')
  )
  const {
    _setDataBasicConsolidationTree,
    _getBusinessByID,
    _getBusinessByCode,
    _setConsolidationTreeRequestUpdate,
    _setConsolidationTreeRequestCreate,
    _setConsolidationTreeChildrens,
  } = useConsolidationTreeStore('v1')

  const { _getResources } = useResourceManagerStore('v1')
  const { bussines_parent, bussines_child } = storeToRefs(
    useAccountingResourceStore('v1')
  )
  const { business_trust_statuses } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )

  const consolidationTreeFormRef = ref()

  const initialModelsValues: IConsolidationTree = {
    id: 0,
    code: '',
    name: '',
    status_id: '',
    accounting_structure: {
      id: 0,
      code: '',
      purpose: '',
    },
    childrens: [],
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const perPage = ref(20)

  const modelRequestUpdate = ref<IRequestUpdateConsolidationTree>({
    parent_id: 0,
    new_childs_ids: [],
    remove_childs_ids: [],
  })

  const modelRequestCreate = ref<IRequestCreateConsolidationTree>({
    parent_id: 0,
    child_ids: [],
  })

  const backupModels = ref<IConsolidationTree | null>(null)

  const tableProps = ref<IBaseTableProps<IConsolidationTreeChild>>({
    title: 'Listado de negocios consolidados',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: (row) => (row.id != 0 ? row.id : ''),
        sortable: true,
      },
      {
        name: 'code',
        required: false,
        label: 'Código de negocio',
        align: 'left',
        field: 'code',
        sortable: true,
      },
      {
        name: 'name',
        required: false,
        label: 'Nombre de negocio',
        align: 'left',
        field: 'name',
        sortable: true,
      },
      {
        name: 'current_period',
        required: false,
        label: 'Periodo contable actual',
        align: 'left',
        field: (row) =>
          row.current_period && typeof row.current_period === 'string'
            ? formatDate(row.current_period, 'YYYY-MM-DD')
            : '-',
        sortable: true,
      },
      {
        name: 'last_consolidation',
        required: false,
        label: 'Última actualización de comprobantes',
        align: 'left',
        field: (row) =>
          row.last_consolidation
            ? formatDate(row.last_consolidation, 'YYYY-MM-DD')
            : '-',
        sortable: true,
      },
      {
        name: 'daily_closing',
        required: false,
        label: 'Tipo de cierre',
        align: 'left',
        field: (row) =>
          row.id ? (row.daily_closing ? 'Diario' : 'Mensual') : '',
        sortable: true,
      },
      {
        name: 'status_id',
        required: false,
        label: 'Estado en contabilidad',
        align: 'center',
        field: 'status_id',
        sortable: true,
      },
      ...(props.action !== 'view'
        ? [
            {
              name: 'actions',
              required: false,
              label: 'Acciones',
              align: 'center' as const,
              field: () => '',
              sortable: false,
            },
          ]
        : []),
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const addRowTable = () => {
    models.value.childrens.push({
      id: 0,
      code: '',
      name: '',
      status_id: 0,
      current_period: '',
      daily_closing: false,
      last_verification: '',
    })
    updateChildrens()
    updatePagination()
  }

  const onChangeSelectorParent = async (selectedId: number) => {
    models.value = initialModelsValues
    if (!selectedId) return

    await _getBusinessByID(selectedId)
    const accountingStructureId =
      data_basic_consolidation_tree.value?.accounting_structure.id || 0
    if (accountingStructureId) {
      await _getResources(
        {
          accounting: ['bussines_child'],
        },
        `filter[account_structure_id]=${accountingStructureId}`
      )
      if (tableProps.value.rows.length > 0) {
        tableProps.value.pages = { currentPage: 1, lastPage: 1 }
      }
    } else {
      showAlert(
        'El negocio no tiene una estructura contable asignada.',
        'warning',
        undefined,
        3000
      )
    }
  }

  const updateChild = async (selectedId: number, index: number) => {
    const isAlreadySelected = models.value.childrens.some(
      (child, i) => child.id === selectedId && i !== index
    )
    if (isAlreadySelected) {
      showAlert(
        'Este negocio ya ha sido seleccionado en otra fila.',
        'warning',
        undefined,
        3000
      )
      return
    }

    const codeSelected = bussines_child.value.find(
      (item) => item.id === selectedId
    )?.business_code

    if (!codeSelected) return

    const childBusinessByCode = await _getBusinessByCode(codeSelected)
    if (!childBusinessByCode) return

    models.value.childrens[index] = childBusinessByCode
    syncModelsRequests()
  }

  const removeChild = (rowId: number, index: number) => {
    if (disabledRowOnCreate(rowId)) {
      showAlert(
        'Para modificar o eliminar negocios previamente consolidados, utilice la opción Editar.',
        'warning',
        undefined,
        3000
      )
      return
    }

    models.value.childrens.splice(index, 1)
    syncModelsRequests()
  }

  const syncModelsRequests = () => {
    const currentIds = models.value.childrens
      .filter((child) => child.id !== null)
      .map((child) => child.id)

    const originalIds = backupModels.value!.childrens.map((child) => child.id)

    const remove_business_childrens = originalIds.filter(
      (id) => !currentIds.includes(id)
    )
    const new_business_childrens = currentIds.filter(
      (id) => !originalIds.includes(id)
    )

    if (props.action === 'create') {
      modelRequestCreate.value.child_ids = new_business_childrens
      _setConsolidationTreeRequestCreate(modelRequestCreate.value)
    }

    if (props.action === 'edit') {
      modelRequestUpdate.value.new_childs_ids = new_business_childrens
      modelRequestUpdate.value.remove_childs_ids = remove_business_childrens
      _setConsolidationTreeRequestUpdate(modelRequestUpdate.value)
    }
    updateChildrens()
    updatePagination()
  }

  const disabledRowOnCreate = (rowId: number) => {
    return (
      props.action === 'create' &&
      backupModels.value?.childrens.some((child) => child.id === rowId)
    )
  }

  const updateChildrens = () => {
    _setConsolidationTreeChildrens(models.value.childrens)
  }

  const updatePagination = () => {
    const total = models.value.childrens.length
    const { currentPage } = tableProps.value.pages

    tableProps.value.pages.lastPage = Math.max(
      1,
      Math.ceil(total / perPage.value)
    )

    // Si currentPage es 0, inicializar a 1
    if (currentPage === 0) {
      tableProps.value.pages.currentPage = 1
    } else if (currentPage > tableProps.value.pages.lastPage) {
      tableProps.value.pages.currentPage = tableProps.value.pages.lastPage
    }

    const start = (tableProps.value.pages.currentPage - 1) * perPage.value
    const end = start + perPage.value

    tableProps.value.rows = models.value.childrens.slice(start, end)
  }

  const updatePage = (page: number) => {
    tableProps.value.pages.currentPage = page
    updatePagination()
  }

  const updatePerPage = (rowsPerPage: number) => {
    perPage.value = rowsPerPage
    updatePagination()
  }

  watch(
    () => models.value.id,
    () => {
      if (props.action === 'create') {
        modelRequestCreate.value.parent_id = models.value.id
      }

      if (props.action === 'edit') {
        modelRequestUpdate.value.parent_id = models.value.id
      }
    }
  )

  watch(
    () => [],
    () => {
      if (isEmptyOrZero(models.value)) {
        _setDataBasicConsolidationTree(null)
      } else {
        _setDataBasicConsolidationTree(models.value)
      }
    }
  )

  watch(
    () => data_basic_consolidation_tree.value,
    (newValue: IConsolidationTree | null) => {
      if (newValue) {
        models.value = newValue
        backupModels.value = structuredClone(toRaw(newValue))
        tableProps.value.rows = newValue?.childrens ?? []
        updatePagination()
      }
    }
  )

  return {
    models,
    tableProps,
    bussines_parent,
    bussines_child,
    business_trust_statuses,
    consolidationTreeFormRef,
    defaultIconsLucide,
    addRowTable,
    updateChild,
    removeChild,
    onChangeSelectorParent,
    updatePage,
    updatePerPage,
    disabledRowOnCreate,
  }
}

export default useBasicDataForm
