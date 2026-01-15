import { ILegalClientCorporative } from '@/interfaces/customs/Clients'
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useValidator } from '@/composables/useValidator'
import { useClientsStore, useResourceStore } from '@/stores'
import { useRules, useUtils } from '@/composables'

const useCorporativeForm = (props: any) => {
  const { _setDataLegalCLientsCorporative } = useClientsStore('v1')
  const { data_corporative_legal_form } = storeToRefs(useClientsStore('v1'))

  const {
    banks,
    bank_types,
    ciius,
    legal_people_company_classification,
    legal_people_fund_sources,
  } = storeToRefs(useResourceStore('v1'))
  const { validateAlphanumericMessage } = useValidator()
  const { date_before_or_equal_to_the_current_date } = useRules()
  const { formatCurrencyString } = useUtils()

  const formCorporative = ref()

  const models = ref({
    company_classification_corporative: null as string | null,
    ciiu_code_corporative: null as string | null,
    is_registered_national_registry_corporative: false as boolean | undefined,
    total_monthly_operating_income_corporative: null as string | number | null,
    total_monthly_not_operating_income_corporative: null as
      | string
      | number
      | null,
    total_monthly_expenses_corporative: null as string | number | null,
    item_other_monthly_income_corporative: null as string | number | null,
    total_assets_corporative: null as string | number | null,
    total_liabilities_corporative: null as string | number | null,
    cutoff_date_financial_information_corporative: null as string | null,
    bank_entity_corporative: null as string | null | number,
    type_account_holder_corporative: null as string | null,
    holder_account_number_corporative: null as string | null,
    origin_funds_corporative: null as string | null,
    other_origin_funds_corporative: null as string | null,
  })

  const isEmpty = (obj: Record<string, any>): boolean => {
    return Object.values(obj).every(
      (value) => value === 0 || value === '' || value === null
    )
  }

  const handlerActionForm = (action: 'create' | 'edit' | 'view') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: data_corporative_legal_form.value ? _setValueModel : setFormEdit,
      view: setFormView,
    }

    actionHandlers[action]?.()
  }

  const setFormView = () => {
    clearForm()
    const data: ILegalClientCorporative = props.data
    if (data) {
      const financialData = data?.financial_info

      models.value.company_classification_corporative =
        data?.legal_person?.classification_company ?? null

      models.value.ciiu_code_corporative = `${data?.economic_activities?.[0]?.ciiu?.code} ${data?.economic_activities?.[0]?.ciiu?.description}`
      models.value.is_registered_national_registry_corporative =
        financialData?.is_registered_in_national_emission_registery ?? false

      models.value.total_monthly_operating_income_corporative =
        financialData?.total_operational_income ?? null
      models.value.total_monthly_not_operating_income_corporative =
        financialData?.total_non_operational_income ?? null
      models.value.total_monthly_expenses_corporative =
        financialData?.total_expenses ?? null
      models.value.item_other_monthly_income_corporative =
        financialData?.other_non_operational_income_concept ?? null
      models.value.total_assets_corporative = financialData?.assets ?? null
      models.value.total_liabilities_corporative =
        financialData?.liabilities ?? null
      models.value.cutoff_date_financial_information_corporative =
        financialData?.cutoff_date ?? null
      models.value.bank_entity_corporative = financialData?.bank_holder ?? null
      models.value.type_account_holder_corporative =
        financialData?.account_type_holder ?? null
      models.value.holder_account_number_corporative =
        financialData?.bank_account_number_holder ?? null

      models.value.origin_funds_corporative =
        financialData?.funding_source ?? null
      models.value.other_origin_funds_corporative =
        financialData?.describe_funding_source ?? null
    }
  }

  const setFormEdit = () => {
    clearForm()
    const data: ILegalClientCorporative = props.data
    if (data) {
      const financialData = data?.financial_info

      models.value.company_classification_corporative =
        data?.legal_person?.classification_company ?? null

      // @ts-ignore
      models.value.ciiu_code_corporative =
        data?.economic_activities?.[0]?.ciiu_id ?? null
      models.value.is_registered_national_registry_corporative =
        financialData?.is_registered_in_national_emission_registery ?? false

      models.value.total_monthly_operating_income_corporative =
        financialData?.total_operational_income ?? null
      models.value.total_monthly_not_operating_income_corporative =
        financialData?.total_non_operational_income ?? null
      models.value.total_monthly_expenses_corporative =
        financialData?.total_expenses ?? null
      models.value.item_other_monthly_income_corporative =
        financialData?.other_non_operational_income_concept ?? null
      models.value.total_assets_corporative = financialData?.assets ?? null
      models.value.total_liabilities_corporative =
        financialData?.liabilities ?? null
      models.value.cutoff_date_financial_information_corporative =
        financialData?.cutoff_date ?? null
      models.value.bank_entity_corporative =
        financialData?.bank_holder_id ?? null
      models.value.type_account_holder_corporative =
        financialData?.account_type_holder ?? null
      models.value.holder_account_number_corporative =
        financialData?.bank_account_number_holder ?? null

      models.value.origin_funds_corporative =
        financialData?.funding_source ?? null
      models.value.other_origin_funds_corporative =
        financialData?.describe_funding_source ?? null
    }
  }
  const _setValueModel = () => {
    if (data_corporative_legal_form.value) {
      models.value = { ...data_corporative_legal_form.value }
    }
  }

  const clearForm = () => {
    models.value.company_classification_corporative = null
    models.value.ciiu_code_corporative = null
    models.value.is_registered_national_registry_corporative = false
    models.value.total_monthly_operating_income_corporative = null
    models.value.total_monthly_not_operating_income_corporative = null
    models.value.total_monthly_expenses_corporative = null
    models.value.item_other_monthly_income_corporative = null
    models.value.total_assets_corporative = null
    models.value.total_liabilities_corporative = null
    models.value.cutoff_date_financial_information_corporative = null
    models.value.bank_entity_corporative = null
    models.value.type_account_holder_corporative = null
    models.value.holder_account_number_corporative = null
    models.value.origin_funds_corporative = null
    models.value.other_origin_funds_corporative = null
  }

  onMounted(async () => {
    handlerActionForm(props.action)
  })

  watch(
    () => [
      models.value.company_classification_corporative,
      models.value.ciiu_code_corporative,
      models.value.is_registered_national_registry_corporative,
      models.value.total_monthly_operating_income_corporative,
      models.value.total_monthly_not_operating_income_corporative,
      models.value.total_monthly_expenses_corporative,
      models.value.item_other_monthly_income_corporative,
      models.value.total_assets_corporative,
      models.value.total_liabilities_corporative,
      models.value.cutoff_date_financial_information_corporative,
      models.value.bank_entity_corporative,
      models.value.type_account_holder_corporative,
      models.value.holder_account_number_corporative,
      models.value.origin_funds_corporative,
      models.value.other_origin_funds_corporative,
    ],
    () => {
      if (isEmpty(models.value)) {
        _setDataLegalCLientsCorporative(null)
      } else {
        _setDataLegalCLientsCorporative({
          financial_info: {},
          company_classification_corporative:
            models.value.company_classification_corporative ?? null,
          ciiu_code_corporative: models.value.ciiu_code_corporative ?? null,
          is_registered_national_registry_corporative:
            models.value.is_registered_national_registry_corporative ?? false,
          total_monthly_operating_income_corporative:
            models.value.total_monthly_operating_income_corporative ?? null,
          total_monthly_not_operating_income_corporative:
            models.value.total_monthly_not_operating_income_corporative ?? null,
          total_monthly_expenses_corporative:
            models.value.total_monthly_expenses_corporative ?? null,
          item_other_monthly_income_corporative:
            models.value.item_other_monthly_income_corporative ?? null,
          total_assets_corporative:
            models.value.total_assets_corporative ?? null,
          assets_corporative: null,
          total_liabilities_corporative:
            models.value.total_liabilities_corporative ?? null,
          cutoff_date_financial_information_corporative:
            models.value.cutoff_date_financial_information_corporative ?? null,
          bank_entity_corporative: models.value.bank_entity_corporative ?? null,
          type_account_holder_corporative:
            models.value.type_account_holder_corporative ?? null,
          holder_account_number_corporative:
            models.value.holder_account_number_corporative ?? null,
          origin_funds_corporative:
            models.value.origin_funds_corporative ?? null,
          other_origin_funds_corporative:
            models.value.other_origin_funds_corporative ?? null,
        })
      }
    }
  )

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    }
  )

  return {
    models,
    formCorporative,
    banks,
    bank_types,
    ciius,
    legal_people_company_classification,
    legal_people_fund_sources,
    validateAlphanumericMessage,
    date_before_or_equal_to_the_current_date,
    formatCurrencyString,
  }
}
export default useCorporativeForm
