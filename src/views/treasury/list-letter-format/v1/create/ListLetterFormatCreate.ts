import { onBeforeMount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMainLoader } from '@/composables'
import { useLetterFormatStore, useResourceManagerStore } from '@/stores'
import { ICreateLetterFormatPayload } from '@/interfaces/customs'

const useLetterFormatCreate = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { _createLetterFormat } = useLetterFormatStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const key = ['banks', 'letter_format_variables']

  const letterFormatForm = ref()
  const alertModalRef = ref()

  const headerProps = {
    title: 'Crear formato de cartas',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Tesorería', route: '' },
      { label: 'Formato de cartas', route: 'ListLetterFormatList' },
      { label: 'Crear', route: 'ListLetterFormatCreate' },
    ],
  }

  const validateForms = async () => await letterFormatForm.value?.validate?.()

  const handleFormUpdate = () => {
    if (letterFormatForm.value?.getFormData) {
      return letterFormatForm.value.getFormData()
    }
    return null
  }

  const onSubmit = async () => {
    if (await validateForms()) {
      openMainLoader(true)
      const updatedModel = handleFormUpdate()

      const payload: ICreateLetterFormatPayload = {
        name: updatedModel.name?.trim() ?? '',
        bank_id: Number(updatedModel.bank_id ?? 0),
        format_definition: updatedModel.format_definition,
        format_definition_html: updatedModel.format_definition_html,
        format_definition_bottom: updatedModel.format_definition_bottom,
        format_definition_bottom_html:
          updatedModel.format_definition_bottom_html,
        table: updatedModel.table ?? null,
        table_html: updatedModel.table_html,
        status_id: 1,
      }

      const created = await _createLetterFormat(payload)
      setTimeout(() => openMainLoader(false), 1000)

      if (created) {
        router.push({ name: 'ListLetterFormatList' })
      }
    }
  }

  const isFormValid = ref(true)

  onMounted(async () => {
    await _getResources({ treasury: key }, '', 'v2')
  })

  onBeforeMount(async () => {
    await _resetKeys({ treasury: key })
  })

  return {
    headerProps,
    alertModalRef,
    letterFormatForm,
    isFormValid,
    onSubmit,
  }
}

export default useLetterFormatCreate
