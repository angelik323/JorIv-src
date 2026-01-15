import {
  useInvestmentPortfolioResourceStore,
  useRegisterConstitutionFicStore,
} from '@/stores'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { IRegisterConstitutionGenericConditions } from '@/interfaces/customs'
import { useMainLoader } from '@/composables'
import { useRouter } from 'vue-router'

export const useInformationFormForeignCondition = () => {
  const {
    data_information_values,
    data_information_generic,
    data_value_money,
  } = storeToRefs(useRegisterConstitutionFicStore('v1'))
  const { openMainLoader } = useMainLoader()
  const router = useRouter()
  const {
    _createCurrencyForeign,
    _setReferenceTabs,
    _setDataInformationGeneric,
    _setDataInformationConditions,
    _setDataInformationValues,
  } = useRegisterConstitutionFicStore('v1')
  const { currency_foreign } = storeToRefs(
    useInvestmentPortfolioResourceStore('v1')
  )
  const conversionRef = ref()
  const valueMoneyRef = ref()
  const models = ref<IRegisterConstitutionGenericConditions>({
    currency_value: null,
    conversion_factor: null,
    compliance_date: null,
    resource_placement_date: null,
    compliance_value_origin_currency: null,
    compliance_transfer_value_local_currency: null,
  })

  const complianceTransferGenerate = () => {
    const constitutionValue = Number(
      data_information_values.value?.details.constitution_value_origin_currency
    )
    const conversionFactor = Number(conversionRef.value)
    const usdCoinValue = Number(
      currency_foreign.value.find((item) => item.code === 'USD')?.coin_value
    )

    const step1 = parseFloat((constitutionValue * conversionFactor).toFixed(2))
    const step2 = parseFloat((step1 * usdCoinValue).toFixed(2))

    return step2
  }

  onMounted(async () => {
    if (data_information_values.value) {
      models.value.currency_value = Number(
        Number(data_value_money.value.currency_local_value).toFixed(2)
      )
      models.value.conversion_factor = Number(conversionData().toFixed(6))
      models.value.compliance_value_origin_currency = Number(
        (
          Number(
            data_information_values.value.details
              .constitution_value_origin_currency
          ) * Number(conversionRef.value)
        ).toFixed(2)
      )
      models.value.compliance_transfer_value_local_currency = Number(
        complianceTransferGenerate().toFixed(2)
      )
    }
  })

  const conversionData = () => {
    if (data_value_money.value.currency_identifier === 'USD') {
      return 1
    }

    if (data_value_money.value.currency_conversion_factor) {
      const result = Number(data_value_money.value?.currency_conversion_factor)
      return result
    } else {
      const usdCoinValue = Number(
        currency_foreign.value.find((item) => item.code === 'USD')?.coin_value
      )
      const result =
        Number(data_value_money.value.currency_local_value) / usdCoinValue

      return result
    }
  }
  const conversionValueMoney = () => {
    return data_value_money.value.currency_identifier !== 'USD'
      ? Number(
          (
            Number(conversionRef.value) *
            Number(data_value_money.value.currency_local_value ?? 0)
          ).toFixed(2)
        )
      : Number(
          Number(data_value_money.value.currency_local_value ?? 0).toFixed(2)
        )
  }

  conversionRef.value = conversionData()
  valueMoneyRef.value = conversionValueMoney()
  const onSubmit = async () => {
    openMainLoader(true)
    const payload = {
      operation_date: data_information_generic.value?.operation_date ?? null,
      values: {
        unit: data_information_values.value?.details.unit?.toString() ?? null,
        portfolio_class:
          data_information_values.value?.details.portfolio_class ?? null,
        currency_id: data_information_values.value?.details.currency_id ?? null,
        isin_id: data_information_values.value?.details.isin_id ?? null,
        participation_number:
          data_information_values.value?.details.participation_number ?? null,
        unit_value_origin_currency:
          data_information_values.value?.details.unit_value_origin_currency ??
          null,
        constitution_unit_number:
          (data_information_values.value?.details
            .constitution_value_origin_currency ?? 0) /
          (data_information_values.value?.details.unit_value_origin_currency ??
            1),
        constitution_value_origin_currency:
          data_information_values.value?.details
            .constitution_value_origin_currency ?? null,
        operation_type_id:
          data_information_values.value?.details.operation_type_id ?? null,
        number_of_cash_operation_days:
          data_information_values.value?.details
            .number_of_cash_operation_days ?? null,
        paper_type_id: data_information_values.value?.details.paper_type_id,
      },
      investment_portfolio_id:
        data_information_generic.value?.investment_portfolio_id ?? null,
      issuer_id: data_information_generic.value?.issuer_id ?? null,
      counterparty_id: data_information_generic.value?.counterparty_id ?? null,
      administrator_id:
        data_information_generic.value?.administrator_id ?? null,
      conditions: {
        currency_value: models.value.currency_value,
        conversion_factor: Number(conversionData().toFixed(6)),
        compliance_date: models.value.compliance_date,
        resource_placement_date: models.value.resource_placement_date,
        compliance_value_origin_currency: Number(
          (
            Number(
              data_information_values.value?.details
                .constitution_value_origin_currency
            ) * Number(conversionRef.value)
          ).toFixed(2)
        ),
        compliance_transfer_value_local_currency: Number(
          complianceTransferGenerate().toFixed(2)
        ),
      },
    }
    if (await _createCurrencyForeign(payload)) {
      router.push({ name: 'RegisterConstitutionList' })
      _setDataInformationGeneric(null)
      _setDataInformationConditions(null)
      _setDataInformationValues(null)
      openMainLoader(false)
    }
    openMainLoader(false)
  }

  return {
    models,
    onSubmit,
    _setReferenceTabs,
  }
}
