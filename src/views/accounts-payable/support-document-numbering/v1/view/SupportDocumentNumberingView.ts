// Vue
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// Interfaces
import { ISupportDocumentNumberingForm } from '@/interfaces/customs/accounts-payable/SupportDocumentNumbering'
import { ITabs } from '@/interfaces/global/Tabs'

// Composables
import {
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
  useUtils,
} from '@/composables'

// Stores
import { useSupportDocumentNumberingStore } from '@/stores/accounts-payable/support-document-numbering'

export const useSupportDocumentNumberingView = () => {
  const { goToURL } = useGoToUrl()
  const { validateRouter } = useRouteValidator()
  const route = useRoute()
  const supportDocumentNumberingId = +route.params.id

  const { defaultIconsLucide } = useUtils()

  const { openMainLoader } = useMainLoader()

  const { _getSupportDocumentNumberingById } =
    useSupportDocumentNumberingStore('v1')

  const basicDataFormRef = ref()

  const basic_data_form = ref<ISupportDocumentNumberingForm | null>(null)

  const selectedResolution = ref<number | null>(null)

  const headerProps = {
    title: 'Ver resolución documento soporte',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas por pagar', route: '' },
      {
        label: 'Resolución documento soporte',
        route: 'SupportDocumentNumberingList',
      },
      {
        label: 'Ver',
        route: 'SupportDocumentNumberingView',
      },
      {
        label: `${supportDocumentNumberingId}`,
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const setViewData = async () => {
    const data = await _getSupportDocumentNumberingById(
      supportDocumentNumberingId
    )
    if (data) {
      let delegateThirdPartyName = data.legal_person
        ? data.legal_person.business_name
        : data.natural_person?.full_name ?? null
      let delegateThirdPartyDocType = data.document_type.name
      let delegateThirdPartyNit = data.document

      const issuer = data.support_document_numbering_issuer_delegate

      if (issuer) {
        delegateThirdPartyName = issuer.legal_person
          ? issuer.legal_person.business_name
          : issuer.natural_person?.full_name ?? null
        delegateThirdPartyDocType = issuer.document_type.name
        delegateThirdPartyNit = issuer.document
      }

      basic_data_form.value = {
        id: data.id,
        nit: data.document,
        name: '',
        status: data.support_document_numbering_issuer_status_id,
        delegate_third_party_id: null,
        delegate_third_party_nit: delegateThirdPartyNit,
        delegate_third_party_document_type: delegateThirdPartyDocType,
        delegate_third_party_name: delegateThirdPartyName ?? data.document,
      }
    }
  }

  onMounted(async () => {
    openMainLoader(true)
    await setViewData()
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    supportDocumentNumberingId,
    basicDataFormRef,
    basic_data_form,
    selectedResolution,
    goToURL,
    validateRouter,
  }
}

export default useSupportDocumentNumberingView
