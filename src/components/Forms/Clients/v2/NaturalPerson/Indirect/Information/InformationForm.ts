import { computed, onBeforeMount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useResourceStore, useThirdPartiesModuleStore } from '@/stores'

import {
  useAlert,
  useMainLoader,
  useUtils,
  useCalendarRules,
  useRules,
} from '@/composables'
import moment from 'moment'

// Interfaces
import { ActionType } from '@/interfaces/global'
import { IClientIndirectNaturalBasicForm } from '@/interfaces/customs/clients/ClientIndirectNaturalPerson'
import { ClientPersonType } from '@/interfaces/global/Clients'

// Stores
import { useThirdPartiesStore } from '@/stores/third-parties'

const isAddressGeneratorOpen = ref(false)
const isAddressEmploymentOpen = ref(false)

const useInformationForm = (
  props: {
    action: ActionType
    data: IClientIndirectNaturalBasicForm | null
    client_person_type?: string
  },
  emit: Function
) => {
  const { third_request, exist_client, wasPersonLoaded } = storeToRefs(
    useThirdPartiesModuleStore()
  )

  const { _verifyExistThirdParty, _setPersonLoadedState } =
    useThirdPartiesModuleStore()

  const { showAlert } = useAlert()
  const { openMainLoader } = useMainLoader()
  const { isCountry, isEmptyOrZero } = useUtils()
  const { rule_older_than } = useCalendarRules()
  const { _searchInCautionList, _getIndirectThirdPartyRequestTypes } =
    useThirdPartiesStore()

  const client_person_type = props.client_person_type

  const clientPersonTypeLabels: Record<ClientPersonType, string> = {
    [ClientPersonType.NATURAL_DIRECT]: 'Natural Directo',
    [ClientPersonType.NATURAL_INDIRECT]: 'Natural Indirecto',
    [ClientPersonType.LEGAL_DIRECT]: 'Jurídica Directo',
    [ClientPersonType.LEGAL_INDIRECT]: 'Jurídica Indirecto',
    [ClientPersonType.TRUST]: 'Fideicomiso',
  }

  const keys = [
    'occupations',
    'ciius',
    'applicant_type_nature_client',
    'document_types_third_party_natural',
    'correspondence',
    'third_party_occupations',
    'banks',
    'countries',
    'departments',
    'cities',
    'third_party_taxpayer_types',
    'third_party_tin_options',
    'estate_origins',
  ]

  const {
    countries,
    document_types_third_party_natural,
    correspondence,
    occupations,
    cities,
    third_party_occupations,
    departments,
    ciius,
  } = storeToRefs(useResourceStore('v1'))

  const { getResources } = useResourceStore('v1')

  const formInformation = ref()
  const documentNumberRef = ref()
  const clientPersonTypeLabel = ref('')
  const indirectThirdPartyRequestTypes = ref([])

  const dateNow = moment().format('YYYY-MM-DD HH:mm')

  const models = ref<IClientIndirectNaturalBasicForm>({
    created_at: '',
    creation_date: props.action === 'create' ? dateNow : '',
    created_by: '',
    updated_date: '',
    updated_by: '',
    request_type: '',
    document_type_id: '',
    document_type: '',
    document: '',
    natural_person: {
      name: '',
      middle_name: '',
      last_name: '',
      second_last_name: '',
      birth_date: '',
      issue_date: '',
      applicat_type: '',
      occupation_id: '',
      expedition_date: '',
      birth_country_id: null,
      location_country_id: null,
      birth_country: null,
      location_country: null,
    },
    nacionality: '',
    contacts: [
      {
        contact_type: 'email',
        contact_value: '',
        is_main: '0',
      },
      {
        contact_type: 'phone',
        contact_value: '',
        is_main: '0',
      },
      {
        contact_type: 'mobile',
        contact_value: '',
        is_main: '0',
      },
    ],
    sending_correspondence: '',
    addresses: {
      address: '',
      country_id: '',
      department_id: '',
      city_id: '',
      postal_code: '',
    },
    employment_info: {
      occupation_id: '',
      ciiu_code: '',
      ciiu_id: '',
      company: '',
      address: '',
      country_id: '',
      department_id: '',
      city_id: '',
      phone: '',
      profession_id: '',
    },
    client_type_id: null,
    fiscal_responsibility: null,
  })

  const rulesNaturalPersonDocumentType = computed(() => {
    const commonRules = [
      (val: string) => useRules().is_required(val),
      (val: string) => useRules().min_length(val, 6),
    ]

    const numericRules = [
      (val: string) => useRules().only_number(val),
      (val: string) => useRules().max_length(val, 10),
    ]

    const alphanumericRules = [
      (val: string) => useRules().only_alphanumeric(val),
      (val: string) => useRules().max_length(val, 30),
    ]

    const specificRulesForType8 = [
      (val: string) => useRules().is_required(val),
      (val: string) => useRules().only_number(val),
      (val: string) => useRules().min_length(val, 6),
      (val: string) => useRules().max_length(val, 10),
    ]

    const numericTypes = [11, 12]
    const alphanumericTypes = [9, 10, 13]

    switch (true) {
      case numericTypes.includes(Number(models.value.document_type_id)):
        return [...commonRules, ...numericRules]

      case Number(models.value.document_type_id) === 8:
        return specificRulesForType8

      case alphanumericTypes.includes(Number(models.value.document_type_id)):
        return [...commonRules, ...alphanumericRules]

      default:
        return commonRules
    }
  })

  const getOptionsCalendar = (date: string) => {
    const MINOR_DOCUMENT_TYPE_IDS = new Set([11, 12])

    const id = Number(models.value.document_type_id)
    const isMinor = MINOR_DOCUMENT_TYPE_IDS.has(id)

    if (isMinor) return rule_older_than(date, 0, 17)
    return rule_older_than(date)
  }

  const _setValueModel = () => {
    if (!props.data) return
    models.value = { ...props.data }
  }

  const searchInCautionList = async (alert: boolean = true) => {
    openMainLoader(true)
    const includeCautelarList = await _searchInCautionList(
      String(
        models.value.natural_person.name +
          ' ' +
          models.value.natural_person.last_name
      ),
      String(models.value.document),
      alert
    )
    openMainLoader(false)

    return includeCautelarList
  }

  const getIndirectThirdPartyRequestTypes = async () => {
    const indirectThirdPartyRequestTypes =
      await _getIndirectThirdPartyRequestTypes()
    return indirectThirdPartyRequestTypes
  }

  const validateExistPerson = async () => {
    if (['edit', 'view'].includes(props.action)) return
    if (!documentNumberRef.value) return

    const isValidDocumentNumber = await documentNumberRef.value.validate()

    if (isValidDocumentNumber && models.value.document_type_id) {
      openMainLoader(true)
      await _verifyExistThirdParty(
        {
          document: Number(models.value.document),
          type: models.value.document_type_id as number,
        },
        false,
        true
      )

      if (third_request.value) {
        if (exist_client.value) {
          models.value.document_type_id = third_request.value.document_type_id
          models.value.document = third_request.value.document

          models.value.natural_person.name =
            third_request.value?.natural_person?.name ?? ''
          models.value.natural_person.middle_name =
            third_request.value?.natural_person?.middle_name ?? ''
          models.value.natural_person.last_name =
            third_request.value?.natural_person?.last_name ?? ''
          models.value.natural_person.second_last_name =
            third_request.value?.natural_person?.second_last_name ?? ''
          models.value.natural_person.birth_date = third_request.value
            ?.natural_person?.birth_date
            ? moment(third_request.value?.natural_person?.birth_date).format(
                'YYYY-MM-DD'
              )
            : ''
          models.value.natural_person.birth_country_id =
            third_request.value?.natural_person?.birth_country_id ?? null
          models.value.natural_person.birth_country =
            third_request.value?.natural_person?.birth_country ?? null
          models.value.natural_person.location_country_id =
            third_request.value?.natural_person?.location_country_id ?? null
          models.value.natural_person.location_country =
            third_request.value?.natural_person?.location_country ?? null
          models.value.contacts[0].contact_value =
            third_request.value?.emails?.find((it) => it.is_main)
              ?.email_address ?? ''
          models.value.contacts[1].contact_value =
            third_request.value?.phones?.find((ph) => ph.phone_type == 'fixed')
              ?.phone_number ?? ''
          models.value.contacts[2].contact_value =
            third_request.value?.phones?.find((ph) => ph.phone_type == 'mobile')
              ?.phone_number ?? ''

          const address_main = third_request.value?.addresses?.find(
            (add) => add.is_main
          )
          models.value.addresses.address = address_main?.address ?? ''
          models.value.addresses.country_id = address_main?.country_id ?? null
          models.value.addresses.department_id =
            address_main?.department_id ?? null
          models.value.addresses.city_id = address_main?.city_id ?? null

          models.value.sending_correspondence =
            third_request.value?.natural_person?.sending_correspondence ?? ''

          const economic_activities_main =
            third_request.value?.economic_activities?.find((add) => add.is_main)
          models.value.employment_info.ciiu_id =
            economic_activities_main?.ciiu_id ?? null

          _setPersonLoadedState(true)
        }
      } else if (wasPersonLoaded.value) {
        clearPersonFields()
        _setPersonLoadedState(false)
      }
      openMainLoader(false)
    }
  }

  const setCountryFieldFromProps = (
    idField: 'birth_country_id' | 'location_country_id',
    labelField: 'birth_country' | 'location_country'
  ) => {
    if (!props?.data?.natural_person) return

    const countryId = Number(props.data.natural_person[idField])
    if (!countryId || !countries.value?.length) return

    const country = countries.value.find(
      (c: unknown) =>
        Number((c as unknown as { value: number }).value) === countryId
    )

    if (country) {
      models.value.natural_person[idField] = Number(country.value)
      models.value.natural_person[labelField] = String(country.label)
    }
  }

  const clearPersonFields = () => {
    models.value.natural_person.name = ''
    models.value.natural_person.middle_name = ''
    models.value.natural_person.last_name = ''
    models.value.natural_person.second_last_name = ''
    models.value.natural_person.birth_date = ''
    models.value.natural_person.occupation_id = ''
    models.value.natural_person.applicat_type = ''
    models.value.natural_person.issue_date = ''
    models.value.contacts[0].contact_value = ''
    models.value.contacts[1].contact_value = ''
    models.value.contacts[2].contact_value = ''
    models.value.addresses.address = ''
    models.value.addresses.country_id = ''
    models.value.addresses.department_id = ''
    models.value.addresses.city_id = ''
    models.value.sending_correspondence = ''
    models.value.employment_info.ciiu_id = ''
  }

  onMounted(async () => {
    models.value.employment_info.profession_id =
      occupations.value.find((e) => e.value == 390)?.value || null

    indirectThirdPartyRequestTypes.value =
      await getIndirectThirdPartyRequestTypes()
  })

  onBeforeMount(async () => {
    await getResources(`keys[]=${keys.join('&keys[]=')}`)
    setCountryFieldFromProps('birth_country_id', 'birth_country')
    setCountryFieldFromProps('location_country_id', 'location_country')
  })

  watch(
    () => props.data,
    (val) => {
      if (!val) return
      _setValueModel()
      setCountryFieldFromProps('birth_country_id', 'birth_country')
      setCountryFieldFromProps('location_country_id', 'location_country')
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

  watch(
    () => models.value.request_type,
    () => {
      models.value.natural_person.applicat_type =
        models.value.request_type ?? null
    }
  )

  watch(
    () => exist_client.value,
    (val) => {
      if (val) {
        return showAlert(
          `Persona natural ya se encuentra registrada`,
          'error',
          undefined,
          20000
        )
      }
    }
  )

  watch(
    () => props.client_person_type,
    (val) => {
      if (!val) return

      clientPersonTypeLabel.value =
        clientPersonTypeLabels[val as ClientPersonType] || val
    },
    { immediate: true }
  )

  return {
    models,
    formInformation,
    document_types_third_party_natural,
    correspondence,
    third_party_occupations,
    occupations,
    countries,
    departments,
    cities,
    ciius,
    rulesNaturalPersonDocumentType,
    isAddressGeneratorOpen,
    isAddressEmploymentOpen,
    documentNumberRef,
    getOptionsCalendar,
    isCountry,
    validateExistPerson,
    searchInCautionList,
    clientPersonTypeLabel,
    client_person_type,
    indirectThirdPartyRequestTypes,
    third_request,
  }
}

export default useInformationForm
