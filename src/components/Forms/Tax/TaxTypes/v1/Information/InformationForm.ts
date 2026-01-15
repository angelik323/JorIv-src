import { ref, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

// Stores
import { useTaxResourceStore } from '@/stores/resources-manager/tax'
import { useResourceManagerStore } from '@/stores/resources-manager'

// Interfaces
import { ActionType } from '@/interfaces/global'
import { ITaxTypeTaxResponse } from '@/interfaces/customs/tax/TaxType'

// Composables
import { useUtils, useRules } from '@/composables'
const useInformationForm = (
  props: {
    action: ActionType
    data?: ITaxTypeTaxResponse | null
  },
  emits: Function
) => {
  const { signs, scopes, usages } = storeToRefs(useTaxResourceStore('v1'))

  const models = ref({
    name: '',
    sign: '',
    scope: '',
    usage: '',
    observations: '',
  })

  const formInformationRef = ref()

  const keys = {
    tax: ['signs', 'scopes', 'usages'],
  }

  onMounted(() => {
    useResourceManagerStore('v1')._getResources(keys)
  })

  watch(
    () => models.value,
    (val) => {
      emits('update:models', useUtils().isEmptyObject(val) ? null : val)
    },
    {
      deep: true,
    }
  )

  watch(
    () => props.data,
    (val) => {
      if (val) {
        models.value = {
          name: val.name ?? '',
          sign: val.sign ?? '',
          scope: val.scope ?? '',
          usage: val.usage ?? '',
          observations: val.observations ?? '',
        }
      }
    },
    {
      deep: true,
    }
  )

  return {
    models,
    formInformationRef,
    signs,
    scopes,
    usages,
    utils: useUtils(),
    rules: useRules(),
  }
}

export default useInformationForm
