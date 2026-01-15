import { ref } from 'vue'

// Interfaces
import { ITabs } from '@/interfaces/global'

// Composables
import { useUtils, useGoToUrl, useMainLoader } from '@/composables'

// Interfaces
import {
  ITaxJurisdictionModels,
  ITaxJurisdictionRequest,
} from '@/interfaces/customs/tax/Jurisdiction'

// Stores
import { useJurisdictionsStore } from '@/stores/tax/jurisdictions'

const useTaxJurisdictionCreate = () => {
  const title: string = 'Crear jurisdicción'
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
      label: 'Crear',
      route: 'JurisdictionsCreate',
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

  const payload_create = ref<ITaxJurisdictionModels | null>(null)

  const informationFormRef = ref()

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

  const makePayloadCreate = (): ITaxJurisdictionRequest | {} => {
    if (!payload_create.value) {
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
    } = payload_create.value
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

  const onSubmit = async () => {
    if (await informationFormRef.value?.validate()) {
      useMainLoader().openMainLoader(true)
      const payload = makePayloadCreate() as ITaxJurisdictionRequest
      const successResponse = await useJurisdictionsStore()._createJurisdiction(
        payload
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
    payload_create,
    informationFormRef,
    onSubmit,
    goToURL,
  }
}

export default useTaxJurisdictionCreate
