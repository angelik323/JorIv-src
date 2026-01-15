// Vue - pinia
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { WriteActionType } from '@/interfaces/global'
import { ICertifiedParametersInformationForm } from '@/interfaces/customs/normative/CertifiedParameters'

// Composables
import { useUtils } from '@/composables/useUtils'

// Stores
import { useNormativeResourceStore } from '@/stores/resources-manager/normative'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useInformationForm = (
  props: {
    action: WriteActionType
    data: ICertifiedParametersInformationForm | null
  },
  emit: Function
) => {
  const { certificate_types, person_types } = storeToRefs(
    useNormativeResourceStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { defaultIconsLucide, isEmptyOrZero } = useUtils()

  const fixedVariablesModalRef = ref()
  const fixedVariablesRef = ref()

  const formElementRef = ref()
  const uploadVariablesRef = ref()
  const uploadVariablesModalRef = ref()

  const initialModelsValues: ICertifiedParametersInformationForm = {
    certificate_type_id: null,
    name: null,
    person_type_id: null,
    html_header: null,
    html_body: null,
    html_footer: null,
    logo: null,
    firma: null,
    marca_agua: null,
    html_content: null,
    generation_date: null,
  }

  const uploadedFiles = ref<{
    logo: File | null
    firma: File | null
    marca_agua: File | null
  }>({
    logo: null,
    firma: null,
    marca_agua: null,
  })

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const _setValueModel = () => {
    if (!props.data) return
    Object.assign(models.value, props.data)
  }

  watch(
    () => props.data,
    (val) => {
      if (!val) return
      _setValueModel()
    },
    { deep: true, immediate: true }
  )

  watch(
    models,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  const keyFixedVariables = {
    normative: ['fixed_variables'],
  }

  watch(
    () => models.value.certificate_type_id,
    async (newVal) => {
      if (!newVal) return

      await _getResources(
        keyFixedVariables,
        `filter[certificate_type]=${newVal}`
      )
    }
  )

  onMounted(() => {
    if (
      models.value.generation_date === null ||
      models.value.generation_date === ''
    ) {
      models.value.generation_date = useUtils().formatDate('', 'YYYY-MM-DD')
    }
  })

  onBeforeUnmount(() => {
    _resetKeys(keyFixedVariables)
  })

  const openFixedVariablesModal = () => {
    fixedVariablesModalRef.value?.openModal()
  }

  const handleAddFixedVariable = (variable: { code: string; name: string }) => {
    const token = variable.code

    const qEditor = document.querySelector(
      '.q-editor__content'
    ) as HTMLElement | null

    if (!qEditor) {
      const current = models.value.html_content || ''
      models.value.html_content = current + token
      fixedVariablesModalRef.value?.closeModal()
      return
    }

    qEditor.focus()

    const selection = window.getSelection()

    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)

      const textNode = document.createTextNode(token)

      range.deleteContents()
      range.insertNode(textNode)

      range.setStartAfter(textNode)
      range.setEndAfter(textNode)

      selection.removeAllRanges()
      selection.addRange(range)

      models.value.html_content = qEditor.innerHTML
    } else {
      qEditor.innerHTML += token
      models.value.html_content = qEditor.innerHTML
    }

    fixedVariablesModalRef.value?.closeModal()
  }
  const handleEditorUpdate = (value: string) => {
    models.value.html_content = value
  }

  const openUploadVariablesModal = () => {
    uploadVariablesModalRef.value?.openModal()
  }

  const cleanUploadVariablesModal = () => {
    if (uploadVariablesRef.value) {
      uploadVariablesRef.value.deleteSignatureFiles?.()
      uploadVariablesRef.value.deleteWaterMarkFiles?.()
      uploadVariablesRef.value.deleteLogoFiles?.()
    }
  }

  const handleConfirmUpload = () => {
    const isValid = uploadVariablesRef.value?.validateForm()

    if (!isValid) {
      return
    }

    const files = uploadVariablesRef.value?.getFiles()
    if (!files) return

    uploadedFiles.value = {
      logo: files.logo || null,
      firma: files.signature || null,
      marca_agua: files.watermark || null,
    }

    cleanUploadVariablesModal()
    uploadVariablesModalRef.value?.closeModal()
  }

  const getUploadFiles = () => {
    return {
      logo: uploadedFiles.value.logo,
      firma: uploadedFiles.value.firma,
      marca_agua: uploadedFiles.value.marca_agua,
    }
  }

  return {
    defaultIconsLucide,
    formElementRef,
    models,
    handleEditorUpdate,
    uploadVariablesRef,
    uploadVariablesModalRef,
    openUploadVariablesModal,
    cleanUploadVariablesModal,
    handleConfirmUpload,
    certificate_types,
    person_types,
    getUploadFiles,
    fixedVariablesModalRef,
    fixedVariablesRef,
    handleAddFixedVariable,
    openFixedVariablesModal,
  }
}

export default useInformationForm
