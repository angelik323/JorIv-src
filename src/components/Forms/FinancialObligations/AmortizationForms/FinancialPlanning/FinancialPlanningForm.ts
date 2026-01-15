// vue
import { computed, onMounted, ref, watch } from 'vue'

// pinia
import { storeToRefs } from 'pinia'

//stores
import {
  useAmortizationTablesStore,
  useFinancialPlanningStore,
  useResourceStore,
} from '@/stores'

//composables
import { useAlert, useMainLoader, useUtils } from '@/composables'

// interfaces
import { QTable } from 'quasar'

import {
  IAlertConfigPlansAdd,
  IAmortizationList,
  IFinancialPlanning,
  IFinancialPlanType,
} from '@/interfaces/customs/financial-obligations/AmortizationTables'

const useFinancialPlanningForm = (props: {
  obligationSelected?: number
  hasPlan?: boolean
  options?: IAmortizationList
  action?: IFinancialPlanType
}) => {
  const { defaultIconsLucide, cleanCurrencyToNumber } = useUtils()

  const { amortizationData, currentAmortizationFilter } = storeToRefs(
    useAmortizationTablesStore('v1')
  )
  const { _loadAmortizationList } = useAmortizationTablesStore('v1')

  const {
    paymentPlanList,
    paymentPlanPages,
    createAmortizationInfo,
    urlFinancialPlanListXLS,
  } = storeToRefs(useFinancialPlanningStore('v1'))

  const {
    _loadFinancialPlanningList,
    _updateAddFinancialPlaningById,
    _loadFinancialPlanningById,
    _resetFinancialPlanning,
    _exportFinancialPlanListXLS,
    _updateFinancialPlaningById,
  } = useFinancialPlanningStore('v1')

  const { _getResourcesFinancialObligations } = useResourceStore('v1')

  const { obligation_status } = storeToRefs(useResourceStore('v1'))

  const { openMainLoader } = useMainLoader()
  const { showAlert } = useAlert()

  const alertPaymentPlanRef = ref()

  const currentIdPlan = ref<number>()
  const currentAction = ref<IFinancialPlanType>('financial-plan/default')

  const keysObligations = ['obligation_statuses']

  const tableProps = ref({
    title: 'Listado de plan de pagos',
    loading: false,
    columns: [
      {
        name: 'numberQuota',
        required: false,
        label: 'No.<br>Cuota',
        align: 'left',
        field: 'numberQuota',
        sortable: true,
      },
      {
        name: 'initialBalance',
        required: false,
        label: 'Saldo<br>inicial cuota',
        align: 'left',
        field: 'initialBalance',
        sortable: true,
      },
      {
        name: 'interestQuota',
        required: false,
        label: 'Cuota<br>de interés',
        align: 'left',
        field: 'interestQuota',
        sortable: true,
      },
      {
        name: 'capitalQuota',
        required: false,
        label: 'Cuota<br>capital',
        align: 'left',
        field: 'capitalQuota',
        sortable: true,
      },
      {
        name: 'finalBalance',
        required: false,
        label: 'Saldo<br>final',
        align: 'left',
        field: 'finalBalance',
        sortable: true,
      },
      {
        name: 'paymentDate',
        required: false,
        label: 'Fecha<br>de pago',
        align: 'left',
        field: 'paymentDate',
        sortable: true,
      },
      {
        name: 'statusQuota',
        required: false,
        label: 'Estado',
        align: 'center',
        field: 'statusQuota',
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
    rows: paymentPlanList,
    pages: paymentPlanPages,
  })

  const planningForm = ref<IFinancialPlanning>({
    financialObligationId: null,
    numberQuota: null,
    initialBalance: null,
    interestQuota: null,
    capitalQuota: null,
    totalQuota: null,
    finalBalance: null,
    paymentDate: null,
    statusQuotaId: null,
  })

  const alertModalConfig = ref<IAlertConfigPlansAdd>({
    title: '',
    description: '',
    btnLabel: '',
    selectorLabel: '',
    type: 'financial-plan/default',
    loader: false,
    isDisabledConfirm: true,
  })

  const getObligationSelect = computed(() => props.obligationSelected)

  // To Do: se tiene que cambiar el disable status cuando se implemente la lógica de cuentas por pagar
  const getDisableStatus = computed(() => true)

  const handlerCloseModal = async () => {
    currentAction.value = 'financial-plan/default'
    if (alertPaymentPlanRef.value) {
      await alertPaymentPlanRef.value.closeModal()
    }
  }

  const updateFinancialPlaningById = async (
    info: IFinancialPlanning,
    page: number = 1
  ) => {
    openMainLoader(true)
    const fiterObligationById = `filter[financial_obligation_id]=${info.financialObligationId}&page=${page}`
    await _updateFinancialPlaningById(info)
    await _loadFinancialPlanningList(fiterObligationById)

    openMainLoader(false)
    handlerCloseModal()
  }

  const updateAmortizationData = async (obligationId: number) => {
    const option = amortizationData.value?.options.find(
      (item: { value: number }) => item.value === obligationId
    )

    if (option?.payload) {
      option.payload.financialPlanning = false
    } else {
      showAlert('Actualización realizada', 'success')
    }
  }

  const updateModalFormInputs = (obligationInfo: IFinancialPlanning) => {
    planningForm.value = {
      financialObligationId: Number(obligationInfo?.financialObligationId),
      numberQuota: cleanCurrencyToNumber(obligationInfo?.numberQuota ?? 0),
      initialBalance: cleanCurrencyToNumber(
        obligationInfo?.initialBalance ?? 0
      ),
      interestQuota: cleanCurrencyToNumber(obligationInfo?.interestQuota ?? 0),
      capitalQuota: cleanCurrencyToNumber(obligationInfo?.capitalQuota ?? 0),
      totalQuota: cleanCurrencyToNumber(obligationInfo?.totalQuota ?? 0),
      finalBalance: cleanCurrencyToNumber(obligationInfo?.finalBalance ?? 0),
      paymentDate: String(obligationInfo?.paymentDate),
      statusQuotaId: Number(obligationInfo?.statusQuotaId),
    }
  }

  const updateInfoAlert = (
    title: string,
    description: string,
    type: IFinancialPlanType,
    info?: IFinancialPlanning
  ) => {
    alertModalConfig.value.title = title
    alertModalConfig.value.description = description
    alertModalConfig.value.type = type

    if (type === 'financial-plan/update' && info) {
      updateModalFormInputs(info)
    }
    openMainLoader(false)

    alertPaymentPlanRef.value.openModal()
  }

  const openPaymentPlanModal = async (
    obligationModalId: number | undefined,
    obligationType: IFinancialPlanType,
    obligationInfo?: IFinancialPlanning
  ) => {
    openMainLoader(true)
    if (obligationModalId) {
      await _loadFinancialPlanningById(obligationModalId)
      await _getResourcesFinancialObligations(
        `keys[]=${keysObligations.join('&keys[]=')}`
      )
    }

    switch (obligationType) {
      case 'financial-plan/create':
        updateInfoAlert(
          'Crear plan de pagos',
          `formulario`,
          'financial-plan/create'
        )

        break

      case 'financial-plan/add':
        updateInfoAlert(
          'Agregar plan de pagos',
          `formulario`,
          'financial-plan/add'
        )

        break

      case 'financial-plan/update':
        updateInfoAlert(
          'Actualizar plan de pago',
          `formulario`,
          'financial-plan/update',
          obligationInfo
        )
        break

      default:
        alertModalConfig.value.type = 'financial-plan/default'
        openMainLoader(false)
        showAlert('No hay plan de pago definido')
        break
    }

    openMainLoader(false)
    alertPaymentPlanRef.value.openModal()
  }

  const updateAddFinancialPlaningById = async (
    infoPlanning: IFinancialPlanning,
    filterURL: string,
    page: number = 1
  ) => {
    openMainLoader(true)
    if (!(await _updateAddFinancialPlaningById(infoPlanning))) {
      openMainLoader(false)
      return
    }

    const fiterObligationById = `filter[financial_obligation_id]=${infoPlanning.financialObligationId}&page=${page}`
    await _loadFinancialPlanningList(fiterObligationById)
    await _loadAmortizationList(filterURL)

    if (infoPlanning.financialObligationId)
      await updateAmortizationData(infoPlanning.financialObligationId)

    openMainLoader(false)

    handlerCloseModal()
  }

  const loadFinancialPlanningList = async (
    obligationId: number,
    page: number = 1
  ) => {
    openMainLoader(true)
    const fiterObligationById = `filter[financial_obligation_id]=${obligationId}&page=${page}`
    await _loadFinancialPlanningList(fiterObligationById)
    openMainLoader(false)
  }

  const exportXLSX = async () => {
    openMainLoader(true)
    if (paymentPlanList.value.length === 0) {
      showAlert('No hay datos para exportar', 'error')
      return
    }

    const url = JSON.parse(JSON.stringify(urlFinancialPlanListXLS.value))
    const queryString = url.split('?')[1]

    await _exportFinancialPlanListXLS(queryString)

    openMainLoader(false)
  }

  const toSafeNumber = (value: unknown): number => {
    const num = Number(value)
    return isNaN(num) ? 0 : num
  }

  const updatePage = (page: number) => {
    loadFinancialPlanningList(page, currentIdPlan.value)
  }

  watch(
    [() => props.action, () => props.obligationSelected],
    ([newAction, newObligationSelected]) => {
      _resetFinancialPlanning()
      if (!newObligationSelected || !newAction) return

      currentIdPlan.value = newObligationSelected
      currentAction.value = newAction

      if (
        currentAction.value === 'financial-plan/create' &&
        currentIdPlan.value
      ) {
        openPaymentPlanModal(currentIdPlan.value, currentAction.value)
        return
      }
      if (
        currentAction.value === 'financial-plan/default' &&
        props.hasPlan &&
        currentIdPlan.value
      ) {
        showAlert('Verifique el plan de pagos existente', 'success')
        loadFinancialPlanningList(currentIdPlan.value)
      }
    },
    { immediate: true, deep: true }
  )

  watch(
    [
      () => planningForm.value.interestQuota,
      () => planningForm.value.capitalQuota,
    ],
    (newVal) => {
      const interestQuota = toSafeNumber(newVal[0])
      const capitalQuota = toSafeNumber(newVal[1])
      const initialBalance = toSafeNumber(planningForm.value.initialBalance)

      const setFinalBalance = initialBalance - capitalQuota

      planningForm.value.totalQuota = interestQuota + capitalQuota
      planningForm.value.finalBalance =
        setFinalBalance < 0 ? 0 : setFinalBalance
    }
  )

  watch(
    () => createAmortizationInfo.value,
    (newVal) => {
      if (newVal) {
        planningForm.value = {
          ...newVal,
        }
      }
    }
  )

  onMounted(async () => {
    await _resetFinancialPlanning()
  })

  return {
    defaultIconsLucide,
    tableProps,
    getDisableStatus,
    planningForm,
    alertModalConfig,
    alertPaymentPlanRef,
    obligation_status,
    getObligationSelect,
    amortizationData,
    currentAmortizationFilter,
    exportXLSX,
    updateAddFinancialPlaningById,
    updateFinancialPlaningById,
    openPaymentPlanModal,
    handlerCloseModal,
    updatePage,
  }
}

export default useFinancialPlanningForm
