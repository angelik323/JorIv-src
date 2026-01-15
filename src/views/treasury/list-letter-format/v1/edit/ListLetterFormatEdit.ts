import { ref, onMounted, onBeforeMount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMainLoader, useUtils } from '@/composables'
import { useLetterFormatStore, useResourceManagerStore } from '@/stores'
import { ILetterFormat, UpdateLetterFormatPayload } from '@/interfaces/customs'

const useLetterFormatEdit = () => {
  const router = useRouter()
  const route = useRoute()
  const { openMainLoader } = useMainLoader()
  const { _getLetterFormat, _updateLetterFormat } = useLetterFormatStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const key = ['banks', 'letter_format_variables', 'letter_format_statuses']

  const letterFormatForm = ref()
  const alertModalRef = ref()
  const model = ref<ILetterFormat | null>(null)

  const headerProps = {
    title: 'Editar formato de cartas',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Tesorería', route: '' },
      { label: 'Formato de cartas', route: 'ListLetterFormatList' },
      { label: 'Editar', route: '' },
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

      const updatedModel = handleFormUpdate() as ILetterFormat

      const payload: UpdateLetterFormatPayload = {
        name: (updatedModel.name ?? updatedModel.format_name ?? '').trim(),
        bank_id: Number(updatedModel.bank_id ?? 0),
        format_definition:
          updatedModel.format_definition ?? updatedModel.format ?? '',
        format_definition_bottom: updatedModel.format_definition_bottom ?? '',
        status_id: updatedModel.status?.id ?? 1,
        table: updatedModel.table ?? null,
      }

      const updated = await _updateLetterFormat(
        model.value!.id!,
        payload as unknown as Partial<ILetterFormat>
      )

      setTimeout(() => openMainLoader(false), 1000)
      if (updated) router.push({ name: 'ListLetterFormatList' })
    }
  }

  const fetchInitialData = async () => {
    const id = Number(route.params.id)
    if (id) {
      openMainLoader(true)

      const response = await _getLetterFormat(id)

      if (response) {
        const plainTop = useUtils().htmlToPlain(response.format_definition)
        const plainBottom = useUtils().htmlToPlain(
          response.format_definition_bottom
        )

        model.value = {
          id: response.id,
          name: response.name ?? response.format_name ?? '',
          format_code: response.code ?? response.format_code ?? '',
          format_name: response.name ?? response.format_name ?? '',
          bank_id: Number(response.bank?.id ?? response.bank_id ?? 0),
          bank_code: response.bank?.bank_code ?? response.bank_code ?? '',
          bank_name: response.bank?.description ?? response.bank_name ?? '',
          format_definition: plainTop,
          format_definition_bottom: plainBottom,
          status: {
            id: response.status?.id ?? 0,
            status: response.status?.status?.toUpperCase() ?? '',
          },
          table: response.table ?? null,
          table_columns: response.table_columns ?? [],
          table_rows: response.table_rows ?? [],
        }
      }

      openMainLoader(false)
    }
  }

  onMounted(async () => {
    await _getResources({ treasury: key }, '', 'v2')
    await fetchInitialData()
  })

  onBeforeMount(async () => {
    await _resetKeys({ treasury: key })
  })

  const isFormValid = ref(true)

  return {
    headerProps,
    alertModalRef,
    letterFormatForm,
    model,
    isFormValid,
    onSubmit,
  }
}

export default useLetterFormatEdit
