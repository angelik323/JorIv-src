// Vue - Pinia
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// Interfaces
import {
  ISupportDocumentNumberingBusinessForm,
  ISupportDocumentNumberingBusinessTrustSupportDocumentNumberings,
} from '@/interfaces/customs/accounts-payable/SupportDocumentNumbering'
import { ITabs } from '@/interfaces/global/Tabs'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useSupportDocumentNumberingStore } from '@/stores/accounts-payable/support-document-numbering'

export const useSupportDocumentNumberingBusinessView = () => {
  const { goToURL } = useGoToUrl()
  const route = useRoute()
  const supportDocumentNumberingId = +route.params.issuer_id
  const supportDocumentNumberingResolutionId = +route.params.resolution_id
  const supportDocumentNumberingBusinessId = +route.params.business_id

  const { defaultIconsLucide } = useUtils()

  const { openMainLoader } = useMainLoader()

  const {
    _getSupportDocumentNumberingBusinessById,
    _getSupportDocumentNumberingResolutionById,
  } = useSupportDocumentNumberingStore('v1')

  const businessDataFormRef = ref()

  const business_data_form = ref<ISupportDocumentNumberingBusinessForm | null>(
    null
  )

  const headerProps = {
    title: 'Ver resolución por negocio',
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
      {
        label: 'Ver',
        route: 'SupportDocumentNumberingBusinessView',
      },
      {
        label: `${supportDocumentNumberingBusinessId}`,
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
    const [data, resolution_info] = await Promise.all([
      _getSupportDocumentNumberingBusinessById(
        supportDocumentNumberingBusinessId
      ),
      _getSupportDocumentNumberingResolutionById(
        supportDocumentNumberingResolutionId
      ),
    ])

    if (data) {
      let handles_issuer_data = false
      let status = 1
      let prefix = ''
      if (data.support_document_numberings) {
        const assign_business_info = data.support_document_numberings.find(
          (
            resolution: ISupportDocumentNumberingBusinessTrustSupportDocumentNumberings
          ) =>
            resolution.support_document_numbering_resolution_id ===
            supportDocumentNumberingResolutionId
        )

        if (assign_business_info) {
          handles_issuer_data = assign_business_info.handles_issuer_data
          status = assign_business_info.status.id
          prefix = assign_business_info.prefix
        }
      }
      business_data_form.value = {
        nit: resolution_info.third_party.document,
        business_code: data.business_code,
        resolution: resolution_info.resolution,
        resolution_date: resolution_info.resolution_date,
        prefix: prefix,
        range_start: resolution_info.range_start,
        range_end: resolution_info.range_end,
        validity_start_date: resolution_info.validity_start_date,
        validity_end_date: resolution_info.validity_end_date,
        next_available_number: resolution_info.next_available_number,
        status_id: status,
        handles_issuer_data: handles_issuer_data,
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
    businessDataFormRef,
    business_data_form,
    goToURL,
  }
}

export default useSupportDocumentNumberingBusinessView
