// Vue, Pinia
import { computed, ref, watch } from 'vue'

// Composables
import { useUtils } from '@/composables'

// Interfaces
import { ActionType } from '@/interfaces/global/Action'
import { ITypeOfPolicyForm, ITypeOfPolicyTable } from '@/interfaces/customs/derivative-contracting/TypesOfPolicy'
import { IRiskDefinitionResponse } from '@/interfaces/customs/derivative-contracting/RiskDefinition'
import { IGenericResource } from '@/interfaces/customs'

// Stores
import { IBaseTableProps } from '@/interfaces/global'

const useTypeOfPolicyInformationForm = (
  props: { 
          action: ActionType; 
          basicDataForm?: ITypeOfPolicyForm | null , 
          risks?: IRiskDefinitionResponse[],
          policyStage?: IGenericResource[],
          riskList?: IGenericResource[]
        },
  emit: Function
) => {
  const { isEmptyOrZero, defaultIconsLucide } = useUtils()

  const formElementRef = ref()
  const qFormRef = formElementRef
  const stageRef = ref()
  const nameRef = ref()
  const statusRef = ref()

  const form = ref<ITypeOfPolicyForm>({
    name: '',
    stage: '',
    status_id: 1,
    risk_ids: [],
  })

  const _setValueModel = () => {
    if (!props.basicDataForm) return
    Object.assign(form.value, props.basicDataForm)
  }

  let perPage = 20

  const tablePropertiesList = ref<IBaseTableProps<ITypeOfPolicyTable>>({
    title: 'Estado de riesgos cubiertos',
    loading: false,
    wrapCells: true,
    columns: [
      { name: 'id', required: true, label: '#', align: 'left', field: 'id', sortable: true },
      { name: 'risk', required: true, label: 'Riesgo', align: 'left', field: (row) => `${row.risk_id ?? ''}`, sortable: true },
      { name: 'min', required: true, label: '% Mínimo', align: 'left', field: (row) => `${row.min ?? ''}`, sortable: true },
      { name: 'max', required: true, label: '% Máximo', align: 'left', field: (row) => `${row.max ?? ''}`, sortable: true },
      { name: 'status', required: true, label: 'Estado', align: 'center', field: (row) => `${row.status ?? ''}`, sortable: true },
      { name: 'actions', required: true, label: 'Acciones', align: 'center', field: 'id' },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })

  const customColumns = computed(() => {
    if (props.action === 'create') return ['risk', 'min', 'max', 'status', 'actions']
    if (props.action === 'edit') return ['risk', 'min', 'max', 'status', 'actions']
    return []
  })

  const visibleColumns = computed<string[]>(() => {
    const base = ['id']
    return props.action === 'create'
      ? [...base, 'risk', 'min', 'max', 'actions']
      : [...base, 'risk', 'min', 'max', 'status', 'actions']
  })

  const handleAddRow = () => {
    const newId = (tablePropertiesList.value.rows?.length ?? 0) + 1
    tablePropertiesList.value.rows.push({
      id: newId,
      risk_id: '' as string,
      min: '',
      max: '',
      status: true,
      actions: '',
      isNew: true,
    } as ITypeOfPolicyTable & { isNew?: boolean })
  }

  const handleDeleteRow = (rowId: number) => {
    tablePropertiesList.value.rows = tablePropertiesList.value.rows.filter((r) => r.id !== rowId)
  }

  const updateTablePropertiesListRows = () => {
    let { currentPage } = tablePropertiesList.value.pages
    const { lastPage } = tablePropertiesList.value.pages
    if (currentPage > lastPage) currentPage = lastPage
    tablePropertiesList.value.rows = tablePropertiesList.value.rows.slice(
      (currentPage - 1) * perPage,
      (currentPage - 1) * perPage + perPage
    )
  }

  const updatePage = () => updateTablePropertiesListRows()
  const updatePerPage = (rowsPerPage: number) => {
    perPage = rowsPerPage
    tablePropertiesList.value.pages.lastPage = Math.ceil(tablePropertiesList.value.rows.length / perPage)
  }

  const collectRiskIds = (): number[] => {
    const ids = (tablePropertiesList.value.rows ?? [])
      .map((r) => r?.risk_id)
      .filter((v) => v !== null && v !== undefined && v !== '')
      .map((v) => Number(v))
      .filter((n) => !Number.isNaN(n))
    return Array.from(new Set(ids))
  }

  const onRiskChange = (row: ITypeOfPolicyTable & { isNew?: boolean }, val: unknown) => {
    row.risk_id = String(val)

    const risk = props.risks?.find((r) => r.id === Number(val))

    if (risk) {
      row.min = String(risk.minimum_percentage ?? '')
      row.max = String(risk.maximum_percentage ?? '')
      row.status = Number(risk.status_id ?? risk.status?.id ?? 1) === 1
    }
  }

  const riskToRow = (
    r: IRiskDefinitionResponse,
    idx: number
  ): ITypeOfPolicyTable & { isNew?: boolean } => ({
    id: idx + 1,
    risk_id: String(r.id),
    min: String(r.minimum_percentage ?? ''),
    max: String(r.maximum_percentage ?? ''),
    status: Number((r).status_id ?? r.status?.id ?? 1) === 1,
    actions: '',
    isNew: false,
  })

  watch(
    () => props.basicDataForm,
    (val) => {
      if (!val) return

      _setValueModel()

      if (tablePropertiesList.value.rows.length > 0) return

      // Fuente de riesgos: puede venir desde props.basicDataForm o desde props.risks
      const risksFromForm = (val as ITypeOfPolicyForm).risks
      const risks = Array.isArray(risksFromForm) && risksFromForm.length
        ? risksFromForm
        : val.risk_ids?.map((id) => props.risks?.find((r) => r.id === Number(id))).filter(Boolean)

      if (!risks || !risks.length) return

      tablePropertiesList.value.rows = risks.map((r, idx) => riskToRow(r!, idx))
    },
    { deep: true, immediate: true }
  )


  watch(
    () => form.value,
    (val) => {
      emit('update:basic-data-form', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  watch(
    () => tablePropertiesList.value.rows,
    () => {
      const ids = collectRiskIds()
      form.value.risk_ids = ids
      emit('update:basic-data-form', isEmptyOrZero(form.value) ? null : form.value)
    },
    { deep: true }
  )

  const validateForm = async () => {
    const name = String(form.value.name ?? '').trim()
    const stage = String(form.value.stage ?? '').trim()
    const riskIds = collectRiskIds()
    return !!name && !!stage && !!riskIds.length
  }

  const policyStage = computed(() => props.policyStage ?? [])
  const riskList = computed(() => props.riskList ?? [])

  return {
    // refs
    formElementRef,
    qFormRef,
    stageRef,
    nameRef,
    statusRef,

    // form
    form,
    policyStage,
    riskList,
    defaultIconsLucide,

    // tabla
    visibleColumns,
    customColumns,
    tablePropertiesList,
    handleAddRow,
    handleDeleteRow,
    updatePage,
    updatePerPage,

    // helpers
    validateForm,
    onRiskChange,
  }
}

export default useTypeOfPolicyInformationForm
