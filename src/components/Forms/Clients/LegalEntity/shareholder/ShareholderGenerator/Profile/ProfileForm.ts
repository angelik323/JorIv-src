import { IShareholderProfileForm } from '@/interfaces/customs/Clients'
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useClientsStore, useResourceStore } from '@/stores'
import { useValidator } from '@/composables/useValidator'
import { useRules, useUtils, useCalendarRules } from '@/composables'

export const useProfileForm = (props: any) => {
  const { data_shareholder_profile_form } = storeToRefs(useClientsStore('v1'))
  const { _setDataShareholderProfileForm } = useClientsStore('v1')
  const {
    document_types_third_party_natural,
    document_types_third_legal,
    countries,
    departments,
    cities,
    nationalities,
  } = storeToRefs(useResourceStore('v1'))

  const { validateEmail } = useValidator()
  const { date_before_or_equal_to_the_current_date, is_older_than } = useRules()
  const { rule_older_than } = useCalendarRules()
  const { isCountry } = useUtils()

  const formValues = ref<IShareholderProfileForm>({
    created_by: null,
    updated_by: null,
    updated_at: null,
    document_type_id: null,
    document_number: null,
    social_reason: null,
    first_name: null,
    second_name: null,
    first_last_name: null,
    second_last_name: null,
    expedition_date: null,
    birth_country: null,
    incorporation_country: null,
    expedition_country: null,
    birth_date: null,
    postal_code: null,
    address: null,
    country: null,
    department: null,
    city: null,
    email_contact: null,
    beneficiary_date: null,
    tax_address: null,
    tax_country: null,
    tax_department: null,
    tax_city: null,
    legal_phone_number: null,
    nationality: null,
    check_digit: null,
    document_type: null,
    taxpayer_document_number: null,
    has_international_tax_responsibility: false,
    has_only_foreign_tax_responsibility: false,
  })

  const formElementRef = ref()

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

  const isAddressGeneratorOpen = ref(false)
  const isAddressContactGeneratorOpen = ref(false)

  const setInitData = () => {
    if (!data_shareholder_profile_form.value) return
    formValues.value = { ...data_shareholder_profile_form.value }
  }

  const setForm = () => {
    const data = props.data
    if (data) {
      formValues.value.created_by = data.created_by ?? null
      formValues.value.updated_by = data.updated_by ?? null
      formValues.value.updated_at = data.updated_at ?? null
      formValues.value.document_type_id = data.document_type_id ?? null
      formValues.value.document_number = data.document_number ?? null
      formValues.value.social_reason = data.social_reason ?? null
      formValues.value.first_name = data.first_name ?? null
      formValues.value.second_name = data.second_name ?? null
      formValues.value.first_last_name = data.first_last_name ?? null
      formValues.value.second_last_name = data.second_last_name ?? null
      formValues.value.expedition_date = data.expedition_date ?? null
      formValues.value.birth_country = data.birth_country ?? null
      formValues.value.incorporation_country =
        data.incorporation_country ?? null
      formValues.value.expedition_country = data.expedition_country ?? null
      formValues.value.birth_date = data.birth_date ?? null
      formValues.value.postal_code = data.postal_code ?? null
      formValues.value.address = data.address ?? null
      formValues.value.country = data.country ?? null
      formValues.value.department = data.department ?? null
      formValues.value.city = data.city ?? null
      formValues.value.email_contact = data.email_contact ?? null
      formValues.value.beneficiary_date = data.beneficiary_date ?? null
      formValues.value.tax_address = data.tax_address ?? null
      formValues.value.tax_country = data.tax_country ?? null
      formValues.value.tax_department = data.tax_department ?? null
      formValues.value.tax_city = data.tax_city ?? null
      formValues.value.legal_phone_number = data.legal_phone_number ?? null
      formValues.value.nationality = data.nationality ?? null
      formValues.value.check_digit = data.check_digit ?? null
      formValues.value.document_type = data.document_type ?? null
      formValues.value.taxpayer_document_number =
        data.taxpayer_document_number ?? null
      formValues.value.has_international_tax_responsibility =
        data.has_international_tax_responsibility ?? false
      formValues.value.has_only_foreign_tax_responsibility =
        data.has_only_foreign_tax_responsibility ?? false
    }
  }

  const handlerActionForm = (formType: 'create' | 'edit' | 'view') => {
    const actionHandlers: Record<typeof formType, () => void> = {
      create: setInitData,
      edit: data_shareholder_profile_form.value ? setInitData : setForm,
      view: setForm,
    }
    actionHandlers[formType]?.()
  }

  onMounted(() => {
    handlerActionForm(props.formType)
  })

  watch(
    () => [
      formValues.value.has_international_tax_responsibility,
      formValues.value.has_only_foreign_tax_responsibility,
    ],
    () => {
      if (
        !formValues.value.has_international_tax_responsibility &&
        !formValues.value.has_only_foreign_tax_responsibility
      ) {
        formValues.value.nationality = null
        formValues.value.taxpayer_document_number = null
        formValues.value.tax_address = null
        formValues.value.tax_country = null
        formValues.value.tax_department = null
        formValues.value.tax_city = null
      }
    }
  )

  watch(
    formValues,
    (newValue: IShareholderProfileForm) => {
      _setDataShareholderProfileForm(newValue)
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
    countries,
    departments,
    cities,
    nationalities,
    isAddressGeneratorOpen,
    isAddressContactGeneratorOpen,
    validateEmail,
    date_before_or_equal_to_the_current_date,
    is_older_than,
    isCountry,
    rule_older_than,
    onlyLetters: /^(?! )[A-Za-zÁÉÍÓÚÜÑñáéíóúü]+(?: [A-Za-zÁÉÍÓÚÜÑñáéíóúü]+)*$/,
  }
}
