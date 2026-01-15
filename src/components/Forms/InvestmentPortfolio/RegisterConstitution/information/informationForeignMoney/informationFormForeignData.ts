import {
  useInvestmentPortfolioResourceStore,
  useRegisterConstitutionFicStore,
  useResourceManagerStore,
} from '@/stores'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import { portfolio_class } from '@/constants'
import { isEmptyOrZero } from '@/utils'
import { IRegisterConstitutionGenericValue } from '@/interfaces/customs'

export const useInformationFormForeignData = () => {
  const {
    operation_type,
    paper_type_participation,
    isin_codes_mnemonics_portfolio,
    currency_foreign_portfolio,
  } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))
  const { _getResources } = useResourceManagerStore('v1')
  const { _setDataInformationValues, _setReferenceTabs, _setDataValueMoney } =
    useRegisterConstitutionFicStore('v1')
  const { data_information_values } = storeToRefs(
    useRegisterConstitutionFicStore('v1')
  )
  const refDescriptionOperation = ref()
  const models = ref<IRegisterConstitutionGenericValue>({
    unit: '',
    portfolio_class: null,
    currency_id: null,
    isin_id: null,
    participation_number: null,
    unit_value_origin_currency: null,
    constitution_unit_number: null,
    constitution_value_origin_currency: null,
    operation_type_id: null,
    number_of_cash_operation_days: null,
    paper_type_id: null,
  })

  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setDataInformationValues(null)
      } else {
        _setDataInformationValues({
          details: {
            ...models.value,
          },
        })
      }
    },
    { deep: true }
  )

  onMounted(() => {
    if (
      !data_information_values.value ||
      !data_information_values.value.details
    )
      return
    models.value = { ...data_information_values.value.details }
  })

  watch(
    () => models.value.currency_id,
    (newVal) => {
      if (!newVal) return
      const currency = currency_foreign_portfolio.value?.find(
        (c) => c.value === newVal
      )
      _setDataValueMoney({
        currency_identifier: currency?.code ?? null,
        currency_local_value: currency?.description ?? null,
        currency_conversion_factor: currency?.currency_conversion ?? null,
      })
    }
  )

  watch(
    () => models.value.operation_type_id,
    (newVal) => {
      if (!newVal) return
      const operationType = operation_type.value?.find(
        (item) => item.value === newVal
      )
      refDescriptionOperation.value = operationType?.description || ''
    }
  )

  watch(
    () => models.value.constitution_value_origin_currency,
    (val) => {
      if (!val) return
      models.value.constitution_unit_number = Number(
        (
          Number(models.value.constitution_value_origin_currency) /
          Number(models.value.unit_value_origin_currency)
        ).toFixed(6)
      )
    },
    { deep: true }
  )

  watch(
    () => [
      models.value.unit_value_origin_currency,
      models.value.constitution_value_origin_currency,
    ],
    ([unitValue, constitutionValue]) => {
      if (!unitValue || !constitutionValue) {
        models.value.constitution_unit_number = null
        return
      }

      const unitValueNum = Number(unitValue)
      const constitutionValueNum = Number(constitutionValue)

      if (unitValueNum > 0) {
        models.value.constitution_unit_number = Number(
          (constitutionValueNum / unitValueNum).toFixed(6)
        )
      } else {
        models.value.constitution_unit_number = null
      }
    }
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
    models,
    _setReferenceTabs,
    currency_foreign_portfolio,
    operation_type,
    paper_type_participation,
    isin_codes_mnemonics_portfolio,
    portfolio_class,
    refDescriptionOperation,
  }
}
