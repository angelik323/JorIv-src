import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import {
  useClientsStore,
  useResourceStore,
  useThirdPartiesModuleStore,
} from '@/stores'
import { IClientNaturalPersonRequest } from '@/interfaces/customs'
import {
  IClientsAddresses,
  IClientsContacts,
  IClientsEmployment,
  INaturalClientInformationFormNaturalPerson,
} from '@/interfaces/customs/Clients'
import {
  useAlert,
  useMainLoader,
  useUtils,
  useCalendarRules,
} from '@/composables'
import moment from 'moment'

import { ActionType } from '@/interfaces/global'

import { useThirdPartiesStore } from '@/stores/third-parties'

const isAddressGeneratorOpen = ref(false)
const isAddressEmploymentOpen = ref(false)

const useInformationForm = (props: {
  action: ActionType
  data?: IClientNaturalPersonRequest | null
}) => {
  const { data_information_form } = storeToRefs(useClientsStore('v1'))
  const { _setDataNaturalCLientsInformation } = useClientsStore('v1')

  const { third_request, exist_client, wasPersonLoaded } = storeToRefs(
    useThirdPartiesModuleStore()
  )

  const { _verifyExistThirdParty, _setPersonLoadedState } =
    useThirdPartiesModuleStore()

  const { showAlert } = useAlert()
  const { openMainLoader } = useMainLoader()

  const { isCountry } = useUtils()

  const { rule_older_than } = useCalendarRules()

  const { _searchInCautionList } = useThirdPartiesStore()

  const {
    countries,
    nationalities,
    third_party_request_types,
    document_types_third_party_natural,
    correspondence,
    occupations,
    ciius,
    cities,
    third_party_occupations,
    departments,
  } = storeToRefs(useResourceStore('v1'))

  const requiredJobFields = computed(() => {
    const nonWorkingLabels = new Set([
      'ama/o de casa',
      'desempleado',
      'estudiante',
      'independiente',
      'pensionado',
    ])

    if (!models.value.employment_info.occupation_id) return true

    const found = third_party_occupations.value.find(
      (e) =>
        String(e.value) == String(models.value.employment_info.occupation_id)
    )

    return !nonWorkingLabels.has(String(found?.label ?? '').toLowerCase())
  })

  const formInformation = ref()
  const documentNumberRef = ref()

  const dateNow = moment().format('YYYY-MM-DD HH:mm')

  const models = ref<{
    creation_date: string | null
    created_by?: string
    updated_date?: string
    updated_by?: string
    application_type: string | null
    document_type_id: string | null | number
    document_type: string | null
    document?: string | null
    natural_person: INaturalClientInformationFormNaturalPerson
    nacionality: string | null | number
    contacts: IClientsContacts[]
    sending_correspondence: string | null
    addresses: IClientsAddresses
    employment_info: IClientsEmployment
  }>({
    creation_date: props.action === 'create' ? dateNow : '',
    created_by: '',
    updated_date: '',
    updated_by: '',
    application_type: '',
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
    },
    employment_info: {
      occupation_id: '',
      ciiu_code: '',
      company: '',
      address: '',
      country_id: '',
      department_id: '',
      city_id: '',
      phone: '',
      profession_id: '',
    },
  })

  const fixedPhoneRef = ref()

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

  const handlerActionForm = (action: 'create' | 'edit' | 'view') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: data_information_form.value ? _setValueModel : setFormEdit,
      view: setFormView,
    }
    actionHandlers[action]?.()
  }

  const setFormView = () => {
    clearForm()
    const data = props.data
    if (data) {
      models.value.creation_date = data?.created_at.toString() ?? ''
      models.value.created_by = `${data.third_party?.created_by.name} ${data.third_party?.created_by.last_name}`
      models.value.updated_date = data?.updated_at.toString() ?? ''
      models.value.updated_by = data.third_party?.updated_by
        ? `${data.third_party?.updated_by?.name} ${data.third_party?.updated_by?.last_name}`
        : 'No registrado'
      models.value.application_type = data.third_party?.customer?.request_type
        ? `${data.third_party?.customer?.request_type
            .charAt(0)
            .toLocaleUpperCase()}${data.third_party?.customer?.request_type.slice(
            1
          )}`
        : ''
      models.value.document_type = data?.third_party?.document_type.name ?? ''
      models.value.document = data?.third_party?.document ?? ''
      models.value.natural_person.name =
        data?.third_party?.natural_person?.name ?? null
      models.value.natural_person.middle_name =
        data?.third_party?.natural_person?.middle_name ?? ''
      models.value.natural_person.last_name =
        data?.third_party?.natural_person?.last_name ?? ''
      models.value.natural_person.second_last_name =
        data?.third_party?.natural_person?.second_last_name ?? ''
      models.value.natural_person.birth_date =
        data?.third_party?.natural_person?.birth_date ?? ''
      models.value.nacionality =
        data?.third_party?.tax_info?.nationality?.name ?? ''

      // Datos de contacto
      data?.third_party?.contacts?.map((contact) => {
        switch (contact.contact_type) {
          case 'email':
            models.value.contacts[0].contact_value = contact.contact_value ?? ''
            break
          case 'phone':
            models.value.contacts[1].contact_value = contact.contact_value ?? ''
            break
          case 'mobile':
            models.value.contacts[2].contact_value = contact.contact_value ?? ''
            break

          default:
            models.value.contacts[0].contact_value = ''
            models.value.contacts[1].contact_value = ''
            models.value.contacts[2].contact_value = ''
            break
        }
      })
      models.value.sending_correspondence =
        data?.third_party?.natural_person.sending_correspondence ?? null

      // Dirección
      models.value.addresses.address =
        data?.third_party?.addresses?.[0].address ?? ''
      models.value.addresses.country_id =
        data?.third_party?.addresses?.[0].country?.name ?? null
      models.value.addresses.department_id =
        data?.third_party?.addresses?.[0].department?.name ?? null
      models.value.addresses.city_id =
        data?.third_party?.addresses?.[0].city?.name ?? null

      // Información laboral
      models.value.employment_info.occupation_id =
        data?.third_party?.employment_info?.occupation.name ?? ''
      models.value.employment_info.ciiu_code =
        data?.third_party?.employment_info?.ciiu?.description ?? ''
      models.value.employment_info.company =
        data?.third_party?.employment_info?.company ?? ''

      // Direccion laboral
      models.value.employment_info.address =
        data?.third_party?.employment_info?.address ?? ''
      models.value.employment_info.country_id =
        data?.third_party?.employment_info?.country?.name ?? null
      models.value.employment_info.department_id =
        data?.third_party?.employment_info?.department?.name ?? null
      models.value.employment_info.city_id =
        data?.third_party?.employment_info?.city?.name ?? null
      models.value.employment_info.phone =
        data?.third_party?.employment_info?.phone ?? ''
      models.value.employment_info.profession_id =
        data?.third_party?.employment_info?.profession_info?.occupation ?? ''
    }
  }

  const setFormEdit = () => {
    clearForm()
    const data = props.data
    if (data) {
      models.value.creation_date = data?.created_at.toString() ?? ''
      models.value.created_by = `${data.third_party?.created_by.name} ${data.third_party?.created_by.last_name}`
      models.value.updated_date = data.third_party?.updated_at.toString() ?? ''
      models.value.updated_by = `${data.third_party?.updated_by?.name} ${data.third_party?.updated_by?.last_name}`
      models.value.application_type = data.third_party?.customer?.request_type
        ? `${data.third_party?.customer?.request_type
            .charAt(0)
            .toLocaleUpperCase()}${data.third_party?.customer?.request_type.slice(
            1
          )}`
        : ''
      models.value.document_type_id = data?.third_party?.document_type_id ?? ''
      models.value.document = data?.third_party?.document ?? ''
      models.value.natural_person.name =
        data?.third_party?.natural_person?.name ?? null
      models.value.natural_person.middle_name =
        data?.third_party?.natural_person?.middle_name ?? ''
      models.value.natural_person.last_name =
        data?.third_party?.natural_person?.last_name ?? ''
      models.value.natural_person.second_last_name =
        data?.third_party?.natural_person?.second_last_name ?? ''
      models.value.natural_person.birth_date =
        data?.third_party?.natural_person?.birth_date ?? ''
      models.value.nacionality =
        data?.third_party?.tax_info?.nationality?.id ?? ''

      // Datos de contacto
      data?.third_party?.contacts?.map((contact) => {
        switch (contact.contact_type) {
          case 'email':
            models.value.contacts[0].contact_value = contact.contact_value ?? ''
            break
          case 'phone':
            models.value.contacts[1].contact_value = contact.contact_value ?? ''
            break
          case 'mobile':
            models.value.contacts[2].contact_value = contact.contact_value ?? ''
            break

          default:
            models.value.contacts[0].contact_value = ''
            models.value.contacts[1].contact_value = ''
            models.value.contacts[2].contact_value = ''
            break
        }
      })
      models.value.sending_correspondence =
        data?.third_party?.natural_person.sending_correspondence ?? null

      // Dirección
      models.value.addresses.address =
        data?.third_party?.addresses?.[0].address ?? ''
      models.value.addresses.country_id =
        data?.third_party?.addresses?.[0].country_id ?? null
      models.value.addresses.department_id =
        data?.third_party?.addresses?.[0].department_id ?? null
      models.value.addresses.city_id =
        data?.third_party?.addresses?.[0].city_id ?? null

      // Información laboral
      models.value.employment_info.occupation_id =
        data?.third_party?.employment_info?.occupation.id ?? ''
      models.value.employment_info.ciiu_code =
        data?.third_party?.employment_info?.ciiu?.id ?? ''
      models.value.employment_info.company =
        data?.third_party?.employment_info?.company ?? ''

      // Direccion laboral
      models.value.employment_info.address =
        data?.third_party?.employment_info?.address ?? ''
      models.value.employment_info.country_id =
        data?.third_party?.employment_info.country_id ?? null
      models.value.employment_info.department_id =
        data?.third_party?.employment_info.department_id ?? null
      models.value.employment_info.city_id =
        data?.third_party?.employment_info.city_id ?? null
      models.value.employment_info.phone =
        data?.third_party?.employment_info?.phone ?? ''
      models.value.employment_info.profession_id =
        data?.third_party?.employment_info?.profession_info?.id ?? ''
    }
  }

  const _setValueModel = () => {
    if (data_information_form.value) {
      models.value = { ...data_information_form.value, document_type: '' }
    }
  }

  const clearForm = () => {
    models.value.application_type = ''
    models.value.document_type_id = ''
    models.value.document = ''
    models.value.natural_person.name = null
    models.value.natural_person.middle_name = null
    models.value.natural_person.last_name = null
    models.value.natural_person.second_last_name = null
    models.value.natural_person.birth_date = null
    models.value.nacionality = ''
    models.value.contacts[0].contact_value = ''
    models.value.contacts[1].contact_value = ''
    models.value.contacts[2].contact_value = ''
    models.value.sending_correspondence = ''
    models.value.addresses.address = null
    models.value.addresses.country_id = null
    models.value.addresses.department_id = null
    models.value.addresses.city_id = null
    models.value.employment_info.occupation_id = null
    models.value.employment_info.ciiu_code = null
    models.value.employment_info.company = null
    models.value.employment_info.address = null
    models.value.employment_info.country_id = null
    models.value.employment_info.department_id = null
    models.value.employment_info.city_id = null
    models.value.employment_info.phone = null
    models.value.employment_info.profession_id = null
    models.value.natural_person.occupation_id = null
  }

  const searchInCautionList = async (alert: boolean = true) => {
    const includeCautelarList = await _searchInCautionList(
      String(
        models.value.natural_person.name +
          ' ' +
          models.value.natural_person.last_name
      ),
      String(models.value.document),
      alert
    )
    return includeCautelarList
  }

  onMounted(async () => {
    handlerActionForm(props.action)
  })

  watch(occupations, () => {
    models.value.employment_info.profession_id =
      occupations.value.find((e) => e.value == 390)?.value || null
  })

  watch(
    () => [models.value.contacts[1].contact_value],
    (val) => {
      if (!val[0]) {
        setTimeout(async () => {
          await fixedPhoneRef.value?.resetValidation()
        }, 500)
      }
    }
  )

  watch(
    () => [
      models.value.creation_date,
      models.value.application_type,
      models.value.document_type_id,
      models.value.document,
      models.value.natural_person.name,
      models.value.natural_person.middle_name,
      models.value.natural_person.last_name,
      models.value.natural_person.second_last_name,
      models.value.natural_person.birth_date,
      models.value.natural_person.issue_date,
      models.value.natural_person.applicat_type,
      models.value.natural_person.occupation_id,
      models.value.nacionality,
      models.value.sending_correspondence,
      models.value.contacts[0].contact_value,
      models.value.contacts[1].contact_value,
      models.value.contacts[2].contact_value,
      models.value.addresses.address,
      models.value.addresses.country_id,
      models.value.addresses.department_id,
      models.value.addresses.city_id,
      models.value.employment_info.occupation_id,
      models.value.employment_info.ciiu_code,
      models.value.employment_info.company,
      models.value.employment_info.address,
      models.value.employment_info.country_id,
      models.value.employment_info.department_id,
      models.value.employment_info.city_id,
      models.value.employment_info.phone,
      models.value.employment_info.profession_id,
    ],
    () => {
      if (useUtils().isEmpty(models.value)) {
        _setDataNaturalCLientsInformation(null)
      } else {
        _setDataNaturalCLientsInformation({
          creation_date: models.value.creation_date ?? '',
          application_type: models.value.application_type ?? null,
          document_type_id: models.value.document_type_id ?? null,
          document: models.value.document ?? null,
          natural_person: {
            name: models.value.natural_person.name ?? '',
            middle_name: models.value.natural_person.middle_name ?? null,
            last_name: models.value.natural_person.last_name ?? null,
            second_last_name:
              models.value.natural_person.second_last_name ?? null,
            birth_date: models.value.natural_person.birth_date ?? null,
            issue_date: '',
            applicat_type: '',
            occupation_id: models.value.natural_person.occupation_id ?? null,
          },
          contacts: [
            {
              contact_type: 'email',
              contact_value: models.value.contacts?.[0].contact_value ?? null,
              is_main: '0',
            },
            {
              contact_type: 'phone',
              contact_value: models.value.contacts?.[1].contact_value ?? null,
              is_main: '0',
            },
            {
              contact_type: 'mobile',
              contact_value: models.value.contacts?.[2].contact_value ?? null,
              is_main: '0',
            },
          ],
          nacionality: models.value.nacionality ?? null,
          sending_correspondence: models.value.sending_correspondence ?? null,
          addresses: {
            address: models.value.addresses.address ?? null,
            country_id: models.value.addresses.country_id ?? null,
            department_id: models.value.addresses.department_id ?? null,
            city_id: models.value.addresses.city_id ?? null,
            address_type: null,
            postal_code: null,
            is_main: null,
          },
          employment_info: {
            occupation_id: models.value.employment_info.occupation_id ?? null,
            ciiu_code: models.value.employment_info.ciiu_code ?? null,
            company: models.value.employment_info.company ?? null,
            address: models.value.employment_info.address ?? null,
            country_id: models.value.employment_info.country_id ?? null,
            department_id: models.value.employment_info.department_id ?? null,
            city_id: models.value.employment_info.city_id ?? null,
            phone: models.value.employment_info.phone ?? null,
            profession_id: models.value.employment_info.profession_id ?? null,
          },
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

  watch(
    () => models.value.application_type,
    () => {
      models.value.natural_person.applicat_type = models.value.application_type
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
          models.value.contacts[0].contact_value =
            third_request.value?.emails?.find((it) => it.is_main)
              ?.email_address ?? ''
          models.value.contacts[1].contact_value =
            third_request.value?.phones?.find((ph) => ph.phone_type == 'phone')
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
          models.value.employment_info.ciiu_code =
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
    models.value.employment_info.ciiu_code = ''
  }

  return {
    models,
    formInformation,
    third_party_request_types,
    document_types_third_party_natural,
    correspondence,
    third_party_occupations,
    occupations,
    ciius,
    nationalities,
    countries,
    departments,
    cities,
    rulesNaturalPersonDocumentType,
    fixedPhoneRef,
    isAddressGeneratorOpen,
    isAddressEmploymentOpen,
    documentNumberRef,
    requiredJobFields,
    third_request,

    getOptionsCalendar,
    isCountry,
    validateExistPerson,
    searchInCautionList,
  }
}

export default useInformationForm
