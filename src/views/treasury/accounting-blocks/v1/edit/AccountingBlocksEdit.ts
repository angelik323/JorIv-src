import { ref, onBeforeMount, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { useMainLoader } from '@/composables'
import { defaultIconsLucide } from '@/utils'
import { ITabs } from '@/interfaces/global'
import { IAccountingBlockToEdit } from '@/interfaces/customs'
import { useResourceManagerStore, useAccountingBlocksStore } from '@/stores'

const useAccountingBlocksEdit = () => {
  const router = useRouter()
  const route = useRoute()

  const accountingBlockId = +route.params.id

  const {
    _setDataInformationForm,
    _updateAccountingBlock,
    _getByIdAccountingBlock,
  } = useAccountingBlocksStore('v1')

  const { data_information_form, accounting_blocks_response } = storeToRefs(
    useAccountingBlocksStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { openMainLoader } = useMainLoader()

  const keys = {
    treasury: [
      'account_structures_block',
      'treasury_movement_codes',
      'third_type',
      'third_party_nit',
    ],
    fics: ['movements'],
  }

  const headerProps = {
    title: 'Editar bloque contable',
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
        label: 'Editar',
        route: 'AccountingBlocksEdit',
      },
      {
        label: `${accountingBlockId}`,
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos*',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const informationFormRef = ref()

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const validateForm = async () => {
    return (await informationFormRef.value?.validateForm()) ?? false
  }

  const onSubmit = async () => {
    if (!(await validateForm())) return
    openMainLoader(true)

    try {
      const payload = data_information_form.value as IAccountingBlockToEdit
      const success = await _updateAccountingBlock(payload, accountingBlockId)

      if (success) {
        router.push({ name: 'AccountingBlocksList' })
      }
    } finally {
      openMainLoader(false)
    }
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    try {
      await _getByIdAccountingBlock(accountingBlockId)
      await _getResources(keys)
    } finally {
      openMainLoader(false)
    }
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
    informationFormRef,
    onSubmit,
  }
}

export default useAccountingBlocksEdit
