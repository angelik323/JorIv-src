import { useAlert } from '@/composables'
import {
  useBankStructuresStore,
  useResourceManagerStore,
  useTreasuryResourceStore,
} from '@/stores'
import { storeToRefs } from 'pinia'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const useBankStructuresList = () => {
  const { headerPropsDefault } = storeToRefs(useBankStructuresStore('v1'))
  const { showAlert } = useAlert()
  const { _setFiltersFormat, _resetDataStore } = useBankStructuresStore('v1')

  const { banks } = storeToRefs(useTreasuryResourceStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const headerProperties = headerPropsDefault.value

  const filters = [
    {
      name: 'bank',
      label: 'Banco',
      type: 'q-select',
      value: null,
      class: 'col-12',
      disable: false,
      options: banks,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
    },
  ]
  const filterConfig = ref(filters)
  const filtersFormat = ref<Record<string, string | number>>({})

  const handleFilterSearch = ($filters: { 'filter[bank]': string }) => {
    if ($filters['filter[bank]']) {
      filtersFormat.value = {
        ...$filters,
      }
      _setFiltersFormat(filtersFormat.value)
    } else {
      showAlert(
        'Por favor seleccione un banco para continuar con la búsqueda',
        'warning'
      )
    }
  }

  const handleClearFilters = () => {
    _setFiltersFormat({ clear: true })
  }

  const keys = { treasury: ['banks'] }
  onMounted(async () => {
    _getResources(keys)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
    _resetDataStore()
  })

  return {
    headerProperties,
    filterConfig,
    handleFilterSearch,
    handleClearFilters,
  }
}

export default useBankStructuresList
