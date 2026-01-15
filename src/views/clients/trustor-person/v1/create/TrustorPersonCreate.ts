import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { ITabs, TrustBusinessStatusID } from '@/interfaces/global'
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

import { useClientsStore } from '@/stores/clients'
import { useResourceStore } from '@/stores/resources-selects'
import { useResourceManagerStore } from '@/stores'

const useTrustorEntity = () => {
  const { openMainLoader } = useMainLoader()

  const { headerPropsTrustorDefault, data_trustor_information_form } =
    storeToRefs(useClientsStore('v1'))

  const { _createTrustorClient } = useClientsStore('v1')
  const { getResources } = useResourceStore('v1')
  const { _getResources } = useResourceManagerStore('v1')

  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()

  const keys = [
    'third_party_request_types',
    'countries',
    'departments',
    'cities',
  ]

  const keysManager = {
    trust_business: ['business_trusts'],
    third_party: ['document_types_third_party_fideicomiso'],
  }
  const statusBusiness = [
    TrustBusinessStatusID.VALID,
    TrustBusinessStatusID.LIQUIDATION,
  ]
  const filters = `filter[status_id]=${statusBusiness.join(',')}`

  const headerProps = {
    ...headerPropsTrustorDefault.value,
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Información básica',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const makeDataRequest = () => {
    return {
      request_type: data_trustor_information_form.value?.request_type ?? null,
      document_type_id:
        data_trustor_information_form.value?.document_type_id ?? null,
      fideicomiso_person:
        data_trustor_information_form.value?.fideicomiso_person,
      email: data_trustor_information_form.value?.email ?? null,
      phone_number: data_trustor_information_form.value?.phone_number ?? null,
      phone_type: data_trustor_information_form.value?.phone_type ?? null,
      address: data_trustor_information_form.value?.address ?? null,
      country_id: data_trustor_information_form.value?.country_id ?? null,
      department_id: data_trustor_information_form.value?.department_id ?? null,
      city_id: data_trustor_information_form.value?.city_id ?? null,
      third_party_category: 'directo', // TODO: remove
    }
  }

  const tabActive = ref(tabs.value[0].name)

  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const formInformation = ref()

  const nextTab = async () => {
    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const onSubmit = async () => {
    openMainLoader(true)
    const payload = makeDataRequest()
    if (await _createTrustorClient(payload)) {
      goToURL('ClientsList')
    }

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  onMounted(async () => {
    openMainLoader(true)
    await getResources(`keys[]=${keys.join('&keys[]=')}`)
    await _getResources(keysManager, filters)

    openMainLoader(false)
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    formInformation,
    goToURL,
    onSubmit,
    nextTab,
    backTab,
  }
}

export default useTrustorEntity
