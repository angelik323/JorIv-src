import { onBeforeMount, onBeforeUnmount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useMainLoader } from '@/composables'
import { defaultIcons } from '@/utils'
import { ITabs } from '@/interfaces/global'
import { useAccountingBlocksStore, useResourceManagerStore } from '@/stores'

const useAccountingBlocksView = () => {
  const route = useRoute()
  const { openMainLoader } = useMainLoader()

  const { accounting_blocks_response } = storeToRefs(
    useAccountingBlocksStore('v1')
  )
  const { _setDataInformationForm, _getByIdAccountingBlock } =
    useAccountingBlocksStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keys = {
    treasury: ['account_structures_block', 'third_party_nit'],
    fics: ['movements'],
  }

  const accountingBlockId = +route.params.id

  const headerProps = {
    title: 'Ver bloque contable',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Tesorería',
      },
      {
        label: 'Bloques contables',
        route: 'AccountingBlocksList',
      },
      {
        label: 'Ver',
        route: 'AccountingBlocksView',
      },
      {
        label: `${accountingBlockId}`,
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos Básicos',
      icon: defaultIcons.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const tabActive = ref(tabs.value[0].name)

  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  onBeforeMount(() => {
    openMainLoader(true)

    _getByIdAccountingBlock(accountingBlockId).finally(() => {
      _getResources(keys)
      openMainLoader(false)
    })
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
    _setDataInformationForm(null)
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    accounting_blocks_response,
  }
}

export default useAccountingBlocksView
