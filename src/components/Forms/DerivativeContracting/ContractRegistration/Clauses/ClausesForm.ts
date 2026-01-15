// Vue - Pinia - Router - Quasar
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Composables
import { useUtils } from '@/composables'

// Interfaces
import { ActionType, IBaseTableProps } from '@/interfaces/global'
import {
  IContractRegistrationClauses,
  IContractRegistrationClausesForm,
  IContractRegistrationGeneralDataForm,
} from '@/interfaces/customs/derivative-contracting/ContractRegistration'

// Stores
import { useDerivativeContractingResourceStore } from '@/stores/resources-manager/derivative-contracting'
import { useContractRegistrationStore } from '@/stores'
import { useRoute } from 'vue-router'

const useClausesForm = (
  props: {
    action: ActionType
    data?: IContractRegistrationGeneralDataForm | null
  },
  emit: Function
) => {
  const { _generatePDFContractRegistration } =
    useContractRegistrationStore('v1')

  const { clause_types, contract_clauses_codes } = storeToRefs(
    useDerivativeContractingResourceStore('v1')
  )

  const { isEmptyOrZero, defaultIconsLucide, getMaxId, downloadBlob } =
    useUtils()

  const route = useRoute()
  const searchId = +route.params.id
  const formElementRef = ref()

  const selectedRowsClauses = ref<IContractRegistrationClauses[]>([])
  const addClausesModalRef = ref()
  const addClausesModalConfig = ref<IContractRegistrationClausesForm>({
    id: null,
    action: 'Crear',
    order: null,
    clause_type_id: null,
    clause_type: null,
    contract_clause_id: null,
    name: null,
    description: null,
    clausule: null,
  })

  const alertModalRef = ref()
  const alertModalConfig = ref({
    id: null as number | null,
    title: 'Advertencia',
    description: '¿Desea eliminar la cláusula seleccionada?',
    description2: 'Se eliminará el registro asociado',
    showCloseBtn: false,
  })

  const models = ref<Partial<IContractRegistrationGeneralDataForm>>({
    clauses: [],
  })

  const tablePropertiesClauses = ref<
    IBaseTableProps<IContractRegistrationClauses>
  >({
    title: 'Cláusulas del contrato',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'order_clause',
        required: true,
        label: 'Orden de cláusula',
        align: 'left',
        field: 'order',
        sortable: true,
      },
      {
        name: 'clause_type',
        required: true,
        label: 'Tipo de cláusula',
        align: 'left',
        field: (row) => row.clause_type,
        sortable: true,
      },
      {
        name: 'name',
        required: true,
        label: 'Nombre de cláusula',
        align: 'left',
        field: 'name',
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'left',
        field: 'id',
        sortable: false,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const setValueModel = () => {
    Object.assign(models.value, props.data)
  }

  watch(
    () => props.data,
    (val) => {
      if (!val) return
      setValueModel()
    },
    { deep: true, immediate: true }
  )

  watch(
    () => models.value,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  const generateClausesPDF = async () => {
    const selectedClause = selectedRowsClauses.value[0]
    if (!selectedClause) return

    const result = await _generatePDFContractRegistration({
      contract_id: searchId,
      clause_type_id: Number(selectedClause?.clause_type_id),
      order: selectedClause?.order || null,
      name: selectedClause?.name || null,
      description: selectedClause?.description || null,
    })

    if (result) {
      const blob = new Blob([result], { type: 'application/pdf' })
      downloadBlob(
        blob,
        `clausula_${selectedClause.name || 'documento'}_${Date.now()}.pdf`
      )
    }
  }

  const handleOpenModal = async () => {
    clearAlertModalConfig()
    await addClausesModalRef.value.openModal()
  }

  const handleAddClause = async () => {
    const { action, id, ...configData } = addClausesModalConfig.value

    const clauses = {
      id: id ?? getMaxId(models.value.clauses ?? []) + 1,
      order: configData.order || 0,
      clause_type: configData.clause_type || null,
      clause_type_id: configData.clause_type_id || '',
      name: configData.name || '',
      contract_clause_id: configData.contract_clause_id || null,
      description: configData.description || '',
      clausule: configData.clausule || '',
      is_new_clause: action === 'Crear',
    }

    if (action === 'Editar') {
      const index = models.value.clauses?.findIndex((it) => it.id === id)

      if (index !== undefined && index > -1) {
        models.value.clauses![index] = clauses
      }
    } else {
      models.value.clauses?.push(clauses)
    }

    clearAlertModal()
    await addClausesModalRef.value.closeModal()
  }

  const clearAlertModal = () => {
    addClausesModalConfig.value = {
      id: null,
      action: 'Crear',
      order: null,
      clause_type_id: null,
      clause_type: null,
      contract_clause_id: null,
      name: null,
      description: null,
      clausule: null,
    }
  }

  const openClauseModal = async (
    clauseId: number | string,
    action: 'Editar' | 'Ver'
  ) => {
    const clause = models.value.clauses?.find((c) => c.id === clauseId)

    if (!clause) return

    addClausesModalConfig.value = {
      action,
      ...clause,
      id: clause.id ?? null,
      clause_type: clause.clause_type || null,
      clause_type_id: clause.clause_type_id
        ? Number(clause.clause_type_id)
        : null,
    }

    await addClausesModalRef.value.openModal()
  }

  const handleOpenModalDelete = (id: number) => {
    const clause = models.value.clauses?.find((doc) => doc.id === id)
    if (!clause) return

    alertModalConfig.value.id = id
    alertModalRef.value.openModal()
  }

  const handleDeleteClause = async (clauseId: number | string) => {
    models.value.clauses = models.value.clauses?.filter(
      (clause) => clause.id !== clauseId
    )

    await alertModalRef.value.closeModal()
  }

  const clearAlertModalConfig = () => {
    addClausesModalConfig.value = {
      id: null,
      action: 'Crear',
      order: null,
      clause_type_id: null,
      clause_type: null,
      contract_clause_id: null,
      name: null,
      description: null,
      clausule: null,
    }
  }

  watch(
    () => models.value.clauses,
    (val) => {
      tablePropertiesClauses.value.rows = val || []
    },
    { deep: true, immediate: true }
  )

  return {
    formElementRef,
    tablePropertiesClauses,
    defaultIconsLucide,
    alertModalRef,
    alertModalConfig,
    addClausesModalRef,
    addClausesModalConfig,
    clause_types,
    contract_clauses_codes,
    selectedRowsClauses,

    handleOpenModal,
    handleAddClause,
    handleDeleteClause,
    openClauseModal,
    generateClausesPDF,
    handleOpenModalDelete,
  }
}

export default useClausesForm
