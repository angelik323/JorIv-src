// Vue - Pinia
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ITabs } from '@/interfaces/global'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useBusinessLineStore } from '@/stores/fics/business-line'

const useBusinessLineCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()

  const { _createBusinessLine, _cleanData } = useBusinessLineStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { typeName } = storeToRefs(useBusinessLineStore('v1'))

  const businessLineForm = ref()

  const keys = {
    fics: ['status_business_line'],
  }

  const headerProps = {
    title: `Crear ${typeName.value}`,
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Líneas de negocios y tipos de participación',
        route: 'BusinessLineList',
      },
      {
        label: `Crear ${typeName.value}`,
        route: 'BusinessLineCreate',
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const validateForms = async () => {
    return businessLineForm?.value?.validateForm()
  }

  const onSubmit = async () => {
    if (await validateForms()) {
      openMainLoader(true)
      const payload = {
        ...businessLineForm.value.getFormData(),
        consolidated_participation_type: businessLineForm.value
          .checkParticipationType
          ? businessLineForm.value.checkParticipationType
          : false,
      }
      if (await _createBusinessLine(payload)) handleGoToList()

      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }
  }

  const handleGoToList = () =>
    goToURL('BusinessLineList', undefined, { reload: true })

  onMounted(async () => {
    openMainLoader(true)

    await _getResources(keys)

    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
    _cleanData()
  })

  watch(
    () => typeName,
    () => (headerProps.title = `Crear ${typeName.value}`)
  )

  return {
    tabs,
    onSubmit,
    tabActive,
    headerProps,
    tabActiveIdx,
    handleGoToList,
    businessLineForm,
  }
}

export default useBusinessLineCreate
