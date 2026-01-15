//Vue - Pinia
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
//Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

//Interfaces
import { IFractionationTitles } from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'

//Stores
import { useFractionationTitlesStore } from '@/stores'

export const useFractionationTitlesView = () => {
  const { openMainLoader } = useMainLoader()
  const route = useRoute()
  const { headerProps, fractionation_titles_response } = storeToRefs(
    useFractionationTitlesStore('v1')
  )
  const { _getFractionationTitleDetail } = useFractionationTitlesStore('v1')
  const fractionationTitleId = +route.params.id
  const informationFormRef = ref()
  const information_form_ref = ref<IFractionationTitles | null>(null)
  const { goToURL } = useGoToUrl()

  const setFormView = (data: IFractionationTitles) => {
    information_form_ref.value = {
      id: data.id ?? null,
      parent_title_number: data.parent_title_number,
      origin_title: data.origin_title ?? null,
      operation_date: data.operation_date,
      investment_class: data.investment_class,

      investment_portfolio: data.investment_portfolio
        ? {
            id: data.investment_portfolio.id,
            code: data.investment_portfolio.code,
            description: data.investment_portfolio.description,
          }
        : null,
      operation_type: data.operation_type
        ? {
            id: data.operation_type.id,
            code: data.operation_type.code,
            description: data.operation_type.description,
          }
        : null,
      created_by: data.created_by ?? null,
      divisions: Array.isArray(data.divisions) ? data.divisions : [],
    }
  }
  const headerProperties = {
    title: 'Ver fraccionamiento de títulos',
    breadcrumbs: [
      ...headerProps.value.breadcrumbs,
      {
        label: 'Ver',
        route: '',
      },
      {
        label: String(fractionationTitleId),
        route: '',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'basic_data',
      label: 'Datos básicos*',
      icon: useUtils().defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  onMounted(async () => {
    openMainLoader(true)
    await _getFractionationTitleDetail(fractionationTitleId)
    openMainLoader(false)
  })

  watch(
    () => fractionation_titles_response.value,
    (val) => {
      if (!val) return
      setFormView(val)
    }
  )

  return {
    headerProperties,
    tabs,
    tabActive,
    tabActiveIdx,
    information_form_ref,
    informationFormRef,
    goToURL,
  }
}
