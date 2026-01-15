//Vue - Pinia
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

//Interfaces
import { ITabs } from '@/interfaces/global'

//Composables
import { useMainLoader } from '@/composables'
import { useGoToUrl } from '@/composables/useGoToUrl'

//Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useReportTemplatesStore } from '@/stores/accounting/report-templates/'

const useReportTemplateImages = () => {
  //Desestrcturing stores and refs
  const { headerPropsDefault } = storeToRefs(useReportTemplatesStore('v2'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  // Header properties
  const headerProperties = {
    title: 'Cargues logos y firmas',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Imagenes',
        router: 'ReportTemplateImages',
      },
    ],
  }

  //Utils and functions
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  //Tabs and properties
  const tabs = ref<ITabs[]>([
    {
      name: 'logo',
      label: 'Cargue logos',
      icon: '',
      outlined: true,
      disable: false,
      show: true,
      required: true,
    },
    {
      name: 'signature',
      label: 'Cargue firmas',
      icon: '',
      outlined: true,
      disable: false,
      show: true,
      required: true,
    },
  ])

  //Tab control
  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  // Change tab function
  const changeTab = () => {
    if (tabActive.value === 'logo') {
      tabActive.value = 'signature'
    } else {
      goToURL('ReportTemplatesList')
    }
  }

  // Lifecycle hooks
  onMounted(async () => {
    await _getResources({
      user: ['users'],
    })
  })

  onBeforeUnmount(() => {
    _resetKeys({
      user: ['users'],
    })
  })

  return {
    //Props and refs
    headerProperties,
    tabs,
    tabActive,
    tabActiveIdx,

    //Functions
    openMainLoader,
    changeTab,
    goToURL,
  }
}

export default useReportTemplateImages
