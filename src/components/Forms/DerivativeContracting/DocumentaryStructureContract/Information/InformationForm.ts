// Vue - Pinia - Router - Quasar
import { ref, watch, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

// Composables
import { useUtils, useMainLoader } from '@/composables'

// Interfaces
import { ActionType } from '@/interfaces/global'
import { DocumentaryStructureContractQueryParam } from '@/interfaces/global/DerivativeContracting'
import { IDocumentaryStructureContractForm } from '@/interfaces/customs/derivative-contracting/DocumentaryStructureContract'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useDerivativeContractingResourceStore } from '@/stores/resources-manager/derivative-contracting'

const useInformationForm = (
  props: {
    action: ActionType
    basicDataForm?: IDocumentaryStructureContractForm | null
  },
  emit: Function
) => {
  const { openMainLoader } = useMainLoader()
  const { isEmptyOrZero } = useUtils()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const {
    contract_type_id_name,
    contract_document_structure_taxable_base_unit,
  } = storeToRefs(useDerivativeContractingResourceStore('v1'))

  const keyAvailableDocumentTypes = {
    derivative_contracting: ['available_document_types'],
  }

  const formElementRef = ref()

  const models = ref<IDocumentaryStructureContractForm>({
    type_id: null,
    handle_stamp_duty: false,
    taxable_base_unit: null,
    tax_base: null,
    requires_publication: false,
    minimum_amount_unit: null,
    minimum_amount: null,
    policy_management: false,
    attachments: [],
  })

  const _setValueModel = () => {
    Object.assign(models.value, props.basicDataForm)
  }

  const handleStampDuty = (value: boolean) => {
    if (!value) {
      models.value.tax_base = null
      models.value.taxable_base_unit = null
    }
    models.value.handle_stamp_duty = value
  }

  const handleRequiresPublication = (value: boolean) => {
    if (!value) {
      models.value.minimum_amount = null
      models.value.minimum_amount_unit = null
    }
    models.value.requires_publication = value
  }

  const handlePolicyManagement = async (value: boolean) => {
    openMainLoader(true)
    await _getResources(
      keyAvailableDocumentTypes,
      `${DocumentaryStructureContractQueryParam.MANAGES_POLICIES}=${value}`
    )

    openMainLoader(false)
  }

  onBeforeUnmount(() => {
    _resetKeys(keyAvailableDocumentTypes)
  })

  watch(
    () => props.basicDataForm,
    (val) => {
      if (!val) return
      _setValueModel()
    },
    { deep: true, immediate: true }
  )

  watch(
    () => models.value,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.basicDataForm)) return
      emit('update:basic-data-form', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  watch(
    () => models.value.policy_management,
    (newVal, oldVal) => {
      if (newVal !== oldVal) {
        handlePolicyManagement(newVal)
      }
    }
  )

  return {
    models,
    formElementRef,
    contract_type_id_name,
    contract_document_structure_taxable_base_unit,

    handleStampDuty,
    handleRequiresPublication,
  }
}

export default useInformationForm
