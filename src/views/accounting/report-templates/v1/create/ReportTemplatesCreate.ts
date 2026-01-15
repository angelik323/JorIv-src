import { computed, ref } from 'vue'
import router from '@/router'

import { useMainLoader, useUtils } from '@/composables'

import { ISignatureTable, IReportTemplatesRequest } from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'

import { useReportTemplatesStore } from '@/stores'

const useReportTemplatesCreate = () => {
  const { _createAction } = useReportTemplatesStore('v1')
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()

  const informationFormRef = ref()

  const headerProperties = {
    title: 'Crear plantilla de reportes',
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
        label: 'Crear',
        route: 'ReportTemplatesCreate',
      },
    ],
  }

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

  const handleSubmitForm = async () => {
    const { logo, signatures, inventory } =
      informationFormRef.value.getDataTables()

    const payload: IReportTemplatesRequest = {
      name: inventory[0].name_report,
      ...(logo.length > 0 && {
        logo: {
          id: logo[0].logo_id,
          image_path: logo[0].image_path,
          app_name: logo[0].app_name,
          entity: logo[0].entity,
          is_validated: true,
        },
      }),
      ...(signatures.length > 0 && {
        signatures: signatures.map((item: ISignatureTable) => ({
          id: item.signature_id,
          image_path: item.image_path,
          is_active: item.is_active,
          is_validated: true,
        })),
      }),
    }

    openMainLoader(true)

    const success = await _createAction(payload)

    if (success) handleGoToList()

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const handleGoToList = () =>
    router.push({ name: 'ReportTemplatesList', query: { reload: 'true' } })

  const isValid = computed(() =>
    informationFormRef.value?.isCurrentTableComplete()
  )

  return {
    nextTab,
    backTab,
    isValid,
    tabActive,
    filteredTabs,
    tabActiveIdx,
    handleGoToList,
    handleSubmitForm,
    headerProperties,
    informationFormRef,
    defaultIconsLucide,
  }
}

export default useReportTemplatesCreate
