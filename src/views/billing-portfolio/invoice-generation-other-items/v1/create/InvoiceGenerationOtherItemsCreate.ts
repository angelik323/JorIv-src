import { ref, onMounted, watch, onBeforeUnmount } from 'vue'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import {
  useInvoiceGenerationOtherItemsStore,
  useResourceManagerStore,
} from '@/stores'

// Interfaces
import { IInvoiceGenerationOtherItemsForm } from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'

const useInvoiceGenerationOtherItemsCreate = () => {
  const { _createInvoiceGenerationOtherItem, _clearData } =
    useInvoiceGenerationOtherItemsStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  // Data de formularios
  const basic_data_form = ref<IInvoiceGenerationOtherItemsForm | null>(null)

  // Referencias a formularios
  const basicDataFormRef = ref()

  const { defaultIconsLucide, cleanEmptyFields } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const headerProps = {
    title: 'Crear registro factura otros conceptos',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Facturación y cartera',
        route: '',
      },
      {
        label: 'Generación de facturación otros conceptos',
        route: 'GenerateInvoicesOtherConceptsList',
      },
      {
        label: 'Crear',
        route: 'InvoiceGenerationOtherItemsCreate',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'basic-data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  // Datos básicos form
  const makeBaseInfoRequest = (
    data: IInvoiceGenerationOtherItemsForm | null
  ) => {
    if (!data) return {}

    const zeroFields: Record<string, number> = {}
    if (data.iva_amount === 0) zeroFields.iva_amount = 0
    if (data.movement_code_percentage_iva_snapshot === 0)
      zeroFields.movement_code_percentage_iva_snapshot = 0

    const request: Partial<IInvoiceGenerationOtherItemsForm> = {
      issuer_business_code_snapshot: data.issuer_business_code_snapshot,
      business_code_snapshot: data.business_code_snapshot,
      business_document_snapshot: data.business_document_snapshot,
      business_document_type_snapshot: data.business_document_snapshot,

      third_party_billing_id: data.third_party_billing_id,
      third_party_billing_document_type_snapshot:
        data.third_party_billing_document_type_snapshot,
      third_party_billing_document_snapshot:
        data.third_party_billing_document_snapshot,
      third_party_billing_name_snapshot: data.third_party_billing_name_snapshot,
      third_party_billing_address_snapshot:
        data.third_party_billing_address_snapshot,
      third_party_billing_phone_snapshot:
        data.third_party_billing_phone_snapshot,
      third_party_billing_email_snapshot:
        data.third_party_billing_email_snapshot,

      movement_code_code_snapshot: data.movement_code_code_snapshot,
      movement_code_movement_snapshot: data.movement_code_movement_snapshot,
      movement_code_descriptions_snapshot:
        data.movement_code_descriptions_snapshot,
      movement_code_has_iva_snapshot:
        data.movement_code_has_iva_snapshot === 'si',
      movement_code_percentage_iva_snapshot:
        data.movement_code_percentage_iva_snapshot,

      base_amount: data.base_amount,
      method_payment: data.method_payment,
      payday: data.payday,

      invoice_description: data.invoice_description,
      observations: data.observations,
    }

    const cleanedRequest = cleanEmptyFields(request)

    return { ...cleanedRequest, ...zeroFields }
  }

  const makeDataRequest = () => {
    const apiRequestBody: Partial<IInvoiceGenerationOtherItemsForm> = {
      ...makeBaseInfoRequest(basic_data_form.value),
    }

    return apiRequestBody
  }

  const validateForms = async () => {
    let valid: boolean = false
    const forms = [basicDataFormRef]

    if (tabActiveIdx.value >= 0 && tabActiveIdx.value < forms.length) {
      try {
        valid =
          (await forms[tabActiveIdx.value]?.value?.validateForm()) ?? false
      } catch {
        valid = false
      }
    }
    return valid
  }

  const nextTab = async () => {
    if (!(await validateForms())) return
    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)
    const payload = makeDataRequest()
    const success = await _createInvoiceGenerationOtherItem(payload)
    if (success) {
      goToURL('GenerateInvoicesOtherConceptsList')
    }
    openMainLoader(false)
  }

  watch(
    () => basic_data_form.value,
    (val) => {
      if (!val) return

      // Rete fuente
      if (val.is_source_network) {
        val.source_network_amount =
          (Number(val.base_amount) * Number(val.source_network_percentage)) /
          100
      }

      // Rete ICA
      if (val.is_ica) {
        val.source_ica_amount =
          (Number(val.base_amount) * Number(val.ica_percentage)) / 100
      }

      // Rete IVA
      if (val.is_source_iva) {
        val.source_iva_amount =
          (Number(val.iva_amount) * Number(val.source_iva_percentage)) / 100
      }

      if (val.base_amount) {
        val.iva_amount =
          (Number(val.base_amount) *
            Number(val.movement_code_percentage_iva_snapshot)) /
          100
        val.total_amount =
          Number(val.base_amount) +
          Number(val.iva_amount || 0) -
          (Number(val.source_network_amount || 0) +
            Number(val.source_ica_amount || 0) +
            Number(val.source_iva_amount || 0))
      }
    },
    { deep: true, immediate: true }
  )

  const keysToClear = {
    trust_business: ['business_trusts', 'movement_codes_parameters'],
    settlement_commissions: ['third_party_billings'],
  }

  onBeforeUnmount(async () => {
    _clearData()
    _resetKeys(keysToClear)
  })

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(
      {
        trust_business: ['business_trusts'],
      },
      'filter[effect]=true'
    )
    openMainLoader(false)
  })

  return {
    basic_data_form,
    basicDataFormRef,
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,

    nextTab,
    backTab,
    onSubmit,
    goToURL,
  }
}

export default useInvoiceGenerationOtherItemsCreate
