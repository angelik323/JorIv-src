//Vue - Pinia
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

//Interfaces
import { IReportTemplatePayload } from '@/interfaces/customs/accounting/ReportTemplates'
import { ITabs } from '@/interfaces/global/Tabs'

//Composables
import { useMainLoader } from '@/composables'
import { useGoToUrl } from '@/composables/useGoToUrl'

//Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useReportTemplatesStore } from '@/stores/accounting/report-templates/'

const useReportTemplateCreate = () => {
  //Desestructuring and logic
  const { headerPropsDefault } = storeToRefs(useReportTemplatesStore('v2'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _createReportTemplate } = useReportTemplatesStore('v2')
  //Models and refs
  const basic_data_form = ref<IReportTemplatePayload | null>(null)
  const informationFormRef = ref()

  const makeDataRequest = (): IReportTemplatePayload => {
    return basic_data_form.value as IReportTemplatePayload
  }

  // Methods
  const validateForms = async () => {
    let valid = false
    const forms = [informationFormRef]

    if (tabActiveIdx.value >= 0 && tabActiveIdx.value < forms.length) {
      const form = forms[tabActiveIdx.value]?.value
      if (form && typeof form.validateForm === 'function') {
        const result = await form.validateForm()
        valid = !!result
      } else {
        valid = false
      }
    }
    return valid
  }

  const headerProperties = {
    title: 'Crear plantilla de informes contables',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Crear',
        route: 'ReportTemplateCreate',
      },
    ],
  }
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
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

  const onSubmit = async () => {
    if (!(await validateForms())) return
    openMainLoader(true)
    const payload = makeDataRequest()
    if (!(await _createReportTemplate(payload))) {
      openMainLoader(false)
      goToURL('ReportTemplatesList')
    }
    openMainLoader(false)
  }

  const changeTabAndSubmit = () => {
    if (tabActive.value === 'reports') {
      onSubmit()
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

  const keysAccounting = {
    accounting: [
      'report_modules',
      'presentation_business_report_headers',
      'responsible_report_signatures',
      'type_report_signatures',
      'report_template_signatures',
      'report_template_logos',
    ],
  }
  onMounted(async () => {
    await _getResources(keysAccounting, '', 'v2')
  })

  onBeforeUnmount(() => {
    _resetKeys(keysAccounting)
  })

  return {
    headerProperties,
    tabs,
    tabActive,
    tabActiveIdx,
    basic_data_form,
    informationFormRef,
    goToURL,
    onSubmit,
    changeTabAndSubmit,
    goToPreviousTab,
  }
}

export default useReportTemplateCreate
