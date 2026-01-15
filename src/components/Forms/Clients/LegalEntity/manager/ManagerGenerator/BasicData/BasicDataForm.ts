/* eslint-disable @typescript-eslint/no-explicit-any */

import { IManagerInfoForm } from '@/interfaces/customs/Clients'
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useClientsStore, useResourceStore } from '@/stores'

export const useManagerInfoForm = (props: any) => {
  const { data_manager_info_form } = storeToRefs(useClientsStore('v1'))
  const { _setDataManagerInfoForm } = useClientsStore('v1')
  const { document_types_third_party_natural, document_types_third_legal } =
    storeToRefs(useResourceStore('v1'))

  const formValues = ref<IManagerInfoForm>({
    document_type: null,
    document_number: null,
    first_name: null,
    second_name: null,
    first_lastname: null,
    second_lastname: null,
    business_name: null,
  })
  const formElementRef = ref()

  const rulesLegalPersonDocumentType = computed(() => {
    if (formValues.value.document_type === 14) {
      return [
        (v: string) => !!v || 'El número de identificación es requerido',
        (v: string) => /^[0-9]+$/.test(v) || 'Debe tener solo números',
        (v: string) => v.length === 9 || 'Debe tener 9 caracteres',
        (v: string) => /^[689]/.test(v) || 'Debe comenzar con 6, 8 o 9',
      ]
    }
    if (formValues.value.document_type === 15) {
      return [
        (v: string) => !!v || 'El número de identificación es requerido',
        (v: string) =>
          /^[A-Za-z0-9]+$/.test(v) || 'Debe tener solo números y letras',
        (v: string) =>
          (v.length >= 6 && v.length <= 30) ||
          'Debe tener entre 6 a 30 caracteres',
      ]
    }
    return [(v: string) => !!v || 'El número de identificación es requerido']
  })

  const rulesNaturalPersonDocumentType = computed(() => {
    const commonRules = [
      (v: string) => !!v || 'El número de identificación es requerido',
      (v: string) => v.length >= 6 || 'Debe tener mínimo 6 caracteres',
    ]

    const numericRules = [
      (v: string) => /^[0-9]*$/.test(v) || 'Debe contener solo números',
      (v: string) => v.length <= 10 || 'Debe tener máximo 10 caracteres',
    ]

    const alphanumericRules = [
      (v: string) =>
        /^[A-Za-z0-9]+$/.test(v) || 'Debe contener solo letras y números',
      (v: string) => v.length <= 30 || 'Debe tener máximo 30 caracteres',
    ]

    const specificRulesForType8 = [
      (v: string) => !!v || 'El número de identificación es requerido',
      (v: string) => /^[0-9]+$/.test(v) || 'Debe contener solo números',
      (v: string) => v.length > 5 || 'Debe tener mínimo 6 caracteres',
      (v: string) =>
        [6, 7, 8, 10].includes(v.length) ||
        'Debe tener 6, 7, 8 o 10 caracteres',
    ]

    const numericTypes = [11, 12]
    const alphanumericTypes = [9, 10, 13]

    switch (true) {
      case numericTypes.includes(formValues.value.document_type as number):
        return [...commonRules, ...numericRules]

      case (formValues.value.document_type as number) === 8:
        return specificRulesForType8

      case alphanumericTypes.includes(formValues.value.document_type as number):
        return [...commonRules, ...alphanumericRules]

      default:
        return commonRules
    }
  })

  const setInitData = () => {
    if (!data_manager_info_form.value) return
    formValues.value = { ...data_manager_info_form.value }
  }

  const setForm = () => {
    const data = props.data
    if (data) {
      formValues.value.document_type = data.document_type ?? null
      formValues.value.document_number = data.document_number ?? null
      formValues.value.first_name = data.first_name ?? null
      formValues.value.second_name = data.second_name ?? null
      formValues.value.first_lastname = data.first_lastname ?? null
      formValues.value.second_lastname = data.second_lastname ?? null
      formValues.value.business_name = data.business_name ?? null
    }
  }

  const handlerActionForm = (formType: 'create' | 'edit' | 'view') => {
    const actionHandlers: Record<typeof formType, () => void> = {
      create: setInitData,
      edit: data_manager_info_form.value ? setInitData : setForm,
      view: setForm,
    }
    actionHandlers[formType]?.()
  }

  onMounted(() => {
    handlerActionForm(props.formType)
  })

  watch(
    formValues,
    (newValue: IManagerInfoForm) => {
      _setDataManagerInfoForm(newValue)
    },
    { deep: true }
  )

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.formType)
      }
    }
  )

  return {
    formValues,
    formElementRef,
    document_types_third_party_natural,
    document_types_third_legal,
    rulesLegalPersonDocumentType,
    rulesNaturalPersonDocumentType,
    onlyLetters: /^(?! )[A-Za-zÁÉÍÓÚÜÑñáéíóúü]+(?: [A-Za-zÁÉÍÓÚÜÑñáéíóúü]+)*$/,
  }
}
