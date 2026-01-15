import { ref, onBeforeMount, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

// Interfaces
import {
  IInvoiceGenerationOtherItemsForm,
  IInvoiceGenerationOtherItemsResponse,
} from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useInvoiceGenerationOtherItemsStore } from '@/stores'

const useInvoiceGenerationOtherItemsView = () => {
  const { _getByIdInvoiceGenerationOtherItem, _clearData } =
    useInvoiceGenerationOtherItemsStore('v1')
  const { invoice_generation_other_items_response } = storeToRefs(
    useInvoiceGenerationOtherItemsStore('v1')
  )

  // Data de formularios
  const basic_data_form = ref<IInvoiceGenerationOtherItemsForm | null>(null)

  // Referencias a formularios
  const basicDataFormRef = ref()

  const route = useRoute()
  const searchId = +route.params.id
  const { openMainLoader } = useMainLoader()
  const utils = useUtils()
  const { goToURL } = useGoToUrl()

  const headerProps = {
    title: 'Ver factura otros conceptos',
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
        label: 'Ver',
        route: 'InvoiceGenerationOtherItemsView',
      },
      {
        label: `${searchId}`,
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'basic-data',
      label: 'Datos básicos',
      icon: utils.defaultIconsLucide.bulletList,
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

  const setFormView = (data: IInvoiceGenerationOtherItemsResponse) => {
    const {
      status_id,

      issuer_business_code_snapshot,
      issuer_business_name_snapshot,
      business_document_type_snapshot,
      business_document_snapshot,

      business_code_snapshot,
      business_name_snapshot,

      third_party_billing_document_type_snapshot,
      third_party_billing_document_snapshot,
      third_party_billing_name_snapshot,

      movement_code_code_snapshot,
      movement_code_movement_snapshot,
      movement_code_descriptions_snapshot,
      movement_code_has_iva_snapshot,
      movement_code_percentage_iva_snapshot,

      base_amount,
      iva_amount,
      total_amount,
      method_payment,
      payday,
      invoice_number,
      invoice_description,
      observations,
      created_at,
    } = data

    basic_data_form.value = {
      status_id: status_id,

      issuer_business_code_snapshot,
      issuer_business_name_snapshot,
      business_document_type_snapshot,
      business_document_snapshot,
      business_code_snapshot,
      business_name_snapshot,
      third_party_billing_document_type_snapshot,
      third_party_billing_document_snapshot,
      third_party_billing_name_snapshot,
      movement_code_code_snapshot,
      movement_code_movement_snapshot,
      movement_code_descriptions_snapshot,
      movement_code_has_iva_snapshot: movement_code_has_iva_snapshot
        ? 'Si'
        : 'No',
      movement_code_percentage_iva_snapshot,
      base_amount: +base_amount,
      iva_amount: +iva_amount,
      total_amount: +total_amount,
      method_payment,
      payday,
      number_invoice: invoice_number,
      invoice_description,
      observations,
      snapshotted_at: created_at,

      is_source_network: 'No',
      source_network_percentage: 0,
      source_network_amount: 0,
      is_ica: 'No',
      ica_percentage: 0,
      source_ica_amount: 0,
      is_source_iva: 'No',
      source_iva_percentage: 0,
      source_iva_amount: 0,
    }
  }

  const nextTab = async () => {
    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const onSubmit = async () => {
    goToURL('GenerateInvoicesOtherConceptsList')
  }

  onMounted(async () => {
    _clearData()
  })

  onBeforeMount(async () => {
    openMainLoader(true)
    await _getByIdInvoiceGenerationOtherItem(searchId)
    openMainLoader(false)
  })

  watch(
    () => invoice_generation_other_items_response.value,
    (val) => {
      if (!val) return
      setFormView(val)
    }
  )

  return {
    invoice_generation_other_items_response,
    basic_data_form,
    basicDataFormRef,
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    utils,

    nextTab,
    backTab,
    onSubmit,
    goToURL,
  }
}

export default useInvoiceGenerationOtherItemsView
