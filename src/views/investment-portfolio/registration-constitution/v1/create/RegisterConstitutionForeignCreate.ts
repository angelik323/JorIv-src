import { ITabs } from '@/interfaces/global'
import {
  useRegisterConstitutionFicStore,
  useResourceManagerStore,
} from '@/stores'
import { defaultIconsLucide } from '@/utils'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue'

export const useRegisterConstitutionForeignCreate = () => {
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { referenceTabs, data_information_generic } = storeToRefs(
    useRegisterConstitutionFicStore('v1')
  )
  const headerProps = {
    title: "Constitución participación en FIC'S moneda extranjera",
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones', route: '' },
      {
        label: "Constitución participación en FIC'S moneda extranjera",
        route: 'RegisterConstitutionList',
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
      name: 'InformationForeignFormData',
      label: 'Datos operación',
      icon: defaultIconsLucide.factory,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'InformationForeignFormConditions',
      label: 'Condiciones de cumplimiento',
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
        'currency_foreign',
      ],
    })

    await _getResources({
      investment_portfolio: [
        'isin_code_mnemonics&filter[title_class]=Participaciones',
      ],
    })
  })

  watch(
    referenceTabs,
    (val) => {
      if (val) {
        activeTab.value =
          tabs[referenceTabs.value.valuePosition]?.name || tabs[0].name
      }
    },
    { deep: true, immediate: true }
  )

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
        'paper_type_participation',
        'emitter_buyer_portfolio',
      ],
    })
  })
  return {
    headerProps,
    tabs,
    activeTab,
    tabActiveIdx,
    data_information_generic,
  }
}
