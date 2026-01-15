// vue - quasar - pinia
import { ref, onMounted, onUnmounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

// utils
import { defaultIconsLucide } from '@/utils'

// composables
import { useMainLoader } from '@/composables'

// stores
import {
  useDesactivateDailyClousingVouchersStore,
  useResourceManagerStore,
} from '@/stores'

// Interfaces
import { ITabs } from '@/interfaces/global'
import { IDesativateDailyClosingVouchersCreate } from '@/interfaces/customs'

const useDesactivateDailyClousingVouchersCreate = () => {
  // imports
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { data_information_form } = storeToRefs(
    useDesactivateDailyClousingVouchersStore('v1')
  )

  const { _setDataInformationForm, _createAction } =
    useDesactivateDailyClousingVouchersStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keys = {
    accounting: ['account_structures_active'],
  }

  // props
  const headerProps = {
    title: 'Crear desactualización',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Contabilidad',
        route: '',
      },
      {
        label: 'Desactualizar comprobantes de cierre diario',
        route: 'DesactivateDailyClosingList',
      },
      {
        label: 'Crear',
        route: '',
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

  const makeDataRequest = (): IDesativateDailyClosingVouchersCreate => {
    return {
      structure: data_information_form.value?.structure,
      from_business_trust_id:
        data_information_form.value?.from_business_trust_id,
      from_business_trust_code:
        data_information_form.value?.from_business_trust_code,
      to_business_trust_id: data_information_form.value?.to_business_trust_id,
      to_business_trust_code:
        data_information_form.value?.to_business_trust_code,
      last_closing_day: data_information_form.value?.last_closing_day ?? '',
      revert_balances_date:
        data_information_form.value?.revert_balances_date ?? '',
    }
  }

  const tabActive = ref(tabs.value[0].name)

  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const formInformation = ref()

  const validateForm = async () => {
    return (await formInformation.value?.validateForm()) ?? false
  }

  onMounted(async () => {
    await _getResources(keys)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  onUnmounted(async () => {
    _setDataInformationForm(null)
    _resetKeys(keys)
  })

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  const onSubmit = async () => {
    if (await validateForm()) {
      openMainLoader(true)
      const payload: IDesativateDailyClosingVouchersCreate = makeDataRequest()
      if (await _createAction(payload)) {
        router.push({ name: 'DesactivateDailyClosingList' })
      }
      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }
  }

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    formInformation,
    data_information_form,
    handlerGoTo,
    onSubmit,
  }
}

export default useDesactivateDailyClousingVouchersCreate
