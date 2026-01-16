// core
import { onBeforeUnmount, onMounted, ref } from 'vue'

// interfaces
import { ITabs } from '@/interfaces/global'
import { ILocationsCreateForm } from '@/interfaces/customs/fixed-assets/v1/Locations'

// composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// stores

import { useResourceManagerStore } from '@/stores/resources-manager'
import { useLocationsStore } from '@/stores/fixed-assets/locations'

const useLocationsCreate = () => {
  // hooks
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()
  const { _createLocation } = useLocationsStore('v1')

  const basicDataFormRef = ref()
  const form = ref<ILocationsCreateForm | null>()

  // stores

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const fixedAssetsKeys = {
    fixed_assets: ['location_types'],
  }

  const keys = { assets: ['countries', 'departments', 'cities'] }

  // configs
  const headerProps = {
    title: 'Crear ubicación',
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
        label: 'Crear',
        route: 'LocationsCreate',
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

  const makePayload = () => {
    if (!form.value) return null

    return {
      type_location: Number(form.value.location_types!),
      custom_type_location: form.value.which ?? null,
      location_parent_id: Number(form.value.locations ?? null),

      country_id: form.value.country!,
      department_id: form.value.department!,
      city_id: form.value.city!,

      address: form.value.address ?? '',
    }
  }

  const handleCreate = async () => {
    openMainLoader(true)

    const payload = makePayload()

    if (!payload) return

    const ok = await _createLocation(payload)

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
    handleCreate,
    goToURL,
  }
}

export default useLocationsCreate
