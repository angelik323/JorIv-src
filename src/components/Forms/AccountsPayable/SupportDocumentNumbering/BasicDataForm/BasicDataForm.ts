// Vue - pinia
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces - Constants
import { ISupportDocumentNumberingForm } from '@/interfaces/customs/accounts-payable/SupportDocumentNumbering'
import { status } from '@/constants'

// Composables
import { useUtils } from '@/composables'

// Stores
import { useThirdPartyResourceStore } from '@/stores/resources-manager/third-party'

const useBasicDataForm = (
  props: {
    data?: ISupportDocumentNumberingForm | null
  },
  emit: Function
) => {
  const { isEmptyOrZero } = useUtils()

  const { third_parties } = storeToRefs(useThirdPartyResourceStore('v1'))

  const basicDataFormRef = ref()

  const models = ref<ISupportDocumentNumberingForm>({
    nit: '',
    name: '',
    status: null,
    delegate_third_party_id: null,
    delegate_third_party_nit: '',
    delegate_third_party_document_type: '',
    delegate_third_party_name: '',
  })

  watch(
    () => models.value.delegate_third_party_id,
    (val) => {
      models.value.delegate_third_party_document_type = ''
      models.value.delegate_third_party_name = ''
      if (!val) return
      const thirdParty = third_parties.value.find((tp) => tp.id === val)
      if (!thirdParty) return
      models.value.delegate_third_party_document_type =
        thirdParty?.document_type?.name ?? ''
      models.value.delegate_third_party_name = thirdParty.name ?? ''
      models.value.delegate_third_party_nit = thirdParty.document ?? ''
    }
  )

  watch(
    () => models.value,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    {
      deep: true,
    }
  )

  const _setValueModel = () => {
    if (!props.data) return
    Object.assign(models.value, props.data)
  }

  watch(
    () => props.data,
    (val) => {
      if (!val) return
      _setValueModel()
    },
    { deep: true, immediate: true }
  )

  return {
    basicDataFormRef,
    models,
    third_parties,
    status,
  }
}

export default useBasicDataForm
