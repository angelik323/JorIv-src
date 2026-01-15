import { IAccountEquivalenceData } from '@/interfaces/customs'
import { usePucAccountEquivalenceStore } from '@/stores'
import { useMainLoader } from '@/composables'
import { defaultIconsLucide } from '@/utils'
import { ITabs } from '@/interfaces/global'
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import router from '@/router'

const usePucAccountEquivalenceCreate = () => {
  const { _getByIdAction, _updateAction } = usePucAccountEquivalenceStore('v1')
  const { openMainLoader } = useMainLoader()
  const route = useRoute()

  const id = route.params.id as string

  const informationFormRef = ref()

  const initialData = ref<IAccountEquivalenceData | null>(null)

  const headerProperties = {
    title: 'Editar configuración PUC equivalente - fiscal',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad' },
      {
        label: 'Configuración PUC equivalente - fiscal',
        route: 'PucAccountEquivalenceList',
      },
      { label: 'Editar', route: 'PucAccountEquivalenceEdit' },
      { label: id },
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

  const loadData = async () => {
    openMainLoader(true)
    const success = await _getByIdAction(id)

    if (success) initialData.value = success

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const handleSubmitForm = async () => {
    const isValid = await validateForms()
    if (!isValid) return

    openMainLoader(true)

    const formData = informationFormRef.value?.getFormData()

    await _updateAction(formData)

    setTimeout(() => {
      openMainLoader(false)
      handleGoToList()
    }, 1000)
  }

  const handleGoToList = () => {
    router.push({ name: 'PucAccountEquivalenceList' })
  }

  onMounted(() => {
    loadData()
  })

  return {
    tabs,
    tabActive,
    initialData,
    tabActiveIdx,
    handleGoToList,
    headerProperties,
    handleSubmitForm,
    informationFormRef,
  }
}

export default usePucAccountEquivalenceCreate
