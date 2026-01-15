import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Utils
import { isEmptyOrZero } from '@/utils'

// Interfaces
import { IInvoiceGenerationOtherItemsForm } from '@/interfaces/customs/billing-portfolio/InvoiceGnerationOtherItems'
import { ISelectorResources } from '@/interfaces/customs/Filters'
import { ActionType } from '@/interfaces/global'
import { IThirdPartyResourceGeneric } from '@/interfaces/customs/resources/ThirdParty'

// Composables
import { useRules, useUtils } from '@/composables'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useSettlementCommissionsResourceStore } from '@/stores/resources-manager/settlement-commissions'
import { useThirdPartyResourceStore } from '@/stores/resources-manager/third-party'

const useBasicDataForm = (
  props: {
    action: ActionType
    data: IInvoiceGenerationOtherItemsForm | null
  },
  emit: Function
) => {
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { business_trusts, movement_codes_parameters } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )
  const { third_party_billings } = storeToRefs(
    useSettlementCommissionsResourceStore('v1')
  )

  const { third_parties } = storeToRefs(useThirdPartyResourceStore('v1'))

  const { is_required, max_length } = useRules()
  const utils = useUtils()

  const formElementRef = ref()

  const initialModelsValues: IInvoiceGenerationOtherItemsForm = {
    issuer_business_id_snapshot: null,
    issuer_business_code_snapshot: null,
    business_document_snapshot: null,
    business_document_type_snapshot: null,

    business_id_snapshot: null,
    business_code_snapshot: null,

    third_party_billing_id: null,
    third_party_billing_document_type_snapshot: null,
    third_party_billing_document_snapshot: null,
    third_party_billing_name_snapshot: null,
    third_party_billing_address_snapshot: null,
    third_party_billing_phone_snapshot: null,
    third_party_billing_email_snapshot: null,

    movement_code_id_snapshot: null,
    movement_code_code_snapshot: null,
    movement_code_movement_snapshot: null,
    movement_code_descriptions_snapshot: null,
    movement_code_has_iva_snapshot: 'no',
    movement_code_percentage_iva_snapshot: '0',

    base_amount: null,
    method_payment: null,
    payday: 15,

    invoice_description: null,
    observations: null,
    snapshotted_at: utils.formatDate(new Date().toISOString(), 'YYYY-MM-DD'),

    iva_amount: null,
    total_amount: null,
    is_source_network: 'no',
    source_network_percentage: '0',
    source_network_amount: 0,
    is_ica: 'no',
    ica_percentage: '0',
    source_ica_amount: 0,
    is_source_iva: 'no',
    source_iva_percentage: '0',
    source_iva_amount: 0,

    number_invoice: null,
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const _setValueModel = () => {
    if (!props.data) return
    models.value = { ...props.data }
  }

  const handleIssuerBusiness = async (val: IThirdPartyResourceGeneric) => {
    _resetKeys({ third_party: ['third_parties'] })

    models.value.issuer_business_id_snapshot = val?.value
      ? Number(val?.value)
      : null
    models.value.issuer_business_code_snapshot = val?.code ?? null

    models.value.business_document_snapshot = null
    models.value.business_document_type_snapshot = null
    if (val?.value) {
      await _getResources(
        { third_party: ['third_parties'] },
        `include=documentType&fields[]=id,document,document_type_id&filter[is_fideicomiso]=true&filter[business_trust_id]=${val.value}`
      )

      models.value.business_document_snapshot =
        third_parties.value?.[0]?.document?.toString() || '-'
      models.value.business_document_type_snapshot =
        third_parties.value?.[0]?.document_type?.abbreviation || '-'
    }
  }

  const handleBusinessTrust = async (val: ISelectorResources) => {
    models.value.third_party_billing_id = null
    models.value.business_id_snapshot = val.value ? Number(val.value) : null
    models.value.business_code_snapshot = val.code ?? null
    clearMovemtCode()

    if (!val) return

    _resetKeys({ settlement_commissions: ['third_party_billings'] })

    await Promise.all([
      _getResources(
        { trust_business: ['movement_codes'] },
        `filter[business_trust_id]=${val.value}`
      ),
      _getResources(
        {
          settlement_commissions: ['third_party_billings'],
        },
        `filter[business_code_snapshot]=${val.code}`
      ),
    ])
  }

  const handleThirdParty = (value: string) => {
    models.value.third_party_billing_id = value

    const third_party = value
      ? third_party_billings.value.find((tp) => tp.value === value)
      : null

    models.value.third_party_billing_document_type_snapshot =
      third_party?.third_party_document_type ?? null
    models.value.third_party_billing_document_snapshot =
      third_party?.third_party_document ?? null
    models.value.third_party_billing_name_snapshot =
      third_party?.third_party_name ?? null

    models.value.third_party_billing_address_snapshot =
      third_party?.third_party_address ?? null
    models.value.third_party_billing_phone_snapshot =
      third_party?.third_party_phone ?? null
    models.value.third_party_billing_email_snapshot =
      third_party?.third_party_email ?? null
  }

  const handleMovementCode = (value: string) => {
    const movement_code_find = value
      ? movement_codes_parameters.value.find((mc) => mc.value === value)
      : null

    models.value.movement_code_id_snapshot = movement_code_find?.id || null
    models.value.movement_code_code_snapshot = movement_code_find?.code || null
    models.value.movement_code_movement_snapshot =
      movement_code_find?.movement || null
    models.value.movement_code_descriptions_snapshot =
      movement_code_find?.description || null

    const hasIva = movement_code_find?.has_iva ? 'si' : 'no'
    models.value.movement_code_has_iva_snapshot = hasIva

    models.value.movement_code_percentage_iva_snapshot =
      movement_code_find?.percentage_iva?.toString() || '0'
  }

  const clearMovemtCode = () => {
    models.value.movement_code_id_snapshot = null
    models.value.movement_code_code_snapshot = null
    models.value.movement_code_movement_snapshot = null
    models.value.movement_code_descriptions_snapshot = null
    models.value.movement_code_has_iva_snapshot = null
    models.value.movement_code_percentage_iva_snapshot = null
    _resetKeys({ trust_business: ['movement_codes_parameters'] })
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
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  return {
    formElementRef,
    models,
    is_required,
    max_length,
    business_trusts,
    third_party_billings,
    movement_codes_parameters,
    utils,

    handleIssuerBusiness,
    handleBusinessTrust,
    handleThirdParty,
    handleMovementCode,
  }
}

export default useBasicDataForm
