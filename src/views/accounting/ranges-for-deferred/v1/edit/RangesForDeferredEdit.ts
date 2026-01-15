//Vue - Pinia
import { ref } from 'vue'
import { useRoute } from 'vue-router'
//Router
import router from '@/router'
//Composables
import { useUtils } from '@/composables'
//Interfaces
import { ITabs } from '@/interfaces/global'

const useRangesForDeferredEdit = () => {
  const route = useRoute()

  const id = route.params.id as string

  const informationFormRef = ref()
  const { defaultIconsLucide } = useUtils()
  const headerProperties = {
    id,
    title: 'Editar rango para diferidos y deterioros',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Contabilidad',
      },
      {
        label: 'Rango para diferidos y deterioros',
        route: 'RangesForDeferredList',
      },
      {
        label: 'Editar',
        route: 'RangesForDeferredEdit',
      },
      {
        label: id,
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
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

  const handleGoToList = () =>
    router.push({ name: 'RangesForDeferredList', query: { reload: 'true' } })

  return {
    tabs,
    tabActive,
    tabActiveIdx,
    headerProperties,
    informationFormRef,

    handleGoToList,
  }
}

export default useRangesForDeferredEdit
