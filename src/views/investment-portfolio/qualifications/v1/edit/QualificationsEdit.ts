// Vue - pinia
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  IQualificationsForm,
  IQualificationsResponse,
  IQualificationsToCreate,
} from '@/interfaces/customs/investment-portfolio/Qualifications'

// Composables
import { useMainLoader, useUtils, useGoToUrl } from '@/composables'

// Stores
import { useQualificationsStore } from '@/stores/investment-portfolio/qualifications'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useQualificationsEdit = () => {
  const { _updateQualifications, _getByIdQualifications, _clearData } =
    useQualificationsStore('v1')
  const { headerPropsDefault, qualifications_response } = storeToRefs(
    useQualificationsStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { defaultIconsLucide, cleanEmptyFields } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const router = useRouter()

  const id = Number(router.currentRoute.value.params.id)

  // Data de formularios
  const information_form = ref<IQualificationsForm | null>(null)

  // Referencias a formularios
  const informationFormRef = ref()

  const headerProperties = {
    title: 'Editar calificación',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Editar',
        route: 'QualificationsEdit',
      },
      {
        label: id.toString(),
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

  const setFormEdit = (data: IQualificationsResponse) => {
    // Seteo del formulario
    information_form.value = {
      id: data.id,
      action_rating: data.action_rating,
      group: data.group,
      rating_code: data.rating_code,
    }
  }

  const validateForms = async () => {
    let valid: boolean = false
    const forms = [informationFormRef]

    if (tabActiveIdx >= 0 && tabActiveIdx < forms.length) {
      valid = (await forms[tabActiveIdx]?.value?.validateForm()) ?? false
    }
    return valid
  }

  // Information form request
  const makeBaseInfoRequest = (data: IQualificationsForm | null) => {
    if (!data) return {}

    const request: IQualificationsToCreate = {
      action_rating: data.action_rating ?? '',
      rating_code: data.rating_code ?? '',
      group: data.group ?? null,
    }

    return cleanEmptyFields(request)
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
    const success = await _updateQualifications(payload, id)
    if (success) {
      router.push({ name: 'QualificationsList' })
    }

    openMainLoader(false)
  }

  const keys = {
    investment_portfolio: ['qualification'],
  }

  onMounted(async () => {
    _clearData()
    openMainLoader(true)
    await _getByIdQualifications(id)
    _getResources(keys)
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  watch(
    () => qualifications_response.value,
    (val) => {
      if (!val) return
      setFormEdit(val)
    }
  )

  return {
    qualifications_response,
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

export default useQualificationsEdit
