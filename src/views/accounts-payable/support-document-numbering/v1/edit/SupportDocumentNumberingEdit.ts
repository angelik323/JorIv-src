// Vue
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// Interfaces
import {
  ISupportDocumentNumberingForm,
  ISupportDocumentNumberingUpdatePayload,
} from '@/interfaces/customs/accounts-payable/SupportDocumentNumbering'
import { ITabs } from '@/interfaces/global/Tabs'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useSupportDocumentNumberingStore } from '@/stores/accounts-payable/support-document-numbering'
import { useResourceManagerStore } from '@/stores/resources-manager'

export const useSupportDocumentNumberingEdit = () => {
  const { goToURL } = useGoToUrl()
  const route = useRoute()
  const supportDocumentNumberingId = +route.params.id

  const { defaultIconsLucide } = useUtils()

  const { openMainLoader } = useMainLoader()

  const { _getSupportDocumentNumberingById, _updateSupportDocumentNumbering } =
    useSupportDocumentNumberingStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const basicDataFormRef = ref()

  const basic_data_form = ref<ISupportDocumentNumberingForm | null>(null)

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
        label: 'Editar',
        route: 'SupportDocumentNumberingEdit',
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

  const createPayload = (form: ISupportDocumentNumberingForm) => {
    return {
      support_document_numbering_issuer_delegate_id:
        form.delegate_third_party_id,
    } as ISupportDocumentNumberingUpdatePayload
  }

  const handleEdit = async () => {
    const isValid = await basicDataFormRef.value?.validateForm()
    if (!isValid) return
    if (!basic_data_form.value) return
    openMainLoader(true)
    const payload = createPayload(basic_data_form.value)
    if (
      await _updateSupportDocumentNumbering(payload, supportDocumentNumberingId)
    ) {
      goToURL('SupportDocumentNumberingList')
    }
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const setEditData = async () => {
    const data = await _getSupportDocumentNumberingById(
      supportDocumentNumberingId
    )
    if (data) {
      const name =
        (data.legal_person
          ? data.legal_person.business_name
          : data.natural_person?.full_name ?? null) ?? data.document

      let delegateThirdPartyId =
        data.support_document_numbering_issuer_delegate_id

      if (!delegateThirdPartyId) {
        delegateThirdPartyId = data.legal_person
          ? data.legal_person.third_party_id
          : data.natural_person?.third_party_id ?? null
      }

      basic_data_form.value = {
        nit: data.document,
        name,
        status: data.support_document_numbering_issuer_status_id,
        delegate_third_party_id: delegateThirdPartyId,
        delegate_third_party_document_type: null,
        delegate_third_party_name: null,
      }
    }
  }

  const keys = {
    third_party: ['third_parties'],
  }

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(
      keys,
      'fields[third_parties]=id,document,document_type_id,support_document_numbering_issuer_delegate_id&include[]=legalPerson&include[]=naturalPerson&include[]=documentType&fields[legal_people]=third_party_id,id,business_name&fields[natural_people]=third_party_id,id,name,middle_name,last_name,second_last_name&filter[status_id]=1'
    )
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
    basicDataFormRef,
    basic_data_form,
    handleEdit,
    goToURL,
  }
}

export default useSupportDocumentNumberingEdit
