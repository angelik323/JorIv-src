import { onBeforeMount, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { defaultIcons } from '@/utils'
import { useMainLoader } from '@/composables'
import { ITabs } from '@/interfaces/global'
import { useDefinitionQuotaCounterpartPermitStore } from '@/stores'

const useDefinitionQuotasCounterpartPermitsView = () => {
  const route = useRoute()

  const definitionQuotaCounterpartPermitId = +route.params.id

  const { openMainLoader } = useMainLoader()

  const { data_view } = storeToRefs(
    useDefinitionQuotaCounterpartPermitStore('v1')
  )

  const { _setDataForm, _getByIdAction } =
    useDefinitionQuotaCounterpartPermitStore('v1')

  const headerProps = {
    title: 'Ver cupos y permisos contraparte',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Tesorería',
        route: '',
      },
      {
        label: 'Definición cupos y permisos contraparte',
        route: 'DefinitionQuotasCounterpartPermitsList',
      },
      {
        label: 'Ver',
        route: '',
      },
      {
        label: `${definitionQuotaCounterpartPermitId}`,
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos Básicos',
      icon: defaultIcons.bulletList,
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

  onUnmounted(async () => {
    _setDataForm(null)
  })

  onBeforeMount(() => {
    openMainLoader(true)

    _getByIdAction(definitionQuotaCounterpartPermitId).finally(() => {
      openMainLoader(false)
    })
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    data_view,
  }
}

export default useDefinitionQuotasCounterpartPermitsView
