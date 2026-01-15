import { watch, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useClientsStore, useResourceStore } from '@/stores'
import { IClientNaturalPersonRequest } from '@/interfaces/customs/Clients'
import { useValidator } from '@/composables/useValidator'
import { useUtils } from '@/composables'
import moment from 'moment'

const useFinanceForm = (props: any) => {
  const { data_finance_form } = storeToRefs(useClientsStore('v1'))
  const { _setDataNaturalClientsFinance } = useClientsStore('v1')

  const { banks, bank_types } = storeToRefs(useResourceStore('v1'))
  const { validateAlphanumericMessage } = useValidator()
  const { formatCurrencyString, isEmptyOrZeroOrFalse } = useUtils()

  const formFinance = ref()

  const optionsCalendar = (date: string) =>
    date <= moment().format('YYYY/MM/DD')

  const models = ref({
    financial_info: {
      report_income: false as boolean | undefined,
      total_operational_income: null as string | number | null,
      total_expenses: null as string | number | null,
      total_non_operational_income: null as string | number | null,
      other_non_operational_income_concept: null as string | number | null,
      assets: null as string | number | null,
      liabilities: null as string | number | null,
      cutoff_date: '' as string | null,
      bank_holder_id: '' as string | null | number,
      bank_account_number_holder: '' as string | null,
      account_type_holder_id: '' as string | null | number,
      beneficiary_name: '' as string | null,
      beneficiary_document_number: '' as string | null,
      bank_beneficiary_id: '' as string | null | number,
      bank_account_number_beneficiary: '' as string | null,
      account_type_beneficiary_id: '' as string | null | number,
    },
  })

  const handlerActionForm = (action: 'create' | 'edit' | 'view') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: data_finance_form.value ? _setValueModel : setFormEdit,
      view: setFormView,
    }

    actionHandlers[action]?.()
  }

  const setFormView = () => {
    clearForm()
    const data: IClientNaturalPersonRequest = props.data
    if (data) {
      models.value.financial_info.report_income =
        data?.third_party?.financial_info.declares_income ?? false
      models.value.financial_info.total_operational_income =
        data?.third_party?.financial_info.total_operational_income ?? null
      models.value.financial_info.total_expenses =
        data?.third_party?.financial_info.total_expenses ?? null
      models.value.financial_info.total_non_operational_income =
        data?.third_party?.financial_info.total_non_operational_income ?? ''

      models.value.financial_info.other_non_operational_income_concept =
        data?.third_party?.financial_info
          .other_non_operational_income_concept ?? null
      models.value.financial_info.assets =
        data?.third_party?.financial_info.assets ?? null
      models.value.financial_info.liabilities =
        data?.third_party?.financial_info.liabilities ?? null
      models.value.financial_info.cutoff_date =
        data?.third_party?.financial_info.cutoff_date ?? ''
      models.value.financial_info.bank_holder_id =
        data?.third_party?.financial_info?.bank?.description ?? ''
      models.value.financial_info.bank_account_number_holder =
        data?.third_party?.financial_info.bank_account_number_holder ?? ''
      models.value.financial_info.account_type_holder_id =
        data?.third_party?.financial_info.account_type_holder ?? ''
      models.value.financial_info.beneficiary_name =
        data?.third_party?.financial_info.beneficiary_name ?? ''
      models.value.financial_info.beneficiary_document_number =
        data?.third_party?.financial_info.beneficiary_document_number ?? ''
      models.value.financial_info.bank_beneficiary_id =
        data?.third_party?.financial_info?.bank_beneficiary?.description ?? ''
      models.value.financial_info.bank_account_number_beneficiary =
        data?.third_party?.financial_info.bank_account_number_beneficiary ?? ''
      models.value.financial_info.account_type_beneficiary_id =
        data?.third_party?.financial_info.account_type_beneficiary ?? ''
    }
  }

  const setFormEdit = () => {
    clearForm()
    const data: IClientNaturalPersonRequest = props.data
    if (data) {
      setTimeout(() => {
        models.value.financial_info.report_income =
          data?.third_party?.financial_info.declares_income ?? false
        models.value.financial_info.total_operational_income =
          data?.third_party?.financial_info.total_operational_income ?? null
        models.value.financial_info.total_expenses =
          data?.third_party?.financial_info.total_expenses ?? null
        models.value.financial_info.total_non_operational_income =
          data?.third_party?.financial_info.total_non_operational_income ?? ''
        models.value.financial_info.other_non_operational_income_concept =
          data?.third_party?.financial_info
            .other_non_operational_income_concept ?? null
        models.value.financial_info.assets =
          data?.third_party?.financial_info.assets ?? null
        models.value.financial_info.liabilities =
          data?.third_party?.financial_info.liabilities ?? null
        models.value.financial_info.cutoff_date =
          data?.third_party?.financial_info.cutoff_date ?? ''
        models.value.financial_info.bank_holder_id =
          data?.third_party?.financial_info?.bank?.id ?? ''
        models.value.financial_info.bank_account_number_holder =
          data?.third_party?.financial_info.bank_account_number_holder ?? ''
        models.value.financial_info.account_type_holder_id =
          data?.third_party?.financial_info.account_type_holder ?? ''
        models.value.financial_info.beneficiary_name =
          data?.third_party?.financial_info.beneficiary_name ?? ''
        models.value.financial_info.beneficiary_document_number =
          data?.third_party?.financial_info.beneficiary_document_number ?? ''
        models.value.financial_info.bank_beneficiary_id =
          data?.third_party?.financial_info?.bank_beneficiary?.id ?? ''
        models.value.financial_info.bank_account_number_beneficiary =
          data?.third_party?.financial_info.bank_account_number_beneficiary ??
          ''
        models.value.financial_info.account_type_beneficiary_id =
          data?.third_party?.financial_info.account_type_beneficiary ?? ''
      }, 1000)
    }
  }

  const _setValueModel = () => {
    if (data_finance_form.value) {
      models.value = { ...data_finance_form.value }
    }
  }

  const clearForm = () => {
    models.value.financial_info.report_income = undefined
    models.value.financial_info.total_operational_income = null
    models.value.financial_info.total_expenses = null
    models.value.financial_info.total_non_operational_income = null
    models.value.financial_info.other_non_operational_income_concept = null
    models.value.financial_info.assets = null
    models.value.financial_info.liabilities = null
    // models.value.financial_info.cutoff_date = ''
    models.value.financial_info.bank_holder_id = null
    models.value.financial_info.bank_account_number_holder = null
    models.value.financial_info.account_type_holder_id = null
    models.value.financial_info.beneficiary_name = null
    models.value.financial_info.beneficiary_document_number = null
    models.value.financial_info.bank_beneficiary_id = null
    models.value.financial_info.bank_account_number_beneficiary = null
    models.value.financial_info.account_type_beneficiary_id = null
  }

  onMounted(async () => {
    handlerActionForm(props.action)
  })

  watch(
    () => [
      models.value.financial_info.report_income,
      models.value.financial_info.total_operational_income,
      models.value.financial_info.total_expenses,
      models.value.financial_info.total_non_operational_income,
      models.value.financial_info.other_non_operational_income_concept,
      models.value.financial_info.assets,
      models.value.financial_info.liabilities,
      models.value.financial_info.cutoff_date,
      models.value.financial_info.bank_holder_id,
      models.value.financial_info.bank_account_number_holder,
      models.value.financial_info.account_type_holder_id,
      models.value.financial_info.beneficiary_name,
      models.value.financial_info.beneficiary_document_number,
      models.value.financial_info.bank_beneficiary_id,
      models.value.financial_info.bank_account_number_beneficiary,
      models.value.financial_info.account_type_beneficiary_id,
    ],
    () => {
      if (isEmptyOrZeroOrFalse(models.value.financial_info)) {
        _setDataNaturalClientsFinance(null)
      } else {
        _setDataNaturalClientsFinance({
          financial_info: {
            report_income: models.value.financial_info.report_income ?? false,
            total_operational_income:
              models.value.financial_info.total_operational_income ?? null,
            total_expenses: models.value.financial_info.total_expenses ?? null,
            total_non_operational_income:
              models.value.financial_info.total_non_operational_income ?? null,
            other_non_operational_income_concept:
              models.value.financial_info
                .other_non_operational_income_concept ?? null,
            assets: models.value.financial_info.assets ?? null,
            liabilities: models.value.financial_info.liabilities ?? null,
            cutoff_date: models.value.financial_info.cutoff_date ?? null,
            bank_holder_id: models.value.financial_info.bank_holder_id ?? null,
            bank_account_number_holder:
              models.value.financial_info.bank_account_number_holder ?? null,
            account_type_holder_id:
              models.value.financial_info.account_type_holder_id ?? null,
            beneficiary_name:
              models.value.financial_info.beneficiary_name ?? null,
            beneficiary_document_number:
              models.value.financial_info.beneficiary_document_number ?? null,
            bank_beneficiary_id:
              models.value.financial_info.bank_beneficiary_id ?? null,
            bank_account_number_beneficiary:
              models.value.financial_info.bank_account_number_beneficiary ??
              null,
            account_type_beneficiary_id:
              models.value.financial_info.account_type_beneficiary_id ?? null,
          },
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
    formFinance,
    banks,
    bank_types,
    validateAlphanumericMessage,
    formatCurrencyString,
    optionsCalendar,
  }
}

export default useFinanceForm
