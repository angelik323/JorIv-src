// vue - pinia - router
import { onBeforeMount, onBeforeUnmount, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

// interfaces
import { ITabs } from '@/interfaces/global'
import { IVisitRecordForm } from '@/interfaces/customs/fixed-assets/v1/VisitRecords'

// composables
import { useMainLoader, useUtils } from '@/composables'

// stores
import { useVisitRecordsStore } from '@/stores/fixed-assets/visit-records'

const useVisitRecordsRead = () => {
  // imports
  const { defaultIconsLucide } = useUtils()
  const { openMainLoader } = useMainLoader()

  // principal data store
  const { headerPropsDefault } = storeToRefs(useVisitRecordsStore('v1'))
  const { _clearData, _getVisitRecordsById } = useVisitRecordsStore('v1')

  // router
  const router = useRouter()
  const route = useRoute()
  const visitRecordsId = +route.params.id

  // breadcrumb
  const headerPropsRead = {
    title: `Ver ${headerPropsDefault.value.title.toLowerCase()}`,
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: `${visitRecordsId}`,
        route: 'VisitRecordsRead',
      },
    ],
  }

  // tabs
  const tabs = ref<ITabs[]>([
    {
      name: 'basic_data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])
  const [initialTab] = tabs.value
  const tabActive = ref(initialTab.name)
  const tabActiveIdx = ref(tabs.value.indexOf(initialTab))

  // form
  const informationFormRef = ref()
  const data_information_form = ref<IVisitRecordForm | null>(null)

  // actions
  const goToList = () => {
    router.push({ name: 'VisitRecordsList' })
  }

  // lifecycle
  onBeforeMount(async () => {
    if (!visitRecordsId) return goToList()
    openMainLoader(true)

    const response = await _getVisitRecordsById(visitRecordsId)
    data_information_form.value = response as IVisitRecordForm

    openMainLoader(false)
  })
  onBeforeUnmount(() => {
    _clearData()
  })

  return {
    headerPropsRead,
    tabs,
    tabActive,
    tabActiveIdx,

    informationFormRef,
    data_information_form,

    goToList,
  }
}

export default useVisitRecordsRead
