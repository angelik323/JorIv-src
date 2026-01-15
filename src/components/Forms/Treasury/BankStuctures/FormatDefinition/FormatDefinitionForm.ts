import { IFormatDefinitionForm } from '@/interfaces/customs'
import { WriteActionType } from '@/interfaces/global'
import {
  useBankStructuresStore,
  useResourceManagerStore,
  useTreasuryResourceStore,
} from '@/stores'
import { isEmptyOrZero } from '@/utils'
import { storeToRefs } from 'pinia'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const useFormatDefinitionForm = (props: {
  action: WriteActionType
  id: number | null
}) => {
  const {
    origin,
    formatType,
    validationType,
    fileExtension,
    fileType,
    valueMask,
    numericMask,
    dateMask,
  } = storeToRefs(useTreasuryResourceStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { filtersFormat } = storeToRefs(useBankStructuresStore('v1'))
  const { _setDataFormatDefinitionForm, _getFormatDefinitionById } =
    useBankStructuresStore('v1')

  const models = ref<IFormatDefinitionForm>({
    bank_id: null,
    origin_id: null,
    description: null,
    format_type_id: (formatType.value[0]?.value as number) ?? null,
    validation_type_id: (validationType.value[0]?.value as number) ?? null,
    generated_file_name: null,
    dispersal_group: false,
    generation_time: false,
    date: false,
    file_extension_id: null,
    path: null,
    applies_to_dispersal: false,
    equivalence_validation: false,
    file_length: undefined,
    file_type_id: (fileType.value[0]?.value as number) ?? null,
    separator: null,
    numeric_mask_id: null,
    value_mask_id: null,
    date_mask_id: null,
  })

  const formFormatDefinition = ref()

  const keys = {
    treasury: [
      'origin',
      'formatType',
      'validationType',
      'fileExtension',
      'fileType',
      'numericMask',
      'valueMask',
      'dateMask',
      'variables',
    ],
  }

  onMounted(async () => {
    if (props.action === 'edit' && props.id) {
      models.value = await _getFormatDefinitionById(props.id)
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
        _setDataFormatDefinitionForm({} as IFormatDefinitionForm)
      } else {
        _setDataFormatDefinitionForm({
          status_id: models.value.status_id ?? 0,
          bank_id: models.value.bank_id ?? 0,
          origin_id: models.value.origin_id ?? 0,
          description: models.value.description ?? '',
          format_type_id: models.value.format_type_id ?? 0,
          validation_type_id: models.value.validation_type_id ?? 0,
          generated_file_name: models.value.generated_file_name ?? '',
          dispersal_group: models.value.dispersal_group ?? false,
          generation_time: models.value.generation_time ?? false,
          date: models.value.date ?? 'false',
          file_extension_id: models.value.file_extension_id ?? 0,
          path: models.value.path ?? '',
          applies_to_dispersal: models.value.applies_to_dispersal ?? false,
          equivalence_validation: models.value.equivalence_validation ?? false,
          file_length: models.value.file_length ?? undefined,
          file_type_id: models.value.file_type_id ?? 0,
          separator: models.value.separator ?? ',',
          numeric_mask_id: models.value.numeric_mask_id ?? 0,
          value_mask_id: models.value.value_mask_id ?? 0,
          date_mask_id: models.value.date_mask_id ?? 0,
        } as IFormatDefinitionForm)
      }
    },
    { deep: true }
  )

  watch(
    filtersFormat,
    (newFilter) => {
      if (newFilter) {
        models.value.bank_id = (newFilter['filter[bank]'] as number) || 0
      }
    },
    { immediate: true }
  )

  return {
    models,
    formFormatDefinition,

    // Selectors
    origin,
    formatType,
    validationType,
    fileExtension,
    fileType,
    valueMask,
    numericMask,
    dateMask,
  }
}

export default useFormatDefinitionForm
