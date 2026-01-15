import { watch, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import moment from 'moment'

//Interfaces
import { ActionType } from '@/interfaces/global'
import { IClientIndirectBasicForm } from '@/interfaces/customs/clients/ClientIndirectLegalPerson'
import { IClientDirectBasicForm } from '@/interfaces/customs/clients/ClientDirectLegalPerson'
import { ClientPersonType } from '@/interfaces/global/Clients'

//Composables
import { useRules, useUtils, useMainLoader, useAlert } from '@/composables'

//Constantes
import { correspondence } from '@/constants/resources/clients'
import { default_statuses } from '@/constants'

//Stores
import {
  useAssetResourceStore,
  useThirdPartyResourceStore,
} from '@/stores/resources-manager'
import { useThirdPartiesModuleStore } from '@/stores/third-party'
import { useThirdPartiesStore } from '@/stores/third-parties'
import { useClientsStore } from '@/stores/clients'
import { useResourceStore } from '@/stores/resources-selects'

const useBasicInformationForm = (
  props: {
    action: ActionType
    data: IClientIndirectBasicForm | null
  },
  emit: Function
) => {
  const { openMainLoader } = useMainLoader()
  const { isEmptyOrZero, calculateCheckDigit, isCountry } = useUtils()
  const { showAlert } = useAlert()

  const { countries } = storeToRefs(useResourceStore('v1'))
  const {
    document_types_third_legal,
    legal_people_company_classification,
    third_party_natures,
    cities,
    departments,
  } = storeToRefs(useAssetResourceStore('v1'))

  const { indirect_third_party_request_types } = storeToRefs(
    useThirdPartyResourceStore('v1')
  )

  const { _searchInCautionList } = useThirdPartiesStore()

  const { third_request, exist_client, wasPersonLoaded } = storeToRefs(
    useThirdPartiesModuleStore()
  )
  const { _verifyExistThirdParty, _setPersonLoadedState } =
    useThirdPartiesModuleStore()
  const { client_person_type } = storeToRefs(useClientsStore('v2'))

  const dateNow = moment().format('YYYY-MM-DD HH:mm')
  const formBasicInformation = ref()
  const isAddressGeneratorOpen = ref(false)
  const documentNumberRef = ref()

  const initializeModel = () => {
    const baseModel = {
      creation_date:
        props.action === 'create' || props.action === 'edit' ? dateNow : '',
      type_client: 'Indirecto',
      request_type: null as string | null,
      document_type: '' as string | null | number,
      document_number: null as string | null,
      name: null as string | null,
      created_by: null as string | null,
      updated_date: null as string | null,
      updated_by: null as string | null,
      nature_third_party: null as string | null | number,
      constitution_country: null as string | null | number,
      date_incorporation: null as string | null,
      country: null as string | number | null,
      department: null as string | number | null,
      city: null as string | number | null,
      address: null as string | null,
      email: null as string | null,
      mobile: null as string | null,
      sending_correspondence: null as string | null,
      check_digit: null as string | null,
    }

    if (client_person_type.value === ClientPersonType.LEGAL_INDIRECT) {
      return {
        ...baseModel,
        classification_company: null as string | null | number,
        phone: null as string | null,
        status_id: null as string | null,
      } as IClientIndirectBasicForm
    }

    return baseModel as IClientDirectBasicForm
  }

  const models = ref(initializeModel())

  const clientLegalTypeDirect = computed(
    () => client_person_type.value === ClientPersonType.LEGAL_DIRECT
  )

  const rulesLegalPersonDocumentType = computed(() => {
    if (models.value.document_type === 14) {
      return [
        (v: string) =>
          useRules().is_required(v, 'El número de documento es requerido'),
        (v: string) => useRules().only_number(v),
        (v: string) => useRules().max_length(v, 9),
        (v: string) => {
          if (!v) return true
          const str = String(v)
          return (
            /^[689]/.test(str) ||
            'El número de documento debe comenzar con 6, 8 o 9'
          )
        },
      ]
    }

    if (models.value.document_type === 15) {
      return [
        (v: string) =>
          useRules().is_required(v, 'El número de documento es requerido'),
        (v: string) => useRules().only_alphanumeric(v),
        (v: string) => useRules().min_length(v, 12),
        (v: string) => useRules().max_length(v, 12),
      ]
    }

    return [
      (v: string) =>
        useRules().is_required(v, 'El número de documento es requerido'),
    ]
  })

  const validateExistPerson = async () => {
    if (['edit', 'view'].includes(props.action)) return
    if (!documentNumberRef.value) return

    const isValidDocumentNumber = await documentNumberRef.value.validate()

    if (isValidDocumentNumber && models.value.document_type) {
      openMainLoader(true)
      await _verifyExistThirdParty(
        {
          document: Number(models.value.document_number),
          type: models.value.document_type as number,
        },
        false,
        true
      )

      if (third_request.value) {
        models.value.name =
          third_request.value?.legal_person?.business_name ?? ''
        if (third_request.value?.legal_person?.nature)
          models.value.nature_third_party =
            third_request.value?.legal_person?.nature ?? ''
        models.value.constitution_country =
          third_request.value?.legal_person?.country_id ?? null

        if (third_request.value?.legal_person?.sending_correspondence) {
          models.value.sending_correspondence =
            third_request.value?.legal_person?.sending_correspondence
        }

        const email_main =
          third_request.value?.emails?.find((it) => it.is_main)
            ?.email_address ?? ''
        if (email_main) {
          models.value.email = email_main
        }

        const phone_fixed =
          third_request.value?.phones?.find((ph) => ph.is_main)?.phone_number ??
          null
        if (phone_fixed) {
          models.value.phone = phone_fixed
        }

        const address_main = third_request.value?.addresses?.find(
          (add) => add.is_main
        )

        models.value.address = address_main?.address ?? ''
        models.value.country = address_main?.country_id ?? null
        models.value.department = address_main?.department_id ?? null
        models.value.city = address_main?.city_id ?? null

        _setPersonLoadedState(true)
      } else if (wasPersonLoaded.value) {
        _setPersonLoadedState(false)
      }
      openMainLoader(false)
    }
  }

  const _setValueModel = () => {
    Object.assign(models.value, props.data)
  }
  third_request

  const searchInCautionList = async (alert: boolean = true) => {
    openMainLoader(true)

    const includeCautelarList = await _searchInCautionList(
      String(models.value.name),
      String(models.value.document_number),
      alert
    )
    openMainLoader(false)

    return includeCautelarList
  }

  watch(
    () => [models.value.document_number, models.value.document_type],
    async () => {
      if (
        [14].includes(models.value.document_type as number) &&
        models.value.document_number
      ) {
        const dv = calculateCheckDigit(models.value.document_number)
        models.value.check_digit = isNaN(dv) ? null : dv.toString()
      } else {
        models.value.check_digit = null
      }
    }
  )

  watch(
    () => props.data,
    (val) => {
      if (!val) return
      _setValueModel()
    },
    { deep: true, immediate: true }
  )

  watch(
    () => models.value,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return

      emit('update:basic-data-form', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  watch(
    () => exist_client.value,
    (val) => {
      if (val) {
        return showAlert(
          `Persona jurídica ya se encuentra registrada`,
          'error',
          undefined,
          5000
        )
      }
    }
  )

  return {
    models,
    formBasicInformation,
    documentNumberRef,
    isAddressGeneratorOpen,
    rulesLegalPersonDocumentType,
    clientLegalTypeDirect,

    correspondence,
    default_statuses,
    document_types_third_legal,
    legal_people_company_classification,
    third_party_natures,
    countries,
    cities,
    departments,
    indirect_third_party_request_types,
    third_request,

    useRules,
    isCountry,
    validateExistPerson,
    searchInCautionList,
  }
}

export default useBasicInformationForm
