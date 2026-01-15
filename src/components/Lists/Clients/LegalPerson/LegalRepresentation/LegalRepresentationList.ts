// Vue - Pinia - Router - Quasar
import { ref, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'

// Composables
import { useUtils, useRouteValidator } from '@/composables'

import {
  IBaseTableProps,
  ActionType,
  ActionTypeEnum,
} from '@/interfaces/global'
import { IBaseLegalRepresentationItem } from '@/interfaces/customs/clients/Clients'

// Constantes
// import { mockLegalRepresentations } from '@/constants/resources/clients'

// Stores
import { useAssetResourceStore } from '@/stores/resources-manager'

const useLegalRepresentationList = (
  props: {
    action: ActionType
    legalRepresentationDataList: IBaseLegalRepresentationItem[] | null
  },
  emit: Function
) => {
  const { defaultIconsLucide } = useUtils()
  const { validateRouter } = useRouteValidator()

  const { document_types_third_party_natural } = storeToRefs(
    useAssetResourceStore('v1')
  )

  const tableProps = ref<IBaseTableProps<IBaseLegalRepresentationItem>>({
    title: 'Listado de Representantes legales',
    loading: false,
    wrapCells: true,
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
        name: 'document_type_id',
        required: false,
        label: 'Tipo de documento',
        align: 'center',
        field: (row: IBaseLegalRepresentationItem) => {
          return (
            document_types_third_party_natural.value.find(
              (item) => item.value === row.document_type_id
            )?.label ?? 'No registrado'
          )
        },
        sortable: true,
      },
      {
        name: 'document',
        required: false,
        label: 'Número de identificación',
        align: 'center',
        field: 'document',
        sortable: true,
      },
      {
        name: 'name',
        required: false,
        label: 'Nombre completo',
        align: 'left',
        field: (row: IBaseLegalRepresentationItem) => {
          return `
            ${row.natural_person?.name ?? ''}
            ${row.natural_person?.middle_name ?? ''}
            ${row.natural_person?.last_name ?? ''}
            ${row.natural_person?.second_last_name ?? ''}`
        },
        sortable: true,
      },
      {
        name: 'status_id',
        required: false,
        label: 'Estado',
        align: 'left',
        field: 'status_id',
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        align: 'left',
        field: 'id',
        sortable: false,
      },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })

  const showModalForm = ref(false)
  const formLegalRepresentation = ref()
  const actionForm = ref<ActionType>(props.action)
  const alertModalDeleteRef = ref()
  const alertModalConfig = ref({
    title: 'Advertencia',
    entityId: null as number | null,
  })
  const legalRepresentationDataForm = ref<IBaseLegalRepresentationItem | null>(
    null
  )

  const setValueTableProps = (
    data: IBaseLegalRepresentationItem[] | null = null
  ) => {
    tableProps.value.loading = true
    tableProps.value.rows = data ?? []
    tableProps.value.loading = false
  }

  const handleShowModalForm = (
    row: IBaseLegalRepresentationItem | null = null,
    value: boolean = false,
    action: ActionType = ActionTypeEnum.VIEW
  ) => {
    legalRepresentationDataForm.value = row
    actionForm.value = action

    nextTick(() => {
      showModalForm.value = value
    })
  }

  const openAlertModal = async (action: string, entityId: number) => {
    alertModalConfig.value.entityId = entityId
    alertModalConfig.value.title = `¿Desea ${action} el Representante legal seleccionado?`
    await alertModalDeleteRef.value.openModal()
  }

  const deleteAction = async () => {
    if (!alertModalConfig.value.entityId) return

    tableProps.value.rows = tableProps.value.rows.filter(
      (row: IBaseLegalRepresentationItem) =>
        row.id !== alertModalConfig.value.entityId
    )

    await alertModalDeleteRef.value.closeModal()
  }

  const onUpdateTable = (formData: IBaseLegalRepresentationItem) => {
    if (!formData) return

    const currentRows = [...tableProps.value.rows]

    const itemId = formData.id === -1 ? Date.now() : formData.id
    const updatedItem = {
      ...formData,
      id: itemId,
    }

    if (actionForm.value === ActionTypeEnum.EDIT) {
      const index = currentRows.findIndex((item) => item.id === formData.id)
      if (index !== -1) {
        currentRows[index] = updatedItem
      }
    } else {
      updatedItem.id = itemId
      updatedItem.is_new = true
      updatedItem.status_id = 1
      currentRows.unshift(updatedItem)
    }

    tableProps.value.rows = currentRows
    showModalForm.value = false
  }

  watch(
    () => props.legalRepresentationDataList,
    (val) => {
      if (!val) return
      setValueTableProps(val)
    },
    { deep: true, immediate: true }
  )

  watch(
    () => tableProps.value.rows,
    (val) => {
      if (
        JSON.stringify(val) ===
        JSON.stringify(props.legalRepresentationDataList)
      )
        return

      emit('update:legalRepresentationDataList', val)
    },
    { deep: true }
  )

  return {
    defaultIconsLucide,
    tableProps,
    showModalForm,
    alertModalDeleteRef,
    alertModalConfig,
    legalRepresentationDataForm,
    actionForm,
    formLegalRepresentation,

    validateRouter,
    handleShowModalForm,
    openAlertModal,
    onUpdateTable,
    deleteAction,
  }
}

export default useLegalRepresentationList
