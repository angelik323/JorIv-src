import {
  useInvestmentPortfolioResourceStore,
  useRegisterConstitutionFicStore,
  useResourceManagerStore,
} from '@/stores'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { portfolio_class } from '@/constants'
import { useMainLoader } from '@/composables'
import { useRouter } from 'vue-router'
import { IGenericRegisterConstitutionAux } from '@/interfaces/customs'
import { isEmptyOrZero } from '@/utils'

export const useInformationFormLocalMoney = () => {
  const { openMainLoader } = useMainLoader()
  const router = useRouter()
  const valueReferenceDescription = ref()
  const { data_information_generic, data_information_values } = storeToRefs(
    useRegisterConstitutionFicStore('v1')
  )
  const {
    currency_local,
    operation_type,
    paper_type_participation,
    isin_codes_mnemonics_portfolio,
  } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))
  const { _getResources } = useResourceManagerStore('v1')
  const { _createCurrencyLocal, _setReferenceTabs, _setDataInformationValues } =
    useRegisterConstitutionFicStore('v1')

  const models = ref<IGenericRegisterConstitutionAux>({
    unit_value: '',
    portfolio_class: null,
    currency_id: null,
    value_currency: 1,
    operation_type_id: null,
    paper_type_id: null,
    isin_id: null,
    participation_number: null,
    constitution_value: null,
  })

  const onSubmit = async () => {
    openMainLoader(true)
    const payload = {
      ...data_information_generic.value,
      investment_portfolio_id:
        data_information_generic.value?.investment_portfolio_id ?? null,
      operation_date: data_information_generic.value?.operation_date ?? null,
      issuer_id: data_information_generic.value?.issuer_id ?? null,
      counterparty_id: data_information_generic.value?.counterparty_id ?? null,
      administrator_id:
        data_information_generic.value?.administrator_id ?? null,
      details: {
        ...models.value,
        unit_value: String(models.value.unit_value) || 0,
      },
    }
    if (await _createCurrencyLocal(payload)) {
      router.push({ name: 'RegisterConstitutionList' })
      openMainLoader(false)
    }
    openMainLoader(false)
  }

  onMounted(() => {
    if (
      !data_information_values.value ||
      !data_information_values.value.details
    )
      return
    const details = data_information_values.value.details
    models.value = {
      unit_value: details.unit ?? '',
      portfolio_class: details.portfolio_class ?? null,
      currency_id: details.currency_id ?? null,
      value_currency: details.unit_value_origin_currency ?? null,
      operation_type_id: details.operation_type_id ?? null,
      paper_type_id: details.paper_type_id ?? null,
      isin_id: details.isin_id ?? null,
      participation_number: details.participation_number ?? null,
      constitution_value: details.constitution_value_origin_currency ?? null,
    }
  })

  onUnmounted(() => {
    _setReferenceTabs({ valuePosition: 0 })
  })

  watch(
    () => models.value.operation_type_id,
    (newVal) => {
      if (!newVal) return
      const operationType = operation_type.value?.find(
        (item) => item.value === newVal
      )
      valueReferenceDescription.value = operationType?.description || ''
    }
  )

  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setDataInformationValues(null)
      } else {
        _setDataInformationValues({
          details: {
            unit: models.value.unit_value,
            portfolio_class: models.value.portfolio_class,
            currency_id: models.value.currency_id,
            unit_value_origin_currency: models.value.value_currency,
            constitution_value_origin_currency: models.value.constitution_value,
            isin_id: models.value.isin_id,
            participation_number: models.value.participation_number,
            constitution_unit_number: null,
            operation_type_id: models.value.operation_type_id,
            number_of_cash_operation_days: null,
            paper_type_id: models.value.paper_type_id,
          },
        })
      }
    },
    { deep: true }
  )

  watch(
    () => models.value.currency_id,
    async (newVal) => {
      if (!newVal) return
      await _getResources({
        investment_portfolio: [
          `paper_type_participation&filter[currency_id]=${newVal}`,
        ],
      })
    }
  )

  return {
    onSubmit,
    models,
    currency_local,
    operation_type,
    paper_type_participation,
    isin_codes_mnemonics_portfolio,
    portfolio_class,
    valueReferenceDescription,
    _setReferenceTabs,
  }
}
