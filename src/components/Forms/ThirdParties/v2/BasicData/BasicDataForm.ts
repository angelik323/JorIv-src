import { ref, onMounted, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import {
  useThirdPartiesStore,
  useResourceStore,
  useThirdPartiesModuleStore,
  useThirdPartyResourceStore,
} from '@/stores'
import { useMainLoader, useUtils } from '@/composables'
import { ActionType, IThirdParty } from '@/interfaces/global'
import { PersonType } from '@/interfaces/global/Clients'

export const useBasicDataForm = (props: {
  data?: IThirdParty | null
  formType: ActionType
}) => {
  const { _setBasicDataState, _searchInCautionList, _clearIsValidPerson } =
    useThirdPartiesStore()
  const { basicDataState, isValidPerson: isIncludedCautelarList } = storeToRefs(
    useThirdPartiesStore()
  )
  const { document_types_third_party_fideicomiso } = storeToRefs(
    useThirdPartyResourceStore('v1')
  )
  const {
    type_person,
    document_types_third_party_natural,
    document_types_third_legal,
    occupations,
    options_boolean,
    third_party_type,
    fiscal_responsability,
    third_party_identity_types,
  } = storeToRefs(useResourceStore('v1'))

  const { naturesData, regimensData, thirdPartyClassificationData } =
    storeToRefs(useThirdPartiesStore())

  const { calculateCheckDigit, capitalize, normalizeText } = useUtils()

  const { openMainLoader } = useMainLoader()

  const { _verifyExistThirdParty } = useThirdPartiesModuleStore()

  const { third_request } = storeToRefs(useThirdPartiesModuleStore())

  const dateNow = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date())

  const formValues = ref({
    creation_date: props.formType === 'create' ? dateNow : '',
    created_by: '' as string | null,
    updated_by: '' as string | null,
    updated_at: '' as string | null,
    person_type_id: capitalize(type_person.value ?? '') as string | null,
    person_type: '' as string | null,
    document_type_id: null as number | null,
    document_type: '' as string | number | null,
    document_number: '' as string | null,
    check_digit: '' as string | number | null,
    social_reason: '' as string | null,
    initials: '' as string | null,
    first_name: '' as string | null,
    second_name: '' as string | null,
    first_last_name: '' as string | null,
    second_last_name: '' as string | null,
    third_type_id: null as number | string | null,
    third_type: '' as string | null,
    tax_manager_id: null as number | string | null,
    tax_manager: '' as string | null,
    iva_manager_id: null as number | string | null,
    iva_manager: '' as string | null,
    profession_id: null as number | string | null,
    profession: '' as string | null,
    status_id: null as number | null,
    identity_type_id: null as number | null,
    identity_type: null as string | null,
  })

  const formElementRef = ref()
  const secondLastName = ref()
  const secondName = ref()
  const acronymRef = ref()
  const isLoading = ref(false)
  const documentNumberRef = ref()
  const documentTypeRef = ref()

  const isNaturalPerson = computed(
    () =>
      (formValues?.value.person_type_id as string)?.toLowerCase() === 'natural'
  )

  const isLegalPerson = computed(() =>
    ['legal', 'juridica'].includes(
      normalizeText(String(formValues?.value.person_type_id))
    )
  )

  const fullName = ref('')

  const isValidForm = ref(false)

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

  const initData = () => {
    if (!basicDataState.value) return
    // @ts-ignore
    formValues.value = { ...basicDataState.value }

    formValues.value.person_type_id =
      basicDataState.value?.person_type_id == 'legal'
        ? capitalize(PersonType.LEGAL)
        : capitalize(PersonType.NATURAL)
  }

  const clearForm = () => {
    setTimeout(() => {
      formElementRef.value?.reset()
    }, 500)
  }

  const setFormView = () => {
    clearForm()
    const data = props.data
    if (data) {
      formValues.value.person_type_id =
        data?.person_type == 'legal'
          ? capitalize(PersonType.LEGAL)
          : capitalize(PersonType.NATURAL)
      formValues.value.creation_date = data?.created_at
      formValues.value.updated_at = data?.updated_at
      formValues.value.created_by = `${data?.created_by.name ?? null} ${
        data?.created_by.last_name ?? null
      }`
      formValues.value.updated_by = data?.updated_by?.name
        ? `${data?.updated_by.name ?? null} ${
            data?.updated_by.last_name ?? null
          }`
        : null
      formValues.value.person_type = formValues.value.person_type_id ?? null
      formValues.value.document_type_id = data?.document_type.id ?? null
      formValues.value.document_type = data?.document_type.name ?? null
      formValues.value.document_number = data?.document ?? null
      formValues.value.check_digit = data?.validator_digit ?? 'Ninguno'
      formValues.value.social_reason = data?.legal_person?.business_name ?? null
      formValues.value.initials = data?.legal_person?.acronym ?? null
      formValues.value.first_name = data?.natural_person?.name ?? null
      formValues.value.second_name = data?.natural_person?.middle_name ?? null
      formValues.value.first_last_name = data?.natural_person?.last_name ?? null
      formValues.value.second_last_name =
        data?.natural_person?.second_last_name ?? null
      formValues.value.third_type = data.is_fideicomiso
        ? 'Fideicomiso'
        : data?.third_party_type ?? null
      formValues.value.tax_manager = data?.fiscal_responsibility ?? null
      formValues.value.iva_manager = data?.vat_responsibility ?? null
      formValues.value.profession =
        data?.natural_person?.occupation_category?.occupation ?? null

      formValues.value.identity_type = data.is_fideicomiso
        ? `${data?.legal_person?.business_type?.code ?? null} - ${
            data?.legal_person?.business_type?.name ?? null
          }`
        : data?.identity_type?.identity_type ?? null
    }
  }

  const setFormEdit = async () => {
    clearForm()
    const data = props.data
    if (data) {
      setTimeout(() => {
        formValues.value.created_by = `${data?.created_by.name ?? null} ${
          data?.created_by.last_name ?? null
        }`
        formValues.value.person_type_id =
          data?.person_type == 'legal'
            ? capitalize(PersonType.LEGAL)
            : capitalize(PersonType.NATURAL)
        formValues.value.creation_date = data?.created_at
        formValues.value.document_type = data?.document_type.id ?? null
        formValues.value.document_type_id = data?.document_type.id ?? null
        formValues.value.document_number = data?.document ?? null
        formValues.value.check_digit = data?.validator_digit ?? null
        formValues.value.social_reason =
          data?.legal_person?.business_name ?? null
        formValues.value.initials = data?.legal_person?.acronym ?? null
        formValues.value.first_name = data?.natural_person?.name ?? null
        formValues.value.second_name = data?.natural_person?.middle_name ?? null
        formValues.value.first_last_name =
          data?.natural_person?.last_name ?? null
        formValues.value.second_last_name =
          data?.natural_person?.second_last_name ?? null
        formValues.value.third_type = data?.third_party_type ?? null
        formValues.value.third_type_id = data?.third_party_type ?? null
        formValues.value.tax_manager = data?.fiscal_responsibility ?? null
        formValues.value.tax_manager_id = data?.fiscal_responsibility ?? null
        formValues.value.iva_manager_id = data?.vat_responsibility ?? null
        formValues.value.identity_type_id = data.is_fideicomiso
          ? data?.legal_person?.business_type?.id ?? null
          : data?.identity_type_id ?? null
        formValues.value.iva_manager =
          data?.vat_responsibility?.toUpperCase() ?? null
        formValues.value.profession_id =
          data?.natural_person?.occupation_category?.id ?? null
      }, 100)
    }
  }

  const handlerActionForm = (action: 'create' | 'edit' | 'view') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: initData,
      edit: basicDataState.value ? initData : setFormEdit,
      view: setFormView,
    }

    actionHandlers[action]?.()
  }

  const searchInCautionList = async (alert: boolean = true) => {
    if (!isValidForm.value) return
    const includeCautelarList = await _searchInCautionList(
      String(fullName.value),
      String(formValues.value.document_number),
      alert
    )
    return includeCautelarList
  }

  const validateExistPerson = async (show_alert: boolean = true) => {
    if (!documentNumberRef.value) return
    const isValidDocumentNumber = await documentNumberRef.value.validate()
    if (isValidDocumentNumber && formValues.value.document_type_id) {
      openMainLoader(true)

      await _verifyExistThirdParty(
        {
          document: Number(formValues.value.document_number),
          type: formValues.value.document_type_id,
        },
        show_alert
      )

      openMainLoader(false)
    }
  }

  onMounted(async () => {
    third_request.value = null
    _clearIsValidPerson()
    handlerActionForm(props.formType)
  })

  watch(occupations, () => {
    formValues.value.profession_id =
      occupations.value.find((e) => e.value == 390)?.value || null
  })

  watch(
    () => formValues.value,
    () => {
      // @ts-ignore
      _setBasicDataState(formValues.value)
    },
    {
      deep: true,
    }
  )

  watch(
    () => [
      formValues.value.second_last_name,
      formValues.value.second_name,
      formValues.value.initials,
    ],
    () => {
      if (!formValues.value.second_last_name) {
        setTimeout(async () => {
          await secondLastName.value?.resetValidation()
        }, 500)
      }

      if (!formValues.value.second_name) {
        setTimeout(async () => {
          await secondName.value?.resetValidation()
        }, 500)
      }

      if (!formValues.value.initials) {
        setTimeout(async () => {
          await acronymRef.value?.resetValidation()
        }, 500)
      }
    }
  )

  watch(type_person, () => {
    formValues.value.person_type_id =
      type_person.value ?? (null as string | null)
  })

  watch(
    () => formValues.value.tax_manager_id,
    () => {
      if (formValues.value.tax_manager_id) {
        formValues.value.iva_manager_id =
          formValues.value.tax_manager_id === 'No responsable' ? 'NO' : 'SI'
      } else {
        formValues.value.iva_manager_id = null
      }
    }
  )

  watch(
    () => [formValues.value.document_number, formValues.value.document_type_id],
    async () => {
      if (
        [14].includes(formValues.value.document_type_id as number) &&
        formValues.value.document_number
      ) {
        const dv = calculateCheckDigit(formValues.value.document_number)
        formValues.value.check_digit = isNaN(dv) ? null : dv.toString()
      } else {
        formValues.value.check_digit = null
      }
    }
  )

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.formType)
      }
    },
    {
      immediate: true,
    }
  )

  watch(
    formValues.value,
    () => {
      const {
        first_name,
        second_name,
        first_last_name,
        second_last_name,
        social_reason,
        document_number,
      } = formValues.value

      if (isNaturalPerson.value) {
        fullName.value = `${first_name} ${second_name} ${first_last_name} ${second_last_name}`
        isValidForm.value =
          !!first_name && !!first_last_name && !!document_number
      }

      if (isLegalPerson.value) {
        fullName.value = `${social_reason}`
        isValidForm.value = !!social_reason && !!document_number
      }
    },
    { deep: true }
  )

  return {
    formValues,
    formElementRef,
    isLoading,
    document_types_third_party_natural,
    document_types_third_legal,
    occupations,
    options_boolean,
    naturesData,
    regimensData,
    thirdPartyClassificationData,
    third_party_type,
    isNaturalPerson,
    isLegalPerson,
    fullName,
    isValidPerson: isValidForm,
    fiscal_responsability,
    third_party_identity_types,
    rulesLegalPersonDocumentType,
    rulesNaturalPersonDocumentType,
    secondLastName,
    secondName,
    acronymRef,
    documentNumberRef,
    documentTypeRef,
    third_request,
    document_types_third_party_fideicomiso,
    searchInCautionList,
    validateExistPerson,
    isIncludedCautelarList,
  }
}
