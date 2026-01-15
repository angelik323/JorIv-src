// Vue
import { computed, reactive, ref, watch } from 'vue'
import { QTable } from 'quasar'

// Interfaces
import {
  Clauses,
  IClausesFormAdditions,
} from '@/interfaces/customs/derivative-contracting/RegisterAdditions'
import { ActionType } from '@/interfaces/global'

// Composables
import { useMainLoader, useUtils } from '@/composables'

// Stores
import { storeToRefs } from 'pinia'
import {
  useDerivativeContractingResourceStore,
  useRegisterAdditionsStore,
} from '@/stores'

const useClausulesForm = (
  props: {
    data: IClausesFormAdditions | null
  },
  emit: Function
) => {
  const { clause_types, contract_clauses_names } = storeToRefs(
    useDerivativeContractingResourceStore('v1')
  )
  const { _generateClausePDF } = useRegisterAdditionsStore('v1')
  const { defaultIconsLucide, isEmptyOrZero } = useUtils()

  const { openMainLoader } = useMainLoader()

  const formElementRef = ref()
  const addAdditionModalRef = ref()
  const formAdditionModal = ref()

  const initialModelsValues: IClausesFormAdditions = {
    clauses: [],
  }

  const modelsModal = reactive<Clauses>({
    select: false,
    id: null,
    order: null,
    type_clause_id: null,
    clause_id: null,
    clause_description: null,
  })

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const rowToDelete = ref<number | null>(null)

  const deleteModalRef = ref()

  const modalProperties = ref({
    title: '',
    buttonLabel: '',
    type: '' as ActionType,
  })

  const tableProps = ref({
    title: 'Listado de adiciones de cláusula del contrato',
    loading: false,
    columns: [
      {
        name: 'select',
        field: 'select',
        required: false,
        label: '',
        align: 'center',
        sortable: true,
      },
      {
        name: 'id',
        field: 'id',
        required: false,
        label: '#',
        align: 'center',
        sortable: true,
      },
      {
        name: 'order',
        field: 'order',
        required: true,
        label: 'Orden de cláusula',
        align: 'left',
        sortable: true,
      },
      {
        name: 'type_clause_id',
        field: (row) =>
          clause_types.value.find((e) => e.value === row.type_clause_id)?.label,
        required: true,
        label: 'Tipo de cláusula',
        align: 'left',
        sortable: true,
      },
      {
        name: 'clause_id',
        field: (row) =>
          contract_clauses_names.value.find((e) => e.value === row.clause_id)
            ?.label ?? row.clause_id,
        required: true,
        label: 'Nombre de cláusula',
        align: 'left',
        sortable: true,
      },
      {
        name: 'actions',
        field: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: computed(() => models.value.clauses ?? []),
  })

  const _setValueModel = () => {
    if (!props.data) return
    models.value = { ...props.data }
  }

  const openDeleteModal = (idRow: number) => {
    rowToDelete.value = idRow
    deleteModalRef.value.openModal()
  }

  const confirmDeleteAction = async () => {
    if (!rowToDelete.value) return

    models.value.clauses = models.value?.clauses?.filter(
      (r) => r.id !== rowToDelete.value
    )

    deleteModalRef.value.closeModal()
    rowToDelete.value = null
  }

  const openModal = (type: ActionType, row?: Clauses) => {
    addAdditionModalRef.value.openModal()
    modalProperties.value.type = type
    cleanValuesModal()

    switch (type) {
      case 'create':
        modalProperties.value.title = 'Agregar adición de cláusula'
        modalProperties.value.buttonLabel = 'Agregar'

        break
      case 'edit':
        modalProperties.value.title = 'Actualizar adición de cláusula'
        modalProperties.value.buttonLabel = 'Actualizar'
        if (row) fillDataModal(row)

        break
      case 'view':
        modalProperties.value.title = 'Ver adición de cláusula'
        modalProperties.value.buttonLabel = 'Finalizar'
        if (row) fillDataModal(row)

        break
    }
  }

  const cleanValuesModal = () => {
    modelsModal.id = null
    modelsModal.order = null
    modelsModal.type_clause_id = null
    modelsModal.clause_id = null
    modelsModal.clause_description = null
  }

  const fillDataModal = (row: Clauses) => {
    const clone = JSON.parse(JSON.stringify(row))
    Object.assign(modelsModal, clone)
  }

  const saveAddition = () => {
    if (!formAdditionModal.value?.validate()) return
    models.value.clauses = models.value.clauses ?? []

    const payload: Clauses = JSON.parse(JSON.stringify(modelsModal))
    const type = modalProperties.value.type

    if (['create'].includes(type)) {
      const ids = models.value.clauses
        .map((p) => Number(p.id))
        .filter((n) => Number.isFinite(n))
      const nextId = ids.length ? Math.max(...ids) + 1 : 1
      payload.id = payload.id ?? nextId
      models.value.clauses.push(payload)
    } else if (['edit'].includes(type)) {
      const idx = models.value.clauses.findIndex((p) => p.id === payload.id)
      if (idx > -1) {
        models.value.clauses[idx] = payload
      }
    }

    addAdditionModalRef.value.closeModal()
  }

  const generatePDF = async () => {
    openMainLoader(true)
    const clauses =
      models.value.clauses?.filter((e) => e.select).map((e) => e.id ?? 0) ?? []

    await _generateClausePDF(clauses)
    openMainLoader(false)
  }

  watch(
    () => props.data,
    (val) => {
      if (!val) return
      _setValueModel()
    },
    { deep: true, immediate: true }
  )

  watch(
    models,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  watch(
    () => modelsModal.clause_id,
    (val) => {
      if (val) {
        const data = contract_clauses_names.value.find((e) => e.value === val)
        if (data) modelsModal.clause_description = data.clausule ?? null
      } else {
        modelsModal.clause_description = null
      }
    }
  )

  return {
    formElementRef,
    models,
    defaultIconsLucide,
    tableProps,
    deleteModalRef,
    addAdditionModalRef,
    modelsModal,
    formAdditionModal,
    clause_types,
    modalProperties,
    contract_clauses_names,
    generatePDF,
    saveAddition,
    openModal,
    confirmDeleteAction,
    openDeleteModal,
  }
}

export default useClausulesForm
