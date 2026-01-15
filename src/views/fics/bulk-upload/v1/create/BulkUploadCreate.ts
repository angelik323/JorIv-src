// Vue
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

// Interfaces
import { ITabs } from '@/interfaces/global'

// composables
import { useGoToUrl, useUtils } from '@/composables'

// store
import { useResourceManagerStore } from '@/stores/resources-manager'

const useBulkUploadCreate = () => {
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const informationFormRef = ref()
  const disabledBtn = ref(true)

  const keys = {
    fics: ['templates', 'funds', 'offices'],
    trust_business: ['business_trusts'],
    treasury: ['payments'],
  }

  const headerProps = {
    title: 'Crear cargue masivo',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Crear',
        route: 'FicsBulkUploadCreate',
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
      required: true,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const handleGoToBack = () =>
    goToURL('FicsBulkUploadList', undefined, { reload: true })

  onMounted(async () => {
    await _getResources(keys)
  })

  const keysBanksCollective = {
    fics: ['banks_collective_investment_funds'],
  }
  onBeforeUnmount(() => {
    _resetKeys(keys)
    _resetKeys(keysBanksCollective)
  })

  watch(
    () => informationFormRef.value?.showFields,
    (val) => {
      if (val) {
        disabledBtn.value = false
      } else {
        disabledBtn.value = true
      }
    }
  )

  return {
    tabs,
    tabActive,
    headerProps,
    tabActiveIdx,
    handleGoToBack,
    informationFormRef,
  }
}

export default useBulkUploadCreate
