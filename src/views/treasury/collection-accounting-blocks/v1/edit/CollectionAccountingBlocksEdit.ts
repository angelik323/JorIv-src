import { ref, onUnmounted, onBeforeMount } from 'vue'
import { defaultIconsLucide } from '@/utils'
import { useRoute } from 'vue-router'
import { useGoToUrl, useMainLoader } from '@/composables'
import { storeToRefs } from 'pinia'
import { useCollectionAccountingBlocksStore } from '@/stores'
import { ITabs } from '@/interfaces/global'

export const useCollectionAccountingBlocksEdit = () => {
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const route = useRoute()
  const movementCodeId = +route.params.id

  const { data_information_form, type_accounting_blocks_collections_request } =
    storeToRefs(useCollectionAccountingBlocksStore('v1'))
  const {
    _setDataInformationForm,
    _updateCollectionAccountingBlocks,
    _getByIdCollectionAccountingBlocks,
  } = useCollectionAccountingBlocksStore('v1')

  const headerProps = ref<{
    title: string
    breadcrumbs: Array<{ label: string; route?: string }>
  }>({
    title: 'Editar bloque contable de recaudo',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Tesorería', route: '' },
      {
        label: 'Bloques contables de recaudo',
        route: 'CollectionAccountingBlocksList',
      },
      { label: 'Editar', route: 'CollectionAccountingBlocksEdit' },
      { label: movementCodeId.toString() },
    ],
  })

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

  const activeTab = ref<string>(tabs.value[0].name)
  const tabActiveIdx = ref<number>(
    tabs.value.findIndex((tab) => tab.name === activeTab.value)
  )
  const informationFormRef = ref<{
    validateForm?: () => Promise<boolean>
  } | null>(null)

  onUnmounted(() => {
    _setDataInformationForm(null)
  })

  const makeDataRequest = (): {
    description: string
    collection_structure_id: number
    accounting_structure_id: number
    cost_center_structure_id: number
    budget_structure_id: number
  } => {
    return {
      description: data_information_form.value?.description ?? '',
      collection_structure_id:
        data_information_form.value?.collection_structure_id ?? 0,
      accounting_structure_id:
        data_information_form.value?.accounting_structure_id ?? 0,
      cost_center_structure_id:
        data_information_form.value?.cost_center_structure_id ?? 0,
      budget_structure_id:
        data_information_form.value?.budget_structure_id ?? 0,
    }
  }

  const onSubmit = async (): Promise<void> => {
    openMainLoader(true)
    const payload = makeDataRequest()
    if (await _updateCollectionAccountingBlocks(payload, movementCodeId)) {
      goToURL('CollectionAccountingBlocksList')
    }
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    await _getByIdCollectionAccountingBlocks(movementCodeId)
    if (type_accounting_blocks_collections_request.value) {
      _setDataInformationForm({
        ...type_accounting_blocks_collections_request.value,
      })
    }
    openMainLoader(false)
  })

  return {
    headerProps,
    tabs,
    activeTab,
    tabActiveIdx,
    informationFormRef,
    data_information_form,
    type_accounting_blocks_collections_request,

    onSubmit,
    goToURL,
  }
}

export default useCollectionAccountingBlocksEdit
