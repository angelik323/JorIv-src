// Vue - Pinia
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// Interfaces
import {
  ISupportDocumentNumberingForm,
  ISupportDocumentNumberingResolutionForm,
} from '@/interfaces/customs/accounts-payable/SupportDocumentNumbering'
import { ITabs } from '@/interfaces/global/Tabs'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useSupportDocumentNumberingStore } from '@/stores/accounts-payable/support-document-numbering'
import { useResourceManagerStore, useThirdPartyResourceStore } from '@/stores'

export const useSupportDocumentNumberingResolutionsEdit = () => {
  const { goToURL } = useGoToUrl()
  const route = useRoute()
  const supportDocumentNumberingId = +route.params.issuer_id
  const supportDocumentNumberingResolutionId = +route.params.resolution_id

  const { defaultIconsLucide } = useUtils()

  const { openMainLoader } = useMainLoader()

  const { third_parties } = storeToRefs(useThirdPartyResourceStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const {
    _getSupportDocumentNumberingResolutionById,
    _updateSupportDocumentNumberingResolution,
  } = useSupportDocumentNumberingStore('v1')

  const basic_data_form = ref<ISupportDocumentNumberingForm | null>(null)

  const resolutionDataFormRef = ref()

  const resolution_data_form =
    ref<ISupportDocumentNumberingResolutionForm | null>(null)

  const headerProps = {
    title: 'Editar resolución documento soporte',
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
        label: 'Editar',
        route: 'SupportDocumentNumberingResolutionsEdit',
      },
      {
        label: `${supportDocumentNumberingResolutionId}`,
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

  const handleSubmit = async () => {
    const isValid = await resolutionDataFormRef.value?.validateForm()
    if (!isValid) return
    if (!resolution_data_form.value) return
    openMainLoader(true)
    const payload = { ...resolution_data_form.value }
    if (
      await _updateSupportDocumentNumberingResolution(
        payload,
        supportDocumentNumberingResolutionId
      )
    ) {
      goToURL('SupportDocumentNumberingView', supportDocumentNumberingId)
    }
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const setEditData = async () => {
    const data = await _getSupportDocumentNumberingResolutionById(
      supportDocumentNumberingResolutionId
    )
    if (data) {
      resolution_data_form.value = {
        ...data,
        status_id: data.status.id,
      }
    }
  }

  const keys = {
    accounts_payable: ['support_document_numbering_resolution_statuses'],
    third_party: ['third_parties'],
  }

  const setBasicData = () => {
    const third_party_info = third_parties.value.find(
      (third_party) => third_party.id === supportDocumentNumberingId
    )

    if (third_party_info) {
      const name =
        (third_party_info.legal_person
          ? third_party_info.legal_person.business_name
          : third_party_info.natural_person?.full_name ?? null) ??
        String(third_party_info.document)

      let delegateThirdPartyId =
        third_party_info.support_document_numbering_issuer_delegate_id

      if (!delegateThirdPartyId) {
        delegateThirdPartyId =
          (third_party_info.legal_person
            ? third_party_info.legal_person.third_party_id
            : third_party_info.natural_person?.third_party_id ?? null) ??
          third_party_info.id ??
          null
      }
      basic_data_form.value = {
        nit: third_party_info.document ?? '',
        name,
        status: null,
        delegate_third_party_id: delegateThirdPartyId,
        delegate_third_party_document_type: null,
        delegate_third_party_name: null,
      }
    }
  }

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(
      keys,
      'fields[third_parties]=id,document,document_type_id,support_document_numbering_issuer_delegate_id&include[]=legalPerson&include[]=naturalPerson&include[]=documentType&fields[legal_people]=third_party_id,id,business_name&fields[natural_people]=third_party_id,id,name,middle_name,last_name,second_last_name'
    )
    setBasicData()
    await setEditData()
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  })

  onBeforeUnmount(() => _resetKeys(keys))

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    supportDocumentNumberingId,
    basic_data_form,
    resolutionDataFormRef,
    resolution_data_form,
    handleSubmit,
    goToURL,
  }
}

export default useSupportDocumentNumberingResolutionsEdit
