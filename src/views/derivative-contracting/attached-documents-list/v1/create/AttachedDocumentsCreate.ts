import { ref, onUnmounted } from 'vue'

//Composables
import { useUtils, useGoToUrl, useMainLoader } from '@/composables'

//Stores
import { useAttachedDocumentsStore } from '@/stores/derivative-contracting/attached-documents'

//Interfaces
import { ITabs } from '@/interfaces/global'
import { IAttachedDocumentForm } from '@/interfaces/customs/AttachedDocuments'

const useAttachedDocumentsCreate = () => {
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()

  const { _setDataInformationForm, _createAttachedDocument } =
    useAttachedDocumentsStore('v1')

  const informationFormRef = ref()

  const { openMainLoader } = useMainLoader()

  //data de formularios
  const data_information_form = ref<IAttachedDocumentForm | null>(null)

  const headerProps = {
    title: 'Crear documentos anexos',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contratación derivada' },
      {
        label: 'Definición de documentos anexos',
        route: 'AttachedDocumentsList',
      },
      {
        label: 'Crear',
        route: 'AttachedDocumentsCreate',
      },
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
      required: true,
    },
  ])

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const makeDataRequest = (): IAttachedDocumentForm => {
    const data = data_information_form.value

    const payload: IAttachedDocumentForm = {
      code: data?.code ?? '',
      name: data?.name ?? '',
      stage: data?.stage ?? '',
    }

    return payload
  }

  const validateForms = async () => {
    return informationFormRef?.value?.validateForm()
  }

  const onSubmit = async () => {
    // 1. Validar el formulario
    if (!(await validateForms())) return

    openMainLoader(true)

    // 2. Preparar los datos del formulario
    const payload = makeDataRequest()

    // 3. Crear el documento anexo (POST)
    const success = await _createAttachedDocument(payload)

    // 4. Si es exitoso, redirigir a la lista
    if (success) {
      goToURL('AttachedDocumentsList')
    }

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  onUnmounted(() => {
    _setDataInformationForm(null)
  })

  return {
    data_information_form,
    headerProps,
    defaultIconsLucide,
    tabActive,
    tabActiveIdx,
    tabs,
    informationFormRef,

    onSubmit,
    goToURL,
  }
}

export default useAttachedDocumentsCreate
