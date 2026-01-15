// vue - quasar - router - pinia
import { useRouter } from 'vue-router'
import { onMounted, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

// store
import { useExtendTrustStore } from '@/stores/trust-business/extend-trust'
import { useResourceStore } from '@/stores/resources-selects'

// composables
import { useMainLoader } from '@/composables'

// utils
import { defaultIconsLucide } from '@/utils'

// interfaces
import { ITabs } from '@/interfaces/global'
import {
  IExtendTrustCreate,
  IExtendTrustResponse,
} from '@/interfaces/customs/trust-business/ExtendTrust'

const useExtendTrustCreate = () => {
  // imports
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { data_information_form } = storeToRefs(useExtendTrustStore('v1'))

  const { _setDataInformationForm, _createExtendTrustAction } =
    useExtendTrustStore('v1')

  const keys = ['business_trusts']

  const { _getTrustBusinessResources } = useResourceStore('v1')

  const { extend_business } = storeToRefs(useResourceStore('v1'))

  const headerProps = {
    title: 'Crear prórroga fideicomiso',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Negocios Fiduciarios',
      },
      {
        label: 'Prórroga fideicomiso',
        route: 'ExtendTrustList',
      },
      {
        label: 'Crear',
      },
    ],
  }

  // filters
  const filterConfig = ref([
    {
      name: 'business_trust',
      label: 'Buscar',
      type: 'q-select',
      value: null,
      class: 'col-12 q-py-md',
      options: extend_business,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione un neogcio fiduciario',
      autocomplete: true,
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})
  const dataFilters = ref<IExtendTrustResponse>()

  const handleFilter = ($filters: { 'filter[business_trust]': string }) => {
    filtersFormat.value = {
      ...$filters,
    }

    const foundResource =
      extend_business.value.find(
        (item) => item.id === +$filters['filter[business_trust]']
      ) || undefined

    dataFilters.value = foundResource
      ? {
          id: foundResource?.id ?? 0,
          code: foundResource?.business_code ?? '',
          name: foundResource?.name ?? '',
          start_date: foundResource?.start_date ?? '',
          end_date: foundResource?.end_date ?? '',
          extension_date: '',
          observation: '',
        }
      : undefined
  }

  const handleClearFilters = () => {
    dataFilters.value = undefined
    filtersFormat.value = {}
  }

  // tabs
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

  const makeDataRequest = (): IExtendTrustCreate => {
    return {
      id: data_information_form.value?.id ?? 0,
      extension_date: data_information_form.value?.extension_date ?? '',
      observation: data_information_form.value?.observation ?? '',
    }
  }

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
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
    await _getTrustBusinessResources(`keys[]=${keys.join('&keys[]=')}`)
  })

  onUnmounted(async () => {
    _setDataInformationForm(null)
  })

  const onSubmit = async () => {
    if (await validateForm()) {
      openMainLoader(true)
      const payload: IExtendTrustCreate = makeDataRequest()
      if (await _createExtendTrustAction(payload, 'create')) {
        router.push({
          name: 'ExtendTrustList',
          query: {
            reload: 1,
          },
        })
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
    filterConfig,
    dataFilters,
    handleFilter,
    handleClearFilters,
    onSubmit,
    handlerGoTo,
  }
}

export default useExtendTrustCreate
