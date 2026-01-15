import { ref, computed, watch } from 'vue'
import { QTableColumn } from 'quasar'
import { useRemoteAuthorization } from '@/stores'
import { useRules, useAlert } from '@/composables'
import {
  IRemoteAuthorizationItem,
  Mode,
  ModalRow,
  ModelFilters,
  RemoteAuthorizationModalEmit,
} from '@/interfaces/customs'

export const modalColumns: QTableColumn<ModalRow>[] = [
  {
    name: 'selection',
    label: '',
    align: 'center',
    field: () => '',
    sortable: false,
    style: 'width: 50px',
  },
  { name: 'idx', label: '#', align: 'left', field: (r) => r.__idx },
  {
    name: 'authorization_code',
    label: 'Número de autorización',
    align: 'left',
    field: (r) => r.authorization_code ?? '—',
    sortable: true,
  },
  {
    name: 'authorization_request_date',
    label: 'Fecha de solicitud',
    align: 'left',
    field: (r) => r.authorization_request_date ?? '—',
    sortable: true,
  },
  {
    name: 'created_by',
    label: 'Usuario',
    align: 'left',
    field: (r) => r.created_by?.name ?? '—',
    sortable: true,
  },
  {
    name: 'module',
    label: 'Módulo',
    align: 'left',
    field: (r) => r.module ?? '—',
    sortable: true,
  },
]

