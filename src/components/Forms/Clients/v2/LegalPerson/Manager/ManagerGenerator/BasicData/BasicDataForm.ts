// Vue - Pinia - Router - Quasar
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import {
  IManagerBasicDataForm,
  IManager,
} from '@/interfaces/customs/clients/Clients'
import { ClientPersonType } from '@/interfaces/global/Clients'
import { ILocation } from '@/interfaces/customs/AddressGenerator'
import { ActionType } from '@/interfaces/global'

// Composables
import { useUtils } from '@/composables/useUtils'

// Stores
import { useClientsStore, useResourceStore } from '@/stores'
import { useAssetResourceStore } from '@/stores/resources-manager'

// TODO: Falta refactor de composable
export const useManagerInfoForm = (props: {
  data: IManager | null
  formType: ActionType
}) => {
  const { isCountry } = useUtils()

  const { client_person_type, data_manager_info_form } = storeToRefs(
    useClientsStore('v2')
  )
  const { _setDataManagerInfoForm } = useClientsStore('v2')
  const {
    document_types_third_party_natural,
    document_types_third_legal,
    countries,
  } = storeToRefs(useResourceStore('v1'))
  const { departments, cities } = storeToRefs(useAssetResourceStore('v1'))

  const formValues = ref<IManagerBasicDataForm>({
    document_type_id: null,
    document: null,
    natural_person: {
      name: null,
      middle_name: null,
      last_name: null,
      second_last_name: null,
      birth_country_id: null,
      issue_date: null,
    },
    legal_person: {
      business_name: null,
      constitution_date: null,
    },
    position: null,
    date_exit: null,
    country_id: null,
    department_id: null,
    city_id: null,
    address: null,
    email: null,
    phone: null,
    beneficiary_date: null,
    status_id: null,
  })

  const formElementRef = ref()
  const isAddressGeneratorOpen = ref(false)

  const rulesLegalPersonDocumentType = computed(() => {
    if (formValues.value.document_type_id === 14) {
      return [
        (v: string) => !!v || 'El número de identificación es requerido',
        (v: string) => /^[0-9]+$/.test(v) || 'Debe tener solo números',
        (v: string) => v.length === 9 || 'Debe tener 9 caracteres',
        (v: string) => /^[689]/.test(v) || 'Debe comenzar con 6, 8 o 9',
      ]
    }
    if (formValues.value.document_type_id === 15) {
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
      case numericTypes.includes(formValues.value.document_type_id as number):
        return [...commonRules, ...numericRules]

      case (formValues.value.document_type_id as number) === 8:
        return specificRulesForType8

      case alphanumericTypes.includes(
        formValues.value.document_type_id as number
      ):
        return [...commonRules, ...alphanumericRules]

      default:
        return commonRules
    }
  })

  const isLegalPersonIndirect = computed(() => {
    return client_person_type.value === ClientPersonType.LEGAL_INDIRECT
  })

  const setInitData = () => {
    if (!data_manager_info_form.value) return
    formValues.value = { ...data_manager_info_form.value }
  }

  const setForm = () => {
    const data = props.data
    if (data) {
      Object.assign(formValues.value, data)
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

  const handleAddressSave = (location: ILocation) => {
    formValues.value = {
      ...formValues.value,
      address: location.address,
      country_id: location.country?.id ?? null,
      department_id: location.department?.id ?? null,
      city_id: location.city?.id ?? null,
    }
  }

  onMounted(() => {
    handlerActionForm(props.formType)
  })

  watch(
    formValues,
    (newValue: IManagerBasicDataForm) => {
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
    isAddressGeneratorOpen,
    rulesLegalPersonDocumentType,
    rulesNaturalPersonDocumentType,
    isLegalPersonIndirect,
    onlyLetters: /^(?! )[A-Za-zÁÉÍÓÚÜÑñáéíóúü]+(?: [A-Za-zÁÉÍÓÚÜÑñáéíóúü]+)*$/,
    isCountry,

    document_types_third_party_natural,
    document_types_third_legal,
    countries,
    departments,
    cities,

    handleAddressSave,
  }
}
