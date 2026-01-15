// Vue - Pinia
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import moment from 'moment'

// Interfaces
import { ActionType } from '@/interfaces/global'
import {
  IFiduciaryInvestmentPlansForm,
  IFiduciaryInvestmentPlansPropsForm,
} from '@/interfaces/customs/fics/FiduciaryInvestmentPlans'

// Composables
import { useUtils, useUtilsCalendarMethods } from '@/composables'

// Stores
import { useFiduciaryInvestmentPlanStore } from '@/stores/fics/fiduciary-investment-plan'
import { useFicResourceStore } from '@/stores/resources-manager/fics'

const useInformationForm = (props: IFiduciaryInvestmentPlansPropsForm) => {
  const { _setDataForm } = useFiduciaryInvestmentPlanStore('v1')
  const { data_form, has_types_participation } = storeToRefs(
    useFiduciaryInvestmentPlanStore('v1')
  )
  const { funts_to_investment_plans, offices } = storeToRefs(
    useFicResourceStore('v1')
  )
  const { isBusinessDay } = useUtilsCalendarMethods()

  const formInformation = ref()
  const models = ref<IFiduciaryInvestmentPlansForm>({
    holder_identification: {
      email_address: '',
      phone: '',
      residential_address: '',
      funding_source: '',
    },
  })

  const handlerActionForm = (action: ActionType) => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: setValueModel,
      edit: data_form.value ? setValueModel : setFormEdit,
      view: setFormView,
    }
    actionHandlers[action]?.()
  }

  const setValueModel = () => {
    if (data_form.value) {
      models.value = { ...data_form.value }
    }
  }

  const setFormView = () => {
    if (props.data) {
      models.value = { ...props.data }

      models.value.collective_investment_fund_id =
        models.value.collective_investment_fund?.fund_id
    }
  }

  const setFormEdit = () => {
    if (props.data) {
      models.value = { ...props.data }

      models.value.collective_investment_fund_id =
        models.value.collective_investment_fund?.fund_id
    }
  }

  const addBusinessDays = (startDate: string, days: number): string => {
    let result = moment(startDate)
    let added = 0

    while (added < days) {
      result = result.add(1, 'day')
      if (isBusinessDay(result.format('YYYY-MM-DD'))) {
        added++
      }
    }

    return result.toISOString()
  }

  onMounted(async () => {
    handlerActionForm(props.action)
  })

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    }
  )

  watch(
    () => models.value.collective_investment_fund_id,
    () => {
      if (models.value.collective_investment_fund_id) {
        const fund = funts_to_investment_plans.value.find(
          (item) => item.value == models.value.collective_investment_fund_id
        )
       
        has_types_participation.value = fund?.has_participation_types ?? false

        if (!models.value.collective_investment_fund) {
          models.value.collective_investment_fund = {
            fund_id: 0,
            fund_code: '',
            fund_name: '',
            last_closing_date: null,
            parameters: [
              {
                fic_parameter_id: 0,
                permanency_days: 0,
                structure: '',
                office_length: 0,
                fund_length: null,
                consecutive_length: 0,
                description: null,
                withholding_percentage: '',
                gmf_percentage: '',
                penalty: false,
                pernalty_percentage: '',
                operation_start_date: null,
                fund_permanency_agreement: false,
              },
            ],
          }
        }

        models.value.collective_investment_fund.parameters[0].gmf_percentage =
          fund?.fic_parameters?.[0]?.gmf_percentage ?? ''

        models.value.collective_investment_fund.parameters[0].withholding_percentage =
          fund?.fic_parameters?.[0]?.withholding_percentage ?? ''

        models.value.investment_plan = ''
        models.value.fund_description = fund?.fund_name ?? ''
        models.value.operation_date = fund?.last_closing_date
          ? useUtils().formatDate(
              new Date(
                new Date(fund.last_closing_date).setDate(
                  new Date(fund.last_closing_date).getDate() + 1
                )
              ).toISOString(),
              'YYYY-MM-DD'
            )
          : fund?.fic_parameters?.[0]?.operation_start_date
          ? useUtils().formatDate(
              fund.fic_parameters[0].operation_start_date,
              'YYYY-MM-DD'
            )
          : ''
        models.value.expiration_date = fund?.last_closing_date
          ? useUtils().formatDate(
              addBusinessDays(
                fund.last_closing_date,
                1 + (fund?.fic_parameters?.[0]?.permanency_days ?? 0)
              ),
              'YYYY-MM-DD'
            )
          : fund?.fic_parameters?.[0]?.operation_start_date
          ? useUtils().formatDate(
              addBusinessDays(
                fund.fic_parameters[0].operation_start_date,
                fund.fic_parameters[0].permanency_days ?? 0
              ),
              'YYYY-MM-DD'
            )
          : ''
        models.value.collective_investment_fund.parameters[0].fund_permanency_agreement =
          fund?.fic_parameters?.[0]?.fund_permanency_agreement ?? false
      }
    },
    { deep: true }
  )

  watch(
    () => models.value,
    () => {
      if (useUtils().isEmptyOrZero(models.value)) {
        _setDataForm(null)
      } else {
        _setDataForm({ ...models.value })
      }
    },
    { deep: true }
  )

  return {
    models,
    formInformation,
    funts_to_investment_plans,
    offices,
  }
}

export default useInformationForm
