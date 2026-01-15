import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import {
  useClientsStore,
  useResourceStore,
  useThirdPartyResourceStore,
  useTrustBusinessResourceStore,
} from '@/stores'
import { ITrustorClientForm, ITrustorResponse } from '@/interfaces/customs'
import { useUtils } from '@/composables'
import { ActionType } from '@/interfaces/global'

const useInformationForm = (props: {
  action: ActionType
  data?: ITrustorResponse | null
}) => {
  const { _setDataTrustorCLientsInformation } = useClientsStore('v1')
  const { data_trustor_information_form } = storeToRefs(useClientsStore('v1'))
  const { business_trusts } = storeToRefs(useTrustBusinessResourceStore('v1'))
  const {
    countries,
    departments,
    cities,
    third_party_request_types,
    correspondence,
    phone_types,
  } = storeToRefs(useResourceStore('v1'))
  const { document_types_third_party_fideicomiso } = storeToRefs(
    useThirdPartyResourceStore('v1')
  )
  const { isCountry, isEmpty } = useUtils()

  const formInformation = ref()
  const isAddressGeneratorOpen = ref(false)

  const dateNow = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date())

  const models = ref<ITrustorClientForm>({
    creation_date: props.action === 'create' ? dateNow : '',
    request_type: '',
    document_type_id: '',
    fideicomiso_person: {
      sending_correspondence: null,
      business_trust_id: null,
    },
    address: '',
    name: null,
    country_id: null,
    department_id: null,
    city_id: null,
    email: '',
    phone_number: '',
    address_type: null,
    phone_type: null,
  })

  const handlerActionForm = (action: 'create' | 'edit' | 'view') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: setFormEdit,
      view: setFormView,
    }

    actionHandlers[action]?.()
  }

  const setFormView = () => {
    clearForm()
    const data: ITrustorResponse | null = props.data ?? null
    if (data) {
      models.value.creation_date = data?.created_at ?? ''
      models.value.request_type = data?.request_type ?? null
      models.value.document_type_id =
        data?.third_party.document_type.name ?? null
      models.value.fideicomiso_person.business_trust_id = `${data?.third_party.fideicomiso_person.business_trust.business_code} - ${data?.third_party.fideicomiso_person.business_trust.name}`
      models.value.name =
        data?.third_party.fideicomiso_person.business_trust.name ?? null

      models.value.country_id =
        data?.third_party.addresses[0].country?.name ?? null
      models.value.department_id =
        data?.third_party.addresses[0].department?.name ?? null
      models.value.city_id = data?.third_party.addresses[0].city?.name ?? null
      models.value.address = data?.third_party.addresses[0].address ?? null

      models.value.email = data?.third_party.contacts[0].contact_value ?? null
      models.value.phone_number =
        data?.third_party.contacts[1]?.contact_value ?? null
      models.value.phone_type =
        data?.third_party.contacts[1]?.contact_type ?? null

      models.value.fideicomiso_person.sending_correspondence =
        data?.third_party.fideicomiso_person.sending_correspondence ?? null
    }
  }

  const setFormEdit = () => {
    clearForm()
    const data: ITrustorResponse | null = props.data ?? null
    if (data) {
      models.value.creation_date = data?.created_at ?? ''
      models.value.request_type = data?.request_type ?? null
      models.value.document_type_id = data?.third_party.document_type_id ?? null
      models.value.fideicomiso_person.business_trust_id =
        data?.third_party.fideicomiso_person.business_trust.id ?? null
      models.value.name =
        data?.third_party.fideicomiso_person.business_trust.name ?? null

      models.value.country_id =
        data?.third_party.addresses[0].country_id ?? null
      models.value.department_id =
        data?.third_party.addresses[0].department_id ?? null
      models.value.city_id = data?.third_party.addresses[0].city_id ?? null
      models.value.address = data?.third_party.addresses[0].address ?? null

      models.value.email = data?.third_party.contacts[0].contact_value ?? null
      models.value.phone_number =
        data?.third_party.contacts[1]?.contact_value ?? null
      models.value.phone_type =
        data?.third_party.contacts[1]?.contact_type ?? null

      models.value.fideicomiso_person.sending_correspondence =
        data?.third_party.fideicomiso_person.sending_correspondence ?? null

      // models.value.request_type = data?.request_type ?? null
      // models.value.document_type_id = data?.document_type_id ?? null
      // models.value.country_id = data?.country_id ?? null
      // models.value.department_id = data?.department_id ?? null
      // models.value.city_id = data?.city_id ?? null
      // models.value.address = data?.address ?? null
    }
  }

  const _setValueModel = () => {
    if (data_trustor_information_form.value) {
      models.value = { ...data_trustor_information_form.value }
    }
  }

  const clearForm = () => {
    models.value.request_type = null
    models.value.document_type_id = null
    models.value.fideicomiso_person.business_trust_id = null
    models.value.fideicomiso_person.sending_correspondence = null
    models.value.name = null
    models.value.email = null
    models.value.phone_number = null
    models.value.phone_type = null
    models.value.country_id = null
    models.value.department_id = null
    models.value.city_id = null
    models.value.address = null
  }

  const getCurrentDate = () => {
    const d = new Date()
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    const hh = String(d.getHours()).padStart(2, '0')
    const min = String(d.getMinutes()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`
  }

  const setInitialValues = () => {
    models.value.creation_date = getCurrentDate()
  }

  watch(
    () => [
      models.value.request_type,
      models.value.document_type_id,
      models.value.fideicomiso_person,
      models.value.name,
      models.value.address,
      models.value.email,
      models.value.phone_number,
      models.value.phone_type,
    ],
    () => {
      if (isEmpty(models.value)) {
        _setDataTrustorCLientsInformation(null)
      } else {
        _setDataTrustorCLientsInformation(models.value)
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
    () => models.value.fideicomiso_person.business_trust_id,
    (val) => {
      if (!val) {
        models.value.name = null
        return
      }
      const selectedTrust = business_trusts.value.find(
        (trust) => trust.id === val
      )
      if (!selectedTrust) return
      models.value.name = selectedTrust.name ?? null
    }
  )

  onMounted(async () => {
    handlerActionForm(props.action)
    if (['create'].includes(props.action)) {
      setInitialValues()
    }
  })

  return {
    models,
    formInformation,
    third_party_request_types,
    countries,
    correspondence,
    isAddressGeneratorOpen,
    departments,
    cities,
    phone_types,
    business_trusts,
    document_types_third_party_fideicomiso,
    isCountry,
  }
}

export default useInformationForm
