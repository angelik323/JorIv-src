// vue
import { ref, computed, onMounted } from 'vue'
// utils
import { defaultIconsLucide, formatParamsCustom } from '@/utils'

// interfaces
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { ITabs } from '@/interfaces/global'

//Composables
import { useAlert, useGoToUrl, useMainLoader } from '@/composables'

// Stores
import { useAmortizationTablesStore } from '@/stores/financial-obligations/amortization-tables'

const useAmortizationTablesCreate = () => {
  const { _loadAmortizationList, _resetSetAmortizationData } =
    useAmortizationTablesStore('v1')

  const { openMainLoader } = useMainLoader()
  const { showAlert } = useAlert()
  const { goToURL } = useGoToUrl()

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'business_code',
      label: 'Código negocio fiduciario',
      type: 'q-input',
      value: null,
      class: 'col-xs-12',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por código',
    },
  ])

  const headerProps = {
    title: 'Crear tabla de amortización',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Negocios fiduciarios',
        route: '',
      },
      {
        label: 'Tabla de amortización',
        route: 'AmortizationTablesList',
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
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))

  const tabActive = ref(filteredTabs.value[0].name)

  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const filtersFormat = ref<Record<string, string | number>>({})

  const loadAmortizationList = async (keyUrl: string) => {
    openMainLoader(true)
    await _loadAmortizationList(keyUrl)

    openMainLoader(false)
  }

  const handlerSearchFilter = ($filters: {
    'filter[business_code]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    if (queryString) {
      loadAmortizationList(queryString ? '&' + queryString : '')
    } else {
      showAlert('Debe digitar alguna busqueda', 'error')
    }
  }

  const resetSetAmortizationData = () => {
    _resetSetAmortizationData()
  }

  onMounted(async () => {
    openMainLoader(true)
    openMainLoader(false)
  })

  return {
    headerProps,
    tabActive,
    filteredTabs,
    tabActiveIdx,
    handlerSearchFilter,
    filterConfig,
    goToURL,
    resetSetAmortizationData,
  }
}

export default useAmortizationTablesCreate
