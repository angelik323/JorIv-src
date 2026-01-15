// Vue - Pinia - Router - Quasar
import { onMounted, ref, watch, computed, nextTick } from 'vue'
import { storeToRefs } from 'pinia'

// Composables
import { useUtils, useAlert } from '@/composables'

// Interfaces
import { StatusID, IBaseTableProps } from '@/interfaces/global'
import {
  TypeAttachedDocument,
  DocumentaryStructureContractQueryParam,
} from '@/interfaces/global/DerivativeContracting'
import {
  IDocumentaryStructureContractAnnexedDocument,
  IDocumentaryStructureContractAnnexedDocumentList,
} from '@/interfaces/customs/derivative-contracting/DocumentaryStructureContract'

// Stores
import { useDerivativeContractingResourceStore } from '@/stores/resources-manager/derivative-contracting'
import { useDocumentaryStructureContractStore } from '@/stores/derivative-contracting/documentary-structure-contract'

const useAnnexedDocumentList = (
  props: {
    annexedDocumentList?: IDocumentaryStructureContractAnnexedDocumentList | null
    documentaryStructureContractId?: number | null
  },
  emit: Function
) => {
  const { defaultIconsLucide, formatParamsCustom } = useUtils()
  const { showAlert } = useAlert()

  const {
    contract_document_structure_stage,
    definition_documentation_mandatory,
    available_document_types,
  } = storeToRefs(useDerivativeContractingResourceStore('v1'))

  const store = useDocumentaryStructureContractStore('v1')
  const { _getListAnnexedDocumentsAction } = store
  const { annexed_documents_list, annexed_documents_pages } = storeToRefs(store)

  const tableProps = ref<
    IBaseTableProps<IDocumentaryStructureContractAnnexedDocument>
  >({
    title: 'Asignación documentos anexos',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'type_attached_document',
        align: 'center',
        label: 'Tipo de documento*',
        field: (row: IDocumentaryStructureContractAnnexedDocument) => {
          return row.type_attached_document?.id ?? null
        },
        sortable: true,
        required: true,
      },
      {
        name: 'stage',
        align: 'center',
        label: 'Etapa*',
        field: 'stage',
        sortable: true,
        required: true,
      },
      {
        name: 'mandatory',
        align: 'center',
        label: 'Obligatoriedad*',
        field: 'mandatory',
        sortable: true,
        required: true,
      },
      {
        name: 'status_id',
        align: 'center',
        label: 'Estado',
        field: 'status_id',
        sortable: true,
        required: true,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const annexedFiltersFormat = ref<Record<string, string | number>>({})

  const availableDocumentTypesCompositeIdentifier = computed(() =>
    available_document_types.value.map((item) => ({
      ...item,
      value: `${item.id}-${item.type}`,
      label: item.label,
    }))
  )

  const setTableProps = () => {
    if (!Array.isArray(annexed_documents_list.value)) {
      tableProps.value.rows = []
      return
    }

    const mapDocumentType = (
      item: IDocumentaryStructureContractAnnexedDocument
    ) => {
      const isPolicy = item.type_attached_document?.policy_type
      const type = isPolicy
        ? TypeAttachedDocument.POLICY
        : TypeAttachedDocument.ANNEX_DOCUMENT
      const id = item.type_attached_document?.id || null

      return {
        ...item,
        type_attached_document: {
          id,
          type,
          value: `${id}-${type}`,
        },
        type_attached_document_id: isPolicy ? null : id,
        type_of_policy_id: isPolicy ? item.type_of_policy_id ?? id : null,
      }
    }

    const rows = annexed_documents_list.value.map(mapDocumentType)

    nextTick(() => {
      tableProps.value.rows = [...rows]
    })

    tableProps.value.pages = {
      ...tableProps.value.pages,
      ...annexed_documents_pages.value,
    }
  }

  const annexedListAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true

    if (!props.documentaryStructureContractId) return

    const params = new URLSearchParams({
      [DocumentaryStructureContractQueryParam.FILTER_CONTRACT_DOCUMENT_ID]:
        String(props.documentaryStructureContractId),
    })

    await _getListAnnexedDocumentsAction(`${filters}&${params.toString()}`)

    tableProps.value.loading = false
  }

  const updatePage = async (page: number) => {
    annexedFiltersFormat.value = {
      ...annexedFiltersFormat.value,
      page: page,
    }
    const queryString = formatParamsCustom(annexedFiltersFormat.value)

    annexedListAction(queryString ? '&' + queryString : '')
  }

  const updatePerPage = (rowsPerPage: number) => {
    annexedFiltersFormat.value = {
      ...annexedFiltersFormat.value,
      rows: rowsPerPage,
    }
    const queryString = formatParamsCustom(annexedFiltersFormat.value)

    annexedListAction(queryString ? '&' + queryString : '')
  }

  const validateExists = (
    value: string,
    currentRowId: number | null
  ): boolean => {
    if (value === null) return false

    return tableProps.value.rows.some(
      (row: IDocumentaryStructureContractAnnexedDocument) => {
        if (currentRowId && row.id === currentRowId) return false
        const hasSameAttachedDocument =
          row.type_attached_document?.value === value

        return hasSameAttachedDocument
      }
    )
  }

  const updateAttachedDocument = async (
    row: IDocumentaryStructureContractAnnexedDocument,
    value: string
  ) => {
    if (!value) {
      row.type_attached_document_id = null
      row.type_attached_document = {
        id: null,
        type: '',
        value: '',
      }
      return
    }

    const selected = availableDocumentTypesCompositeIdentifier.value.find(
      (document) => String(document.value) === value
    )

    const updatedRows = JSON.parse(JSON.stringify(tableProps.value.rows))

    if (validateExists(value, row.id || null)) {
      showAlert(
        'En un documento contractual no se puede repetir el documento anexo o la Tipo de póliza',
        'error'
      )
      row.type_attached_document_id = null
      row.type_attached_document = {
        id: null,
        type: '',
      }
      tableProps.value.rows = []
      nextTick(() => {
        tableProps.value.rows = [...updatedRows]
      })
      return
    }

    row.type_attached_document = {
      id: selected?.id || null,
      type: selected?.type || '',
      value: value,
    }

    if (selected?.type === TypeAttachedDocument.POLICY) {
      row.type_of_policy_id = selected?.id || null
      row.type_attached_document_id = null
    } else {
      row.type_attached_document_id = selected?.id || null
      row.type_of_policy_id = null
    }
  }

  const handleAddRow = () => {
    const newRow: IDocumentaryStructureContractAnnexedDocument = {
      type_attached_document: {
        id: null,
        type: '',
        value: '',
      },
      stage: '',
      mandatory: '',
      status_id: StatusID.ACTIVE,
      is_new: true,
      type_attached_document_id: null,
      type_of_policy_id: null,
    }
    tableProps.value.rows.push(newRow)
  }

  const hanldeChangeStatus = (
    row: IDocumentaryStructureContractAnnexedDocument
  ) => {
    row.status_id =
      row.status_id === StatusID.ACTIVE ? StatusID.INACTIVE : StatusID.ACTIVE
  }

  const handleDeleteRow = (id: number) => {
    tableProps.value.rows = tableProps.value.rows.filter(
      (row: IDocumentaryStructureContractAnnexedDocument) => row.id !== id
    )
  }

  onMounted(() => {
    if (props.documentaryStructureContractId) {
      annexedListAction()
    }
  })

  watch(
    () => annexed_documents_list.value,
    () => {
      setTableProps()
    }
  )

  watch(
    () => tableProps.value.rows,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.annexedDocumentList))
        return

      const cleanedVal = val?.map(
        (row: IDocumentaryStructureContractAnnexedDocument) => {
          const { is_new, ...cleanRow } = row
          return cleanRow
        }
      )

      const filteredVal = cleanedVal && cleanedVal.length > 0 ? cleanedVal : []
      emit('update:annexed-document-list', filteredVal)
    },
    { deep: true }
  )

  return {
    tableProps,
    defaultIconsLucide,
    contract_document_structure_stage,
    definition_documentation_mandatory,
    availableDocumentTypesCompositeIdentifier,

    updatePage,
    updatePerPage,
    handleAddRow,
    handleDeleteRow,
    hanldeChangeStatus,
    updateAttachedDocument,
  }
}

export default useAnnexedDocumentList
