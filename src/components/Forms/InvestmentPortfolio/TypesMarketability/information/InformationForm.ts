import { IMarketabilityType } from '@/interfaces/customs'
import { useMarketabilityTypesStore } from '@/stores/investment-portfolio/types-marketability'
import { useInvestmentPortfolioResourcesV1 } from '@/stores/resources-manager/investment-portfolio/investment-portfolio-resources-v1'
import { isEmptyOrZero } from '@/utils'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export const useInformationForm = (props: {
  action: 'create' | 'edit'
  data?: IMarketabilityType
}) => {
  const formInformation = ref()
  const route = useRoute()
  const id = Number(route.params.id)

  const { data_information_form } = storeToRefs(
    useMarketabilityTypesStore('v1')
  )
  const { _setDataInformationForm } = useMarketabilityTypesStore('v1')
  const { types_marketability } = storeToRefs(
    useInvestmentPortfolioResourcesV1()
  )
  const { getResources } = useInvestmentPortfolioResourcesV1()

  const models = ref<{
    id?: number
    code: string
    description: string
    type: string
  }>({
    id: 0,
    code: '',
    description: '',
    type: '',
  })

  const handlerActionForm = (action: 'create' | 'edit') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: _setValueModel,
    }
    actionHandlers[action]?.()
  }

  const _setValueModel = () => {
    models.value.id = data_information_form.value?.id ?? 0
    models.value.code = data_information_form.value?.code ?? ''
    models.value.description = data_information_form.value?.description ?? ''
    models.value.type = data_information_form.value?.type ?? ''
  }

  onMounted(async () => {
    await getResources('?keys[]=type_bursatility')
  })

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    },
    { deep: true }
  )

  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setDataInformationForm(null)
      } else {
        _setDataInformationForm({
          ...models.value,
        } as IMarketabilityType)
      }
    },
    { deep: true }
  )
  return {
    types_marketability,
    formInformation,
    models,
    id,
  }
}
