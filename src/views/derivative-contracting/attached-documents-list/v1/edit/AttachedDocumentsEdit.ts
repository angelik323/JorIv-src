import { ref, onUnmounted, onBeforeMount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

//Composables
import { useUtils, useGoToUrl, useMainLoader } from '@/composables'

//Stores
import { useAttachedDocumentsStore } from '@/stores/derivative-contracting/attached-documents'

//Interfaces
import { ITabs } from '@/interfaces/global'
import { IAttachedDocumentForm } from '@/interfaces/customs/AttachedDocuments'

const useAttachedDocumentsEdit = () => {
  const route = useRoute()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()

  // Capturar el ID del documento desde los parámetros de la ruta
  const documentId = route.params.id

  //data de formularios
  const data_information_form = ref<IAttachedDocumentForm | null>(null)

  const {
    _setDataInformationForm,
    _updateAttachedDocument,
    _getAttachedDocumentById,
    _clearData,
  } = useAttachedDocumentsStore('v1')

  const { attached_documents_response } = storeToRefs(
    useAttachedDocumentsStore('v1')
  )

  const informationFormRef = ref()

  const { openMainLoader } = useMainLoader()

  const headerProps = {
    title: 'Editar documentos anexos',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contratación derivada' },
      {
        label: 'Definición de documentos anexos',
        route: 'AttachedDocumentsList',
      },
      {
        label: 'Editar',
        route: 'AttachedDocumentsEdit',
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

  const setFormEdit = (data: IAttachedDocumentForm) => {
    const { code, name, stage } = data

    data_information_form.value = {
      code: code?.toString() ?? null,
      name: name ?? null,
      stage: stage ?? null,
    }
  }

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

    // 3. Actualizar el documento anexo (PUT)
    const success = await _updateAttachedDocument(Number(documentId), payload)

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

  onBeforeMount(async () => {
    _clearData()
    openMainLoader(true)
    await _getAttachedDocumentById(Number(documentId))
    openMainLoader(false)
  })

  watch(
    () => attached_documents_response.value,
    (val) => {
      if (!val) return
      setFormEdit(val)
    }
  )

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

export default useAttachedDocumentsEdit
