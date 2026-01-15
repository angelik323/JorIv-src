//Vue - Pinia
import { onMounted, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

//Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

//Interfaces
import { IFractionationSendData } from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'
//Stores
import { useResourceManagerStore, useFractionationTitlesStore } from '@/stores'

export const useFractionationTitlesCreate = () => {
  const { headerProps } = storeToRefs(useFractionationTitlesStore('v1'))
  const { openMainLoader } = useMainLoader()
  const { _createFractionationTitle, _clearData } =
    useFractionationTitlesStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { goToURL } = useGoToUrl()
  const informationFormRef = ref()
  const information_form_ref = ref<IFractionationSendData | null>(null)
  const headerProperties = {
    title: 'Crear fraccionamiento de títulos',
    breadcrumbs: [
      ...headerProps.value.breadcrumbs,
      {
        label: 'Crear',
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
      disable: false,
      show: true,
      required: false,
    },
  ])

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const validateForms = async () => {
    let valid = false
    const forms = [informationFormRef]

    if (tabActiveIdx.value >= 0 && tabActiveIdx.value < forms.length) {
      try {
        valid =
          (await forms[tabActiveIdx.value]?.value?.validateForm()) ?? false
      } catch {
        valid = false
      }
    }
    return valid
  }

  const makeDataRequest = () => {
    const apiRequest: Partial<IFractionationSendData> = {
      ...information_form_ref.value,
    }
    return apiRequest
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return
    openMainLoader(true)
    const payload = makeDataRequest()
    const fractionationTitle = await _createFractionationTitle(payload)
    if (fractionationTitle) {
      openMainLoader(false)
      goToURL('FractionationTitleList')
    }
    openMainLoader(false)
  }

  onMounted(async () => {
    await _getResources({
      investment_portfolio: [
        'division_inversion_classes&filter[investment_class]=CLASE_INVERSION',
      ],
    })
    await _getResources({
      investment_portfolio: ['investment_portfolio', 'operation_type'],
    })
  })

  onUnmounted(() => {
    _resetKeys({
      investment_portfolio: [
        'division_inversion_classes',
        'investment_portfolio',
        'available_titles_for_division_and_encompass',
        'operation_type',
      ],
    })
    _clearData()
  })

  return {
    tabs,
    tabActive,
    tabActiveIdx,
    headerProperties,
    informationFormRef,
    information_form_ref,
    onSubmit,
    validateForms,
  }
}
