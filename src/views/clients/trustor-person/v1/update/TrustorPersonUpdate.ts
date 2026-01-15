import { onMounted, ref } from 'vue'
import { ITabs, TrustBusinessStatusID } from '@/interfaces/global'
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'
import { useClientsStore } from '@/stores/clients'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useResourceManagerStore, useResourceStore } from '@/stores'

const useTrustorEntity = () => {
  const { openMainLoader } = useMainLoader()

  const { trustor_client_request, data_trustor_information_form } = storeToRefs(
    useClientsStore('v1')
  )
  const { defaultIconsLucide } = useUtils()

  const { _updateTrustorClient, _getByIdTrustorClient } = useClientsStore('v1')
  const { goToURL } = useGoToUrl()
  const { getResources } = useResourceStore('v1')
  const { _getResources } = useResourceManagerStore('v1')

  const keys = [
    'third_party_request_types',
    'document_types_third_party_natural',
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

  const route = useRoute()

  const trustorClientId = +route.params.id

  const headerProps = {
    title: 'Editar persona fideicomiso',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Clientes', route: '' },
      { label: 'Vinculación de clientes', route: 'ClientsList' },
      { label: 'Editar persona fideicomiso', route: 'TrustorPersonUpdate' },
      { label: `${trustorClientId}` },
    ],
    showBackBtn: true,
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
    if (await _updateTrustorClient(payload, trustorClientId)) {
      goToURL('ClientsList')
    }

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  onMounted(async () => {
    openMainLoader(true)
    await _getByIdTrustorClient(trustorClientId)
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
    trustor_client_request,
    onSubmit,
    nextTab,
    backTab,
    goToURL,
  }
}

export default useTrustorEntity
