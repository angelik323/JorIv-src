import { onMounted, ref } from 'vue'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  ITaxJurisdictionResponse,
  ITaxJurisdictionRequest,
  ITaxJurisdictionModels,
} from '@/interfaces/customs/tax/Jurisdiction'

// Composables
import { useGoToUrl, useUtils, useMainLoader } from '@/composables'

// Stores
import { useJurisdictionsStore } from '@/stores/tax/jurisdictions'

// Router
import { useRoute } from 'vue-router'
const useTaxJurisdictionEdit = () => {
  const id = useRoute().params?.id || null
  const title: string = 'Editar jurisdicción'
  const breadcrumbs = [
    {
      label: 'Inicio',
      route: 'HomeView',
    },
    {
      label: 'Tributario',
      route: '',
    },
    {
      label: 'Jurisdicciones',
      route: 'JurisdictionsList',
    },
    {
      label: 'Editar',
      route: 'JurisdictionsEdit',
    },
    {
      label: id!.toString(),
    },
  ]

  const tabs: ITabs[] = [
    {
      name: 'information',
      label: 'Datos básicos',
      icon: useUtils().defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  // Referencias a formularios
  const informationFormRef = ref()

  const response_data = ref<ITaxJurisdictionResponse | null | undefined>(null)
  const payload_edit = ref<ITaxJurisdictionModels | null>(null)

  const goToURL = useGoToUrl().goToURL

  const extractCodeAndName = (
    value: string
  ): { code: string; name: string } => {
    const parts = value?.split(' - ') || ['', '']
    return {
      code: parts[0] || '',
      name: parts[1] || '',
    }
  }

  const buildDepartmentData = (department: string) => {
    const { code, name } = extractCodeAndName(department)
    return {
      department_code: code,
      department_name: name,
    }
  }

  const buildMunicipalityData = (city: string) => {
    const { code, name } = extractCodeAndName(city)
    return {
      municipality_code: code,
      municipality_name: name,
    }
  }

  const makePayloadUpdate = (): ITaxJurisdictionRequest | {} => {
    if (!payload_edit.value) {
      return {}
    }

    const {
      level,
      country,
      department,
      city,
      name,
      tax_authority,
      observations,
    } = payload_edit.value
    const countryData = extractCodeAndName(country ?? '')
    const departmentData = extractCodeAndName(department ?? '')

    const basePayload: ITaxJurisdictionRequest = {
      code: 'CO_PEI',
      name: name ?? '',
      level: level ?? '',
      country_code: countryData.code,
      country_name: countryData.name,
      department_code: departmentData.code,
      department_name: departmentData.name,
      tax_authority: tax_authority ?? '',
      observations: observations ?? '',
    }

    const levelHandlers: Record<
      string,
      () => Partial<ITaxJurisdictionRequest>
    > = {
      departmental: () => buildDepartmentData(department ?? ''),
      municipal: () => ({
        ...buildDepartmentData(department ?? ''),
        ...buildMunicipalityData(city ?? ''),
      }),
    }

    const additionalData = levelHandlers[level ?? '']?.() || {}

    return {
      ...basePayload,
      ...additionalData,
    }
  }

  onMounted(async () => {
    showById()
  })

  const showById = async () => {
    if (!id) {
      goToURL('JurisdictionsList')
    }
    response_data.value = await useJurisdictionsStore()._getJurisdiction(
      Number(id)
    )

    makeDataModel(response_data.value)
  }

  const makeDataModel = (data: ITaxJurisdictionResponse | null) => {
    if (!data) return false

    payload_edit.value = {
      name: data.name ?? '',
      level: data.level ?? '',
      country: data.country_code
        ? `${data.country_code} - ${data.country_name}`
        : '',
      department: data.department_code
        ? `${data.department_code} - ${data.department_name}`
        : '',
      city: data.municipality_code
        ? `${data.municipality_code} - ${data.municipality_name}`
        : '',
      tax_authority: data.tax_authority ?? '',
      observations: data.observations ?? '',
    }
  }

  const onSubmit = async () => {
    if (await informationFormRef.value?.validate()) {
      useMainLoader().openMainLoader(true)
      const payload = makePayloadUpdate() as ITaxJurisdictionRequest
      const successResponse = await useJurisdictionsStore()._updateJurisdiction(
        Number(id),
        payload as ITaxJurisdictionRequest
      )

      if (successResponse) {
        goToURL('JurisdictionsList')
      }
      useMainLoader().openMainLoader(false)
    }
  }

  return {
    title,
    breadcrumbs,
    tabs,
    tabActive,
    tabActiveIdx,
    response_data,
    payload_edit,
    informationFormRef,
    onSubmit,
    goToURL,
  }
}

export default useTaxJurisdictionEdit
