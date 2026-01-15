// Vue - pinia
import { ref, watch, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { WriteActionType } from '@/interfaces/global'
import { IGenerationCertificateInformationForm } from '@/interfaces/customs/normative/GenerationCertificate'

// Composables - constants
import { useUtils } from '@/composables/useUtils'
import { person_types } from '@/constants/resources'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useThirdPartyResourceStore } from '@/stores/resources-manager/third-party'

const useInformationForm = (
  props: {
    action: WriteActionType
    data: IGenerationCertificateInformationForm | null
  },
  emit: Function
) => {
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { third_parties } = storeToRefs(useThirdPartyResourceStore('v1'))

  const { defaultIconsLucide, isEmptyOrZero } = useUtils()

  const personTypeOptions = person_types.filter(
    (type) => type.label?.toLowerCase() !== 'todos'
  )

  const formElementRef = ref()
  const disableValiditySelectors = ref(false)

  const initialModelsValues: IGenerationCertificateInformationForm = {
    validity: null,
    person_types: null,
    start_client_id: null,
    end_client_id: null,
    massive: false,
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const _setValueModel = () => {
    if (!props.data) return
    Object.assign(models.value, props.data)
  }

  const keyClients = {
    third_party: ['third_parties'],
  }

  onBeforeUnmount(() => {
    _resetKeys(keyClients)
  })

  watch(
    () => props.data,
    (val) => {
      if (!val) return
      _setValueModel()
    },
    { deep: true, immediate: true }
  )

  watch(
    models,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  watch(
    () => models.value.person_types,
    async (newVal: string | number | null) => {
      if (newVal == null) return

      let personFilter = ''
      if (newVal != 0) {
        personFilter = `filter[person_type]=${newVal}`
      } else {
        personFilter = ``
      }
      await _getResources(
        {
          third_party: ['third_parties'],
        },
        `fields[third_parties]=id,document&filter[is_customer]=1&${personFilter}`
      )
    }
  )

  watch(
    () => models.value.massive,
    () => {
      models.value.start_client_id = null
      models.value.end_client_id = null
    },
    { deep: true }
  )

  return {
    defaultIconsLucide,
    formElementRef,
    models,
    personTypeOptions,
    disableValiditySelectors,
    third_parties,
  }
}

export default useInformationForm
