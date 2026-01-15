import { useAlert } from '@/composables'
import {
  IConsolidationTree,
  IRequestCreateConsolidationTree,
  IRequestUpdateConsolidationTree,
} from '@/interfaces/customs'
import { useResourceStore, useConsolidationTreeStore } from '@/stores'
import moment from 'moment'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { onMounted, toRaw, watch, ref } from 'vue'

const useBasicDataForm = (props: any) => {
  const { showAlert } = useAlert()
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

  const { bussines_parent, bussines_child } = storeToRefs(
    useResourceStore('v1')
  )
  const { _getAccountingResources } = useResourceStore('v1')

  const perPage = ref(20)

  const models = ref<IConsolidationTree>({
    id: 0,
    code: '',
    name: '',
    status_id: 0,
    accounting_structure: {
      id: 0,
      code: '',
      purpose: '',
    },
    childrens: [],
  })

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

  const tableProps = ref({
    title: 'Listado de negocios consolidados',
    loading: false,
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
          row.current_period
            ? moment(row.current_period).format('DD/MM/YYYY')
            : '-',
        sortable: true,
      },
      {
        name: 'last_verification',
        required: false,
        label: 'Última verificación de comprobantes',
        align: 'left',
        field: (row) =>
          row.last_verification
            ? moment(row.last_verification).format('DD/MM/YYYY')
            : '-',
        sortable: true,
      },
      {
        name: 'daily_closing',
        required: false,
        label: 'Genera cierre diario',
        align: 'left',
        field: (row) => (row.id ? (row.daily_closing ? 'Sí' : 'No') : ''),
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
      {
        name: 'is_consolidator',
        required: false,
        label: 'Consolidador',
        align: 'left',
        field: (row) => (row.id ? (row.is_consolidator ? 'Sí' : 'No') : ''),
        sortable: true,
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
    rows: [] as any[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const isEmpty = (obj: Record<string, any>): boolean => {
    return Object.values(obj).every(
      (value) => value === 0 || value === '' || value === null
    )
  }

  const addRowTable = () => {
    models.value.childrens.push({
      id: 0,
      code: '',
      name: '',
      status_id: 0,
      current_period: false,
      daily_closing: false,
      last_verification_date: null,
      is_consolidator: false,
    })
    updateChildrens()
    updatePagination()
  }

  const onChangeSelectorParent = async (selectedId: number) => {
    models.value = {
      id: 0,
      code: '',
      name: '',
      status_id: 0,
      accounting_structure: {
        id: 0,
        code: '',
        purpose: '',
      },
      childrens: [],
    }
    if (!selectedId) return

    await _getBusinessByID(selectedId)
    await _getAccountingResources(
      `keys[]=bussines_child&filter[business_id]=${selectedId}`
    )
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

  const keys = ['bussines_parent']
  onMounted(() => {
    _getAccountingResources(`keys[]=${keys.join('&keys[]=')}`)
  })

  const updatePagination = () => {
    const total = models.value.childrens.length
    const { currentPage } = tableProps.value.pages

    tableProps.value.pages.lastPage = Math.max(
      1,
      Math.ceil(total / perPage.value)
    )

    if (currentPage > tableProps.value.pages.lastPage) {
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
      if (isEmpty(models.value)) {
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
      }
    }
  )

  return {
    models,
    tableProps,
    bussines_parent,
    bussines_child,
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
