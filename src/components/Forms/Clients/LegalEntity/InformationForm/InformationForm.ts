/* eslint-disable @typescript-eslint/no-explicit-any */

import { onMounted, watch, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import {
  useClientsStore,
  useResourceStore,
  useThirdPartiesModuleStore,
} from '@/stores'
import { useThirdPartiesStore } from '@/stores/third-parties'
import { ILegalClientInformation } from '@/interfaces/customs/Clients'
import { useAlert, useMainLoader, useRules, useUtils } from '@/composables'
import moment from 'moment'

const useInformationForm = (props: any) => {
  const { data_legal_information_form } = storeToRefs(useClientsStore('v1'))
  const { _setDataLegalCLientsInformation } = useClientsStore('v1')
  const { openMainLoader } = useMainLoader()
  const { showAlert } = useAlert()

  const {
    third_party_request_types,
    document_types_third_legal,
    correspondence,
    countries,
    departments,
    cities,
    third_party_natures,
  } = storeToRefs(useResourceStore('v1'))

  const { _searchInCautionList } = useThirdPartiesStore()

  const { third_request, exist_client, wasPersonLoaded } = storeToRefs(
    useThirdPartiesModuleStore()
  )
  const { _verifyExistThirdParty, _setPersonLoadedState } =
    useThirdPartiesModuleStore()

  const { date_before_or_equal_to_the_current_date } = useRules()

  const dateNow = moment().format('YYYY-MM-DD HH:mm')

  const { calculateCheckDigit, formatFullName, isCountry } = useUtils()

  const formInformation = ref()
  const isAddressGeneratorOpen = ref(false)

  const models = ref({
    creation_date: props.action === 'create' ? dateNow : '',
    created_by: null as string | null,
    updated_date: null as string | null,
    updated_by: null as string | null,
    date_incorporation: null as string | null,
    application_type: null as string | null,
    document_type: '' as string | null | number,
    document_number: null as string | null,
    check_digit: null as string | null,
    email: null as string | null,
    phone: null as string | null,
    sending_correspondence: null as string | null,
    name: null as string | null,
    nature: null as string | null,
    constitution_country: null as string | null | number,
    address: null as string | null,
    country: null as string | number | null,
    department: null as string | number | null,
    city: null as string | number | null,
  })

  const rulesLegalPersonDocumentType = computed(() => {
    if (models.value.document_type === 14) {
      return [
        (v: string) => !!v || 'El número de documento es requerido',
        (v: string) => /^[0-9]+$/.test(v) || 'Debe tener solo números',
        (v: string) => v.length === 9 || 'Debe tener 9 caracteres',
        (v: string) => /^[689]/.test(v) || 'Debe comenzar con 6, 8 o 9',
      ]
    }
    if (models.value.document_type === 15) {
      return [
        (v: string) => !!v || 'El número de documento es requerido',
        (v: string) =>
          /^[A-Za-z0-9]+$/.test(v) || 'Debe tener solo números y letras',
        (v: string) =>
          (v.length >= 6 && v.length <= 30) ||
          'Debe tener entre 6 a 30 caracteres',
      ]
    }
    return [(v: string) => !!v || 'El número de documento es requerido']
  })

  const documentNumberRef = ref()

  const isEmpty = (obj: Record<string, any>): boolean => {
    return Object.values(obj).every(
      (value) => value === 0 || value === '' || value === null
    )
  }

  const handlerActionForm = (action: 'create' | 'edit' | 'view') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: data_legal_information_form.value ? _setValueModel : setFormEdit,
      view: setFormView,
    }
    actionHandlers[action]?.()
  }

  const setFormView = () => {
    clearForm()
    const data: ILegalClientInformation = props.data
    if (data) {
      models.value.creation_date = data?.customer?.created_at ?? ''
      models.value.created_by = formatFullName({
        firstName: data?.customer?.created_by?.name,
        lastName: data?.customer?.created_by?.last_name,
      })
      models.value.updated_date = data?.customer?.updated_at ?? null
      models.value.updated_by = formatFullName({
        firstName: data?.customer?.updated_by?.name,
        lastName: data?.customer?.updated_by?.last_name,
      })
      models.value.date_incorporation =
        data?.legal_person?.constitution_date ?? null
      models.value.application_type = data?.customer?.request_type ?? null
      // @ts-ignore
      models.value.document_type = data?.third_party?.document_type ?? null
      models.value.document_number = data?.third_party?.document ?? null
      models.value.email =
        data?.contacts?.find((it) => it.contact_type === 'email')
          ?.contact_value ?? null
      models.value.phone =
        data?.contacts?.find((it) => it.contact_type === 'phone')
          ?.contact_value ?? null
      models.value.sending_correspondence =
        data?.legal_person?.sending_correspondence ?? null
      models.value.name = data?.legal_person?.business_name ?? null
      models.value.nature = data?.legal_person?.nature ?? null
      models.value.constitution_country = data?.legal_person?.country ?? null
      models.value.country = data?.addresses?.[0]?.country ?? null
      models.value.department = data?.addresses?.[0]?.department ?? null
      models.value.city = data?.addresses?.[0]?.city ?? null
      models.value.address = data?.addresses?.[0]?.address ?? null
    }
  }

  const setFormEdit = () => {
    clearForm()
    const data: ILegalClientInformation = props.data
    if (data) {
      models.value.creation_date = data?.customer?.created_at ?? ''
      models.value.created_by = formatFullName({
        firstName: data?.customer?.created_by?.name,
        lastName: data?.customer?.created_by?.last_name,
      })
      models.value.updated_date = data?.customer?.updated_at ?? null
      models.value.updated_by = formatFullName({
        firstName: data?.customer?.updated_by?.name,
        lastName: data?.customer?.updated_by?.last_name,
      })
      models.value.date_incorporation =
        data?.legal_person?.constitution_date ?? null
      models.value.application_type = data?.customer?.request_type ?? null
      // @ts-ignore
      models.value.document_type = data?.third_party?.document_type_id ?? null
      models.value.document_number = data?.third_party?.document ?? null

      data.contacts?.map((contact) => {
        switch (contact.contact_type) {
          case 'email':
            models.value.email = contact.contact_value ?? ''
            break
          case 'phone':
            models.value.phone = contact.contact_value ?? ''
            break
          default:
            models.value.email = ''
            models.value.phone = ''
            break
        }
      })
      models.value.sending_correspondence =
        data?.legal_person?.sending_correspondence ?? null
      models.value.name = data?.legal_person?.business_name ?? null
      models.value.nature = data?.legal_person?.nature ?? null
      models.value.constitution_country = data?.legal_person?.country_id ?? null
      models.value.country = data?.addresses?.[0]?.country_id ?? null
      models.value.department = data?.addresses?.[0]?.department_id ?? null
      models.value.city = data?.addresses?.[0]?.city_id ?? null
      models.value.address = data?.addresses?.[0]?.address ?? null
    }
  }

  const _setValueModel = () => {
    if (data_legal_information_form.value) {
      // @ts-ignore
      models.value = { ...data_legal_information_form.value }
    }
  }

  const clearForm = () => {
    models.value.date_incorporation = null
    models.value.application_type = null
    models.value.document_type = null
    models.value.document_number = null
    models.value.email = null
    models.value.phone = null
    models.value.sending_correspondence = null
    models.value.name = null
    models.value.nature = null
    models.value.constitution_country = null
    models.value.country = null
    models.value.department = null
    models.value.city = null
    models.value.address = null
  }

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

  onMounted(async () => {
    handlerActionForm(props.action)
  })

  watch(
    () => [
      models.value.creation_date,
      models.value.created_by,
      models.value.updated_date,
      models.value.updated_by,
      models.value.date_incorporation,
      models.value.application_type,
      models.value.document_type,
      models.value.document_number,
      models.value.email,
      models.value.phone,
      models.value.sending_correspondence,
      models.value.name,
      models.value.nature,
      models.value.constitution_country,
      models.value.country,
      models.value.department,
      models.value.city,
      models.value.address,
    ],
    () => {
      if (isEmpty(models.value)) {
        _setDataLegalCLientsInformation(null)
      } else {
        _setDataLegalCLientsInformation({
          creation_date: models.value.creation_date,
          created_by: models.value.created_by,
          updated_date: models.value.updated_date,
          updated_by: models.value.updated_by,
          date_incorporation: models.value.date_incorporation ?? null,
          application_type: models.value.application_type ?? null,
          document_type: models.value.document_type ?? null,
          document_number: models.value.document_number ?? null,
          email: models.value.email ?? null,
          phone: models.value.phone ?? null,
          sending_correspondence: models.value.sending_correspondence ?? null,
          name: models.value.name ?? null,
          nature: models.value.nature ?? null,
          constitution_country: models.value.constitution_country ?? null,
          country: models.value.country ?? null,
          department: models.value.department ?? null,
          city: models.value.city ?? null,
          address: models.value.address ?? null,
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
    },
    { immediate: true }
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
          models.value.nature = third_request.value?.legal_person?.nature ?? ''
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
        clearPersonFields()
        _setPersonLoadedState(false)
      }
      openMainLoader(false)
    }
  }

  const clearPersonFields = () => {
    models.value.name = null
    models.value.nature = null
    models.value.constitution_country = null
    models.value.sending_correspondence = null
    models.value.email = null
    models.value.phone = null
    models.value.address = null
    models.value.country = null
    models.value.department = null
    models.value.city = null
  }

  return {
    models,
    formInformation,
    third_party_request_types,
    document_types_third_legal,
    correspondence,
    countries,
    departments,
    cities,
    rulesLegalPersonDocumentType,
    third_party_natures,
    isAddressGeneratorOpen,
    documentNumberRef,
    date_before_or_equal_to_the_current_date,
    third_request,

    isCountry,
    validateExistPerson,
    searchInCautionList,
  }
}

export default useInformationForm
