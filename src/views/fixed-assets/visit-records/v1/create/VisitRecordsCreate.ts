// vue - quasar
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

// interfaces
import { ITabs } from '@/interfaces/global/Tabs'
import { IVisitRecordForm } from '@/interfaces/customs/fixed-assets/v1/VisitRecords'

// composables
import { useAlert, useMainLoader, useUtils } from '@/composables'
import { useVisitRecordsStore } from '@/stores/fixed-assets/visit-records'

const useVisitRecordsCreate = () => {
  // imports
  const router = useRouter()
  const { defaultIconsLucide } = useUtils()
  const { showAlert } = useAlert()
  const { openMainLoader } = useMainLoader()

  // principal data store
  const { headerPropsDefault } = storeToRefs(useVisitRecordsStore('v1'))
  const { _createVisitRecords } = useVisitRecordsStore('v1')

  // breadcrumb
  const headerPropsCreate = {
    title: `Crear ${headerPropsDefault.value.title.toLowerCase()}`,
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      ...[
        {
          label: 'Crear',
          route: 'VisitRecordsCreate',
        },
      ],
    ],
  }

  // tabs
  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ])
  const [initialTab] = tabs.value
  const tabActive = ref<string>(initialTab.name)
  const tabActiveIdx = ref<number>(tabs.value.indexOf(initialTab))

  // form
  const informationFormRef = ref()
  const data_information_form = ref<IVisitRecordForm | null>(null)

  const validateForms = async () => {
    const validation = await informationFormRef.value?.validateAllForms()

    if (!validation.isValid) {
      showAlert(validation.message, 'error', undefined, 3000)
      return false
    }

    return true
  }

  // actions
  const goToList = () => {
    router.push({ name: 'VisitRecordsList' })
  }

  const makeDataRequest = (): IVisitRecordForm | null => {
    if (!data_information_form.value) return null

    const form = data_information_form.value

    const completedDetails = (form.details || []).filter(
      (detail) =>
        detail.visit_date &&
        detail.responsible_id &&
        detail.visitor_id &&
        detail.visit_reason &&
        detail.physical_condition &&
        detail.asset_rating &&
        detail.recommendations
    )
    return {
      business_trust_id: form.business_trust_id,
      configuration_types_id: form.configuration_types_id,
      configuration_subtypes_id: form.configuration_subtypes_id,
      details: completedDetails,
    }
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)
    const payload = makeDataRequest()
    if (!payload) {
      openMainLoader(false)
      return
    }
    const success = await _createVisitRecords(payload)

    if (success) {
      setTimeout(() => {
        openMainLoader(false)
        goToList()
      }, 5000)
    } else {
      openMainLoader(false)
    }
  }

  return {
    headerPropsCreate,
    tabs,
    tabActive,
    tabActiveIdx,

    informationFormRef,
    data_information_form,

    goToList,
    onSubmit,
  }
}

export default useVisitRecordsCreate
