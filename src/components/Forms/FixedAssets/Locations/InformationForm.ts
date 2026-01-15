// vue - quasar
import { computed, ref, watch } from 'vue'

// interface
import { ActionType } from '@/interfaces/global'
import { ILocationsCreateForm } from '@/interfaces/customs/fixed-assets/v1/Locations'
import { ILocation } from '@/interfaces/customs/AddressGenerator'

// stores
import { storeToRefs } from 'pinia'
import { useFixedAssetsResourceStore } from '@/stores/resources-manager/fixed-assets'
import { useAssetResourceStore } from '@/stores/resources-manager/assets'

// composable
import { useUtils } from '@/composables/useUtils'

const useInformationform = (
  props: {
    action: ActionType
    data?: ILocationsCreateForm | null
  },

  emit: Function
) => {
  const { isEmptyOrZero } = useUtils()

  // stores
  const { location_types, locations } = storeToRefs(
    useFixedAssetsResourceStore('v1')
  )

  const { countries, departments, cities } = storeToRefs(
    useAssetResourceStore('v1')
  )

  const models = ref<ILocationsCreateForm>({
    id: null,
    created_by_name: null,
    updated_by_name: null,
    updated_at: null,
    created_at: null,
    location_types: null,
    locations: null,
    which: null,
    parent_location: null,
    city: null,
    address: null,
    department: null,
    country: null,
    country_name: null,
    city_name: null,
    department_name: null,
  })

  const locationsFormRef = ref()
  const isAddressGeneratorOpen = ref(false)

  const defaultDateValue = computed(() => {
    if (props.action === 'edit' && models.value.created_at) {
      return models.value.created_at
    }

    return new Date().toLocaleString('sv-SE')
  })

  const isOtherLocation = computed(() => {
    return models.value.location_types === 13
  })

  const handleSaveAddress = (location: ILocation) => {
    models.value.country_name = location.country?.name ?? null
    models.value.department_name = location.department?.name ?? null
    models.value.city_name = location.city?.name ?? null

    models.value.address = location.address ?? null
    models.value.country = String(location.country?.id) ?? null
    models.value.department = String(location.department?.id) ?? null
    models.value.city = String(location.city?.id) ?? null
  }

  // lifecycle hooks
  watch(
    models,
    (val) => {
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true, flush: 'post' }
  )

  watch(
    () => props.data,

    (val) => {
      if (val && props.data) models.value = props.data
    },

    { immediate: true }
  )

  return {
    models,
    locationsFormRef,
    location_types,
    locations,
    defaultDateValue,
    isOtherLocation,
    isAddressGeneratorOpen,
    countries,
    departments,
    cities,
    handleSaveAddress,
  }
}

export default useInformationform
