import { ref, onBeforeMount, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  ISupportingDocumentResponse,
  ISupportingDocumentForm,
} from '@/interfaces/customs'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useSupportingDocumentsStore } from '@/stores'

const useSupportingDocumentsView = () => {
  const { _getByIdSupportingDocuments, _clearData } =
    useSupportingDocumentsStore('v1')
  const { supporting_documents_response } = storeToRefs(
    useSupportingDocumentsStore('v1')
  )

  // Referencias a formularios
  const basicDataFormRef = ref()

  const { defaultIconsLucide } = useUtils()
  const route = useRoute()
  const searchId = +route.params.id
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const basic_data = ref<ISupportingDocumentForm | null>(null)

  const headerProps = {
    title: 'Ver documento de soporte',
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
        label: 'Documentos de soporte',
        route: 'SupportingDocumentsList',
      },
      {
        label: 'Ver',
        route: 'SupportingDocumentsView',
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
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ])

  const setFormRead = (data: ISupportingDocumentResponse) => {
    const {
      business_trust,
      third_party_billing,
      production_date,
      payment_methods,
      description,
      movement_code,

      base_amount,
      base_iva,
      rete_source,
      rete_ica,
      rete_iva,
      total_amount,
      days_for_pays,
      status,
      support_document_number,
    } = data

    basic_data.value = {
      business_trust_id: business_trust?.id,
      business_code_snap: business_trust?.code,
      business_name_snap: business_trust?.name,
      type_document: data.type_document,
      document_number: data.document_number,

      third_party_billing_id: third_party_billing?.id,
      third_party_address_snap: third_party_billing?.address,
      third_party_phone_snap: third_party_billing?.phone,
      third_party_email_snap: third_party_billing?.email,
      third_party_type_document_snap: third_party_billing?.type_document,
      third_party_document_snap: third_party_billing?.document,
      third_party_name_snap: third_party_billing?.name,
      third_party_billing_name: `${
        third_party_billing?.type_document ?? ''
      } - ${third_party_billing?.document ?? ''} - ${
        third_party_billing?.name ?? ''
      }`,

      production_date,
      payment_methods,
      description,

      movement_code_id: movement_code?.id,
      movement_code_snap: movement_code?.code,
      movement_code_description: movement_code?.description,

      generate_iva: movement_code?.generate_iva ? 'si' : 'no',
      generate_source_rete: movement_code?.generate_source_rete ? 'si' : 'no',
      generate_source_ica: movement_code?.generate_source_ica ? 'si' : 'no',
      generate_rete_iva: movement_code?.generate_rete_iva ? 'si' : 'no',
      iva_percentage: movement_code?.iva_percentage,
      rete_source_percentage: movement_code?.rete_source_percentage,
      rete_ica_percentage: movement_code?.rete_ica_percentage,
      rete_iva_percentage: movement_code?.rete_iva_percentage,

      base_amount,
      base_iva,
      rete_source,
      rete_ica,
      rete_iva,
      total_amount,
      days_for_pays,

      status_id: status?.id,
      supporting_document_number: support_document_number,
    }
  }

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const onSubmit = async () => {
    goToURL('SupportingDocumentsList')
  }

  watch(
    () => supporting_documents_response.value,
    (val) => {
      if (!val) return
      setFormRead(val)
    }
  )

  onBeforeMount(async () => {
    _clearData()
    openMainLoader(true)
    await _getByIdSupportingDocuments(searchId)
    openMainLoader(false)
  })

  return {
    supporting_documents_response,
    basic_data,
    basicDataFormRef,
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,

    onSubmit,
    goToURL,
  }
}

export default useSupportingDocumentsView
