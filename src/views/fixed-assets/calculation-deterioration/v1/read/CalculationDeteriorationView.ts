// vue
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// interfaces
import { ITabs } from '@/interfaces/global'
import { ICalculationForm } from '@/interfaces/customs/fixed-assets/CalculationDeterioration'

// composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// stores
import { useCalculationDeteriorationStore } from '@/stores/fixed-assets/calculation-deterioration'

const useCalculationDeteriorationView = () => {
  // hooks
  const route = useRoute()
  const id = +route.params.id
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()

  //stores

  const { _getCalculationById } = useCalculationDeteriorationStore('v1')

  const basicDataFormRef = ref()
  const calculation_form = ref<ICalculationForm | null>()

  // configs
  const headerProps = {
    title: 'Ver cálculo de deterioro',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Activos fijos',
        route: '',
      },
      {
        label: 'Cálculo de deterioro',
        route: 'CalculationDeteriorationList',
      },
      {
        label: 'Ver',
        route: 'CalculationDeteriorationView',
      },
      {
        label: `${id}`,
        route: '',
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  // actions

  const handleView = async () => {
    openMainLoader(true)

    goToURL('CalculationDeteriorationList')

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  // lifecycle hooks
  onMounted(async () => {
    openMainLoader(true)

    calculation_form.value = await _getCalculationById(id)

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  })

  return {
    // configs
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,

    // refs
    basicDataFormRef,
    calculation_form,

    // methods
    goToURL,
    handleView,
  }
}

export default useCalculationDeteriorationView
