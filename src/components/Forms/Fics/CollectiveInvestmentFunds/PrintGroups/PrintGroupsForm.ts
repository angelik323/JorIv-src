// Vue - Pinia - Quasar
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Interfaces
import { IPrintGroup } from '@/interfaces/customs/fics/CollectiveInvestmentFunds'
import { ActionType } from '@/interfaces/global'

// Composables
import { useAlert, useUtils } from '@/composables'

// Stores
import { useFicResourceStore } from '@/stores/resources-manager/fics'

const usePrintGroupsForm = (props: {
  action: ActionType
  data?: IPrintGroup[]
}) => {
  const { send_types } = storeToRefs(useFicResourceStore('v1'))
  const { defaultIconsLucide, isEmpty } = useUtils()
  const { showAlert } = useAlert()

  const editRowId = ref<number | null>(null)
  const printGroupsFormRef = ref()
  const isEditing = ref(false)
  const modalFormRef = ref()
  const addModalRef = ref()

  const modalData = ref<IPrintGroup>({
    id: null,
    code: 0,
    description: '',
    send_type: '',
  })

  const tableProps = ref({
    title: 'Grupos de impresión',
    loading: false,
    columns: [
      {
        name: 'code',
        required: true,
        label: 'Código',
        align: 'left',
        field: 'code',
        sortable: true,
      },
      {
        name: 'description',
        required: true,
        label: 'Descripción',
        align: 'left',
        field: 'description',
        sortable: true,
      },
      {
        name: 'send_type',
        required: true,
        label: 'Tipo de envío',
        align: 'left',
        field: 'send_type',
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
    rows: [] as IPrintGroup[],
  })

  const resetForm = () => {
    modalData.value = {
      code: 0,
      description: '',
      send_type: '',
    }

    isEditing.value = false
    editRowId.value = null
  }

  const handleOpenModal = (action: 'create' | 'edit', code?: number) => {
    if (action === 'edit') {
      const row = tableProps.value.rows.find((r) => r.code === code)
      if (row) {
        modalData.value = { ...row }
        editRowId.value = row.code ?? null
        isEditing.value = true
      }
    } else {
      resetForm()

      const lastCode = tableProps.value.rows.length
        ? Math.max(...tableProps.value.rows.map((r) => Number(r.code)))
        : 0

      modalData.value.code = lastCode + 1
      editRowId.value = null
      isEditing.value = false
    }

    addModalRef.value?.openModal?.()
  }

  const handleAddRow = async () => {
    const isValid = await modalFormRef.value?.validate()
    if (!isValid) return

    const exists = tableProps.value.rows.some(
      (row) =>
        row.send_type.toLowerCase() ===
          modalData.value.send_type.toLowerCase() &&
        (!isEditing.value || row.code !== editRowId.value)
    )

    if (exists) {
      showAlert('¡Este tipo de envío ya existe!', 'warning')
      return
    }

    if (isEditing.value && editRowId.value !== null) {
      const index = tableProps.value.rows.findIndex(
        (row) => row.code === editRowId.value
      )
      if (index !== null) {
        tableProps.value.rows[index] = {
          ...tableProps.value.rows[index],
          id: editRowId.value,
          code: modalData.value.code,
          description: modalData.value.description.trim(),
          send_type: modalData.value.send_type,
        }

        showAlert('¡Grupo de impresión actualizado correctamente!', 'success')
      }
    } else {
      const newRow: IPrintGroup = {
        id: null,
        code: modalData.value.code,
        description: modalData.value.description.trim(),
        send_type: modalData.value.send_type,
      }
      tableProps.value.rows.push({ ...newRow })

      showAlert('¡Grupo de impresión agregado correctamente!', 'success')
    }

    handleCloseModal()
    resetForm()
  }

  const handleCloseModal = () => addModalRef.value?.closeModal?.()

  const getValues = () =>
    tableProps.value.rows.map((row) => ({
      id: row.id ?? null,
      code: row.code,
      description: row.description,
      send_type: row.send_type,
    }))

  const validateForm = () => {
    if (!tableProps.value.rows.length) {
      showAlert('Debe agregar al menos un grupo de impresión.', 'warning')
      return false
    }

    return true
  }

  const isView = computed(() => ['view'].includes(props.action))
  const isEdit = computed(() => ['edit'].includes(props.action))

  const isFormValid = computed(
    () =>
      isEmpty(modalData.value.code) &&
      isEmpty(modalData.value.description) &&
      isEmpty(modalData.value.send_type)
  )

  watch(
    () => props.data,
    (newVal = []) => {
      tableProps.value.rows = newVal.map((item: IPrintGroup) => ({
        id: item.id ?? null,
        code: item.code,
        description: item.description,
        send_type: item.send_type,
      }))
    },
    { immediate: true }
  )

  return {
    isView,
    isEdit,
    getValues,
    modalData,
    isEditing,
    send_types,
    tableProps,
    isFormValid,
    addModalRef,
    validateForm,
    handleAddRow,
    modalFormRef,
    handleOpenModal,
    handleCloseModal,
    defaultIconsLucide,
    printGroupsFormRef,
  }
}

export default usePrintGroupsForm
