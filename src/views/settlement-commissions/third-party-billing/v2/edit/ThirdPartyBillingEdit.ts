import { ref, onBeforeUnmount, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useThirdPartyBillingStore } from '@/stores/settlement-commissions/third-party-billing'

// Interfaces
import {
  IThirdPartyBillingFormV2,
  IThirdPartyBillingResponseV2,
} from '@/interfaces/customs/settlement-commissions/ThirdPartyBillingV2'
import { ITabs } from '@/interfaces/global'

const useThirdPartyBillingEdit = () => {
  const { _updateThirdPartyBilling, _getByIdThirdPartyBilling } =
    useThirdPartyBillingStore('v2')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  // Data de formularios
  const data_information_form = ref<IThirdPartyBillingFormV2 | null>(null)

  // Referencias a formularios
  const basicDataFormRef = ref()

  const route = useRoute()
  const searchId = +route.params.id
  const { openMainLoader } = useMainLoader()
  const { cleanEmptyFields, defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()

  const third_party_billing_response = ref<IThirdPartyBillingResponseV2 | null>(
    null
  )

  const headerProps = {
    title: 'Editar Vinculación de terceros de facturación',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Liquidación de comisiones',
      },
      {
        label: 'Vincular terceros de facturación',
        route: 'ThirdPartyBillingList',
      },
      {
        label: 'Editar',
        route: 'ThirdPartyBillingEdit',
      },
      {
        label: `${searchId}`,
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'basic_data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const setFormEdit = (data: IThirdPartyBillingResponseV2) => {
    data_information_form.value = {
      business_code_snapshot: data.business_code_snapshot,
      business_trust_name:
        (data.business_code_snapshot ?? '') +
        ' - ' +
        (data.business_name_snapshot ?? ''),
      third_party_id: data.third_party_id,
      third_party_name:
        (data.third_party_document_type ?? '') +
        ' - ' +
        (data.third_party_document ?? '') +
        ' - ' +
        (data.third_party_name ?? ''),
      created_date: data.created_date,
      addresses: data.address.map((address) => ({
        ...address,
        is_main: Boolean(data.third_party_address === address.address),
      })),
      emails: data.email.map((email) => ({
        ...email,
        is_main: Boolean(data.third_party_email === email.email_address),
      })),
      phones: data.phones.map((phone) => ({
        ...phone,
        is_main: Boolean(data.third_party_phone === phone.phone_number),
      })),

      status: data.comission_settlement_statuses?.name,
    }
  }

  // Datos básicos form
  const makeBaseInfoRequest = (data: IThirdPartyBillingFormV2 | null) => {
    if (!data) return {}

    const request: Partial<IThirdPartyBillingFormV2> = {
      third_party_id: data.third_party_id,
      created_date: data.created_date,
      addresses: data.addresses,
      emails: data.emails,
      phones: data.phones,
    }
    return cleanEmptyFields(request)
  }

  const makeDataRequest = () => {
    const apiRequestBody: Partial<IThirdPartyBillingFormV2> = {
      ...makeBaseInfoRequest(data_information_form.value),
    }

    return apiRequestBody
  }

  const validateForms = async () => {
    let valid: boolean = false
    const forms = [basicDataFormRef]

    try {
      valid = (await forms[tabActiveIdx]?.value?.validateForm()) ?? false
    } catch {
      valid = false
    }
    return valid
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)
    const payload = makeDataRequest()
    const success = await _updateThirdPartyBilling(payload, searchId)
    if (success) {
      goToURL('ThirdPartyBillingList')
    }
    openMainLoader(false)
  }

  const keys = {
    trust_business: ['third_parties'],
  }

  const keysToClear = {
    trust_business: ['third_parties', 'business_trusts'],
  }

  onMounted(async () => {
    openMainLoader(true)
    const response = await _getByIdThirdPartyBilling(searchId)
    if (response) setFormEdit(response)

    await _getResources(keys)
    await _getResources(
      { trust_business: ['business_trusts'] },
      '&filter[status_id]=59,57&can_manage=true'
    )
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keysToClear)
  })

  return {
    third_party_billing_response,
    data_information_form,
    basicDataFormRef,
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,

    onSubmit,
    goToURL,
  }
}

export default useThirdPartyBillingEdit
