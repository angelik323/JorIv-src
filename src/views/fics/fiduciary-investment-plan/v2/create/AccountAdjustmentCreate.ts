// Vue - Vue Router - Pinia
import { onBeforeUnmount, onMounted, ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  MovementType,
  AdjustmentType,
  AdjustmentMode,
  IFiduciaryInvestmentPlanAdjustmentDetail,
  IFiduciaryInvestmentPlanAdjustmentRequest,
  IFiduciaryInvestmentPlanBalanceAdjustmentForm,
} from '@/interfaces/customs/fics/FiduciaryInvestmentPlans'

// Composables
import { useGoToUrl } from '@/composables/useGoToUrl'
import { useRules } from '@/composables/useRules'
import { useUtils } from '@/composables/useUtils'
import { useMainLoader } from '@/composables'

// Stores
import { useFiduciaryInvestmentPlanStore } from '@/stores/fics/fiduciary-investment-plan'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useAccountAdjustmentCreate = () => {
  const { is_required, only_number_greater_than_zero_with_decimal } = useRules()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const {
    _getAdjustmentDetail,
    _calculateAdjustment,
    _createInvestmentPlanAdjustment,
  } = useFiduciaryInvestmentPlanStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const {
    adjustment_types,
    adjustment_balance_types,
    funts_to_investment_plans,
    movement_nature_movement_codes,
    adjustment_movement_codes_list,
    adjustment_class_movements_list,
  } = storeToRefs(useFicResourceStore('v1'))

  const resourceKeys = {
    fics: [
      'adjustment_class_movements_list',
      'adjustment_movement_codes_list',
      'movement_nature_movement_codes',
      'funts_to_investment_plans',
      'adjustment_balance_types',
      'adjustment_types',
    ],
  }

  const headerProps = {
    title: 'Crear ajustes de saldos de los planes de inversión',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Planes de inversión fiduciarios',
        route: 'FiduciaryInvestmentPlanList',
      },
      {
        label: 'Ajuste',
        route: 'AccountAdjustmentCreate',
      },
      {
        label: 'Crear',
        route: 'AccountAdjustmentCreate',
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ]

  const createInitialFormData =
    (): IFiduciaryInvestmentPlanBalanceAdjustmentForm => {
      return {
        collective_investment_fund_id: null,
        investment_plan_id: null,
        registration_date: new Date().toISOString().split('T')[0],
        operation_date: new Date().toISOString().split('T')[0],
        investment_plan_status: '',
        fund_code: '',
        fund_description: '',
        fund_business_id: '',
        plan_code: '',
        plan_description: '',
        plan_business_id: '',
        plan_balance: null,
        capital_balance: null,
        performance_balance: null,
        adjustment: '',
        adjustment_in: '',
        adjustment_type: '',
        adjustment_observation: '',
        adjustment_class: '',
        adjustment_value: null,
        movement_code: '',
        initial_date: '',
        final_date: '',
        calculation_balance: null,
        automatic_adjustment_in: null,
      }
    }

  const formBalanceAdjustment = ref()
  const models = ref<IFiduciaryInvestmentPlanBalanceAdjustmentForm>(
    createInitialFormData()
  )
  const planDetail = ref<IFiduciaryInvestmentPlanAdjustmentDetail | null>(null)

  const isCapitalAdjustment = computed(
    () => models.value.adjustment === AdjustmentType.CAPITAL
  )
  const isPerformanceAdjustment = computed(
    () => models.value.adjustment === AdjustmentType.PERFORMANCE
  )
  const isManualAdjustment = computed(
    () => models.value.adjustment_type === AdjustmentMode.MANUAL
  )
  const isAutomaticAdjustment = computed(
    () => models.value.adjustment_type === AdjustmentMode.AUTOMATIC
  )

  const isFormValid = computed(() => {
    if (!planDetail.value) return false

    const hasRequiredBaseFields = validateBaseFields()
    if (!hasRequiredBaseFields) return false

    const hasValidAdjustmentValue = validateAdjustmentValue()
    if (!hasValidAdjustmentValue) return false

    return validateSpecificAdjustmentFields()
  })

  const validateBaseFields = (): boolean => {
    return !!(
      models.value.adjustment_observation.trim() && models.value.adjustment
    )
  }

  const validateAdjustmentValue = (): boolean => {
    if (models.value.adjustment_value === null) return true
    const numValue = Number(models.value.adjustment_value)
    return !Number.isNaN(numValue) && numValue >= 0
  }

  const validateSpecificAdjustmentFields = (): boolean => {
    const { adjustment, adjustment_type } = models.value

    if (adjustment === AdjustmentType.PERFORMANCE && !adjustment_type) {
      return false
    }

    if (adjustment === AdjustmentType.CAPITAL) {
      return validateCapitalAdjustmentFields()
    }

    if (adjustment === AdjustmentType.PERFORMANCE) {
      return adjustment_type === AdjustmentMode.MANUAL
        ? validateManualPerformanceFields()
        : validateAutomaticPerformanceFields()
    }

    return false
  }

  const validateCapitalAdjustmentFields = (): boolean => {
    return !!(
      models.value.adjustment_in &&
      models.value.adjustment_class &&
      models.value.adjustment_value &&
      models.value.movement_code
    )
  }

  const validateManualPerformanceFields = (): boolean => {
    return !!(
      models.value.adjustment_in &&
      models.value.adjustment_value &&
      models.value.movement_code
    )
  }

  const validateAutomaticPerformanceFields = (): boolean => {
    return !!(
      models.value.initial_date &&
      models.value.final_date &&
      models.value.calculation_balance &&
      models.value.automatic_adjustment_in &&
      models.value.adjustment_value &&
      models.value.movement_code
    )
  }

  const handleAdjustmentChange = (newAdjustment: string): void => {
    if (newAdjustment === AdjustmentType.CAPITAL) {
      models.value.adjustment_type = AdjustmentMode.MANUAL
    } else if (newAdjustment === AdjustmentType.PERFORMANCE) {
      models.value.adjustment_type = ''
    }

    resetAdjustmentFields()
  }

  const resetAdjustmentFields = (): void => {
    models.value.adjustment_in = ''
    models.value.adjustment_class = ''
    models.value.adjustment_value = null
    models.value.movement_code = ''
    models.value.initial_date = ''
    models.value.final_date = ''
    models.value.calculation_balance = null
    models.value.automatic_adjustment_in = null
  }

  const resetAdjustmentSpecificFields = (): void => {
    models.value.adjustment_in = ''
    models.value.adjustment_value = null
    models.value.movement_code = ''
    models.value.initial_date = ''
    models.value.final_date = ''
    models.value.calculation_balance = null
  }

  const handleAutomaticCalculationChange = async (): Promise<void> => {
    if (!isAutomaticAdjustment.value) return

    const hasRequiredFields = hasAutomaticCalculationFields()

    if (hasRequiredFields) {
      await calculateAutomaticAdjustmentValue()
    } else {
      clearAutomaticCalculationResults()
    }
  }

  const hasAutomaticCalculationFields = (): boolean => {
    return !!(
      models.value.initial_date &&
      models.value.final_date &&
      models.value.calculation_balance &&
      planDetail.value?.id
    )
  }

  const clearAutomaticCalculationResults = (): void => {
    models.value.automatic_adjustment_in = null
    models.value.adjustment_value = null
  }

  const loadAdjustmentMovementCodes = async (): Promise<void> => {
    if (!models.value.adjustment) return

    const filters = buildMovementCodeFilters()
    const filterParams = buildFilterParams(filters)
    const dynamicKeys = { fics: [filterParams] }

    await _getResources(dynamicKeys)
  }

  const calculateAutomaticAdjustmentValue = async (): Promise<void> => {
    if (!hasAutomaticCalculationFields()) return

    const calculationData = buildCalculationData()
    const calculatedValue = await _calculateAdjustment(calculationData)

    updateAdjustmentValues(calculatedValue)
    await loadAdjustmentMovementCodes()
  }

  const buildCalculationData = () => {
    return {
      start_date: models.value.initial_date,
      end_date: models.value.final_date,
      amount: Number(models.value.calculation_balance) || 0,
      fund_id: models.value.collective_investment_fund_id || 0,
    }
  }

  const updateAdjustmentValues = (calculatedValue: number): void => {
    models.value.adjustment_value = Math.abs(calculatedValue).toString()

    const movementType =
      calculatedValue >= 0 ? MovementType.INCOME : MovementType.EXPENSE
    const selectedOption = findMovementOption(movementType)

    if (selectedOption) {
      models.value.automatic_adjustment_in = selectedOption.value
    }
  }

  const findMovementOption = (movementType: string) => {
    return movement_nature_movement_codes.value.find((item) =>
      item.label?.toLowerCase().includes(movementType)
    )
  }

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const handleGoTo = (routeName: string): void => goToURL(routeName)

  const buildMovementCodeFilters = (): string[] => {
    const filters: string[] = []

    if (models.value.adjustment_class) {
      const classId = findItemId(
        adjustment_class_movements_list.value,
        models.value.adjustment_class
      )
      if (classId) filters.push(`filter[movement_class_id]=${classId}`)
    }

    if (models.value.adjustment_in) {
      const natureId = findItemId(
        movement_nature_movement_codes.value,
        models.value.adjustment_in
      )
      if (natureId) filters.push(`filter[movement_nature_id]=${natureId}`)
    }

    const isCapital = models.value.adjustment === AdjustmentType.CAPITAL
    filters.push(`filter[capital]=${isCapital}`)

    return filters
  }

  const buildFilterParams = (filters: string[]): string => {
    let filterParams = 'adjustment_movement_codes_list'
    if (filters.length > 0) {
      filterParams += '&' + filters.join('&')
    }
    return filterParams
  }

  const findItemId = (
    list: Array<{ id?: string | number; value?: string | number }>,
    value: string
  ): string | null => {
    const item = list.find((item) => item.value === value)
    return item?.value?.toString() || null
  }

  const prepareAdjustmentData =
    (): IFiduciaryInvestmentPlanAdjustmentRequest => {
      const adjustmentInValue = getAdjustmentInValue()
      const adjustmentNatureId = getAdjustmentNatureId(adjustmentInValue)
      const adjustmentClassId = getAdjustmentClassId()
      const movementCodeId = getMovementCodeId()

      const baseData: IFiduciaryInvestmentPlanAdjustmentRequest = {
        balance_type: models.value.adjustment,
        adjustment_nature_id: adjustmentNatureId,
        adjustment_type: models.value.adjustment_type,
        adjustment_value: models.value.adjustment_value,
        adjustment_notes: models.value.adjustment_observation,
        class_movement_id: adjustmentClassId,
        movement_code_id: movementCodeId,
        collective_investment_fund_id:
          models.value.collective_investment_fund_id || 0,
        fiduciary_investment_plan_id:
          models.value.investment_plan_id ||
          planDetail.value?.investment_plan_id ||
          planDetail.value?.id ||
          0,
      }

      if (isAutomaticPerformanceAdjustment()) {
        baseData.calculation_balance =
          models.value.calculation_balance || undefined
        baseData.start_date = models.value.initial_date
        baseData.end_date = models.value.final_date
      }

      return baseData
    }

  const getAdjustmentInValue = (): string | number | null => {
    return isAutomaticPerformanceAdjustment()
      ? models.value.automatic_adjustment_in
      : models.value.adjustment_in
  }

  const getAdjustmentNatureId = (
    adjustmentInValue: string | number | null
  ): number => {
    return (
      movement_nature_movement_codes.value.find(
        (item) => item.value === adjustmentInValue
      )?.id || 0
    )
  }

  const getAdjustmentClassId = (): number | null => {
    if (models.value.adjustment === AdjustmentType.PERFORMANCE) {
      return null
    }
    return Number(
      adjustment_class_movements_list.value.find(
        (item) => item.value === models.value.adjustment_class
      )?.value || 0
    )
  }

  const getMovementCodeId = (): number => {
    return Number(
      adjustment_movement_codes_list.value.find(
        (item) => item.value === models.value.movement_code
      )?.value || 0
    )
  }

  const isAutomaticPerformanceAdjustment = (): boolean => {
    return (
      models.value.adjustment === AdjustmentType.PERFORMANCE &&
      models.value.adjustment_type === AdjustmentMode.AUTOMATIC
    )
  }

  const onSubmit = async (): Promise<void> => {
    openMainLoader(true)

    const adjustmentData = prepareAdjustmentData()
    const success = await _createInvestmentPlanAdjustment(adjustmentData)

    if (success) handleGoTo('FiduciaryInvestmentPlanList')
    openMainLoader(false)
  }

  const loadPlanDetail = async (): Promise<void> => {
    const adjustmentId = +route.params.id
    const detail = await _getAdjustmentDetail(adjustmentId)
    if (detail) {
      planDetail.value = detail
      updateModelsWithPlanDetail(detail)
    }
  }

  const setCollectiveInvestmentFundId = (): void => {
    if (!planDetail.value) return
    const fundItem = funts_to_investment_plans.value.find((fund) => {
      return (
        fund.code === planDetail.value!.fund_code ||
        fund.value === planDetail.value!.fund_code ||
        String(fund.code) === String(planDetail.value!.fund_code) ||
        String(fund.value) === String(planDetail.value!.fund_code) ||
        fund.label?.includes(planDetail.value!.fund_code) ||
        fund.description?.includes(planDetail.value!.fund_code)
      )
    })

    models.value.collective_investment_fund_id = fundItem
      ? Number(fundItem.id || fundItem.value) || null
      : null
  }

  const updateModelsWithPlanDetail = (
    detail: IFiduciaryInvestmentPlanAdjustmentDetail
  ): void => {
    models.value.investment_plan_id =
      detail.investment_plan_id || detail.id || null
    models.value.registration_date = detail.registration_date
    models.value.fund_code = detail.fund_code
    models.value.fund_description = detail.fund_name
    models.value.fund_business_id = detail.fund_business_trust
    models.value.operation_date = detail.operation_date || ''
    models.value.plan_code = detail.plan_code
    models.value.plan_description = detail.plan_holder
    models.value.plan_business_id = detail.plan_business_trust
    models.value.investment_plan_status = detail.status_name
    models.value.plan_balance = detail.balance
    models.value.capital_balance = detail.capital
    models.value.performance_balance = detail.returns
  }

  onMounted(async () => {
    openMainLoader(true)

    await _getResources(resourceKeys)
    await loadPlanDetail()
    setCollectiveInvestmentFundId()
    await loadAdjustmentMovementCodes()

    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(resourceKeys)
  })

  watch(() => models.value.adjustment, handleAdjustmentChange)

  watch(() => models.value.adjustment_type, resetAdjustmentSpecificFields)

  watch(
    [
      () => models.value.adjustment,
      () => models.value.adjustment_in,
      () => models.value.adjustment_class,
    ],
    loadAdjustmentMovementCodes,
    { deep: true }
  )

  watch(
    [
      () => models.value.initial_date,
      () => models.value.final_date,
      () => models.value.calculation_balance,
      () => planDetail.value?.id,
    ],
    handleAutomaticCalculationChange
  )

  watch(
    () => funts_to_investment_plans.value,
    () => {
      if (funts_to_investment_plans.value.length > 0) {
        setCollectiveInvestmentFundId()
      }
    },
    { deep: true }
  )

  return {
    tabs,
    models,
    onSubmit,
    tabActive,
    handleGoTo,
    headerProps,
    isFormValid,
    is_required,
    tabActiveIdx,
    adjustment_types,
    isManualAdjustment,
    isCapitalAdjustment,
    formBalanceAdjustment,
    isAutomaticAdjustment,
    isPerformanceAdjustment,
    adjustment_balance_types,
    movement_nature_movement_codes,
    adjustment_movement_codes_list,
    adjustment_class_movements_list,
    only_number_greater_than_zero_with_decimal,
  }
}

export default useAccountAdjustmentCreate
