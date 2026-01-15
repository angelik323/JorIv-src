import { onMounted, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { defaultIconsLucide } from '@/utils'
import { useGoToUrl, useMainLoader } from '@/composables'

import { ITabs } from '@/interfaces/global'

import { useResourceStore } from '@/stores/resources-selects'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useCollectionAccountingBlocksStore } from '@/stores/treasury/collection-accounting-blocks'

export const useCollectionAccountingBlocksCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const { data_information_form } = storeToRefs(
    useCollectionAccountingBlocksStore('v1')
  )
  const { _setDataInformationForm, _createCollectionAccountingBlocks } =
    useCollectionAccountingBlocksStore('v1')

  const { _getResourcesTreasuries } = useResourceStore('v1')
  const { _getResources } = useResourceManagerStore('v1')

  const keys = ['account_structures_by_type']
  const filters = [
    'Catálogo de conceptos recaudo',
    'Catálogo de cuentas contables',
    'Catálogo de centros de costo',
    'Catálogo de rubros presupuestal',
    'Catálogo de cuentas flujo de caja',
  ]

  const headerProps = {
    title: 'Crear bloque contable de recaudo',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Tesorería', route: '' },
      {
        label: 'Bloques contables de recaudo',
        route: 'CollectionAccountingBlocksList',
      },
      {
        label: 'Crear',
        route: 'CollectionAccountingBlocksCreate',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'InformationForm',
      label: 'Datos Básicos',
      icon: defaultIconsLucide.listBulleted,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ])

  const makeDataRequest = (): {
    description: string
    collection_structure_id: number
    accounting_structure_id: number
    cost_center_structure_id?: number | null
    budget_structure_id?: number | null
    cash_flow_structure_id?: number | null
  } => {
    const {
      description,
      collection_structure_id,
      accounting_structure_id,
      cost_center_structure_id,
      budget_structure_id,
      cash_flow_structure_id,
    } = data_information_form.value ?? {}
    return {
      description: description ?? '',
      collection_structure_id: collection_structure_id ?? 0,
      accounting_structure_id: accounting_structure_id ?? 0,
      ...(cost_center_structure_id != null && { cost_center_structure_id }),
      ...(budget_structure_id != null && { budget_structure_id }),
      ...(cash_flow_structure_id != null && { cash_flow_structure_id }),
    }
  }

  const activeTab = ref<string>(tabs.value[0].name)

  const tabActiveIdx = ref<number>(
    tabs.value.findIndex((tab: ITabs) => tab.name === activeTab.value)
  )

  const informationFormRef = ref<{
    validateForm: () => Promise<boolean>
  } | null>(null)

  const validateForm = async (): Promise<boolean> => {
    return (await informationFormRef.value?.validateForm()) ?? false
  }

  onMounted(async () => {
    await _getResourcesTreasuries(
      `keys[]=${keys.join('&keys[]=')}` +
        filters
          .map((filter) => `&filter[type][]=${encodeURIComponent(filter)}`)
          .join('')
    )

    await _getResources({accounting: ['budget_structures_generate']}, '', 'v2')
  })

  onUnmounted(() => {
    _setDataInformationForm(null)
  })

  const onSubmit = async (): Promise<void> => {
    if (await validateForm()) {
      openMainLoader(true)
      const payload = makeDataRequest()
      if (await _createCollectionAccountingBlocks(payload)) {
        goToURL('CollectionAccountingBlocksList')
      }
      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }
  }
  return {
    headerProps,
    tabs,
    activeTab,
    tabActiveIdx,
    informationFormRef,
    
    onSubmit,
    goToURL,
  }
}

export default useCollectionAccountingBlocksCreate
