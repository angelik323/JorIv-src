import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { useAlert } from '@/composables'
import moment from 'moment'
import {
  IDocumentCharacteristicsForm,
  IDocumentCharacteristicsPayload,
  IDocumentStructuresForCharacteristics,
} from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'
import {
  useDocumentCharacteristicsStore,
  useResourceManagerStore,
  useTrustBusinessResourceStore,
} from '@/stores'

const useDocumentCharacteristicsForm = (action: ActionType) => {
  const { showAlert } = useAlert()
  const { business_trusts, document_types, document_structures } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { data_document_characteristics_form } = storeToRefs(
    useDocumentCharacteristicsStore('v1')
  )
  const { _createAction } = useDocumentCharacteristicsStore('v1')

  const formDocumentCharacteristics = ref()

  const models = ref<IDocumentCharacteristicsForm>({
    business_trust_id: '',
    document_type_id: '',
    created_at: moment().format('YYYY-MM-DD'),
    characteristics_document: [],
  })

  const getAvailableOrderOptions = (_currentIndex: number) => {
    const totalRows = models.value.characteristics_document.length

    const availableOptions = []
    for (let i = 1; i <= totalRows; i++) {
      availableOptions.push({
        label: i.toString(),
        value: i,
      })
    }

    return availableOptions
  }

  const businessTrustSelected = ref()

  const tableProperties = ref({
    title: 'Listado de características',
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
        name: 'caracteristic_code_and_description',
        required: true,
        label: 'Código y descripción de característica',
        align: 'left',
        field: (row) => `${row.characteristic_code} - ${row.description}`,
        sortable: true,
      },
      {
        name: 'type',
        required: true,
        label: 'Tipo de dato',
        align: 'left',
        field: 'type',
        sortable: true,
      },
      {
        name: 'is_obligatory',
        required: true,
        label: 'Obligatoriedad',
        align: 'left',
        field: (row) => (row.obligatory ? 'Sí' : 'No'),
        sortable: true,
      },
      {
        name: 'alert',
        required: true,
        label: 'Alerta',
        align: 'left',
        field: (row) => (row.alert ? 'Sí' : 'No'),
        sortable: true,
      },
      {
        name: 'order',
        required: true,
        label: 'Orden',
        align: 'left',
        field: 'order',
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
    rows: [] as IDocumentStructuresForCharacteristics[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
    wrapCells: true,
  })

  const alertModalRef = ref()

  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '¿Desea eliminar la característica?',
    index: null as number | null,
  })

  const openModalDelete = async (index: number) => {
    if (index !== null && index >= 0) {
      alertModalConfig.value.index = index
      await alertModalRef.value.openModal()
    }
  }

  const addRowTable = () => {
    const nextOrder = models.value.characteristics_document.length + 1
    models.value.characteristics_document.push({
      id: 0,
      business_trust_id: 0,
      characteristic_code: '',
      description: '',
      type: '',
      obligatory: false,
      alert: false,
      order: nextOrder,
    })

    tableProperties.value.rows = [...models.value.characteristics_document]
  }

  const handleDeleteRow = () => {
    const deletedIndex = alertModalConfig.value.index!
    const deletedOrder =
      models.value.characteristics_document[deletedIndex].order

    // Eliminar el elemento
    models.value.characteristics_document.splice(deletedIndex, 1)

    // Reajustar los órdenes de los elementos que tenían un orden mayor al eliminado
    models.value.characteristics_document.forEach(
      (item: IDocumentStructuresForCharacteristics) => {
        if (item.order > deletedOrder) {
          item.order -= 1
        }
      }
    )

    tableProperties.value.rows = [...models.value.characteristics_document]
    alertModalConfig.value.index = null
    alertModalRef.value.closeModal()
  }

  const updateOrder = (newOrder: number, rowIndex: number) => {
    const currentOrder = models.value.characteristics_document[rowIndex].order

    if (currentOrder === newOrder) {
      return
    }

    const targetIndex = models.value.characteristics_document.findIndex(
      (item) => item.order === newOrder
    )

    if (targetIndex !== -1 && targetIndex !== rowIndex) {
      models.value.characteristics_document[targetIndex].order = currentOrder
      models.value.characteristics_document[rowIndex].order = newOrder
    } else {
      models.value.characteristics_document[rowIndex].order = newOrder
    }

    models.value.characteristics_document.sort(
      (a, b) => (a.order || 0) - (b.order || 0)
    )

    tableProperties.value.rows = [...models.value.characteristics_document]
  }

  const changeSelectorCharacteristic = async (
    selectedId: number,
    index: number
  ) => {
    const isAlreadySelected = models.value.characteristics_document.some(
      (child: IDocumentStructuresForCharacteristics, i: number) =>
        child.id === selectedId && i !== index
    )
    if (isAlreadySelected) {
      showAlert(
        'No se puede crear un registro con la misma característica',
        'warning',
        undefined,
        3000
      )

      // Resetear el elemento específico
      models.value.characteristics_document[index] = {
        ...models.value.characteristics_document[index],
        id: 0,
        business_trust_id: 0,
        characteristic_code: '',
        description: '',
        type: '',
        obligatory: false,
        is_obligatory: false,
        alert: false,
      }

      return
    }

    const codeSelected = document_structures.value.find(
      (item) => item.id === selectedId
    ) as IDocumentStructuresForCharacteristics | undefined

    if (!codeSelected) {
      return
    }

    models.value.characteristics_document[index] = {
      ...models.value.characteristics_document[index],
      id: codeSelected.id ?? 0,
      characteristic_code: codeSelected.characteristic_code ?? '',
      description: codeSelected.description ?? '',
      type:
        (codeSelected as { type_data?: string }).type_data ||
        codeSelected.business_trust_document_structure?.type_data ||
        codeSelected.type ||
        '',
      obligatory:
        (codeSelected as { is_obligatory?: boolean }).is_obligatory ||
        codeSelected.business_trust_document_structure?.is_obligatory ||
        false,
      alert:
        (codeSelected as { alert?: boolean }).alert ||
        codeSelected.business_trust_document_structure?.alert ||
        false,
      business_trust_id: models.value.business_trust_id,
    }
    tableProperties.value.rows = [...models.value.characteristics_document]
  }

  const renderDocumentTypeCodeAndDescription = computed(() => {
    const docType = document_types.value.find(
      (item) => item.id === models.value.document_type_id
    )
    return docType ? docType.label : '-'
  })

  const keys = { trust_business: ['business_trusts'] }

  onMounted(async () => {
    if (action === 'view') {
      tableProperties.value.columns = tableProperties.value.columns!.filter(
        (col) => col.name !== 'actions'
      )
    }
    _getResources(keys)
  })

  onBeforeUnmount(() => {
    const keysToReset = {
      trust_business: [
        'business_trusts',
        'document_types',
        'document_structures',
      ],
    }
    _resetKeys(keysToReset)
  })

  watch(
    () => businessTrustSelected.value,
    (newBusinessTrustSelected) => {
      if (!newBusinessTrustSelected) {
        return
      }

      const keys = { trust_business: ['document_types', 'document_structures'] }
      _getResources(keys, `business_trust_id=${newBusinessTrustSelected}`)
      models.value.business_trust_id = newBusinessTrustSelected
    }
  )

  watch(
    () => data_document_characteristics_form.value,
    (newData) => {
      if (!newData) {
        return
      }

      businessTrustSelected.value = newData.business_trust?.id
      models.value = {
        business_trust_id: newData.business_trust?.id || 0,
        document_type_id: newData.document_type_id,
        created_at: newData.created_at,
        business_trust: newData.business_trust,
        characteristics_document: newData.characteristics_document.map(
          (item) => ({
            id: item.business_trust_document_structure?.id || 0,
            order: item.order,
            description:
              item.business_trust_document_structure?.description || '',
            obligatory:
              item.business_trust_document_structure?.is_obligatory || false,
            characteristic_code:
              item.business_trust_document_structure?.characteristic_code || '',
            alert: item.business_trust_document_structure?.alert || false,
            type: item.business_trust_document_structure?.type_data || '',
            business_trust_id: newData.business_trust_id,
          })
        ),
      }

      const sortedRows = [...models.value.characteristics_document].sort(
        (a, b) => (a.order || 0) - (b.order || 0)
      )
      tableProperties.value.rows = sortedRows
    }
  )

  const handleSubmitForm = async () => {
    // Validar que no hay características sin seleccionar (id = 0)
    const hasUnselectedCharacteristics =
      models.value.characteristics_document.some((item) => item.id === 0)

    if (hasUnselectedCharacteristics) {
      showAlert(
        'No se puede crear un registro con la misma característica',
        'warning',
        undefined,
        3000
      )
      return
    }

    const payload: IDocumentCharacteristicsPayload = {
      document_type_id: models.value.document_type_id,
      characteristics_document: models.value.characteristics_document.map(
        (item) => ({
          document_structure_id: item.id,
          order: item.order,
        })
      ),
      action: action === 'create' ? 'create' : 'update',
    }
    return await _createAction(models.value.business_trust_id, payload)
  }

  return {
    models,
    tableProperties,
    alertModalRef,
    alertModalConfig,
    businessTrustSelected,
    business_trusts,
    document_types,
    document_structures,
    formDocumentCharacteristics,
    renderDocumentTypeCodeAndDescription,
    getAvailableOrderOptions,
    openModalDelete,
    addRowTable,
    handleDeleteRow,
    changeSelectorCharacteristic,
    updateOrder,
    handleSubmitForm,
  }
}

export default useDocumentCharacteristicsForm
