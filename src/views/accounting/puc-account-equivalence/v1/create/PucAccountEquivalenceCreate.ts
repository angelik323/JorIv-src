import { usePucAccountEquivalenceStore } from '@/stores'
import { useMainLoader } from '@/composables'
import { defaultIconsLucide } from '@/utils'
import { ITabs } from '@/interfaces/global'
import router from '@/router'
import { ref } from 'vue'

const usePucAccountEquivalenceCreate = () => {
  const { _createAction } = usePucAccountEquivalenceStore('v1')
  const { openMainLoader } = useMainLoader()

  const informationFormRef = ref()

  const headerProperties = {
    title: 'Crear configuración PUC equivalente - fiscal',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad' },
      {
        label: 'Configuración PUC equivalente - fiscal',
        route: 'PucAccountEquivalenceList',
      },
      { label: 'Crear', route: 'PucAccountEquivalenceCreate' },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const tabActive = ref(tabs.value[0].name)

  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const validateForms = async () => {
    if (tabActive.value === 'information') {
      return await informationFormRef.value?.validateForm()
    }
    return true
  }

  const handleSubmitForm = async () => {
    const isValid = await validateForms()
    if (!isValid) return

    openMainLoader(true)

    const formData = informationFormRef.value?.getFormData()

    await _createAction(formData)

    setTimeout(() => {
      openMainLoader(false)
      handleGoToList()
    }, 1000)
  }

  const handleGoToList = () => {
    router.push({ name: 'PucAccountEquivalenceList' })
  }

  return {
    tabs,
    tabActive,
    tabActiveIdx,
    handleGoToList,
    headerProperties,
    handleSubmitForm,
    informationFormRef,
  }
}

export default usePucAccountEquivalenceCreate
