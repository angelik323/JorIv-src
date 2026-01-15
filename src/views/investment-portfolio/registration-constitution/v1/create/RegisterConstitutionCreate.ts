import { useMainLoader } from '@/composables'
import { ITabs } from '@/interfaces/global'
import {
  useRegisterConstitutionFicStore,
  useResourceManagerStore,
} from '@/stores'
import { defaultIconsLucide } from '@/utils'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue'

export const useRegisterConstitutionCreate = () => {
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const informationForm = ref()
  const { openMainLoader } = useMainLoader()
  const { referenceTabs } = storeToRefs(useRegisterConstitutionFicStore('v1'))
  const headerProps = {
    title: "Constitución participación en FIC's",
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones', route: '' },
      {
        label: "Constitución participación en FIC's moneda local",
        route: 'RegisterConstitutionCreate',
      },
    ],
  }
  const tabs = reactive<ITabs[]>([
    {
      name: 'InformationForm',
      label: 'Datos Básicos',
      icon: defaultIconsLucide.listBulleted,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'InformationForeignForm',
      label: 'Unidad/Moneda/Valor',
      icon: defaultIconsLucide.dollarSign,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ])

  const activeTab = ref(tabs[0].name)
  const tabActiveIdx = ref(
    tabs.findIndex((tab) => tab.name === activeTab.value)
  )

  onMounted(async () => {
    await _getResources({
      investment_portfolio: [
        'investment_portfolio',
        'administrators_codes',
        'emitter',
        'emitter_buyer',
        'currency_local',
        'operation_type',
      ],
    })
    await _getResources({
      investment_portfolio: [
        'isin_code_mnemonics&filter[title_class]=Participaciones',
      ],
    })
  })

  const validateForm = async () => {
    if (await informationForm.value?.validate()) {
      return true
    }
    return

    false
  }

  const validateChange = async () => {
    if (await validateForm()) {
      openMainLoader(true)
      activeTab.value = 'InformationForeignForm'
      openMainLoader(false)
    }
  }

  onUnmounted(() => {
    _resetKeys({
      investment_portfolio: [
        'investment_portfolio',
        'administrators_codes',
        'emitter',
        'emitter_buyer',
        'isin_code_mnemonics',
        'currency_local',
        'operation_type',
      ],
    })
  })

  watch(
    referenceTabs,
    (val) => {
      if (val) {
        activeTab.value = tabs[val.valuePosition]?.name || tabs[0].name
      }
    },
    { deep: true }
  )

  return {
    headerProps,
    tabs,
    activeTab,
    tabActiveIdx,
    validateForm,
    informationForm,
    validateChange,
  }
}
