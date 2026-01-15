import { CATEGORY_DATE, CATEGORY_NUMERIC, CATEGORY_VALUE } from '@/constants'
import { IFormatDefinitionMask, IRecordColumnsForm } from '@/interfaces/customs'
import { IResource, WriteActionType } from '@/interfaces/global'
import {
  useBankStructuresStore,
  useResourceManagerStore,
  useTreasuryResourceStore,
} from '@/stores'
import { isEmptyOrZero } from '@/utils'
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const useRecordColumnsForm = (props: {
  action: WriteActionType
  id: number | null
}) => {
  const {
    variables,
    mask,
    constant,
    justification,
    fileType,
    formatType,
    format_masks,
  } = storeToRefs(useTreasuryResourceStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { selectIdRecordType, selectIdFormatDefinition } = storeToRefs(
    useBankStructuresStore('v1')
  )
  const {
    _setDataRecordColumnsForm,
    _getRecordColumnsById,
    _getFormatDefinitionById,
    _getRecordColumnsPurposeValue,
  } = useBankStructuresStore('v1')

  const models = ref<IRecordColumnsForm>({
    record_type_id: null,
    variable_field_id: null,
    structure_field_name: '',
    start_position: null,
    dimension: null,
    end_position: null,
    data_type: '',
    justified_id: null,
    mask_id: null,
    constant: '',
    filler_character: 'N',
    value: '',
  })

  const dataFormat = ref({
    format_type_id: null as number | null,
    file_type_id: null as number | null,
    file_length: null as number | null,
    date_mask_id: null as number | null,
  })

  const formRecordColumns = ref()
  const isFixedPositionOnFileType = ref(false)

  const keys = {
    treasury: ['constant', 'justification', 'fileType', 'formatType'],
  }

  onMounted(async () => {
    await _getResources(keys)

    const { file_type_id, format_type_id, date_mask_id, file_length } =
      await _getFormatDefinitionById(selectIdFormatDefinition.value!)

    const nameFileType = fileType.value.find(
      (filetype) => filetype.value === file_type_id
    )?.label
    const nameFormatType = formatType.value.find(
      (formattype) => formattype.value === format_type_id
    )?.label

    if (nameFormatType) {
      await _getResources(
        { treasury: ['variables'] },
        `filter[format_type]=${nameFormatType}`
      )
    }

    isFixedPositionOnFileType.value = nameFileType === 'Posición fija'

    if (props.action === 'edit' && props.id) {
      models.value = await _getRecordColumnsById(props.id)
    } else {
      models.value.start_position =
        (await _getRecordColumnsPurposeValue()) ?? null
    }

    models.value.record_type_id = selectIdRecordType.value || 0

    dataFormat.value = {
      format_type_id: format_type_id ?? null,
      file_type_id: file_type_id ?? null,
      date_mask_id: date_mask_id ?? null,
      file_length: file_length ?? null,
    }

    if (models.value.variable_field_id && !isConstanteSelected()) {
      _getResources(
        { treasury: ['mask'] },
        `variable_id=${models.value.variable_field_id}`
      )
    }

    if (selectIdFormatDefinition.value) {
      await _getResources(
        { treasury: ['format_mask'] },
        `filter[id]=${selectIdFormatDefinition.value}`
      )
    }
  })

  onBeforeUnmount(() => {
    keys.treasury.push('mask', 'variables', 'format_mask')
    _resetKeys(keys)
  })

  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setDataRecordColumnsForm({} as IRecordColumnsForm)
      } else {
        const selectVariable = variables.value.find(
          (v) => v.value === models.value.variable_field_id
        )

        models.value.data_type = selectVariable?.data_type || ''

        models.value.justified_id =
          Number(
            justification.value.find(
              (j) =>
                j.label.toLowerCase() ===
                selectVariable?.alignment?.toLowerCase()
            )?.value
          ) || null

        if (models.value.dimension && models.value.start_position) {
          models.value.end_position =
            Number(models.value.start_position) + Number(models.value.dimension)
        }

        _setDataRecordColumnsForm({
          status_id: models.value.status_id ?? null,
          record_type_id: models.value.record_type_id ?? null,
          variable_field_id: models.value.variable_field_id ?? null,
          structure_field_name: models.value.structure_field_name ?? '',
          start_position: models.value.start_position ?? null,
          dimension: models.value.dimension ?? null,
          end_position: models.value.end_position ?? null,
          data_type: models.value.data_type ?? '',
          justified_id: models.value.justified_id ?? null,
          mask_id: models.value.mask_id ?? null,
          constant: models.value.constant ?? '',
          filler_character: models.value.filler_character ?? '',
          value: models.value.value ?? '',
        } as IRecordColumnsForm)
      }
    },
    { deep: true }
  )

  const isConstanteSelected = () => {
    const selectedVariable = variables.value.find(
      (variable) => variable.value === models.value.variable_field_id
    )
    return (
      selectedVariable?.label?.toLowerCase().includes('constante') ||
      (selectedVariable?.label?.toLowerCase().includes('tipo registro') &&
        dataFormat.value.format_type_id === 39)
    )
  }

  const handleChangeVariableField = (variableFieldId: number) => {
    models.value.variable_field_id = variableFieldId
    models.value.structure_field_name =
      variables.value.find((v) => v.value === variableFieldId)?.label || ''
    if (variableFieldId && !isConstanteSelected()) {
      _getResources({ treasury: ['mask'] }, `variable_id=${variableFieldId}`)
    }
    if (dataFormat.value.format_type_id === 39 && variableFieldId === 449) {
      models.value.mask_id = dataFormat.value.date_mask_id || null
    } else {
      models.value.mask_id = null
    }
  }

  const disabledMask = computed(() => {
    const dataType = variables.value
      .find((v) => v.value === models.value.variable_field_id)
      ?.data_type?.toLowerCase()
      .trim()
    return dataType === 'alfanumérico' || dataType === 'alfanumerico'
  })

  const disabledConstant = computed(() => {
    return !isConstanteSelected()
  })

  const disabledValueAndFillerCharacter = computed(() => {
    const constantValue = models.value.constant?.toLowerCase().trim()
    return constantValue !== 'alfanumerico' && constantValue !== 'alfanumérico'
  })

  const valueLength = computed(() =>
    dataFormat.value.file_type_id === 48
      ? dataFormat.value.file_length
      : models.value.dimension
  )

  const idCategory = ref<number | undefined>()
  const prevVariableFieldId = ref<number | null>(null)

  const shouldSkipEditMatch = (variableFieldId: number | null): boolean => {
    if (props.action !== 'edit') return false

    if (prevVariableFieldId.value === null && variableFieldId !== null) {
      prevVariableFieldId.value = variableFieldId
      return true
    }

    if (
      prevVariableFieldId.value === variableFieldId &&
      variableFieldId !== null &&
      variableFieldId !== undefined
    ) {
      return true
    }
    return false
  }

  const shouldResetMask = (
    selectedMask: IResource[],
    formatMasks: IFormatDefinitionMask[]
  ): boolean => {
    return (
      !selectedMask || selectedMask.length === 0 || formatMasks.length === 0
    )
  }

  const shouldClearMask = (
    variableFieldId: number | null,
    disabledMask: boolean
  ): boolean => {
    return !variableFieldId || disabledMask
  }

  const getCategoryIds = (format: IFormatDefinitionMask) => {
    return {
      [CATEGORY_NUMERIC]: format.numeric_mask_id,
      [CATEGORY_VALUE]: format.value_mask_id,
      [CATEGORY_DATE]: format.date_mask_id,
    }
  }

  const getSelectedCategoryId = (
    selectedMask: IResource[]
  ): number | undefined => {
    return selectedMask[0]?.category_type?.id
  }

  const getDefaultMaskId = (
    selectedCategoryId: number | undefined,
    categoryIds: Record<number, number | undefined>
  ) => {
    return selectedCategoryId !== undefined &&
      [CATEGORY_NUMERIC, CATEGORY_VALUE, CATEGORY_DATE].includes(
        selectedCategoryId
      )
      ? categoryIds[selectedCategoryId]
      : undefined
  }

  const findMatchedMask = (
    selectedMask: IResource[],
    defaultMaskId: number | undefined,
    selectedCategoryId: number | undefined
  ) => {
    return selectedMask.find(
      (item) =>
        item.id === defaultMaskId &&
        item.category_type?.id === selectedCategoryId
    )
  }

  watch(
    () => ({
      variableFieldId: models.value.variable_field_id,
      selectedMask: mask.value,
      formatMasks: format_masks.value,
    }),
    ({ variableFieldId, selectedMask, formatMasks }) => {
      if (shouldSkipEditMatch(variableFieldId)) {
        return
      }

      if (shouldResetMask(selectedMask, formatMasks)) {
        models.value.mask_id = null
        idCategory.value = undefined
        return
      }

      if (shouldClearMask(variableFieldId, disabledMask.value)) {
        models.value.mask_id = null
        _resetKeys({ treasury: ['mask'] })
        return
      }

      const [format] = formatMasks
      const categoryIds = getCategoryIds(format)
      const selectedCategoryId = getSelectedCategoryId(selectedMask)
      idCategory.value = selectedCategoryId

      const defaultMaskId = getDefaultMaskId(selectedCategoryId, categoryIds)
      const matchedMask = findMatchedMask(
        selectedMask,
        defaultMaskId,
        selectedCategoryId
      )

      models.value.mask_id = matchedMask?.id ?? null
    },
    { immediate: true, deep: true }
  )

  return {
    models,
    formRecordColumns,
    variables,
    valueLength,
    mask,
    constant,
    justification,
    isFixedPositionOnFileType,
    disabledMask,
    disabledConstant,
    disabledValueAndFillerCharacter,
    handleChangeVariableField,
  }
}

export default useRecordColumnsForm
