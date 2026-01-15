// Vue - Pinia - Router - Quasar
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ActionType, ActionTypeEnum } from '@/interfaces/global'
import { IBaseLegalRepresentationItem } from '@/interfaces/customs/clients/Clients'
import { ILocation } from '@/interfaces/customs/AddressGenerator'

// Composables
import { useUtils, useRules, useCalendarRules, useDates } from '@/composables'

// Stores
import { useAssetResourceStore } from '@/stores/resources-manager'
import { useClientsStore } from '@/stores/clients'
import { useResourceStore } from '@/stores/resources-selects'

const useLegalRepresentationForm = (
  props: {
    action: ActionType
    legalRepresentationDataForm: IBaseLegalRepresentationItem | null
  },
  emit: Function
) => {
  const { isCountry, isEmptyOrZero } = useUtils()
  const { getCurrentDate } = useDates()
  const { countries, nationalities } = storeToRefs(useResourceStore('v1'))
  const { isLegalPersonIndirect } = storeToRefs(useClientsStore('v2'))
  const { document_types_third_party_natural, departments, cities } =
    storeToRefs(useAssetResourceStore('v1'))

  const formLegalRepresentation = ref()
  const isAddressRepresentationGeneratorOpen = ref(false)
  const isAddressDifferentTaxGeneratorOpen = ref(false)
  const currentDate = getCurrentDate()

  const models = ref<IBaseLegalRepresentationItem>({
    id: null,
    third_party_id: null,
    third_party_category: null,

    document_type_id: null, // Tipo de Documento
    document: null, // Número de Documento

    natural_person: {
      issue_date: null, // Fecha de Expedición
      birth_country_id: null, // País de nacimiento
      name: null, // Primer Nombre
      middle_name: null, // Segundo Nombre
      last_name: null, // Primer Apellido
      second_last_name: null, // Segundo Apellido
    },

    address: null, // Dirección
    country_id: null, // País de ubicación
    department_id: null, // Departamento/Estado
    city_id: null, // Ciudad
    postal_code: null, // Código postal

    tax_info: {
      has_different_nationality: false, // ¿Tiene nacionalidad diferente a la colombiana?
      country_id: null, // País
      nationality_id: null, // Nacionalidad
      foreign_responsibility: false, // ¿Tiene responsabilidad tributaria internacional en un país diferente a Colombia?
      branch_address: null, // Dirección
      branch_country_id: null, // Pais tributario
      tin: null, // TIN - Número de Identificación del contribuyente
    },

    pep_info: {
      is_pep: false, // ¿Es una persona expuesta políticamente (PEP)?
      position: null, // Cargo
      entity: null, // Entidad
      date_exit: null, // Fecha de retiro del cargo
      is_politician: false, // Político  (Según decreto 830 de 2021)
      is_international_pep: false, // Representante Legal de una organización internacional
      is_pep_international: false, // PEP Internacional
      date_entry: null, // Fecha de ingreso al cargo
      has_pep_relatives: false, // ¿Tiene parentesco con persona expuesta políticamente (PEP)?

      relatives: {
        full_name: null, // Nombre completo
        relationship: null, // Parentesco
        position: null, // Cargo que desempeña
        entity: null, // Entidad
        id: null,
      },
    },

    has_beneficiary_treatment: false, // ¿Tiene tratamiento de beneficiario final?
    beneficiary_date: null, // Fecha desde la calidad de beneficiario final

    status_id: null, // Estado : se precarga el estado del representante legal
  })

  const rulesNaturalPersonDocumentType = computed(() => {
    const commonRules = [
      (v: string) =>
        useRules().is_required(v, 'El número de identificación es requerido'),
      (v: string) => useRules().min_length(v, 6),
    ]

    const numericRules = [
      (v: string) => useRules().only_number(v),
      (v: string) => useRules().max_length(v, 10),
    ]

    const alphanumericRules = [
      (v: string) => useRules().only_alphanumeric(v),
      (v: string) => useRules().max_length(v, 30),
    ]

    const specificRulesForType8 = [
      (v: string) =>
        useRules().is_required(v, 'El número de identificación es requerido'),
      (v: string) => useRules().only_number(v),
      (v: string) => useRules().min_length(v, 6),
      (v: string) => useRules().length_include(v, [6, 7, 8, 10]),
    ]

    const numericTypes = [11, 12]
    const alphanumericTypes = [9, 10, 13]

    switch (true) {
      case numericTypes.includes(models.value.document_type_id as number):
        return [...commonRules, ...numericRules]

      case (models.value.document_type_id as number) === 8:
        return specificRulesForType8

      case alphanumericTypes.includes(models.value.document_type_id as number):
        return [...commonRules, ...alphanumericRules]

      default:
        return commonRules
    }
  })

  const setValueModel = (data: IBaseLegalRepresentationItem | null) => {
    if (data) {
      models.value = JSON.parse(JSON.stringify(data))
    }
    models.value.beneficiary_date = data?.beneficiary_date ?? currentDate
  }

  const handleAddressSave = (location: ILocation) => {
    models.value.address = location.address
    models.value.country_id = location.country?.id ?? null
    models.value.department_id = location.department?.id ?? null
    models.value.city_id = location.city?.id ?? null
  }

  const handleTaxAddressSave = (location: ILocation) => {
    if (models.value.tax_info) {
      models.value.tax_info.branch_address = location.address
      models.value.tax_info.branch_country_id = location.country?.id ?? null
    }
  }

  const handleHasDifferentNationality = (value: boolean) => {
    models.value.tax_info.has_different_nationality = value

    if (!value) {
      models.value.tax_info.country_id = null
      models.value.tax_info.nationality_id = null
    }
  }

  const handleForeignResponsibility = (value: boolean) => {
    models.value.tax_info.foreign_responsibility = value

    if (!value) {
      models.value.tax_info.branch_address = null
      models.value.tax_info.branch_country_id = null
      models.value.tax_info.tin = null
    }
  }

  const handleIsPep = (value: boolean) => {
    models.value.pep_info.is_pep = value

    if (!value) {
      models.value.pep_info.is_politician = false
      models.value.pep_info.is_international_pep = false
      models.value.pep_info.is_pep_international = false
      models.value.pep_info.position = null
      models.value.pep_info.entity = null
      models.value.pep_info.date_exit = null
      models.value.pep_info.date_entry = null
    }
  }

  const handleHasPepRelatives = (value: boolean) => {
    models.value.pep_info.has_pep_relatives = value

    if (!value && models.value.pep_info.relatives) {
      models.value.pep_info.relatives.full_name = null
      models.value.pep_info.relatives.relationship = null
      models.value.pep_info.relatives.position = null
      models.value.pep_info.relatives.entity = null
    }
  }

  const handleHasBeneficiaryTreatment = (value: boolean) => {
    models.value.has_beneficiary_treatment = value

    if (!value) {
      models.value.beneficiary_date = null
    }
  }

  const validateForm = async () => {
    return (await formLegalRepresentation.value?.validate()) ?? false
  }

  const onSubmit = async () => {
    if (!isLegalPersonIndirect.value) return

    if (props.action !== ActionTypeEnum.VIEW) {
      if (!(await validateForm())) {
        return
      }

      const formData = {
        ...models.value,
        beneficiary_date: models.value.has_beneficiary_treatment
          ? models.value.beneficiary_date
          : null,
        id:
          props.action === ActionTypeEnum.EDIT &&
          props.legalRepresentationDataForm?.id
            ? props.legalRepresentationDataForm.id
            : -1,
      }

      emit('update:table', formData)
    }

    emit('close:modal')
  }

  watch(
    () => props.legalRepresentationDataForm,
    (val) => {
      setValueModel(val)
    },
    { deep: true, immediate: true }
  )

  watch(
    () => models.value,
    (val) => {
      if (
        JSON.stringify(val) ===
        JSON.stringify(props.legalRepresentationDataForm)
      )
        return
      emit(
        'update:legal-representation-data-form',
        isEmptyOrZero(val) ? null : val
      )
    },
    { deep: true }
  )

  return {
    models,
    formLegalRepresentation,
    isLegalPersonIndirect,
    isCountry,
    currentDate,
    useRules,
    useCalendarRules,

    document_types_third_party_natural,
    countries,
    departments,
    cities,
    nationalities,

    isAddressRepresentationGeneratorOpen,
    isAddressDifferentTaxGeneratorOpen,
    rulesNaturalPersonDocumentType,

    onSubmit,
    handleAddressSave,
    handleTaxAddressSave,
    handleHasDifferentNationality,
    handleForeignResponsibility,
    handleIsPep,
    handleHasPepRelatives,
    handleHasBeneficiaryTreatment,
  }
}

export default useLegalRepresentationForm
