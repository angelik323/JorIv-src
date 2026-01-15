// vue
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

// interfaces
import { ITabs } from '@/interfaces/global'
import { IVisitRecordForm } from '@/interfaces/customs/fixed-assets/v1/VisitRecords'

// composables
import { useAlert, useMainLoader, useUtils } from '@/composables'

// stores
import { useVisitRecordsStore } from '@/stores/fixed-assets/visit-records'

const useVisitRecordsEdit = () => {
  // imports
  const { showAlert } = useAlert()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()

  // principal data store
  const { headerPropsDefault } = storeToRefs(useVisitRecordsStore('v1'))
  const { _clearData, _getVisitRecordsById, _updateVisitRecords } =
    useVisitRecordsStore('v1')

  // router
  const router = useRouter()
  const route = useRoute()
  const visitRecordId = +route.params.id

  // breadcrumb
  const headerPropsCreate = {
    title: `Editar ${headerPropsDefault.value.title.toLowerCase()}`,
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      ...[
        {
          label: 'Editar',
          route: 'VisitRecordsEdit',
          params: { id: visitRecordId },
        },
      ],
    ],
  }

  // tabs
  const tabs = ref<ITabs[]>([
    {
      name: 'basic_data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])
  const [initialTab] = tabs.value
  const tabActive = ref(initialTab.name)
  const tabActiveIdx = ref(tabs.value.indexOf(initialTab))

  // form
  const informationFormRef = ref()
  const data_information_form = ref<IVisitRecordForm | null>(null)
  const original_data = ref<IVisitRecordForm | null>(null)

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
      id: visitRecordId,
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
    const success = await _updateVisitRecords(payload)

    if (success) {
      setTimeout(() => {
        openMainLoader(false)
        goToList()
      }, 5000)
    } else {
      openMainLoader(false)
    }
  }

  // lifecycle
  onMounted(async () => {
    if (!visitRecordId) return
    openMainLoader(true)

    const response = await _getVisitRecordsById(visitRecordId)
    if (response) {
      data_information_form.value = response as IVisitRecordForm
      original_data.value = response as IVisitRecordForm
    }
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  })

  onBeforeUnmount(() => {
    _clearData()
  })

  return {
    headerPropsCreate,

    tabs,
    tabActive,
    tabActiveIdx,

    informationFormRef,
    data_information_form,

    onSubmit,
    goToList,
  }
}

export default useVisitRecordsEdit