const useRemoteAuthorizationModal = (
  props: {
    openDialog: boolean
    mode: Mode
    selected: IRemoteAuthorizationItem[]
    modelFilters?: ModelFilters
  },
  emit: RemoteAuthorizationModalEmit
) => {
  const raStore = useRemoteAuthorization('v1')
  const { _bulkUpdate } = raStore
  const { showAlert } = useAlert()
  const { no_special_characters_extended, max_length } = useRules()

  const formElementRef = ref<HTMLElement | null>(null)

  const initialModelsValues = { reason: '' as string }
  const models = ref({ ...initialModelsValues })
  const rejectionReasons = ref<Record<number, string>>({})

  const selectedItems = ref<Set<number>>(new Set())
  const selectAll = ref(false)

  const selected = computed(() => {
    return Array.isArray(props.selected) ? props.selected : []
  })

  const resetModels = () => {
    models.value = { ...initialModelsValues }
    rejectionReasons.value = {}
    selectedItems.value.clear()

    selected.value.forEach((item) => {
      rejectionReasons.value[item.id] = ''
      selectedItems.value.add(item.id)
    })
    selectAll.value =
      selectedItems.value.size === selected.value.length &&
      selected.value.length > 0
  }

  const updateRejectionReason = (id: number, value: string) => {
    rejectionReasons.value[id] = value
  }

  const toggleItemSelection = (id: number) => {
    if (selectedItems.value.has(id)) {
      selectedItems.value.delete(id)
    } else {
      selectedItems.value.add(id)
    }

    selectAll.value =
      selectedItems.value.size === selected.value.length &&
      selected.value.length > 0
  }

  const toggleSelectAll = () => {
    if (selectAll.value) {
      selectedItems.value.clear()
    } else {
      selected.value.forEach((item) => {
        selectedItems.value.add(item.id)
      })
    }
    selectAll.value = !selectAll.value
  }

  const isItemSelected = (id: number) => {
    return selectedItems.value.has(id)
  }

  const confirmationMessage = computed(() => {
    return props.mode === 'authorize'
      ? 'Se autorizan los movimientos de tesorería seleccionados.'
      : 'Por favor, indique el motivo del rechazo'
  })

  const getSelectedItems = computed(() => {
    return selected.value.filter((item) => selectedItems.value.has(item.id))
  })

  watch(
    () => [props.mode, props.openDialog] as const,
    ([, open]) => {
      if (open) resetModels()
    },
    { immediate: true }
  )

  watch(
    () => props.selected,
    () => {
      if (props.openDialog && props.mode === 'reject') {
        props.selected.forEach((item) => {
          if (!(item.id in rejectionReasons.value)) {
            rejectionReasons.value[item.id] = ''
          }
        })
      }
    },
    { immediate: true, deep: true }
  )

  const selectedRowsWithIdx = computed<ModalRow[]>(() =>
    selected.value.map((r, i) => ({ ...r, __idx: i + 1 }))
  )

  const page = ref(1)
  const rowsPerPage = ref(5)

  const pages = computed(() => {
    const total = selectedRowsWithIdx.value.length
    const last = total === 0 ? 1 : Math.ceil(total / rowsPerPage.value)
    return { currentPage: page.value, lastPage: last }
  })

  watch([selectedRowsWithIdx, rowsPerPage], () => {
    const total = selectedRowsWithIdx.value.length
    const last = total === 0 ? 1 : Math.ceil(total / rowsPerPage.value)
    if (page.value > last) page.value = last
  })

  const updatePage = (p: number) => (page.value = p)
  const updatePerPage = (rpp: number) => {
    rowsPerPage.value = rpp
    page.value = 1
  }

  const rows = computed<ModalRow[]>(() => {
    const start = (page.value - 1) * rowsPerPage.value
    return selectedRowsWithIdx.value.slice(start, start + rowsPerPage.value)
  })

  const isProcessing = ref(false)

  const confirm = async () => {
    if (props.mode === 'authorize') {
      if (selectedItems.value.size === 0) {
        showAlert(
          'Debe seleccionar al menos un registro para autorizar',
          'warning',
          undefined,
          3000
        )
        return
      }
    }

    if (props.mode === 'reject') {
      const missingReasons = selected.value.filter(
        (item) => !rejectionReasons.value[item.id]?.trim()
      )

      if (missingReasons.length > 0) {
        showAlert(
          'Debe completar el motivo de rechazo para todos los registros',
          'warning',
          undefined,
          3000
        )
        return
      }
    }

    isProcessing.value = true

    try {
      let success = false

      const itemsToProcess =
        props.mode === 'authorize' ? getSelectedItems.value : selected.value

      const authorizations = itemsToProcess.map((item) => {
        const authorization: {
          id: number
          is_authorized: boolean
          rejection_reason?: string
        } = {
          id: item.id,
          is_authorized: props.mode === 'authorize',
        }

        if (props.mode === 'reject') {
          const rejectionReason = rejectionReasons.value[item.id]?.trim()
          if (rejectionReason) {
            authorization.rejection_reason = rejectionReason
          }
        }

        return authorization
      })

      success = await _bulkUpdate(authorizations)

      if (success) {
        emit('done')
        emit('update:openDialog', false)
        resetModels()
      }
    } finally {
      isProcessing.value = false
    }
  }

  const cancel = () => {
    showAlert(
      'Se ha cancelado la acción para los registros seleccionados exitosamente!',
      'warning',
      undefined,
      3000
    )
    emit('cancel')
    emit('update:openDialog', false)
    resetModels()
  }

  const open = computed({
    get: () => props.openDialog,
    set: (v: boolean) => emit('update:openDialog', v),
  })

  const title = computed(() =>
    props.mode === 'authorize'
      ? '¿Desea autorizar los registros seleccionados?'
      : '¿Desea rechazar los registros seleccionados?'
  )

  const displayColumns = computed(() => {
    let baseColumns = [...modalColumns]

    if (props.mode !== 'authorize') {
      baseColumns = baseColumns.filter((col) => col.name !== 'selection')
    }

    if (props.mode === 'reject') {
      baseColumns.push({
        name: 'rejection_reason',
        label: 'Motivo de rechazo *',
        align: 'left' as const,
        field: () => '',
        sortable: false,
      })
    }

    return baseColumns
  })

  return {
    formElementRef,
    models,
    isProcessing,
    modalColumns,
    selectedRowsWithIdx,
    rows,
    pages,
    page,
    rowsPerPage,
    updatePage,
    updatePerPage,
    confirm,
    cancel,
    open,
    title,
    displayColumns,
    rejectionReasons,
    updateRejectionReason,
    no_special_characters_extended,
    max_length,
    selectedItems,
    selectAll,
    toggleItemSelection,
    toggleSelectAll,
    isItemSelected,
    confirmationMessage,
    getSelectedItems,
  }
}

export default useRemoteAuthorizationModal
