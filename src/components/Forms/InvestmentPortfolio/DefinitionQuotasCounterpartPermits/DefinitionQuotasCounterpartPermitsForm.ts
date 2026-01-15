import { onMounted, ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { isEmptyOrZero } from '@/utils'
import { useMainLoader } from '@/composables'
import {
  IDefinitionQuotaCounterpartPermitForm,
  IGenericResource,
} from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'

import {
  useDefinitionQuotaCounterpartPermitStore,
  useInvestmentPortfolioResourceStore,
  useResourceManagerStore,
} from '@/stores'

const useDefinitionQuotasCounterpartPermitForm = (props: {
  action: ActionType
  data?: IDefinitionQuotaCounterpartPermitForm | null
}) => {
  const { openMainLoader } = useMainLoader()

  const { data_view } = storeToRefs(
    useDefinitionQuotaCounterpartPermitStore('v1')
  )
  const { _setDataForm } = useDefinitionQuotaCounterpartPermitStore('v1')

  const {
    third_party_issuers_selector_to_counterparty,
    selectable_portfolios_with_code_and_name,
    inversion_types,
    paper_type,
  } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keyPaperType = { investment_portfolio: ['paper_type'] }

  const formElementRef = ref()

  const initialModelsValues: IDefinitionQuotaCounterpartPermitForm = {
    counterpart_id: null,
    description_counterpart_name: '',
    document_counterpart: null,
    investment_portfolio_id: null,
    portfolio_code: '',
    description_portfolio_name: '',
    general_quota: null,
    type_of_investment: null,
    paper_type_id: null,
    papers: '',
    history_permits_quotas_counterpart: {
      created_at: null,
      creator_data: null,
      updated_at: null,
      update_data: null,
    },
  }

  const models = ref<IDefinitionQuotaCounterpartPermitForm>({
    ...initialModelsValues,
  })

  const isView = computed(() => props.action === 'view')

  const handlerActionForm = (action: ActionType) => {
    const data = data_view.value ?? props.data ?? null
    const actionHandlers: { [key in ActionType]: () => void } = {
      create: () => setForm(null),
      edit: async () => {
        await setForm(data)
        if (data?.type_of_investment) {
          await handleSelectInvestmentType(
            data.type_of_investment.toString(),
            data.paper_type_id,
            true
          )
        }
      },
      view: () => setForm(data),
    }
    actionHandlers[action]?.()
  }

  const setForm = (data: IDefinitionQuotaCounterpartPermitForm | null) => {
    if (!data) {
      models.value = { ...initialModelsValues }
      return
    }

    models.value = {
      ...initialModelsValues,
      ...data,
    }
  }

  const handleSelectCounterpart = (value: number) => {
    models.value.counterpart_id = value
    models.value.description_counterpart_name =
      third_party_issuers_selector_to_counterparty.value.find(
        (item: IGenericResource) => item.id === value
      )?.description ?? ''
  }

  const handleSelectPortfolio = (value: number) => {
    models.value.investment_portfolio_id = value
    models.value.description_portfolio_name =
      selectable_portfolios_with_code_and_name.value.find(
        (item: IGenericResource) => item.id === value
      )?.name ?? ''
  }

  const handleSelectInvestmentType = async (
    value: string,
    paperType: number | null = null,
    searchByLabel: boolean = false
  ) => {
    models.value.paper_type_id = paperType
    models.value.papers = ''

    if (!value) {
      _resetKeys(keyPaperType)
      models.value.type_of_investment = null
      return
    }

    const investmentType = searchByLabel
      ? inversion_types.value.find(
          (item: IGenericResource) => item.label === value
        )?.value
      : inversion_types.value.find(
          (item: IGenericResource) => item.value === value
        )?.value

    if (!investmentType) return

    models.value.type_of_investment = investmentType
    openMainLoader(true)
    await _getResources(
      keyPaperType,
      `filter[inversion_type_id]=${investmentType}`
    )
    openMainLoader(false)
  }

  onMounted(async () => {
    await handlerActionForm(props.action)
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
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setDataForm(null)
      } else {
        _setDataForm({ ...models.value })
      }
    },
    { deep: true }
  )

  watch(
    () => inversion_types.value,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    }
  )

  return {
    models,
    formElementRef,
    isView,
    third_party_issuers_selector_to_counterparty,
    selectable_portfolios_with_code_and_name,
    inversion_types,
    paper_type,
    handleSelectCounterpart,
    handleSelectPortfolio,
    handleSelectInvestmentType,
  }
}

export default useDefinitionQuotasCounterpartPermitForm
