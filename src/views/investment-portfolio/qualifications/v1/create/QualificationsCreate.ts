// Vue - pinia - moment
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  IQualificationsForm,
  IQualificationsToCreate,
} from '@/interfaces/customs/investment-portfolio/Qualifications'

// Composables
import { useMainLoader, useUtils, useGoToUrl } from '@/composables'

// Store
import { useQualificationsStore } from '@/stores/investment-portfolio/qualifications'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useQualificationsCreate = () => {
  const { _createQualifications, _clearData } = useQualificationsStore('v1')
  const { headerPropsDefault } = storeToRefs(useQualificationsStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide, cleanEmptyFields } = useUtils()
  const { goToURL } = useGoToUrl()

  // Data de formularios
  const information_form = ref<IQualificationsForm | null>(null)

  // Referencias a formularios
  const informationFormRef = ref()

  const headerProperties = {
    title: 'Crear calificación',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Crear',
        route: 'QualificationsCreate',
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'information_form',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = tabs.findIndex((tab) => tab.name === tabActive)

  const validateForms = async () => {
    let valid = false
    const forms = [informationFormRef]

    if (tabActiveIdx >= 0 && tabActiveIdx < forms.length) {
      try {
        valid = (await forms[tabActiveIdx]?.value?.validateForm()) ?? false
      } catch {
        valid = false
      }
    }
    return valid
  }

  // Information form
  const makeBaseInfoRequest = (data: IQualificationsForm | null) => {
    if (!data) return {}

    const request: IQualificationsToCreate = {
      action_rating: data.action_rating ?? '',
      rating_code: data.rating_code ?? '',
      group: data.group ?? null,
    }

    return cleanEmptyFields(request, true)
  }

  const makeDataRequest = () => {
    const apiRequestBody: Partial<IQualificationsToCreate> = {
      ...makeBaseInfoRequest(information_form.value),
    }

    return apiRequestBody
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)

    const payload = makeDataRequest()
    const success = await _createQualifications(payload)

    if (success) {
      goToURL('QualificationsList')
    }

    openMainLoader(false)
  }

  const keys = {
    investment_portfolio: ['qualification'],
  }

  onMounted(async () => {
    _clearData()
    openMainLoader(true)
    await _getResources(keys)
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  return {
    information_form,
    informationFormRef,
    headerProperties,
    tabs,
    tabActive,
    tabActiveIdx,
    goToURL,
    onSubmit,
  }
}

export default useQualificationsCreate
