import { ref, onBeforeMount, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useMainLoader } from '@/composables'
import { defaultIconsLucide } from '@/utils'
import { ITabs } from '@/interfaces/global'
import { IAccountingBlockToCreate } from '@/interfaces/customs'
import { useResourceManagerStore, useAccountingBlocksStore } from '@/stores'

const useAccountingBlocksCreate = () => {
  const { _createAccountingBlock, _clearData } = useAccountingBlocksStore('v1')
  const { data_information_form } = storeToRefs(useAccountingBlocksStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { openMainLoader } = useMainLoader()
  const router = useRouter()

  const informationFormRef = ref()

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
    title: 'Crear bloque contable',
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
        label: 'Crear',
        route: 'AccountingBlocksCreate',
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
      const payload = data_information_form.value as IAccountingBlockToCreate
      const success = await _createAccountingBlock(payload)

      if (success) {
        router.push({ name: 'AccountingBlocksList' })
      }
    } finally {
      openMainLoader(false)
    }
  }

  onBeforeMount(async () => {
    _clearData()
    openMainLoader(true)
    await _getResources(keys)
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    informationFormRef,
    onSubmit,
  }
}

export default useAccountingBlocksCreate
