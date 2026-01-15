import { useMainLoader } from '@/composables'
import { useIssuersCounterpartiesStore } from '@/stores'
import { defaultIconsLucide } from '@/utils'
import { storeToRefs } from 'pinia'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const useIssuersCounterpartiesEdit = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()

  const { headerPropsDefault, data_issuers_counterparties_form } = storeToRefs(
    useIssuersCounterpartiesStore('v1')
  )
  const { _getIssuersCounterpartiesByID, _updateAction } =
    useIssuersCounterpartiesStore('v1')

  const issuersCounterpartiesId = router.currentRoute.value.params.id

  const headerProperties = {
    ...headerPropsDefault.value,
    title: 'Editar emisores y contrapartes',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Editar',
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

  const onSubmit = async () => {
    if (!data_issuers_counterparties_form.value) return

    openMainLoader(true)
    if (
      await _updateAction(
        issuersCounterpartiesId.toString(),
        data_issuers_counterparties_form.value
      )
    ) {
      router.push({ name: 'IssuersCounterpartiesList' })
    }

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
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
    onSubmit,
  }
}

export default useIssuersCounterpartiesEdit
