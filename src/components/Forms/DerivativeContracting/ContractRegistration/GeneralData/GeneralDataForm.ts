// Vue - Pinia - Router - Quasar
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import moment from 'moment'

// Composables
import { useUtils } from '@/composables'

// Interfaces
import { ActionType } from '@/interfaces/global'
import {
  EContractRegistrationPeriodicity,
  IContractRegistrationGeneralDataForm,
} from '@/interfaces/customs/derivative-contracting/ContractRegistration'

// Stores
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useDerivativeContractingResourceStore } from '@/stores/resources-manager/derivative-contracting'
import { useThirdPartyResourceStore } from '@/stores/resources-manager/third-party'
import { useInvestmentPortfolioResourceStore } from '@/stores/resources-manager/investment-portfolio'
import { useResourceManagerStore } from '@/stores/resources-manager/'
import { useResourceStore } from '@/stores/resources-selects'

const useGeneralDataForm = (
  props: {
    action: ActionType
    data?: IContractRegistrationGeneralDataForm | null
  },
  emit: Function
) => {
  const { isEmptyOrZero, formatDate, formatCurrencyString } = useUtils()

  const { business_trusts } = storeToRefs(useTrustBusinessResourceStore('v1'))

  const {
    work_plan,
    contract_document_structure,
    project,
    substatuses_contract_type_status_statuses_substatuses,
  } = storeToRefs(useDerivativeContractingResourceStore('v1'))

  const { third_parties } = storeToRefs(useThirdPartyResourceStore('v1'))

  const { coins_exchange_traded_fund } = storeToRefs(
    useInvestmentPortfolioResourceStore('v1')
  )

  const { cities } = storeToRefs(useResourceStore('v1'))

  const { _getResources } = useResourceManagerStore('v1')

  const formElementRef = ref()

  const has_supervisor = ref<boolean>(false)
  const has_work_plan = ref<boolean>(false)

  const models = ref<Partial<IContractRegistrationGeneralDataForm>>({
    business_trusts_id: null,
    contract_document_structure_id: null,
    status_id: 'En registro',
    stage: 'En registro',

    registration_date: formatDate(new Date()?.toString(), 'YYYY-MM-DD'),
    internal_number: null,
    contract_number: null,
    name: null,
    object: null,

    subscription_date: formatDate(new Date()?.toString(), 'YYYY-MM-DD'),
    duration: null,
    periodicity: null,
    execution_start_date: formatDate(new Date()?.toString(), 'YYYY-MM-DD'),
    execution_end_date: formatDate(new Date()?.toString(), 'YYYY-MM-DD'),

    currency_id: null,
    contract_value: null,
    trm_value: null,
    trm_value_raw: null,
    amount: null,

    has_stamp_tax: false,
    requires_publication: false,

    project_id: null,
    work_plan_id: null,
    work_plan_structure_id: null,
    work_plan_structure: null,
    work_plan_code: null,

    contractor_id: null,
    supervision_role: null,
    supervisor_id: null,
    other_supervision_role: null,
    supervisor2_id: null,
    execution_city_id: null,

    internal_notes: null,

    is_editable_ppto: false,
    show_future_validities: true,
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

  watch(
    () => models.value.amount,
    (val) => {
      if (models.value.currency_id === 'COP') return

      if (!val) return

      models.value.contract_value = (
        Number(val ?? 0) * Number(models.value.trm_value ?? 0)
      )?.toString()
    },
    { deep: true }
  )

  watch(
    () => [
      models.value.duration,
      models.value.periodicity,
      models.value.execution_start_date,
    ],
    ([valDuration, valPeriodicity, valExecutionStartDate]) => {
      if (!valDuration || !valPeriodicity || !valExecutionStartDate) {
        models.value.execution_end_date = formatDate(
          new Date()?.toString(),
          'YYYY-MM-DD'
        )
        return
      }

      const periodicityMap: Record<
        string,
        moment.unitOfTime.DurationConstructor
      > = EContractRegistrationPeriodicity

      models.value.execution_end_date = moment(
        valExecutionStartDate,
        'YYYY-MM-DD'
      )
        .add(Number(valDuration), periodicityMap[valPeriodicity] || 'days')
        .format('YYYY-MM-DD')
    }
  )

  watch(
    () => models.value.contract_document_structure_id,
    async (val) => {
      if (!val) return

      await _getResources(
        { derivative_contracting: ['contract_attachments'] },
        'filter[contract_document_id]=' + val
      )

      const findDocumentStructure =
        contract_document_structure.value.find((cds) => cds.id === val) ?? null

      if (!findDocumentStructure) return

      models.value.has_stamp_tax =
        findDocumentStructure.type_document?.has_stamp_tax ?? false

      models.value.requires_publication =
        findDocumentStructure?.requires_publication ?? false

      has_supervisor.value =
        findDocumentStructure?.type_document?.has_supervisor ?? false
      has_work_plan.value =
        findDocumentStructure?.type_document?.has_work_plan ?? false

      models.value.is_editable_ppto =
        findDocumentStructure?.type_document?.modality === 3

      models.value.show_future_validities = !(
        findDocumentStructure?.type_document?.budget_validity === 1 &&
        [1, 3].includes(findDocumentStructure?.type_document?.modality)
      )
    }
  )

  return {
    models,
    formElementRef,
    business_trusts,
    contract_document_structure,
    substatuses_contract_type_status_statuses_substatuses,
    work_plan,
    third_parties,
    coins_exchange_traded_fund,
    has_supervisor,
    has_work_plan,
    cities,
    project,

    formatCurrencyString,
  }
}

export default useGeneralDataForm
