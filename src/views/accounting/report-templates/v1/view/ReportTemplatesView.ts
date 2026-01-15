import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'

import { useMainLoader, useUtils } from '@/composables'

import { IReportTemplatesRequest } from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'

import { useReportTemplatesStore } from '@/stores'

const useReportTemplatesView = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()

  const { _getByIdAction } = useReportTemplatesStore('v1')

  const route = useRoute()

  const id = route.params.id as string

  const isLoaded = ref(false)

  const initialData = ref<IReportTemplatesRequest>({
    report_template_id: 0,
    code: '',
    name: '',
    logo: {
      id: 0,
      image_path: '',
      image_url: '',
      app_name: '',
      entity: '',
    },
    signatures: [
      {
        id: 0,
        code: '',
        image_path: '',
        name: '',
        position: '',
        is_active: false,
        user: {
          name: '',
          profile_type: '',
        },
      },
    ],
  })

  const headerProperties = ref({
    title: 'Ver plantilla de reportes',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Contabilidad',
      },
      {
        label: 'Plantilla de reportes',
        route: 'ReportTemplatesList',
      },
      {
        label: 'Ver',
        route: 'ReportTemplatesView',
      },
      {
        label: '',
      },
    ],
  })

  const tabs = ref<ITabs[]>([
    {
      name: 'logo',
      label: 'Logo institucional',
      icon: defaultIconsLucide.image,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'signatures',
      label: 'Firmas',
      icon: defaultIconsLucide.edit,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'inventory',
      label: 'Inventarios de informes',
      icon: defaultIconsLucide.fileWithList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))

  const tabActive = ref(filteredTabs.value[0].name)

  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const loadData = async () => {
    openMainLoader(true)

    const success = await _getByIdAction(id)

    if (success) {
      initialData.value = success
      isLoaded.value = true

      headerProperties.value.breadcrumbs[4].label =
        success.code || 'Código no disponible'
    }

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const nextTab = () => {
    const nextIdx = tabActiveIdx.value + 1

    if (nextIdx < filteredTabs.value.length) {
      tabActiveIdx.value = nextIdx
      tabActive.value = filteredTabs.value[nextIdx].name
    }
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = filteredTabs.value[tabActiveIdx.value].name
  }

  const handleGoToList = () =>
    router.push({ name: 'ReportTemplatesList', query: { reload: 'true' } })

  onMounted(() => loadData())

  return {
    nextTab,
    backTab,
    isLoaded,
    tabActive,
    initialData,
    filteredTabs,
    tabActiveIdx,
    handleGoToList,
    headerProperties,
    defaultIconsLucide,
  }
}

export default useReportTemplatesView
