// Vue - Pinia - Router - Quasar
import { computed, ref, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Composables
import { useUtils, useAlert } from '@/composables'

// Interfaces
import {
  ITabs,
  ActionType,
  TypesContractingDocumentStatusFlowTypeID,
} from '@/interfaces/global'
import {
  ITypesContractingDocumentsFlowParent,
  ITypesContractingDocumentsFlowChild,
  ITypesContractingDocumentsFlowStatesForm,
} from '@/interfaces/customs'

// Stores
import { useDerivativeContractingResourceStore } from '@/stores/resources-manager/derivative-contracting'

const useFlowStatesForm = (
  props: {
    action: ActionType
    flowStatesForm: ITypesContractingDocumentsFlowStatesForm | null
  },
  emit: Function
) => {
  const { defaultIconsLucide } = useUtils()
  const { showAlert } = useAlert()

  const {
    contract_type_status_flow_type,
    contract_type_status_statuses_substatuses,
  } = storeToRefs(useDerivativeContractingResourceStore('v1'))

  const tablePropertiesStatusParent = ref({
    title: 'Crear flujo de estado',
    loading: false,
    columns: [
      {
        name: 'order_parent',
        align: 'left',
        label: 'Orden*',
        field: 'order_parent',
        sortable: true,
        required: true,
      },
      {
        name: 'status_parent_id',
        align: 'left',
        label: 'Estado*',
        field: 'status_parent_id',
        sortable: true,
        required: true,
      },
      {
        name: 'actions',
        align: 'center',
        label: 'Acciones',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: [] as ITypesContractingDocumentsFlowParent[],
  })

  const childTableColumns = [
    {
      name: 'order_child',
      align: 'left',
      label: 'Orden*',
      field: 'order_child',
      sortable: true,
      required: true,
    },
    {
      name: 'status_child_id',
      align: 'left',
      label: 'Estado*',
      field: 'status_child_id',
      sortable: true,
      required: true,
    },
    {
      name: 'actions',
      align: 'center',
      label: 'Acciones',
      field: 'actions',
    },
  ]

  const flowStatesChildFormRef = ref()
  const flowType = ref<string | number | null>(null)

  const tabs = ref<ITabs[]>([])
  const activeTab = ref('')
  const activeTabIndex = ref(0)

  const predefinedRows = computed(() => {
    return contract_type_status_statuses_substatuses.value.map(
      (status, index) => ({
        id: status.value as number,
        order_parent: index + 1,
        status_parent_id: status.value as number,
        label: status.label,
      })
    )
  })

  const statusChildOptions = computed(() => {
    const parent = contract_type_status_statuses_substatuses.value.find(
      (status) => status.label === tabs.value[activeTabIndex.value].label
    )
    return parent?.sons || []
  })

  const tablePropertiesStatusChildCurrent = computed(() => {
    const tablePropertiesStatusChild = {
      title: 'Flujo por estados',
      loading: false,
      columns: childTableColumns as QTable['columns'],
      rows: [] as ITypesContractingDocumentsFlowChild[],
    }

    if (activeTab.value) {
      const parent = tablePropertiesStatusParent.value.rows.find(
        (p) => p.label === activeTab.value
      )

      tablePropertiesStatusChild.rows = parent?.children || []
    }

    return tablePropertiesStatusChild
  })

  const setTabs = (items: ITypesContractingDocumentsFlowParent[]) => {
    tabs.value = items.map((item) => ({
      name: item.label || '',
      label: item.label || '',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: item.label ? true : false,
      required: false,
    }))
  }

  const handleFlowTypeChange = async (newVal: string | number | null) => {
    flowType.value =
      newVal || TypesContractingDocumentStatusFlowTypeID.PREDEFINED
    if (
      flowType.value === TypesContractingDocumentStatusFlowTypeID.PREDEFINED
    ) {
      tablePropertiesStatusParent.value.rows = [...predefinedRows.value]
    } else {
      tablePropertiesStatusParent.value.rows = []
      tabs.value = []
      activeTab.value = ''
      activeTabIndex.value = 0
    }
  }

  const setFlowStatesForm = async () => {
    if (
      props.flowStatesForm &&
      Array.isArray(props.flowStatesForm.flow) &&
      props.flowStatesForm.flow.length > 0 &&
      props.flowStatesForm.type
    ) {
      tablePropertiesStatusParent.value.rows = [...props.flowStatesForm.flow]
      flowType.value = props.flowStatesForm.type
      setTabs(props.flowStatesForm.flow)
      return
    }

    handleFlowTypeChange(flowType.value)
    setTabs([])
  }

  const handleAddRowStatus = () => {
    if (
      flowType.value === TypesContractingDocumentStatusFlowTypeID.PREDEFINED
    ) {
      return
    }

    const newId = tablePropertiesStatusParent.value.rows.length + 1

    const newRow = {
      id: newId,
      order_parent: newId,
      status_parent_id: null,
      label: '',
    }

    tablePropertiesStatusParent.value.rows.push(newRow)

    setTabs([...tablePropertiesStatusParent.value.rows])
  }

  const validateStatusExists = (
    statusId: number | null,
    currentId: number | null
  ): boolean => {
    if (statusId === null) return false

    return tablePropertiesStatusParent.value.rows.some(
      (item) =>
        item.status_parent_id !== null &&
        Number(item.status_parent_id) === Number(statusId) &&
        item.id !== currentId
    )
  }

  const handleStatusChange = (
    id: number | null,
    newStatusId: number | null
  ) => {
    if (
      flowType.value === TypesContractingDocumentStatusFlowTypeID.PREDEFINED ||
      id === null
    ) {
      return
    }

    const rowIndex = tablePropertiesStatusParent.value.rows.findIndex(
      (item) => item.id === id
    )
    if (rowIndex === -1) return

    const updatedRows = JSON.parse(
      JSON.stringify(tablePropertiesStatusParent.value.rows)
    )

    if (newStatusId === null) {
      updatedRows[rowIndex].status_parent_id = null
      updatedRows[rowIndex].label = ''

      tablePropertiesStatusParent.value.rows = []
      nextTick(() => {
        tablePropertiesStatusParent.value.rows = [...updatedRows]
      })
      return
    }

    if (validateStatusExists(newStatusId, id)) {
      showAlert('¡No se permite estados repetidos!', 'error')

      updatedRows[rowIndex].status_parent_id = null
      updatedRows[rowIndex].label = ''

      tablePropertiesStatusParent.value.rows = []
      nextTick(() => {
        tablePropertiesStatusParent.value.rows = [...updatedRows]
      })
      return
    }

    const status = contract_type_status_statuses_substatuses.value.find(
      (s) => s.value === newStatusId
    )
    if (!status) return

    updatedRows[rowIndex].status_parent_id = newStatusId
    updatedRows[rowIndex].label = status.label || ''

    tablePropertiesStatusParent.value.rows = [...updatedRows]

    const tabIndex = updatedRows.findIndex(
      (item: ITypesContractingDocumentsFlowParent) => item.id === id
    )
    if (tabIndex !== -1) {
      setTabs([...updatedRows])
      activeTab.value = tabs.value[tabIndex]?.name || ''
      activeTabIndex.value = tabIndex
    }
  }

  const handleOrderChange = (id: number, newOrder: number) => {
    const rows = JSON.parse(
      JSON.stringify(tablePropertiesStatusParent.value.rows)
    )

    const row = rows.find(
      (item: ITypesContractingDocumentsFlowParent) => item.id === id
    )
    if (!row) return

    row.order_parent = Number(newOrder)

    const sortedRows = [...rows].sort(
      (a, b) => (a.order_parent || 0) - (b.order_parent || 0)
    )
    tablePropertiesStatusParent.value.rows = sortedRows
  }

  const handleDeleteRow = (id: number) => {
    if (flowType.value === TypesContractingDocumentStatusFlowTypeID.PREDEFINED)
      return

    const rows = tablePropertiesStatusParent.value.rows
    if (!rows?.length) return

    const index = rows.findIndex((item) => item.id === id)
    if (index === -1) return

    const tabIndex = tabs.value.findIndex((tab) => tab.name === id.toString())
    if (tabIndex !== -1) {
      tabs.value.splice(tabIndex, 1)
    }

    rows.splice(index, 1)

    const updatedRows = rows.map((item, i) => ({
      ...item,
      order_parent: i + 1,
    }))

    tablePropertiesStatusParent.value.rows = [...updatedRows]

    setTabs([...tablePropertiesStatusParent.value.rows])
  }

  const handleAddRowStatusChild = () => {
    if (!activeTab.value) return

    const parentName = activeTab.value
    const parent = tablePropertiesStatusParent.value.rows.find(
      (p) => p.label === parentName
    )
    if (!parent) return

    if (!parent.children) {
      parent.children = []
    }

    const newId = parent.children.length + 1

    parent.children.push({
      id: newId,
      order_child: newId,
      status_child_id: null,
      label: '',
    })

    tablePropertiesStatusParent.value.rows = [
      ...tablePropertiesStatusParent.value.rows,
    ]
  }

  const validateChildStatusExists = (
    children: ITypesContractingDocumentsFlowChild[],
    statusId: number | null,
    currentId: number | null
  ): boolean => {
    if (statusId === null) return false

    return children.some(
      (child) =>
        child.status_child_id !== null &&
        Number(child.status_child_id) === Number(statusId) &&
        child.id !== currentId
    )
  }

  const handleStatusChangeChild = (id: number, newStatusId: number | null) => {
    if (!activeTab.value) return

    const parentName = activeTab.value
    const parentIndex = tablePropertiesStatusParent.value.rows.findIndex(
      (p) => p.label === parentName
    )

    if (
      parentIndex === -1 ||
      !tablePropertiesStatusParent.value.rows[parentIndex]?.children
    ) {
      return
    }

    const updatedRows = JSON.parse(
      JSON.stringify(tablePropertiesStatusParent.value.rows)
    )
    const parent = updatedRows[parentIndex]
    const childIndex = parent.children.findIndex(
      (item: ITypesContractingDocumentsFlowChild) => item.id === id
    )

    if (childIndex === -1) return

    if (newStatusId === null) {
      parent.children[childIndex].status_child_id = null
      parent.children[childIndex].label = ''

      tablePropertiesStatusParent.value.rows = []
      nextTick(() => {
        tablePropertiesStatusParent.value.rows = [...updatedRows]
      })
      return
    }

    if (validateChildStatusExists(parent.children, newStatusId, id)) {
      showAlert('¡No se permite estados repetidos!', 'error')

      parent.children[childIndex].status_child_id = null
      parent.children[childIndex].label = ''

      tablePropertiesStatusParent.value.rows = []
      nextTick(() => {
        tablePropertiesStatusParent.value.rows = [...updatedRows]
      })
      return
    }

    parent.children[childIndex].status_child_id = newStatusId

    tablePropertiesStatusParent.value.rows = [...updatedRows]
  }

  const handleOrderChangeChild = (id: number, newOrder: number) => {
    if (!activeTab.value) return

    const parentName = activeTab.value
    const parent = tablePropertiesStatusParent.value.rows.find(
      (p) => p.label === parentName
    )
    if (!parent || !parent.children?.length) return

    const child = parent.children.find((item) => item.id === id)
    if (child) {
      child.order_child = Number(newOrder)
    }

    parent.children.sort((a, b) => (a.order_child || 0) - (b.order_child || 0))

    tablePropertiesStatusParent.value.rows = [
      ...tablePropertiesStatusParent.value.rows,
    ]
  }

  const handleDeleteRowChild = (id: number) => {
    if (!activeTab.value) return

    const parentName = activeTab.value
    const parent = tablePropertiesStatusParent.value.rows.find(
      (p) => p.label === parentName
    )
    if (!parent || !parent.children?.length) return

    const index = parent.children.findIndex((item) => item.id === id)
    if (index === -1) return

    parent.children.splice(index, 1)

    parent.children.forEach((child, i) => {
      child.order_child = i + 1
    })

    tablePropertiesStatusParent.value.rows = [
      ...tablePropertiesStatusParent.value.rows,
    ]
  }

  watch(
    () => props.flowStatesForm,
    (val) => {
      if (!val) return
      nextTick(() => {
        setFlowStatesForm()
      })
    },
    { deep: true, immediate: true }
  )

  watch(
    () => [...tablePropertiesStatusParent.value.rows],
    (newVal, oldVal) => {
      if (!oldVal?.length && !newVal?.length) return
      if (
        JSON.stringify(newVal) ===
        JSON.stringify(props.flowStatesForm?.flow || [])
      ) {
        return
      }
      emit('update:flow-states-form', newVal)
    },
    { deep: true }
  )

  watch(
    () => flowType.value,
    (val) => {
      if (!val) return
      if (JSON.stringify(val) === JSON.stringify(props.flowStatesForm?.type))
        return
      emit('update:flow-states-type', val)
    },
    { deep: true }
  )

  return {
    TypesContractingDocumentStatusFlowTypeID,
    defaultIconsLucide,
    flowStatesChildFormRef,
    flowType,
    tablePropertiesStatusParent,
    tablePropertiesStatusChildCurrent,
    statusChildOptions,
    tabs,
    activeTab,
    activeTabIndex,

    contract_type_status_flow_type,
    contract_type_status_statuses_substatuses,

    handleFlowTypeChange,
    handleAddRowStatus,
    handleStatusChange,
    handleOrderChange,
    handleDeleteRow,
    handleAddRowStatusChild,
    handleStatusChangeChild,
    handleOrderChangeChild,
    handleDeleteRowChild,
  }
}

export default useFlowStatesForm
