// Vue - Pinia
import { onBeforeUnmount, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ITabs } from '@/interfaces/global'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useFreezeResourcesStore } from '@/stores/fics/freeze-resources'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useFreezeResourcesCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()

  const { data_information_form } = storeToRefs(useFreezeResourcesStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _createFreeze } = useFreezeResourcesStore('v1')

  const headerProps = {
    title: 'Crear congelamiento de recursos',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Congelamiento y descongelamiento de recursos',
        route: 'FreezeResourcesList',
      },
      {
        label: 'Crear congelamiento de recursos',
        route: 'FreezeResourcesCreate',
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

  const onSubmit = async () => {
    openMainLoader(true)

    const payload = {
      ...data_information_form.value,
      orderer_identification:
        data_information_form.value?.orderer_identification ?? '',
      orderer_description:
        data_information_form.value?.orderer_description ?? '',
      observations: data_information_form.value?.observations ?? '',
      operation_type: data_information_form.value?.operation_type ?? '',
      operations: data_information_form.value?.operations ?? [],
    }

    if (await _createFreeze(payload)) {
      openMainLoader(false)
      handleGoToList()
    }

    openMainLoader(false)
  }

  const handleGoToList = () =>
    goToURL('FreezeResourcesList', undefined, { reload: true })

  onMounted(
    async () =>
      await _getResources({
        treasury: ['third_party_nit', 'third_parties'],
      })
  )

  onBeforeUnmount(() =>
    _resetKeys({
      treasury: ['third_party_nit', 'third_parties'],
    })
  )

  return {
    tabs,
    onSubmit,
    tabActive,
    headerProps,
    tabActiveIdx,
    handleGoToList,
    data_information_form,
  }
}

export default useFreezeResourcesCreate
