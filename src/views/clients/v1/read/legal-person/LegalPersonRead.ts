import { ITabs } from '@/interfaces/customs/Tab'
import { onBeforeMount, ref } from 'vue'
import { defaultIcons } from '@/utils'
import { useClientsStore, useResourceStore } from '@/stores'
import { storeToRefs } from 'pinia'
import router from '@/router'
import { useRoute } from 'vue-router'
import { useMainLoader } from '@/composables'

const useLegalEntity = () => {
  const { legal_client_request } = storeToRefs(useClientsStore('v1'))

  const { _getByIdLegalClient, _clearDataLegal } = useClientsStore('v1')

  const { getResources } = useResourceStore('v1')

  const route = useRoute()
  const legalClientId = +route.params.id

  const { openMainLoader } = useMainLoader()

  const legalData = ref()

  const headerProps = {
    title: 'Ver persona jurídica',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Clientes',
      },
      {
        label: 'Vinculación de clientes',
        route: 'ClientsList',
      },
      {
        label: 'Ver persona jurídica',
      },
      {
        label: `${legalClientId}`,
      },
    ],
    showBackBtn: true,
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Información básica',
      icon: defaultIcons.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'legal_representation',
      label: 'Representante legal',
      icon: defaultIcons.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'corporative',
      label: 'Corporativos',
      icon: defaultIcons.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'tributary',
      label: 'Tributario',
      icon: defaultIcons.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'shareholder',
      label: 'Accionistas',
      icon: defaultIcons.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'manager',
      label: 'Directivos',
      icon: defaultIcons.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'investor',
      label: 'Inversionistas',
      icon: defaultIcons.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'document',
      label: 'Documentos',
      icon: defaultIcons.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ])

  const keys = ['third_party_request_types', 'cities']

  const tabActive = ref(tabs.value[0].name)

  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const nextTab = async () => {
    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const onSubmit = async () => {
    router.push({ name: 'ClientsList' })
  }

  onBeforeMount(async () => {
    _clearDataLegal()
    openMainLoader(true)
    await getResources(`keys[]=${keys.join('&keys[]=')}`)
    await _getByIdLegalClient(legalClientId)
    legalData.value = legal_client_request.value
    openMainLoader(false)
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    legalData,

    onSubmit,
    nextTab,
    backTab,
  }
}

export default useLegalEntity
