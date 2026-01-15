// vue - pinia
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useFixedAssetsResourceStore, useResourceManagerStore } from '@/stores'

// interfaces
import { ActionType } from '@/interfaces/global'
import {
  IAssetTypeForm,
  IAssetTypeResponse
} from '@/interfaces/customs/fixed-assets/ConfigurationTypeSubtypes'

// composables
import { useUtils } from '@/composables'
import {
  usePagination,
  useAuditFields,
  useSubtypeActions,
  useSubtypesTable,
  useFormValidation
} from '@/components/Forms/FixedAssets/ConfigurationTypeSubtypes/InformationForm/composables'

const useInformationForm = (
  props: {
    action: ActionType
    data?: IAssetTypeResponse | null
  },
  emit: Function
) => {
  // resources stores
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { type, asset_class } = storeToRefs(useFixedAssetsResourceStore('v1'))

  // keys para consumir recursos
  const keys = {
    fixed_assets: ['configuration_type_code', 'asset_class', 'type']
  }

  const assetClassesOptions = asset_class

  const typeOptions = type

  const displayTypeLabel = computed(() => {
    if (!model.value?.type || !typeOptions.value) return ''
    const selectedOption = typeOptions.value.find((option) => option.value === model.value?.type)
    return selectedOption?.label || ''
  })

  const model = ref<IAssetTypeForm | null>(null)

  const information_form_ref = ref()
  const type_form_ref = ref()
  const subtypes_form_ref = ref()

  const subtypes = computed(() => {
    return model.value?.subtypes || []
  })

  const isEditable = computed(() => {
    return ['create', 'edit'].includes(props.action)
  })

  const { defaultIconsLucide } = useUtils()

  const pagination = usePagination(() => subtypes.value, 20)
  const subtypeActions = useSubtypeActions(
    () => model.value,
    () => {
      pagination.adjustPageAfterDelete(subtypes.value.length)
      table.updateSubtypesTable()
    }
  )

  const table = useSubtypesTable(
    props.action,
    () => pagination.paginatedItems.value,
    () => pagination.lastPage.value,
    () => pagination.currentPage.value
  )

  const auditFields = useAuditFields(() => model.value, props.action)

  const validation = useFormValidation(() => model.value, type_form_ref, subtypes_form_ref)

  const clearForm = () => {
    model.value = null
    table.updateSubtypesTable()
    subtypeActions.resetDeletedSubtypes()
  }

  const _setValueModel = () => {
    clearForm()
    model.value = {
      type: 'activo fijo',
      code: null,
      description: null,
      asset_class: null,
      subtypes: []
    }
    subtypeActions.addSubtype()
  }

  const setDataFormFromProps = (data: IAssetTypeResponse | null = props.data ?? null) => {
    clearForm()
    if (!data) return

    model.value = {
      ...data,
      subtypes: data.subtypes.map((subtype) => ({
        ...subtype,
        _uid: subtypeActions.uidCounter.value++,
        depreciation: subtype.depreciation ? Number(subtype.depreciation) : null
      }))
    }

    table.updateSubtypesTable()
  }

  const handlerActionForm = (action: ActionType) => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: () => setDataFormFromProps(),
      view: () => setDataFormFromProps()
    }
    actionHandlers[action]?.()
  }

  const handleUpdatePage = (page: number) => {
    pagination.handleUpdatePage(page)
    table.updateSubtypesTable()
  }

  const handleUpdateRowsPerPage = (perPage: number) => {
    pagination.handleUpdateRowsPerPage(perPage)
    table.updateSubtypesTable()
  }

  const getDisplayIndex = (rowIndex: number): number => {
    return (pagination.currentPage.value - 1) * pagination.rowsPerPage.value + rowIndex + 1
  }

  watch(
    () => model.value,
    () => {
      emit('update:model', model.value)
    },
    { deep: true }
  )

  watch(
    () => props.data,
    () => {
      handlerActionForm(props.action)
    },
    { immediate: true }
  )

  // lifecycles
  onMounted(async () => {
    await _getResources(keys)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  return {
    model,
    information_form_ref,
    type_form_ref,
    subtypes_form_ref,
    deletedSubtypes: subtypeActions.deletedSubtypes,

    subtypesTableProps: table.subtypesTableProps,

    subtypes,
    isEditable,
    displayCreationDate: auditFields.displayCreationDate,
    displayCreatedBy: auditFields.displayCreatedBy,
    displayUpdatedAt: auditFields.displayUpdatedAt,
    displayUpdatedBy: auditFields.displayUpdatedBy,
    showAuditFields: auditFields.showAuditFields,
    showOnlyCreationDate: auditFields.showOnlyCreationDate,
    shouldShowPagination: pagination.shouldShowPagination,

    typeOptions,
    displayTypeLabel,
    assetClassesOptions,

    defaultIconsLucide,

    deleteModalConfig: subtypeActions.deleteModalConfig,
    deleteModalRef: subtypeActions.deleteModalRef,

    addSubtype: subtypeActions.addSubtype,
    openDeleteSubtypeModal: subtypeActions.openDeleteSubtypeModal,
    confirmDeleteSubtype: subtypeActions.confirmDeleteSubtype,
    validateForm: validation.validateForm,
    validateCodeUniqueness: validation.validateCodeUniqueness,

    handleUpdatePage,
    handleUpdateRowsPerPage,
    getDisplayIndex
  }
}

export default useInformationForm
