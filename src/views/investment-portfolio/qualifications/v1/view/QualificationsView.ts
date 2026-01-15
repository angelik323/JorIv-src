// Vue - pinia
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  IQualificationsForm,
  IQualificationsResponse,
} from '@/interfaces/customs/investment-portfolio/Qualifications'

// Composables
import { useMainLoader, useUtils, useGoToUrl } from '@/composables'

// Stores
import { useQualificationsStore } from '@/stores/investment-portfolio/qualifications'

const useQualificationsView = () => {
  const { _getByIdQualifications, _clearData } = useQualificationsStore('v1')
  const { headerPropsDefault, qualifications_response } = storeToRefs(
    useQualificationsStore('v1')
  )

  const { defaultIconsLucide } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const router = useRouter()
  const id = Number(router.currentRoute.value.params.id)

  // Data de formularios
  const information_form = ref<IQualificationsForm | null>(null)

  // Referencias a formularios
  const informationFormRef = ref()

  const headerProperties = {
    title: 'Ver calificación',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Ver',
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

  const setFormView = (data: IQualificationsResponse) => {
    information_form.value = {
      id: data.id,
      action_rating: data.action_rating,
      rating_code: data.rating_code,
      group: data.group,
      history_qualification: data.history_qualification,
    }
  }

  onMounted(async () => {
    _clearData()
    openMainLoader(true)
    await _getByIdQualifications(id)
    openMainLoader(false)
  })

  watch(
    () => qualifications_response.value,
    (val) => {
      if (!val) return
      setFormView(val)
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
  }
}

export default useQualificationsView
