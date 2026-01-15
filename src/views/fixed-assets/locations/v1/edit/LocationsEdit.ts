// core
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// interfaces
import { ITabs } from '@/interfaces/global'
import { ILocationsCreateForm } from '@/interfaces/customs/fixed-assets/v1/Locations'

// stores

import { useLocationsStore } from '@/stores/fixed-assets/locations'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useLocationsEdit = () => {
  const route = useRoute()
  const id = +route.params.id
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { _updateLocation } = useLocationsStore('v1')
  const { defaultIconsLucide } = useUtils()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const basicDataFormRef = ref()
  const form = ref<ILocationsCreateForm | null>()

  const fixedAssetsKeys = {
    fixed_assets: ['location_types'],
  }

  const keys = { assets: ['countries', 'departments', 'cities'] }

  form.value = {
    id: id,
    created_by_name: String(route.query.created_by_name ?? ''),
    updated_by_name: String(route.query.updated_by_name ?? ''),
    created_at: '',
    updated_at: String(route.query.updated_at ?? ''),
    location_types: null,
    which: '',
    locations: null,
    parent_location: null,
    country: null,
    department: null,
    city: null,
    address: null,
  }

  // configs
  const headerProps = {
    title: 'Editar ubicación',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Activos fijos',
        route: '',
      },
      {
        label: 'Ubicación',
        route: 'LocationsList',
      },
      {
        label: 'Editar',
        route: 'LocationsEdit',
      },
      {
        label: `${id}`,
        route: '',
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
      required: false,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  // actions

  const makePayload = () => {
    if (!form.value) return null

    return {
      type_location: form.value.location_types!,
      custom_type_location: form.value.which ?? null,
      location_parent_id: form.value.locations ?? null,

      country_id: form.value.country!,
      department_id: form.value.department!,
      city_id: form.value.city!,

      address: form.value.address ?? '',
    }
  }

  const handleEdit = async () => {
    openMainLoader(true)

    const payload = makePayload()

    if (!payload) return

    const ok = await _updateLocation(payload, id)

    if (ok) goToURL('LocationsList')

    setTimeout(() => openMainLoader(false), 600)
  }

  onMounted(async () => {
    openMainLoader(true)
    await Promise.all([_getResources(fixedAssetsKeys)])
    _getResources(
      {
        fixed_assets: ['locations'],
      },
      `filter[active]=1`
    )
    await _getResources(keys)
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(fixedAssetsKeys)
    _resetKeys(keys)
    _resetKeys({
      fixed_assets: ['locations'],
    })
  })

  return {
    // configs
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,

    // refs
    basicDataFormRef,
    form,

    // methods
    handleEdit,
    goToURL,
  }
}

export default useLocationsEdit
