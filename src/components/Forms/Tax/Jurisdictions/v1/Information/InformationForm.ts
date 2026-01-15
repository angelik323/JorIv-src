import { ref, watch, onMounted, reactive, computed } from 'vue'
import { storeToRefs } from 'pinia'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useAssetResourceStore } from '@/stores/resources-manager/assets'

// Interfaces
import { ActionType } from '@/interfaces/global'
import { ITaxJurisdictionModels } from '@/interfaces/customs/tax/Jurisdiction'

// Composables
import { useUtils, useRules } from '@/composables'

// Constants
import {
  levels,
  countries_dian,
  tax_authorities,
} from '@/constants/resources/tax'

const useInformationForm = (
  props: {
    action: ActionType
    data?: ITaxJurisdictionModels | null
  },
  emits: Function
) => {
  const { countries, departments_divipola, municipalities_divipola } =
    storeToRefs(useAssetResourceStore('v1'))

  const models: ITaxJurisdictionModels = reactive({
    name: '',
    level: '',
    country: '',
    department: '',
    city: '',
    tax_authority: '',
    observations: '',
  })

  const disable_country = computed(() => !['pais'].includes(models.level))
  const disable_department = computed(
    () => ['pais', 'nacional'].includes(models.level) || !models.level
  )
  const disable_city = computed(
    () =>
      ['pais', 'nacional', 'departmental'].includes(models.level) ||
      !models.level
  )

  const formInformationRef = ref()

  const keys = {
    assets: { assets: ['countries', 'departments', 'cities'] },
    jurisdictions: { jurisdictions: ['levels', 'tax_authorities'] },
  }

  const update_level = (val: string | null) => {
    models.level = val || ''

    if (!val || val === 'pais') {
      models.country = ''
      models.department = ''
      models.city = ''
    } else {
      models.country = 'CO - Colombia'
    }
  }

  const update_country = (val: string | null) => {
    models.country = val ?? ''
    if (!val) {
      models.country = ''
      models.department = ''
      models.city = ''
    }
  }

  const update_department = (val: string | null) => {
    models.department = val ?? ''
    if (!val) {
      models.department = ''
      models.city = ''
    }
  }

  const update_city = (val: string | null) => {
    models.city = val ?? ''
    if (!val) {
      models.city = ''
    }
  }

  onMounted(() => {
    useResourceManagerStore('v1')._getResources(keys.assets)
  })

  watch(models, (val) => {
    emits('update:models', useUtils().isEmptyObject(val) ? null : val)
  })

  watch(
    () => props.data,
    (val) => {
      if (val) {
        Object.assign(models, {
          name: val.name ?? '',
          level: val.level ?? '',
          country: val.country ?? '',
          department: val.department ?? '',
          city: val.city ?? '',
          tax_authority: val.tax_authority ?? '',
          observations: val.observations ?? '',
        })
      }
    },
    {
      deep: true,
    }
  )

  return {
    models,
    formInformationRef,
    disable_country,
    disable_department,
    disable_city,
    countries,
    departments: departments_divipola,
    cities: municipalities_divipola,
    levels,
    countries_dian,
    tax_authorities,
    update_level,
    update_country,
    update_department,
    update_city,
    utils: useUtils(),
    rules: useRules(),
  }
}

export default useInformationForm
