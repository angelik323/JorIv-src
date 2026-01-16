// vue - pinia - quasar
import { computed, onMounted, ref, watch } from 'vue'

// interfaces
import { ActionType } from '@/interfaces/global'
import {
  ITrustBusinessAdditionalInformation,
  ITrustBusinessGeneralDates,
  ITrustBusinessGeneralInformation,
  ITrustBusinessInformationForm,
  ITrustBusinessRegisters,
} from '@/interfaces/customs/trust-business/v2/TrustBusinessManagement'

// composables
import { useAlert, useUtils } from '@/composables'
const { isEmptyOrZero } = useUtils()

// constants
import { business_trust_register_type } from '@/constants'

const useInformationForm = (
  props: {
    action: ActionType
    data?: ITrustBusinessInformationForm | null
  },
  emit: Function
) => {
  const { showAlert } = useAlert()

  // computed
  const isSociety = computed(
    () => models.value.register_type === 'Sociedad' || false
  )
  const isLoading = ref(true)
  const isCreate = computed(() => props.action === 'create')

  const models = ref<ITrustBusinessInformationForm>({
    id: undefined,
    register_type: 'Fideicomiso',
    business_code: null,
    business_type_id: null,
    business_subtype_id: null,
    name: null,
    business_mod: null,
    classification: null,
    office_id: null,
    object: null,
    filing_date_sfc: null,
    start_date: null,
    end_date: null,
    start_date_commission: null,
    has_extend: null,
    extend_date: null,
    accountability_period: null,
    business_manager_id: null,
    business_accountant_id: null,
    consortium: null,
    manage_budget: null,
    derivate_contracting: null,
    has_accounts_payable: null,
    has_billing: null,
    has_assets: null,
    has_policy: null,
    has_guarantee: null,
    has_real_estate_project: null,
    has_secured_creditor: null,
    has_normative: null,
    status_id: null,
    status_fiduciary_fees_id: null,
    business_resources: [],
    business_derivate_contrating: null,
    business_budget: null,
    has_budget: null,
  })

  // refs & init
  const information_form_ref = ref()
  const general_information_ref = ref()
  const general_dates_ref = ref()
  const additional_information_ref = ref()
  const registers_ref = ref()

  const _setValueModel = () => {
    if (props.data) {
      models.value = { ...props.data }
      getGeneralInformation.value = {
        business_code: props.data.business_code,
        business_type_id: props.data.business_type_id,
        business_subtype_id: props.data.business_subtype_id,
        name: props.data.name,
        business_mod: props.data.business_mod,
        classification: props.data.classification,
        office_id: props.data.office_id,
        object: props.data.object,
      }
      getGeneralDates.value = {
        filing_date_sfc: props.data.filing_date_sfc,
        start_date: props.data.start_date,
        end_date: props.data.end_date,
        start_date_commission: props.data.start_date_commission,
        has_extend: props.data.has_extend,
        extend_date: props.data.extend_date,
      }
      getAdditionalInformation.value = {
        accountability_period: props.data.accountability_period,
        business_manager_id: props.data.business_manager_id,
        business_accountant_id: props.data.business_accountant_id,
        consortium: props.data.consortium,
        manage_budget: props.data.manage_budget,
        derivate_contracting: props.data.derivate_contracting,
        has_accounts_payable: props.data.has_accounts_payable,
        has_billing: props.data.has_billing,
        has_assets: props.data.has_assets,
        has_policy: props.data.has_policy,
        has_guarantee: props.data.has_guarantee,
        has_real_estate_project: props.data.has_real_estate_project,
        has_secured_creditor: props.data.has_secured_creditor,
        has_normative: props.data.has_normative,
        has_budget: props.data.has_budget,
      }
      getRegisters.value = {
        business_resources: props.data.business_resources,
        business_accounting: props.data.business_accounting,
        business_treasurie: props.data.business_treasurie,
        business_account_payable: props.data.business_account_payable,
        business_normative: props.data.business_normative,
        business_billing: props.data.business_billing,
        business_derivate_contrating:
          props.data.business_derivate_contrating ?? null,
        business_budget: props.data.business_budget ?? null,
      }
    }
  }

  // init data childrens
  const getGeneralInformation = ref<ITrustBusinessGeneralInformation | null>(
    null
  )
  const getGeneralDates = ref<ITrustBusinessGeneralDates | null>(null)
  const getAdditionalInformation =
    ref<ITrustBusinessAdditionalInformation | null>(null)
  const getRegisters = ref<ITrustBusinessRegisters | null>(null)

  // set data children
  const setDataGeneralInformation = (
    data: ITrustBusinessGeneralInformation | null
  ) => {
    models.value = {
      ...models.value,
      business_code: data?.business_code ?? null,
      business_type_id: data?.business_type_id ?? null,
      business_subtype_id: data?.business_subtype_id ?? null,
      name: data?.name ?? null,
      business_mod: data?.business_mod ?? null,
      classification: data?.classification ?? null,
      office_id: data?.office_id ?? null,
      object: data?.object ?? null,
    }
  }

  const setDataGeneralDates = (data: ITrustBusinessGeneralDates | null) => {
    models.value = {
      ...models.value,
      filing_date_sfc: data?.filing_date_sfc ?? null,
      start_date: data?.start_date ?? null,
      end_date: data?.end_date ?? null,
      start_date_commission: data?.start_date_commission ?? null,
      has_extend: data?.has_extend ?? null,
    }
  }

  const setAdditionalInformation = (
    data: ITrustBusinessAdditionalInformation | null
  ) => {
    models.value = {
      ...models.value,
      accountability_period: data?.accountability_period ?? null,
      business_manager_id: data?.business_manager_id ?? null,
      business_accountant_id: data?.business_accountant_id ?? null,
      consortium: data?.consortium ?? null,
      has_budget: data?.has_budget ?? null,
      derivate_contracting: data?.derivate_contracting ?? null,
      has_accounts_payable: data?.has_accounts_payable ?? null,
      has_billing: data?.has_billing ?? null,
      has_assets: data?.has_assets ?? null,
      has_policy: data?.has_policy ?? null,
      has_guarantee: data?.has_guarantee ?? null,
      has_real_estate_project: data?.has_real_estate_project ?? null,
      has_secured_creditor: data?.has_secured_creditor ?? null,
      has_normative: data?.has_normative ?? null,
    }
  }

  const setRegisters = (data: ITrustBusinessRegisters | null) => {
    models.value = {
      ...models.value,
      business_resources: data?.business_resources,
      business_accounting: data?.business_accounting,
      business_treasurie: data?.business_treasurie,
      business_account_payable: data?.business_account_payable,
      business_normative: data?.business_normative,
      business_billing: data?.business_billing,
      business_derivate_contrating: data?.business_derivate_contrating ?? null,
      business_budget: data?.business_budget ?? null,
    }
  }

  // lifecycles
  onMounted(async () => {
    isLoading.value = true
    await _setValueModel()
    isLoading.value = false
  })

  // watchs
  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        emit('update:models', null)
      } else {
        emit('update:models', models.value)
      }
    },
    {
      deep: true,
    }
  )

  watch(
    () => props.data,
    () => {
      _setValueModel()

      if (isLoading.value) {
        isLoading.value = false
      }
    },
    {
      deep: true,
      immediate: true,
    }
  )

  const validateForm = async () => {
    const isValid =
      (await general_information_ref.value?.validateForm()) &&
      (await general_dates_ref.value?.validateForm()) &&
      (await additional_information_ref.value?.validateForm()) &&
      (await registers_ref.value?.validateForm())

    if (!isValid) {
      showAlert('Campos requeridos no diligenciados', 'warning')
    }

    return isValid
  }

  return {
    models,
    information_form_ref,
    business_trust_register_type,
    general_information_ref,
    general_dates_ref,
    additional_information_ref,
    getGeneralInformation,
    isSociety,
    isCreate,
    getGeneralDates,
    getAdditionalInformation,
    getRegisters,
    registers_ref,
    isLoading,

    setDataGeneralInformation,
    setDataGeneralDates,
    setAdditionalInformation,
    setRegisters,
    validateForm,
  }
}

export default useInformationForm
