import { useMainLoader } from '@/composables'
import { useIssuersCounterpartiesStore } from '@/stores'
import { defaultIconsLucide } from '@/utils'
import { storeToRefs } from 'pinia'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const useIssuersCounterpartiesView = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()

  const { headerPropsDefault } = storeToRefs(
    useIssuersCounterpartiesStore('v1')
  )
  const { _getIssuersCounterpartiesByID } = useIssuersCounterpartiesStore('v1')

  const issuersCounterpartiesId = router.currentRoute.value.params.id

  const headerProperties = {
    ...headerPropsDefault.value,
    title: 'Ver emisores y contrapartes',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Ver',
        route: 'IssuersCounterpartiesList',
      },
      {
        label: issuersCounterpartiesId.toString(),
      },
    ],
  }

  const tabs = reactive([
    {
      name: 'InformationForm',
      label: 'Datos Básicos',
      icon: defaultIconsLucide.listBulleted,
      outlined: true,
      disable: false,
      show: true,
      required: true,
    },
  ])
  const activeTab = ref(tabs[0].name)
  const tabActiveIdx = ref(
    tabs.findIndex((tab) => tab.name === activeTab.value)
  )

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  onMounted(async () => {
    if (issuersCounterpartiesId) {
      openMainLoader(true)
      await _getIssuersCounterpartiesByID(
        Number(issuersCounterpartiesId.toString())
      )
      openMainLoader(false)
    }
  })

  return {
    headerProperties,
    tabs,
    activeTab,
    tabActiveIdx,
    handlerGoTo,
  }
}

export default useIssuersCounterpartiesView
