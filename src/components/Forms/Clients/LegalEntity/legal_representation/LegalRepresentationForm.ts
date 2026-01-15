import { watch, onMounted, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useClientsStore, useResourceStore } from '@/stores'
import { ILegalRepresentationClient } from '@/interfaces/customs/Clients'
import { useRules } from '@/composables'

const useLegalRepresentationForm = (props: any) => {
  const { data_representative_legal_form } = storeToRefs(useClientsStore('v1'))
  const { _setDataLegalCLientsRepresentativeLegal } = useClientsStore('v1')
  const { document_types_third_party_natural, countries, nationalities } =
    storeToRefs(useResourceStore('v1'))
  const {
    date_before_or_equal_to_the_current_date,
    date_after_or_equal_to_specific_date,
  } = useRules()

  const formLegalRepresentation = ref()
  const isAddressGeneratorOpen = ref(false)

  const models = ref({
    first_name_representation: null as string | null,
    second_name_representation: null as string | null,
    first_lastname_representation: null as string | null,
    second_lastname_representation: null as string | null,
    document_type_representation: null as string | number | null,
    document_number_representation: null as string | null,
    date_issue_representation: null as string | null,
    country_birth_representation: null as string | number | null,
    different_nactionality_representation: false as boolean | undefined,
    different_tax_liability_representation: false as boolean | undefined,
    country_representation: null as string | number | null,
    department_representation: null as string | number | null,
    city_representation: null as string | number | null,
    nacionality_representation: null as string | number | null,
    address_representation: null as string | null,
    nit_taxpayer_representation: null as string | null,
    is_pep: false as boolean | undefined,
    is_politician_representation: false as boolean | undefined,
    is_international_entity_representation: false as boolean | undefined,
    is_international_pep_representation: false as boolean | undefined,
    position_entity_representation: null as string | null,
    date_entry_position_representation: null as string | null,
    date_retirement_position_representation: null as string | null,
    family_member_second_degree_representation: false as boolean | undefined,
    name_family_representation: null as string | null,
    relationship_family_representation: null as string | null,
    position_family_representation: null as string | null,
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
      case numericTypes.includes(
        models.value.document_type_representation as number
      ):
        return [...commonRules, ...numericRules]

      case (models.value.document_type_representation as number) === 8:
        return specificRulesForType8

      case alphanumericTypes.includes(
        models.value.document_type_representation as number
      ):
        return [...commonRules, ...alphanumericRules]

      default:
        return commonRules
    }
  })

  const isEmpty = (obj: Record<string, any>): boolean => {
    return Object.values(obj).every(
      (value) => value === 0 || value === '' || value === null
    )
  }

  const handlerActionForm = (action: 'create' | 'edit' | 'view') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: data_representative_legal_form.value ? _setValueModel : setFormEdit,
      view: setFormView,
    }

    actionHandlers[action]?.()
  }

  const setFormView = () => {
    clearForm()
    const data: ILegalRepresentationClient = props.data
    if (data) {
      const legal_representation = data?.legal_representatives?.[0] || null
      models.value.first_name_representation =
        legal_representation?.natural_person?.name ?? null
      models.value.second_name_representation =
        legal_representation?.natural_person?.middle_name ?? null
      models.value.first_lastname_representation =
        legal_representation?.natural_person?.last_name ?? null
      models.value.second_lastname_representation =
        legal_representation?.natural_person?.second_last_name ?? null
      models.value.document_type_representation =
        legal_representation?.document_type ?? null
      models.value.document_number_representation =
        legal_representation?.document ?? null
      models.value.date_issue_representation =
        legal_representation?.natural_person?.issue_date ?? null
      models.value.country_birth_representation =
        legal_representation?.natural_person?.birth_country ?? null

      models.value.different_nactionality_representation =
        legal_representation?.tax_info?.has_different_nationality ?? false

      models.value.different_tax_liability_representation =
        legal_representation?.tax_info?.foreign_responsibility ?? false
      models.value.country_representation =
        legal_representation?.tax_info?.country ?? null
      models.value.nacionality_representation =
        legal_representation?.tax_info?.nationality ?? null
      models.value.address_representation =
        legal_representation?.tax_info?.branch_address ?? null
      models.value.nit_taxpayer_representation =
        legal_representation?.tax_info?.tin ?? null

      models.value.is_pep = legal_representation?.pep_info?.is_pep ?? false
      models.value.is_politician_representation =
        legal_representation?.pep_info?.is_politician ?? false
      models.value.is_international_entity_representation =
        legal_representation?.pep_info?.is_international_pep ?? false
      models.value.is_international_pep_representation =
        legal_representation?.pep_info?.is_pep_international ?? false
      models.value.position_entity_representation =
        legal_representation?.pep_info?.position ?? null
      models.value.date_entry_position_representation =
        legal_representation?.pep_info?.date_entry ?? null
      models.value.date_retirement_position_representation =
        legal_representation?.pep_info?.date_exit ?? null

      models.value.family_member_second_degree_representation =
        legal_representation?.pep_info?.has_pep_relatives ?? false
      models.value.name_family_representation =
        legal_representation?.pep_info?.relatives[0]?.full_name ?? null
      models.value.relationship_family_representation =
        legal_representation?.pep_info?.relatives[0]?.relationship ?? null
      models.value.position_family_representation =
        legal_representation?.pep_info?.relatives[0]?.position ?? null
    }
  }

  const setFormEdit = () => {
    clearForm()
    const data: ILegalRepresentationClient = props.data

    if (data) {
      const legal_representation = data?.legal_representatives?.[0] || null

      models.value.first_name_representation =
        legal_representation?.natural_person?.name ?? null
      models.value.second_name_representation =
        legal_representation?.natural_person?.middle_name ?? null
      models.value.first_lastname_representation =
        legal_representation?.natural_person?.last_name ?? null
      models.value.second_lastname_representation =
        legal_representation?.natural_person?.second_last_name ?? null
      models.value.document_type_representation =
        legal_representation?.document_type_id ?? null
      models.value.document_number_representation =
        legal_representation?.document ?? null
      models.value.date_issue_representation =
        legal_representation?.natural_person?.issue_date ?? null
      models.value.country_birth_representation =
        legal_representation?.natural_person?.birth_country_id ?? null

      models.value.different_nactionality_representation =
        legal_representation?.tax_info?.has_different_nationality ?? false

      models.value.different_tax_liability_representation =
        legal_representation?.tax_info?.foreign_responsibility ?? false
      models.value.country_representation =
        legal_representation?.tax_info?.country_id ?? null
      models.value.nacionality_representation =
        legal_representation?.tax_info?.nationality_id ?? null
      models.value.address_representation =
        legal_representation?.tax_info?.branch_address ?? null
      models.value.nit_taxpayer_representation =
        legal_representation?.tax_info?.tin ?? null

      models.value.is_pep = legal_representation?.pep_info?.is_pep ?? false
      models.value.is_politician_representation =
        legal_representation?.pep_info?.is_politician ?? false
      models.value.is_international_entity_representation =
        legal_representation?.pep_info?.is_international_pep ?? false
      models.value.is_international_pep_representation =
        legal_representation?.pep_info?.is_pep_international ?? false
      models.value.position_entity_representation =
        legal_representation?.pep_info?.position ?? null
      models.value.date_entry_position_representation =
        legal_representation?.pep_info?.date_entry ?? null
      models.value.date_retirement_position_representation =
        legal_representation?.pep_info?.date_exit ?? null

      models.value.family_member_second_degree_representation =
        legal_representation?.pep_info?.has_pep_relatives ?? false
      models.value.name_family_representation =
        legal_representation?.pep_info?.relatives[0]?.full_name ?? null
      models.value.relationship_family_representation =
        legal_representation?.pep_info?.relatives[0]?.relationship ?? null
      models.value.position_family_representation =
        legal_representation?.pep_info?.relatives[0]?.position ?? null
    }
  }

  const _setValueModel = () => {
    if (data_representative_legal_form.value) {
      models.value = { ...data_representative_legal_form.value }
    }
  }

  const clearForm = () => {
    models.value.first_name_representation = null
    models.value.second_name_representation = null
    models.value.first_lastname_representation = null
    models.value.second_lastname_representation = null
    models.value.document_type_representation = null
    models.value.document_number_representation = null
    models.value.date_issue_representation = null
    models.value.country_birth_representation = null
    models.value.different_nactionality_representation = false
    models.value.different_tax_liability_representation = false
    models.value.country_representation = null
    models.value.department_representation = null
    models.value.city_representation = null
    models.value.nacionality_representation = null
    models.value.address_representation = null
    models.value.nit_taxpayer_representation = null
    models.value.is_pep = false
    models.value.is_politician_representation = false
    models.value.is_international_entity_representation = false
    models.value.is_international_pep_representation = false
    models.value.position_entity_representation = null
    models.value.date_entry_position_representation = null
    models.value.date_retirement_position_representation = null
    models.value.family_member_second_degree_representation = false
    models.value.name_family_representation = null
    models.value.relationship_family_representation = null
    models.value.position_family_representation = null
  }

  onMounted(async () => {
    handlerActionForm(props.action)
  })

  watch(
    () => [
      models.value.different_nactionality_representation,
      models.value.different_tax_liability_representation,
    ],
    () => {
      if (
        !models.value.different_nactionality_representation &&
        !models.value.different_tax_liability_representation
      ) {
        models.value.nacionality_representation = null
        models.value.address_representation = null
        models.value.country_representation = null
        models.value.department_representation = null
        models.value.city_representation = null
        models.value.nit_taxpayer_representation = null
      }
    }
  )

  watch(
    () => [models.value.is_pep],
    () => {
      if (!models.value.is_pep) {
        models.value.is_politician_representation = false
        models.value.is_international_entity_representation = false
        models.value.is_international_pep_representation = false
        models.value.position_entity_representation = null
        models.value.date_entry_position_representation = null
        models.value.date_retirement_position_representation = null
      }
    }
  )

  watch(
    () => [models.value.family_member_second_degree_representation],
    () => {
      if (!models.value.family_member_second_degree_representation) {
        models.value.name_family_representation = null
        models.value.relationship_family_representation = null
        models.value.position_family_representation = null
      }
    }
  )

  watch(
    () => [
      models.value.first_name_representation,
      models.value.second_name_representation,
      models.value.first_lastname_representation,
      models.value.second_lastname_representation,
      models.value.document_type_representation,
      models.value.document_number_representation,
      models.value.date_issue_representation,
      models.value.country_birth_representation,
      models.value.different_nactionality_representation,
      models.value.different_tax_liability_representation,
      models.value.country_representation,
      models.value.department_representation,
      models.value.city_representation,
      models.value.nacionality_representation,
      models.value.address_representation,
      models.value.nit_taxpayer_representation,
      models.value.is_pep,
      models.value.is_politician_representation,
      models.value.is_international_entity_representation,
      models.value.is_international_pep_representation,
      models.value.position_entity_representation,
      models.value.date_entry_position_representation,
      models.value.date_retirement_position_representation,
      models.value.family_member_second_degree_representation,
      models.value.name_family_representation,
      models.value.relationship_family_representation,
      models.value.position_family_representation,
    ],
    () => {
      if (isEmpty(models.value)) {
        _setDataLegalCLientsRepresentativeLegal(null)
      } else {
        _setDataLegalCLientsRepresentativeLegal({
          first_name_representation:
            models.value.first_name_representation ?? null,
          second_name_representation:
            models.value.second_name_representation ?? null,
          first_lastname_representation:
            models.value.first_lastname_representation ?? null,
          second_lastname_representation:
            models.value.second_lastname_representation ?? null,
          document_type_representation:
            models.value.document_type_representation ?? null,
          document_number_representation:
            models.value.document_number_representation ?? null,
          date_issue_representation:
            models.value.date_issue_representation ?? null,
          country_birth_representation:
            models.value.country_birth_representation ?? null,
          different_nactionality_representation:
            models.value.different_nactionality_representation ?? false,
          different_tax_liability_representation:
            models.value.different_tax_liability_representation ?? false,
          country_representation: models.value.country_representation ?? null,
          department_representation:
            models.value.department_representation ?? null,
          city_representation: models.value.city_representation ?? null,
          nacionality_representation:
            models.value.nacionality_representation ?? null,
          address_representation: models.value.address_representation ?? null,
          nit_taxpayer_representation:
            models.value.nit_taxpayer_representation ?? null,
          is_pep: models.value.is_pep ?? false,
          is_politician_representation:
            models.value.is_politician_representation ?? false,
          is_international_entity_representation:
            models.value.is_international_entity_representation ?? false,
          is_international_pep_representation:
            models.value.is_international_pep_representation ?? false,
          position_entity_representation:
            models.value.position_entity_representation ?? null,
          date_entry_position_representation:
            models.value.date_entry_position_representation ?? null,
          date_retirement_position_representation:
            models.value.date_retirement_position_representation ?? null,
          family_member_second_degree_representation:
            models.value.family_member_second_degree_representation ?? false,
          name_family_representation:
            models.value.name_family_representation ?? null,
          relationship_family_representation:
            models.value.relationship_family_representation ?? null,
          position_family_representation:
            models.value.position_family_representation ?? null,
        })
      }
    }
  )

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    }
  )

  return {
    models,
    formLegalRepresentation,
    document_types_third_party_natural,
    countries,
    nationalities,
    rulesNaturalPersonDocumentType,
    isAddressGeneratorOpen,
    date_before_or_equal_to_the_current_date,
    date_after_or_equal_to_specific_date,
  }
}

export default useLegalRepresentationForm
