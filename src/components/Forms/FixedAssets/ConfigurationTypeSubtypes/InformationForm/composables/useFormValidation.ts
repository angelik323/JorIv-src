// vue
import type { Ref } from 'vue'

// interfaces
import type {
  IAssetTypeForm,
  IAssetSubtypeForm
} from '@/interfaces/customs/fixed-assets/ConfigurationTypeSubtypes'

// composables
import { useAlert } from '@/composables'

export const useFormValidation = (
  model: () => IAssetTypeForm | null,
  type_form_ref: Ref,
  subtypes_form_ref: Ref
) => {
  const { showAlert } = useAlert()

  const validateCodeUniqueness = (
    code: string | number,
    currentRow: IAssetSubtypeForm,
    allSubtypes: IAssetSubtypeForm[]
  ): boolean | string => {
    const duplicate = allSubtypes.some(
      (subtype) => subtype._uid !== currentRow._uid && subtype.code === String(code)
    )
    return duplicate ? 'El código ya existe en este tipo de activo' : true
  }

  const validateForm = async (): Promise<boolean> => {
    if (!model()) {
      showAlert('No hay datos en el formulario', 'error', undefined, 5000)
      return false
    }

    const isAssetTypeFormValid = (await type_form_ref.value?.validate()) ?? false

    if (!isAssetTypeFormValid) {
      showAlert('Complete todos los campos requeridos del tipo de activo', 'error', undefined, 5000)
      return false
    }

    if (model()!.subtypes.length === 0) {
      showAlert('Debe agregar al menos un subtipo', 'error', undefined, 5000)
      return false
    }

    const invalidSubtypes: Array<{ index: number; position: number }> = []
    model()!.subtypes.forEach((subtype, index) => {
      if (
        !subtype.code ||
        !subtype.description ||
        subtype.life_span === null ||
        subtype.depreciation === null
      ) {
        invalidSubtypes.push({ index, position: index + 1 })
      }
    })

    if (invalidSubtypes.length > 0) {
      showAlert(
        `Complete todos los campos requeridos en los subtipos. Subtipos incompletos en posiciones: ${invalidSubtypes
          .map((s) => s.position)
          .join(', ')}`,
        'error',
        undefined,
        8000
      )
      return false
    }

    const isSubtypesFormValid = (await subtypes_form_ref.value?.validate()) ?? false

    if (!isSubtypesFormValid) {
      showAlert('Complete todos los campos requeridos en los subtipos', 'error', undefined, 5000)
      return false
    }

    return true
  }

  return {
    validateForm,
    validateCodeUniqueness
  }
}
