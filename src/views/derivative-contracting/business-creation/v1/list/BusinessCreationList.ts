// Vue
import { ref, onBeforeMount, onBeforeUnmount } from 'vue'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  IBusinessCreationForm,
  IBusinessCreationFormPayload,
} from '@/interfaces/customs/derivative-contracting/IBusinessCreation'

// Composables
import { useMainLoader, useUtils } from '@/composables'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useBusinessCreationStore } from '@/stores/derivative-contracting/business-creation'

const BusinessCreationList = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const store = useBusinessCreationStore('v1')
  const { _createAction } = store

  const keys = {
    trust_business: ['business_trusts_derivate_contracting '],
  }

  const informationFormRef = ref()
  const basicDataForm = ref<IBusinessCreationForm | null>(null)

  const headerProps = {
    title: 'Creación de negocios',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Contratación derivada',
      },
      {
        label: 'Creación de negocios',
        route: 'BusinessCreationList',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'basic_data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: true,
    },
  ])

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const validateForm = async () => {
    return (await informationFormRef.value?.validateForm()) ?? false
  }

  const makeDataRequest = (
    formData: IBusinessCreationForm
  ): IBusinessCreationFormPayload | null => {
    if (!formData.business_trusts?.id) {
      return null
    }

    return {
      business_trusts_id: formData.business_trusts.id,
      manage_budget: formData.manage_budget,
      manage_proyects: formData.manage_proyects,
      manage_works_structures: formData.manage_works_structures,
      work_plan_business: formData.work_plan_business
        .filter((item) => item.plan !== null)
        .map((item) => item.plan as number),
    }
  }

  const onSubmit = async () => {
    if (!(await validateForm())) return

    const formData = informationFormRef.value?.getFormData()
    if (!formData) return

    const payload = makeDataRequest(formData)
    if (!payload) return

    openMainLoader(true)
    const success = await _createAction(payload)
    openMainLoader(false)

    if (success) {
      informationFormRef.value?.resetForm()
    }
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    await _getResources(keys)
    await _getResources(
      { derivative_contracting: ['work_plan'] },
      'filter[status_id]=1'
    )
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    informationFormRef,
    basicDataForm,

    onSubmit,
  }
}

export default BusinessCreationList
