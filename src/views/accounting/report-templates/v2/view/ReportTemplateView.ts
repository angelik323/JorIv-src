//Vue - Pinia
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

//Interfaces
import { IReportTemplatePayload } from '@/interfaces/customs/accounting/ReportTemplates'
import { ITabs } from '@/interfaces/global/Tabs'

//Composables
import { useMainLoader } from '@/composables'
import { useGoToUrl } from '@/composables/useGoToUrl'

//Stores
import { useReportTemplatesStore } from '@/stores/accounting/report-templates'

const useReportTemplateView = () => {
  //Desestrcturing stores and refs
  const { headerPropsDefault, report_template_response } = storeToRefs(
    useReportTemplatesStore('v2')
  )
  const { _getShowReportTemplate } = useReportTemplatesStore('v2')

  //Utils
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  //Refs and variables
  const basic_data_form = ref<IReportTemplatePayload | null>(null)
  const informationFormRef = ref()
  const route = useRoute()

  const setFormView = (data: IReportTemplatePayload) => {
    basic_data_form.value = data
  }

  const headerProperties = {
    title: 'Ver plantilla de informes contables',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Ver',
        route: 'ReportTemplateView',
      },
      {
        label: String(route.params.id),
        route: '',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'template',
      label: 'Plantillas',
      icon: '',
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'header',
      label: 'Encabezado',
      icon: '',
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'signature',
      label: 'Firmas',
      icon: '',
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'reports',
      label: 'Asignación de reportes',
      icon: '',
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

  const changeTabAndSubmit = () => {
    if (tabActive.value === 'reports') {
      goToURL('ReportTemplatesList')
    } else if (
      tabActive.value === 'template' ||
      tabActive.value === 'header' ||
      tabActive.value === 'signature'
    ) {
      const nextIdx = tabActiveIdx.value + 1
      if (nextIdx < tabs.value.length) {
        tabActive.value = tabs.value[nextIdx].name
        tabActiveIdx.value = nextIdx
      }
    }
  }

  const goToPreviousTab = () => {
    if (tabActive.value !== 'template') {
      const prevIdx = tabActiveIdx.value - 1
      if (prevIdx >= 0) {
        tabActive.value = tabs.value[prevIdx].name
        tabActiveIdx.value = prevIdx
      }
    }
  }

  onMounted(async () => {
    openMainLoader(true)
    await _getShowReportTemplate(route.params.id as string | number)
    openMainLoader(false)
  })

  watch(
    () => report_template_response.value,
    (val) => {
      if (!val) return
      setFormView(val)
    }
  )

  return {
    headerProperties,
    tabs,
    tabActive,
    tabActiveIdx,
    basic_data_form,
    informationFormRef,
    goToURL,
    changeTabAndSubmit,
    goToPreviousTab,
  }
}

export default useReportTemplateView
