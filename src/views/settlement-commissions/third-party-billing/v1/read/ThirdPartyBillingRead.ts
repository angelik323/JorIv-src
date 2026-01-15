import { useMainLoader } from '@/composables'
import {
  IThirdPartyBillingForm,
  IThirdPartyBillingResponse,
} from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'
import { useResourceManagerStore, useThirdPartyBillingStore } from '@/stores'
import { defaultIconsLucide } from '@/utils'
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const useThirdPartyBillingRead = () => {
  const router = useRouter()
  const route = useRoute()
  const searchId = +route.params.id
  const { _getByIdThirdPartyBilling, _clearData } =
    useThirdPartyBillingStore('v1')
  const { third_party_billing_response } = storeToRefs(
    useThirdPartyBillingStore('v1')
  )
  const { openMainLoader } = useMainLoader()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keys = {
    assets: ['countries', 'departments', 'cities'],
  }

  const data_information_form = ref<IThirdPartyBillingForm | null>(null)

  const headerProps = {
    title: 'Ver terceros de facturación',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Liquidación de comisiones',
        route: '',
      },
      {
        label: 'Definir terceros de facturación',
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

  const tabs = ref<ITabs[]>([
    {
      name: 'basic_data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))

  const tabActive = ref(filteredTabs.value[0].name)

  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const goToList = () => {
    router.push({ name: 'ThirdPartBillingList' })
  }

  const setFormRead = (data: IThirdPartyBillingResponse) => {
    data_information_form.value = {
      third_party_id: data.third_party_id,
      third_party_name: data.third_party_name,
      created_date: data.created_date,
      addresses: data.address,
      emails: data.email,
      phones: data.phones,
    }
  }

  onMounted(async () => {
    _clearData()
    openMainLoader(true)
    await _getByIdThirdPartyBilling(searchId)
    await _getResources(keys)
    openMainLoader(false)
  })

  watch(
    () => third_party_billing_response.value,
    (val) => {
      if (!val) return
      setFormRead(val)
    }
  )

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  return {
    headerProps,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    data_information_form,
    goToList,
  }
}

export default useThirdPartyBillingRead
