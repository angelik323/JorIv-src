// vue - pinia - quasar
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// interfaces
import {
  IRealStateProject,
  IRealStateProjectStages,
} from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'

// stores
import {
  useRealStateProjectStore,
  useTrustBusinessResourceStore,
} from '@/stores'

// utils
import { isEmptyOrZero } from '@/utils'

// composables
import { useAlert, useMainLoader } from '@/composables'

const useInformationForm = (
  props: {
    action: ActionType
    data?: IRealStateProject
  },
  emit: Function
) => {
  const { project_type, project_status, business_inmobiliary } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )

  const { openMainLoader } = useMainLoader()
  const { showAlert } = useAlert()

  const { _setDataInformationForm } = useRealStateProjectStore('v1')
  const { data_information_form } = storeToRefs(useRealStateProjectStore('v1'))

  const formInformation = ref()
  const formPropertyFeatures = ref()
  const isValid = ref(false)
  const addedRows = ref(false)
  const actionModal = ref()
  const isClick = ref(false)

  // init data
  const models = ref<IRealStateProject>({
    id: undefined,
    business_trust_id: null,
    project_name: null,
    project_type: null,
    description: null,
    num_stages: null,
    status: undefined,
    stages: [],
    status_id: null,
  })

  const defaultStage: Partial<IRealStateProjectStages> = {
    address: null,
    land_area: null,
    builder_id: null,
    technical_supervision_id: null,
    property_registration: null,
    start_date: null,
    start_end: null,
    total_value: null,
    financed_value: null,
    associated_financing: null,
    observations: null,
    development_type: null,
    block_nomenclature: null,
    number_of_groups: null,
    initial_group: null,
    final_group: null,
    total_units_stage: null,
    property_area_m2: null,
    property_value_calculation: null,
    property_value: null,
    department_id: null,
    number_of_unit_per_group: null,
    city_id: null,
    policies_id: null,
    guarantee_id: null,
    financing_bank_id: null,
    business_trust_project_id: null,
    business_trust_id: null,
    base_calculation_property: null,
  }

  // table
  const tableProps = ref({
    title: 'Listado de etapas',
    loading: false,
    columns: [
      {
        name: 'id',
        field: 'id',
        required: false,
        label: '#',
        align: 'center',
        sortable: true,
      },
      {
        name: 'stage_number',
        field: 'stage_number',
        required: false,
        label: 'Nº de etapa',
        align: 'center',
        sortable: true,
      },
      {
        name: 'start_date',
        field: 'start_date',
        required: false,
        label: 'Fecha de inicio',
        align: 'center',
        sortable: true,
      },
      {
        name: 'total_value',
        field: 'total_value',
        required: false,
        label: 'Valor total de la etapa',
        align: 'center',
        sortable: true,
      },
      {
        name: 'status_id',
        field: 'status_id',
        required: false,
        label: 'Estado',
        align: 'center',
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
    rows: [] as IRealStateProjectStages[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  // actions
  const emitData = () => {
    if (!models.value.num_stages) return
    const stages_before = []
    for (let i = 1; i <= models.value.num_stages; i++) {
      stages_before?.push({
        id: undefined,
        stage_number: i,
        status_id: 82,
        ...defaultStage,
      } as IRealStateProjectStages)
    }
    models.value.stages = [...stages_before]
    addedRows.value = true
    isClick.value = true
  }

  const handlerActionForm = (action: ActionType) => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setModelView,
      edit: _setModelView,
      view: _setModelView,
    }
    actionHandlers[action]?.()
  }

  const _setModelView = () => {
    const data = data_information_form.value || props.data
    if (data) {
      models.value = {
        ...data,
      }
    }
    addedRows.value = true
  }

  // modal delete
  const alertModalRef = ref()
  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '',
    entityId: null as number | null,
  })

  const openAlertModal = async (status: string, stage_number: number) => {
    alertModalConfig.value.entityId = stage_number
    alertModalConfig.value.description = setAlertModalDescription(status)
    await alertModalRef.value.openModal()
  }

  const setAlertModalDescription = (status: string) => {
    return `¿Está seguro que desea ${status} el negocio?`
  }

  const deleteRealStateProject = async () => {
    alertModalRef.value.closeModal()
    openMainLoader(true)

    const idToReplace = alertModalConfig.value.entityId
    if (idToReplace != null) {
      tableProps.value.rows = tableProps.value.rows.map((item) =>
        item.id === idToReplace
          ? ({
              id: item.id,
              stage_number: item.stage_number,
              ...defaultStage,
            } as IRealStateProjectStages)
          : item
      )

      if (props.action === 'create' || props.action === 'edit') {
        tableProps.value.rows = tableProps.value.rows
          .filter((item) => item.stage_number !== idToReplace)
          .map((item, index) => ({
            ...item,
            stage_number: index + 1,
          }))
        models.value.num_stages =
          tableProps.value.rows.length > 0 ? tableProps.value.rows.length : null
        models.value.stages = [...tableProps.value.rows]
      }

      if (tableProps.value.rows.length === 0) {
        addedRows.value = false
        isClick.value = false
      }

      showAlert(`Etapa eliminada exitosamente.`, 'success', undefined, 5000)
    }

    openMainLoader(false)
  }

  const _clearForm = () => {
    models.value.id = undefined
    models.value.business_trust_id = null
    models.value.project_name = null
    models.value.project_type = null
    models.value.description = null
    models.value.num_stages = null
    models.value.status = undefined
    models.value.stages = []
  }

  // modal stages
  const alertModalStageRef = ref()
  const alertModalConfigStage = ref({
    title: ``,
    description: '',
    stage: null as IRealStateProjectStages | null,
  })

  const closeAlertModalRef = () => {
    alertModalStageRef.value?.closeModal()
  }

  const openAlertModalStage = async (
    id: number,
    stage_number: number,
    action: string
  ) => {
    alertModalConfigStage.value.title = `${
      props.action === 'view' ? 'Ver' : 'Gestionar'
    } etapa ${stage_number}`
    actionModal.value = action
    alertModalConfigStage.value.stage =
      models.value.stages?.find(
        (item) => item.id === id && item.stage_number === stage_number
      ) ?? null
    await alertModalStageRef.value.openModal()
  }

  const validateForm = async () => {
    const formFeatures = formPropertyFeatures.value

    if (!formFeatures) return false

    const [isCharacteristicsFormValid, nomenclatureAmount] = await Promise.all([
      formFeatures.validatecCharacteristicsForm(),
      formFeatures.getNomenclatureAmount(),
    ])

    return isCharacteristicsFormValid && (nomenclatureAmount ?? 0) > 0
  }

  const onSubmit = async () => {
    if ('view'.includes(props.action)) return closeAlertModalRef()
    if (await validateForm()) {
      if (!models.value?.stages?.length) return
      const dataEdit = formPropertyFeatures.value?.getModels()

      const index = models.value.stages.findIndex(
        (stage) =>
          stage.id === alertModalConfigStage.value.stage?.id &&
          stage.stage_number === alertModalConfigStage.value.stage?.stage_number
      )
      if (index !== -1) {
        models.value.stages[index] = {
          ...dataEdit,
          id: alertModalConfigStage.value.stage?.id,
          stage_number: alertModalConfigStage.value.stage?.stage_number,
          status_id: 57,
        }
      }

      showAlert(`Etapa gestionada exitosamente.`, 'success', undefined, 3000)
      closeAlertModalRef()
    }
  }
  const processedPerPage = ref(20)

  const setNumberOfPages = () => {
    const numberOfPages = models.value.num_stages
      ? Math.ceil(models.value.num_stages / processedPerPage.value)
      : 1

    tableProps.value.pages.currentPage = 1
    tableProps.value.pages.lastPage = numberOfPages
  }

  const updateProcessedPage = (page: number) => {
    tableProps.value.pages.currentPage = page
    tableProps.value.rows = [...(models.value.stages || [])].slice(
      (page - 1) * processedPerPage.value,
      page * processedPerPage.value
    )
  }

  const updateProcessedPerPage = (newPerPage: number) => {
    processedPerPage.value = newPerPage
    setNumberOfPages()
    tableProps.value.rows = [...(models.value.stages || [])].slice(
      0,
      newPerPage
    )
  }

  watch(
    () => [...(models.value.stages || [])],
    () => {
      setNumberOfPages()

      tableProps.value.rows = [...(models.value.stages || [])].slice(
        (tableProps.value.pages.currentPage - 1) * processedPerPage.value,
        tableProps.value.pages.currentPage * processedPerPage.value
      )
    }
  )

  //
  onMounted(async () => {
    handlerActionForm(props.action)
  })

  onUnmounted(() => {
    _clearForm()
  })

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    },
    { immediate: true, deep: true }
  )

  watch(
    () => models.value,
    () => {
      isValid.value =
        models.value.num_stages !== null &&
        !isNaN(models.value.num_stages) &&
        models.value.num_stages > 0 &&
        models.value.business_trust_id !== null

      if (!isEmptyOrZero(models.value)) {
        _setDataInformationForm({ ...models.value })
      }
    },
    { deep: true }
  )

  watch(
    () => models.value.stages,
    (val) => {
      tableProps.value.rows = val ? [...val] : []
    },
    { deep: true }
  )

  return {
    models,
    props,
    emit,
    business_inmobiliary,
    project_type,
    formInformation,
    isValid,
    addedRows,
    tableProps,
    alertModalRef,
    alertModalStageRef,
    alertModalConfigStage,
    formPropertyFeatures,
    project_status,
    actionModal,
    isClick,
    onSubmit,
    closeAlertModalRef,
    openAlertModal,
    openAlertModalStage,
    deleteRealStateProject,
    emitData,
    updateProcessedPage,
    updateProcessedPerPage,
  }
}

export default useInformationForm
