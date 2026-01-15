// vue - pinia
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// Interfaces
import {
  IThirdPartyBillingFormV2,
  IThirdPartyBillingResponseV2,
} from '@/interfaces/customs/settlement-commissions/ThirdPartyBillingV2'
import { ITabs } from '@/interfaces/global'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useThirdPartyBillingStore } from '@/stores/settlement-commissions/third-party-billing'

const useThirdPartyBillingRead = () => {
  const { _getByIdThirdPartyBilling } = useThirdPartyBillingStore('v2')

  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()

  const data_information_form = ref<IThirdPartyBillingFormV2 | null>(null)

  const route = useRoute()
  const searchId = +route.params.id

  const headerProps = {
    title: 'Ver Vinculación de terceros de facturación',
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
        label: 'Ver',
        route: 'ThirdPartyBillingRead',
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

  const setFormRead = (data: IThirdPartyBillingResponseV2) => {
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
      addresses: data.address,
      emails: data.email,
      phones: data.phones,

      status: data.comission_settlement_statuses?.name,
    }
  }

  const onSubmit = async () => {
    goToURL('ThirdPartyBillingList')
  }

  onMounted(async () => {
    openMainLoader(true)
    const response = await _getByIdThirdPartyBilling(searchId)
    if (response) setFormRead(response)
    openMainLoader(false)
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    data_information_form,

    onSubmit,
    goToURL,
  }
}

export default useThirdPartyBillingRead
