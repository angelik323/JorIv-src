// Vue - Pinia - Quasar
import { ref, watch, computed, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Interfaces
import {
  IFundParameters,
  IRawParameters,
} from '@/interfaces/customs/fics/CollectiveInvestmentFunds'
import { ActionType } from '@/interfaces/global'

// Composables
import { useUtils } from '@/composables'

// Stores
import { useCollectiveInvestmentFundsStore } from '@/stores/fics/collective-investment-funds'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useParametersForm = (props: { action: ActionType; data?: {} }) => {
  const { _getResources } = useResourceManagerStore('v1')

  const { business_trust_types, business_trust_subtypes } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )

  const { _setParticipationTypesTermDaysActive } =
    useCollectiveInvestmentFundsStore('v1')

  const {
    structure,
    term_basis,
    calculation_unit,
    commission_assumed,
    fiduciary_commissions,
    status_investment_plan_status_modification,
  } = storeToRefs(useFicResourceStore('v1'))

  const { formatCurrencyString } = useUtils()
  const commissionAssumedValue = ref<string | number>('')
  const participationType = ref('')
  const parametersFormRef = ref()
  const fundType = ref()
  const fundCode = ref()

  const STRUCTURE_KEYWORDS = {
    CITY: 'ciudad',
    FUND: 'fondo',
    CONSECUTIVE: 'consecutivo',
  }

  const formData = ref<IFundParameters>({
    operation_start_date: '',
    operation_end_date: '',
    operation_control_date: '',
    calculation_unit: null,
    minimun_value: 0,
    minimun_number_investors: 0,
    maximun_porcentage_per_investors: 0,
    minimun_plan_balance: 0,
    minimun_investment_plan_percentage: 0,
    fund_permanency_agreement: false,
    fund_contribution_control: false,
    extension_deadline: false,
    permanency_days: 0,
    term_basis: null,
    penalty: false,
    penalty_gmf: false,
    grace_days: 0,
    pernalty_percentage: null,
    investment_plan_status_modification_id: null,
    minimun_balance: 0,
    days_without_movement: 0,
    commission_id: null,
    commission_assumed: null,
    gmf_percentage: 0,
    withholding_percentage: 0,
    structure: null,
    office_length: 0,
    fund_length: 0,
    consecutive_length: 0,
    structure_length: '',
    example_code_plan: '',
    business_type_id: null,
    business_subtype_id: null,
    description: '',
    fixed_rate_percentage: 0,
    variable_rates: [],
  })

  const tableProps = ref({
    loading: false,
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
        name: 'initial_balance',
        required: true,
        label: 'Saldo inicial',
        align: 'left',
        field: 'initial_balance',
        sortable: true,
        format: (item) => (item ? formatCurrencyString(item) : '-'),
      },
      {
        name: 'final_balance',
        required: true,
        label: 'Saldo final',
        align: 'left',
        field: 'final_balance',
        sortable: true,
        format: (item) => (item ? formatCurrencyString(item) : '-'),
      },
      {
        name: 'rate_percentage',
        required: true,
        label: 'Tasa comisión',
        align: 'left',
        field: 'rate_percentage',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IRawParameters[],
  })

  const includesInStructure = (word: string): boolean =>
    formData.value.structure?.toLowerCase().includes(word) || false

  const formatPercentage = (value: number | undefined | null): string =>
    value != null ? `${value}%` : '-'

  const formatBoolean = (value: boolean | undefined | null): string => {
    return value === true ? 'Sí' : value === false ? 'No' : '-'
  }

  const getStructureLengthByKeyword = (keyword: string, value: number) =>
    includesInStructure(keyword) ? Number(value || 0) : 0

  const resetLengthsByStructure = (structure: string) => {
    const lower = structure.toLowerCase()
    if (!lower.includes(STRUCTURE_KEYWORDS.CITY))
      formData.value.office_length = 0
    if (!lower.includes(STRUCTURE_KEYWORDS.FUND)) formData.value.fund_length = 0
    if (!lower.includes(STRUCTURE_KEYWORDS.CONSECUTIVE))
      formData.value.consecutive_length = 0
  }

  const fillTableRowsFromVariableRates = (data: {
    variable_rates?: IRawParameters[]
  }) => {
    if (Array.isArray(data.variable_rates) && data.variable_rates.length > 0) {
      tableProps.value.rows = data.variable_rates
    } else {
      tableProps.value.rows = []
    }
  }

  const handleBusinessTypeChange = async (business_id: number) => {
    if (!business_id) return

    await _getResources(
      {
        trust_business: ['business_trust_subtypes'],
      },
      `filter[business_type_id]=${business_id}`
    )

    formData.value.business_type_id = business_id
    formData.value.business_subtype_id = null
  }

  const isFA = computed(() => fundType.value === 1)
  const isFC = computed(() => fundType.value === 2)

  const hasParticipationTypes = computed(() => participationType.value === 'Si')
  const hasPenalty = computed(() => formData.value.penalty === false)
  const hasPermanence = computed(() => formData.value.fund_permanency_agreement)

  const hasControlFund = computed(
    () => formData.value.fund_contribution_control
  )
  const isInvestmentPlanStatusChange = computed(
    () => formData.value.investment_plan_status_modification_id === 64
  )
  const isPermanenceRequired = computed(
    () => hasControlFund.value || hasPermanence.value
  )

  const hasCityInStructure = computed(() =>
    includesInStructure(STRUCTURE_KEYWORDS.CITY)
  )
  const hasFundInStructure = computed(() =>
    includesInStructure(STRUCTURE_KEYWORDS.FUND)
  )
  const hasConsecutiveInStructure = computed(() =>
    includesInStructure(STRUCTURE_KEYWORDS.CONSECUTIVE)
  )

  const totalStructureLength = computed(() => {
    return (
      getStructureLengthByKeyword(
        STRUCTURE_KEYWORDS.CITY,
        formData.value.office_length
      ) +
      getStructureLengthByKeyword(
        STRUCTURE_KEYWORDS.FUND,
        formData.value.fund_length
      ) +
      getStructureLengthByKeyword(
        STRUCTURE_KEYWORDS.CONSECUTIVE,
        formData.value.consecutive_length
      )
    )
  })

  const examplePlanCode = computed(() => {
    const parts: string[] = []

    const addZerosWithId = (condition: boolean, length: number) => {
      if (condition) {
        const zeros = '0'.repeat(length)
        parts.push(`${zeros}`)
      }
    }

    addZerosWithId(hasCityInStructure.value, formData.value.office_length || 0)

    addZerosWithId(hasFundInStructure.value, formData.value.fund_length || 0)

    addZerosWithId(
      hasConsecutiveInStructure.value,
      formData.value.consecutive_length || 0
    )

    return parts.length ? parts.join(' ') : '-'
  })

  const isView = computed(() => ['view'].includes(props.action))
  const isDisabled = computed(() => ['edit'].includes(props.action))
  const isEditable = computed(() => ['create', 'edit'].includes(props.action))

  watch(
    () => formData.value.structure,
    (newStructure) => {
      if (newStructure) resetLengthsByStructure(newStructure)
    }
  )

  watchEffect(() => (formData.value.example_code_plan = examplePlanCode.value))

  watchEffect(() => {
    if (!formData.value.structure_length) {
      formData.value.structure_length = totalStructureLength.value.toString()
    }
  })

  watch(
    () => formData.value.penalty,
    (val) => {
      if (val === false) {
        formData.value.penalty_gmf = false
        formData.value.pernalty_percentage = null
      }
    }
  )

  watch(
    [
      () => formData.value.fund_permanency_agreement,
      () => formData.value.fund_contribution_control,
    ],
    ([permanency, contribution]) => {
      if (permanency && contribution) {
        formData.value.fund_contribution_control = false
      }

      _setParticipationTypesTermDaysActive(
        permanency || contribution ? true : false
      )
    }
  )

  watch(commissionAssumedValue, (newVal) => {
    if (newVal) {
      const selected = commission_assumed.value.find(
        (opt) => opt.value === newVal
      )
      const valueToAssign = selected?.label?.toString() || newVal?.toString()
      formData.value.commission_assumed = valueToAssign
    } else {
      formData.value.commission_assumed = null
    }
  })

  watch(
    [commission_assumed, () => formData.value.commission_assumed],
    ([newCommissionAssumed, currentCommissionAssumed]) => {
      if (newCommissionAssumed.length > 0 && currentCommissionAssumed) {
        const foundOption = newCommissionAssumed.find(
          (opt) =>
            opt.value?.toString() === currentCommissionAssumed?.toString() ||
            opt.label === currentCommissionAssumed
        )
        if (foundOption && commissionAssumedValue.value !== foundOption.value) {
          commissionAssumedValue.value = foundOption.value
        }
      }
    },
    { immediate: true }
  )

  watch(
    business_trust_types,
    async () => {
      if (props.action === 'create') {
        formData.value.business_type_id = 9
        await _getResources(
          {
            trust_business: ['business_trust_subtypes'],
          },
          `filter[business_type_id]=${formData.value.business_type_id}`
        )
      } else {
        await _getResources(
          {
            trust_business: ['business_trust_subtypes'],
          },
          `filter[business_type_id]=${formData.value.business_type_id}`
        )
      }
    },
    { immediate: true }
  )

  watch(
    () => formData.value.commission_id,
    (newVal) => {
      const findCommision = fiduciary_commissions.value.find(
        (commision) => commision.id === newVal
      )
      if (findCommision) {
        const typedData = findCommision as { variable_rates?: IRawParameters[] }
        fillTableRowsFromVariableRates(typedData)

        formData.value.fixed_rate_percentage =
          findCommision.type === 1
            ? findCommision.fixed_rate_percentage
              ? parseFloat(findCommision.fixed_rate_percentage)
              : 0
            : 0
      }
    }
  )

  watch(
    () => props.data,
    (newData) => {
      if (newData) {
        const typedData = newData as Partial<IFundParameters>

        formData.value = {
          ...formData.value,
          ...typedData,
          penalty: typedData.penalty ?? formData.value.penalty ?? false,
        }

        const foundOption = commission_assumed.value.find(
          (opt) =>
            opt.value === formData.value.commission_assumed ||
            opt.label === formData.value.commission_assumed
        )
        const valueToSet = foundOption
          ? foundOption.value
          : formData.value.commission_assumed ?? ''
        commissionAssumedValue.value = valueToSet

        fillTableRowsFromVariableRates(typedData)
      }
    },
    { immediate: true }
  )

  return {
    isFA,
    isFC,
    isView,
    fundCode,
    fundType,
    formData,
    structure,
    term_basis,
    isEditable,
    isDisabled,
    tableProps,
    hasPenalty,
    formatBoolean,
    hasPermanence,
    hasControlFund,
    examplePlanCode,
    formatPercentage,
    calculation_unit,
    parametersFormRef,
    participationType,
    hasFundInStructure,
    hasCityInStructure,
    commission_assumed,
    business_trust_types,
    isPermanenceRequired,
    totalStructureLength,
    formatCurrencyString,
    fiduciary_commissions,
    hasParticipationTypes,
    commissionAssumedValue,
    business_trust_subtypes,
    handleBusinessTypeChange,
    hasConsecutiveInStructure,
    isInvestmentPlanStatusChange,
    status_investment_plan_status_modification,
  }
}
export default useParametersForm
