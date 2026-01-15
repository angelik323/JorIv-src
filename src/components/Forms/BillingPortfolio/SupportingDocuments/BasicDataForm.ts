import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// interfaces
import { ActionType } from '@/interfaces/global'
import { ISupportingDocumentForm } from '@/interfaces/customs'
import { IContact } from '@/interfaces/customs/IThirdParties'

// composables
import { useUtils } from '@/composables'

// store
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useBillingCollectStore } from '@/stores/resources-manager/billing-collect'
import { useThirdPartyResourceStore } from '@/stores/resources-manager/third-party'

const useBasicDataForm = (
  props: {
    action: ActionType
    data: ISupportingDocumentForm | null
  },
  emit: Function
) => {
  const { business_trusts, movement_codes_parameters } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )

  const { third_parties } = storeToRefs(useThirdPartyResourceStore('v1'))

  const { payment_methods } = storeToRefs(useBillingCollectStore('v1'))

  const utils = useUtils()
  const formElementRef = ref()

  const initialModelsValues: ISupportingDocumentForm = {
    // business
    business_trust_id: null,
    business_code_snap: null,
    business_name_snap: null,
    type_document: null,
    document_number: null,
    // terceros
    third_party_billing_id: null,
    third_party_address_snap: null,
    third_party_phone_snap: null,
    third_party_email_snap: null,
    third_party_type_document_snap: null,
    third_party_document_snap: null,
    third_party_name_snap: null,
    // info
    production_date: utils.formatDate(new Date().toISOString(), 'YYYY-MM-DD'),
    payment_methods: null,
    description: null,
    // movement code
    movement_code_id: null,
    movement_code_snap: null,
    generate_iva: 'no',
    iva_percentage: '0',
    generate_source_rete: 'no',
    rete_source_percentage: '0',
    generate_source_ica: 'no',
    rete_ica_percentage: '0',
    generate_rete_iva: 'no',
    rete_iva_percentage: '0',
    // amounts
    base_amount: null,
    base_iva: null,
    rete_source: null,
    rete_ica: null,
    rete_iva: null,
    total_amount: null,
    days_for_pays: 15,
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const _setValueModel = () => {
    if (!props.data) return
    models.value = { ...props.data }
  }

  const handleIssuerBusiness = (value: number) => {
    const businessTrust = value
      ? business_trusts.value.find((bt) => bt.value === value)
      : null

    models.value.business_trust_id = value || null
    models.value.business_code_snap = businessTrust?.code || null
    models.value.business_name_snap = businessTrust?.label || null
    models.value.type_document = '-'
    models.value.document_number = '-'
  }

  const handleThirdParty = (value: number) => {
    models.value.third_party_billing_id = value

    const third_party = value
      ? third_parties.value?.find((tp) => tp.value === value)
      : null

    models.value.third_party_type_document_snap =
      third_party?.document_type?.abbreviation ?? null
    models.value.third_party_document_snap = third_party?.document ?? null
    models.value.third_party_name_snap = third_party?.name ?? null

    const findMainContact = (contacts: IContact[] = [], type?: string) => {
      if (!Array.isArray(contacts)) return null
      return (
        contacts.find((c) => c.is_main && (!type || c.contact_type === type))
          ?.contact_value || '-'
      )
    }

    models.value.third_party_address_snap = Array.isArray(
      third_party?.addresses
    )
      ? third_party.addresses.find((addr) => addr.is_main)?.address || null
      : '-'

    models.value.third_party_phone_snap = findMainContact(
      third_party?.contacts,
      'phone'
    )
    models.value.third_party_email_snap = findMainContact(
      third_party?.contacts,
      'email'
    )
  }

  const handleMovementCode = (value: string) => {
    const movement_code_find = value
      ? movement_codes_parameters.value.find((mc) => mc.value === value)
      : null

    models.value.movement_code_id = movement_code_find?.id || null
    models.value.movement_code_snap = movement_code_find?.code || null
    models.value.movement_code_description =
      movement_code_find?.description || null

    const hasIva = movement_code_find?.has_iva ? 'si' : 'no'
    models.value.generate_iva = hasIva

    models.value.iva_percentage =
      movement_code_find?.percentage_iva?.toString() || '0'
  }

  // Sincroniza el modelo con la prop 'data'
  watch(
    () => props.data,
    (val) => {
      if (!val) return
      _setValueModel()
    },
    { deep: true, immediate: true }
  )

  watch(
    models,
    (val) => {
      // Evita bucle infinito
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', utils.isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  return {
    formElementRef,
    models,
    utils,
    third_parties,
    business_trusts,
    movement_codes_parameters,
    payment_methods,

    handleIssuerBusiness,
    handleThirdParty,
    handleMovementCode,
  }
}

export default useBasicDataForm
