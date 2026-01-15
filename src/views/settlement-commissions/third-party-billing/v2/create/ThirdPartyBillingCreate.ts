// vue - pinia
import { ref, onBeforeMount, onBeforeUnmount } from 'vue'

// Interfaces
import { ITabs } from '@/interfaces/global'
import { IThirdPartyBillingFormV2 } from '@/interfaces/customs/settlement-commissions/ThirdPartyBillingV2'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useThirdPartyBillingStore } from '@/stores/settlement-commissions/third-party-billing'

const useThirdPartyBillingCreate = () => {
  const { _createThirdPartyBilling } = useThirdPartyBillingStore('v2')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  // Data de formularios
  const data_information_form = ref<IThirdPartyBillingFormV2 | null>(null)

  // Referencias a formularios
  const basicDataFormRef = ref()

  const { openMainLoader } = useMainLoader()
  const { cleanEmptyFields, defaultIconsLucide, formatDate } = useUtils()
  const { goToURL } = useGoToUrl()

  const headerProps = {
    title: 'Crear vinculación de terceros de facturación',
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
        label: 'Crear',
        route: 'ThirdPartyBillingCreate',
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

  // Datos básicos form
  const makeBaseInfoRequest = (data: IThirdPartyBillingFormV2 | null) => {
    if (!data) return {}

    const request: Partial<IThirdPartyBillingFormV2> = {
      third_party_id: data.third_party_id,
      business_code_snapshot: data.business_code_snapshot,
      created_date: formatDate(new Date().toString(), 'YYYY-MM-DD'),
      addresses: data.addresses.map((address) => ({
        id: address.id,
        country_id: address.country_id,
        department_id: address.department_id,
        city_id: address.city_id,
        address: address.address,
        address_type: address.address_type,
        postal_code: address.postal_code,
        is_main: address.is_main,
      })),
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

    if (tabActiveIdx >= 0 && tabActiveIdx < forms.length) {
      try {
        valid = (await forms[tabActiveIdx]?.value?.validateForm()) ?? false
      } catch {
        valid = false
      }
    }
    return valid
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)
    const payload = makeDataRequest()
    const success = await _createThirdPartyBilling(payload)
    if (success) {
      goToURL('ThirdPartyBillingList')
    }
    openMainLoader(false)
  }

  const keys = {
    trust_business: ['third_parties'],
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    await _getResources(keys)
    await _getResources(
      { trust_business: ['business_trusts'] },
      'filter[status_id]=59,57&can_manage=true'
    )
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  return {
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

export default useThirdPartyBillingCreate
