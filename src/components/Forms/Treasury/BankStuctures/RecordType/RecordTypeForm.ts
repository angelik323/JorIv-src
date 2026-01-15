import { IRecordTypeForm } from '@/interfaces/customs'
import { WriteActionType } from '@/interfaces/global'
import {
  useBankStructuresStore,
  useResourceManagerStore,
  useTreasuryResourceStore,
} from '@/stores'
import { isEmptyOrZero } from '@/utils'
import { storeToRefs } from 'pinia'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const useRecordTypeForm = (props: {
  action: WriteActionType
  id: number | null
}) => {
  const { registerType } = storeToRefs(useTreasuryResourceStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { selectIdFormatDefinition } = storeToRefs(useBankStructuresStore('v1'))
  const { _setDataRecordTypeForm, _getRecordTypeById } =
    useBankStructuresStore('v1')

  const models = ref<IRecordTypeForm>({
    bank_structure_id: null,
    order: null,
    name: null,
    record_type_id: null,
    length: null,
  })

  const formRecordType = ref()

  const keys = { treasury: ['registerType'] }

  onMounted(async () => {
    if (props.action === 'edit' && props.id) {
      models.value = await _getRecordTypeById(props.id)
    }
    _getResources(keys)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setDataRecordTypeForm({} as IRecordTypeForm)
      } else {
        _setDataRecordTypeForm({
          status_id: models.value.status_id ?? 0,
          bank_structure_id: models.value.bank_structure_id ?? 0,
          order: models.value.order ?? 0,
          name: models.value.name ?? '',
          record_type_id: models.value.record_type_id ?? 0,
          length: models.value.length ?? undefined,
        } as IRecordTypeForm)
      }
    },
    { deep: true }
  )

  watch(
    selectIdFormatDefinition,
    (newSelectIdFormatDefinition) => {
      models.value.bank_structure_id = newSelectIdFormatDefinition || 0
    },
    { immediate: true }
  )

  return {
    models,
    formRecordType,
    registerType,
  }
}

export default useRecordTypeForm
