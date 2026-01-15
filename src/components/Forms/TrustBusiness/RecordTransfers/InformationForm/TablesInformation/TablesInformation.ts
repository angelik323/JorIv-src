// pinia - vue - quasar
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { QTable } from 'quasar'
import { storeToRefs } from 'pinia'

// interfaces
import {
  IRecordTransfersAssignees,
  IRecordTransfersPrincipal,
  IRecordTransfersTransferors,
} from '@/interfaces/customs'

// stores
import {
  useRecordTransfersStore,
  useTrustBusinessResourceStore,
} from '@/stores'

// utils
import { useUtils } from '@/composables/useUtils'
const defaultIconsLucide = useUtils().defaultIconsLucide

// composables
import { useAlert, useBigNumbers } from '@/composables'
const { createBigNumber } = useBigNumbers()

const useTablesInformationForm = (props: {
  action: 'create' | 'edit' | 'view' | 'authorize'
  status?: number
}) => {
  const isImport = ref(false)

  const { business_trust_third_parties } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )

  const {
    _getErrorsFile,
    _setListFinal,
    _setListAssignees,
    _setSelectedThird,
    _setParticipation,
  } = useRecordTransfersStore('v1')

  const {
    data_import_response,
    data_transferors_list,
    data_assignees_list,
    selectedThirdId,
    selectedThird,
    participations,
  } = storeToRefs(useRecordTransfersStore('v1'))

  const { showAlert } = useAlert()

  const idsAssigns = computed(
    () =>
      tablePropsAssignees.value.rows
        .filter((fl) => fl.id)
        .map((item) => {
          if (item.id) {
            return item.id
          }
        }) ?? []
  )

  // table
  const total_percentaje = computed(() =>
    (tablePropsFinal.value.rows ?? [])
      .reduce((total, item) => {
        const value = createBigNumber(item.percentage_participation || 0)
        return total.plus(value)
      }, createBigNumber(0))
      .valueOf()
  )

  const tableProps = ref({
    title: 'Cedente',
    loading: false,
    columns: [
      {
        name: 'checked',
        required: true,
        label: '',
        align: 'center',
        field: 'checked',
        sortable: true,
      },
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'center',
        field: 'third_party_id',
        sortable: true,
      },
      {
        name: 'type',
        required: true,
        label: 'Tipo de documento',
        align: 'center',
        field: 'type',
        sortable: true,
      },
      {
        name: 'document_number',
        required: true,
        label: 'N° de documento',
        align: 'center',
        field: 'document_number',
        sortable: true,
      },
      {
        name: 'name',
        required: true,
        label: 'Nombre o razón social',
        align: 'center',
        field: 'name',
        sortable: true,
      },
      {
        name: 'percentage_participation',
        required: true,
        label: '% de participación actual',
        align: 'center',
        field: 'percentage_participation',
        sortable: true,
      },
      {
        name: 'transfer_percentage',
        required: true,
        label: '% de participación a ceder',
        align: 'left',
        field: 'transfer_percentage',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IRecordTransfersTransferors[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  // table assignees

  const allColumns: QTable['columns'] = [
    {
      name: 'id',
      required: true,
      label: '#',
      align: 'center',
      field: 'id',
      sortable: true,
    },
    {
      name: 'type',
      required: true,
      label: 'Tipo de documento',
      align: 'center',
      field: 'type',
      sortable: true,
    },
    {
      name: 'document_number',
      required: true,
      label: 'N° de documento',
      align: 'center',
      field: 'document_number',
      sortable: true,
    },
    {
      name: 'name',
      required: true,
      label: 'Nombre o razón social',
      align: 'center',
      field: 'name',
      sortable: true,
    },
    {
      name: 'percentage_participation',
      required: true,
      label: '% de participación actual',
      align: 'center',
      field: 'percentage_participation',
      sortable: true,
    },
    {
      name: 'received_percentage',
      required: true,
      label: '% de participación a recibir',
      align: 'left',
      field: 'received_percentage',
      sortable: true,
    },
    {
      name: 'actions',
      required: true,
      label: 'Acciones',
      align: 'center',
      field: 'actions',
    },
  ]

  const tablePropsAssignees = ref({
    title: 'Cesionario',
    loading: false,
    columns: allColumns.filter(
      (col) =>
        ['create', 'edit'].includes(props.action) || col.name !== 'actions'
    ),
    rows: [] as IRecordTransfersAssignees[],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const pageSizeAssignees = ref(20)
  const pageSizeFinal = ref(20)

  const paginatedAssignees = computed(() => {
    const start =
      (tablePropsAssignees.value.pages.currentPage - 1) *
      pageSizeAssignees.value
    return tablePropsAssignees.value.rows.slice(
      start,
      start + pageSizeAssignees.value
    )
  })

  const paginatedFinal = computed(() => {
    const start =
      (tablePropsFinal.value.pages.currentPage - 1) * pageSizeFinal.value
    return tablePropsFinal.value.rows.slice(start, start + pageSizeFinal.value)
  })

  const addRow = () => {
    tablePropsAssignees.value.rows.push({})
  }

  const changeDataTable = (id: number | string | null) => {
    if (!id) return

    const dataIndex = business_trust_third_parties.value.find(
      (item) => item.id === id
    )

    if (!dataIndex) return

    const rowIndex = tablePropsAssignees.value.rows.findIndex(
      (item) => item.id === id
    )

    if (rowIndex === -1) return

    const updatedItem = {
      ...tablePropsAssignees.value.rows[rowIndex],
      type: dataIndex.document_type?.name,
      document_number: `${dataIndex.document}`,
      name: dataIndex.name,
      percentage_participation: 0,
    }

    tablePropsAssignees.value.rows.splice(rowIndex, 1, updatedItem)
  }

  const deleteRow = (row: IRecordTransfersAssignees) => {
    const index = tablePropsAssignees.value.rows.findIndex(
      (item) => item === row
    )

    if (index !== -1) {
      tablePropsAssignees.value.rows.splice(index, 1)
    }

    if (!tablePropsAssignees.value.rows.length) isImport.value = false
  }

  const uploadDataTable = () => {
    tablePropsAssignees.value.rows = []
    isImport.value = true

    const importedData = data_import_response.value?.successful?.data ?? []

    tablePropsAssignees.value.rows = importedData
      ?.filter((item) => item)
      .map((item) => ({
        id: item.id,
        _uid: item.id,
        percentage_participation: 0,
        type_resource: item.type_resource,
        name: item.name,
        type: item.document_type?.name,
        abbreviation: item.document_type?.abbreviation,
        document_number: item.document,
        received_percentage: item.percentage_participation,
      }))

    setStatsProps()
    closeAlertModal()
  }

  // modal upload
  const alertModalRef = ref()

  const closeAlertModal = () => {
    alertModalRef.value?.closeModal()
  }

  const openAlertModal = async () => {
    await alertModalRef.value?.openModal()
  }

  // actions

  const handlerActionForm = (
    action: 'create' | 'edit' | 'view' | 'authorize'
  ) => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setModelValue,
      edit: _setModelValue,
      view: _setModelValue,
      authorize: _setModelValue,
    }
    actionHandlers[action]?.()
  }

  const _setModelValue = () => {
    const data_assignees = data_assignees_list.value
    if (data_assignees) {
      tablePropsAssignees.value.rows = data_assignees
    }

    const data = data_transferors_list.value

    if (data) {
      tableProps.value.rows = data?.map((item) => ({
        ...item,
        _uid: item.id,
      }))
    }
  }

  const statsProps = ref()

  const setStatsProps = () => {
    statsProps.value = [
      {
        count: data_import_response?.value?.successful.count ?? 0,
        image: defaultIconsLucide.circleCheckBig,
        label: 'Total registros exitosos',
      },
      {
        count: data_import_response?.value?.failed.count ?? 0,
        image: defaultIconsLucide.circleOff,
        label: 'Total registros Fallidos',
      },
      {
        count:
          (data_import_response?.value?.successful.count ?? 0) +
          (data_import_response?.value?.failed.count ?? 0),
        image: defaultIconsLucide.equal,
        label: 'Total registros',
      },
    ]
  }

  const downloadErrorsFile = async () => {
    if (!data_import_response?.value?.failed.count) {
      showAlert('¡No hay errores en los datos cargados!', 'error')
      return
    }
    await _getErrorsFile()
  }

  // table final
  const tablePropsFinal = ref({
    title: 'Participación final',
    loading: false,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'center',
        field: 'id',
        sortable: true,
      },
      {
        name: 'type',
        required: true,
        label: 'Tipo de documento',
        align: 'center',
        field: 'type',
        sortable: true,
      },
      {
        name: 'document_number',
        required: true,
        label: 'N° de documento',
        align: 'center',
        field: 'document_number',
        sortable: true,
      },
      {
        name: 'name',
        required: true,
        label: 'Nombre o razón social',
        align: 'center',
        field: 'name',
        sortable: true,
      },
      {
        name: 'percentage_participation',
        required: true,
        label: '% de participación',
        align: 'center',
        field: 'percentage_participation',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IRecordTransfersPrincipal[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const onChangeParticipation = (thirdId: string, value: number) => {
    _setParticipation(thirdId, value)
    tablePropsAssignees.value.rows = []
  }

  const getThird = () => {
    if (!selectedThirdId.value) return _setSelectedThird(null)

    const row = tableProps.value.rows.find(
      (item: IRecordTransfersTransferors) => item.id === selectedThirdId.value
    )
    _setSelectedThird(selectedThirdId.value, row)
  }

  const recalculateFinalTable = async () => {
    const rows = tableProps.value.rows ?? []
    const assigneeRows = tablePropsAssignees.value.rows ?? []

    await getThird()

    tablePropsFinal.value.rows = []

    const selId = selectedThirdId.value
    const selThird = selectedThird.value
    const participationsValue = participations.value?.[selId ?? 0] ?? 0

    const finalRows: IRecordTransfersPrincipal[] = []

    // Cedentes
    for (const item of rows) {
      const original = createBigNumber(item.percentage_participation || 0)
      let final = original

      if (selId && item.id === selId) {
        const p = createBigNumber(participationsValue || 0)
        final = original.minus(original.times(p).div(100))
      }

      finalRows.push({
        id: item.third_party_id,
        _uid: item.id,
        third_party_id: item.third_party_id,
        percentage_participation: final.valueOf(),
        type_resource: item.type_resource,
        name: item.name,
        type: item.type,
        abbreviation: item.abbreviation,
        document_number: item.document_number,
      })
    }

    // Cesionarios
    for (const item of assigneeRows) {
      const base = createBigNumber(selThird?.percentage_participation || 0)
      const part = createBigNumber(participationsValue || 0)
      const received = createBigNumber(item.received_percentage || 0)

      const final = base.times(part).div(100).times(received).div(100)

      finalRows.push({
        id: item.id,
        _uid: item.id,
        third_party_id: item.third_party_id,
        percentage_participation: final.valueOf(),
        type_resource: item.type_resource,
        name: item.name,
        type: item.type,
        abbreviation: item.abbreviation,
        document_number: item.document_number,
        received_percentage: item.received_percentage,
      })
    }

    tablePropsFinal.value.rows = finalRows
  }

  onMounted(async () => {
    isImport.value = false
    handlerActionForm(props.action)
    await nextTick()
    recalculateFinalTable()
  })

  onUnmounted(() => {
    isImport.value = false
  })

  // watch
  watch(
    () => data_transferors_list.value,
    () => {
      handlerActionForm(props.action)
    },
    { deep: true, immediate: true }
  )

  watch(
    () => [tableProps.value.rows, tablePropsAssignees.value.rows],
    () => {
      recalculateFinalTable()
    },
    { deep: true, immediate: true }
  )

  watch(
    () => participations.value,
    () => {
      recalculateFinalTable()
    },
    { deep: true }
  )

  watch(
    selectedThirdId,
    async () => {
      await getThird()
    },
    { deep: true, immediate: true }
  )

  watch(
    [() => tablePropsAssignees.value.rows, () => pageSizeAssignees.value],
    () => {
      tablePropsAssignees.value.pages.lastPage = Math.ceil(
        tablePropsAssignees.value.rows.length / pageSizeAssignees.value
      )

      if (tablePropsAssignees.value.rows.length === 0)
        return _setListAssignees([])

      _setListAssignees([...tablePropsAssignees.value.rows])
    },
    { deep: true }
  )

  watch(
    [() => tablePropsFinal.value.rows, () => pageSizeFinal.value],
    () => {
      tablePropsFinal.value.pages.lastPage = Math.ceil(
        tablePropsFinal.value.rows.length / pageSizeFinal.value
      )
      getThird()
      if (tablePropsFinal.value.rows.length === 0) return _setListFinal([])

      _setListFinal([...tablePropsFinal.value.rows])
    },
    { deep: true }
  )

  return {
    tableProps,
    tablePropsAssignees,
    business_trust_third_parties,
    alertModalRef,
    isImport,
    statsProps,
    tablePropsFinal,
    total_percentaje,
    selectedThirdId,
    selectedThird,
    participations,
    idsAssigns,
    paginatedAssignees,
    paginatedFinal,
    pageSizeAssignees,
    pageSizeFinal,
    data_import_response,

    addRow,
    changeDataTable,
    deleteRow,
    closeAlertModal,
    openAlertModal,
    uploadDataTable,
    downloadErrorsFile,
    onChangeParticipation,
  }
}
export default useTablesInformationForm
