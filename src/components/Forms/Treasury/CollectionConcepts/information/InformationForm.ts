import { ICollectionConceptsResponse } from '@/interfaces/customs'
import {
  useCollectionsConceptsStore,
  useResourceManagerStore,
  useTreasuryResourceStore,
} from '@/stores'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'

const useInformationForm = (props: {
  action: 'create' | 'edit'
  data?: ICollectionConceptsResponse | null
}) => {
  const { data_information_form } = storeToRefs(
    useCollectionsConceptsStore('v1')
  )
  const { _setDataCollectionsConcepts, _dataBasicError } =
    useCollectionsConceptsStore('v1')

  const { _getResources } = useResourceManagerStore('v1')

  const {
    account_structures_collection,
    collection_concept_type,
    collection_concept_status,
  } = storeToRefs(useTreasuryResourceStore('v1'))

  const keys = {
    treasury: [
      'account_structures_collection',
      'collection_type',
      'collection_status',
    ],
  }

  const models = ref<{
    structure_id: number | null
    structure_name: string | null
    structure_use: string | null
    structure_code: string | null
    type: string | null
    description: string | null
    status?: number | null
  }>({
    structure_id: null,
    structure_name: null,
    structure_use: null,
    structure_code: null,
    type: null,
    description: null,
    status: 1,
  })

  const formInformation = ref()

  const clearForm = () => {
    models.value.structure_id = null
    models.value.structure_name = null
    models.value.structure_use = null
    models.value.structure_code = null
    models.value.type = null
    models.value.description = null
    models.value.status = null
  }

  const _setValueModel = () => {
    if (data_information_form.value) {
      models.value = {
        ...data_information_form.value,
        status:
          typeof data_information_form.value.status === 'object' &&
          data_information_form.value.status !== null
            ? data_information_form.value.status.id
            : data_information_form.value.status ?? 1,
      }
    }
  }

  const handlerActionForm = (action: 'create' | 'edit') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: setFormEdit,
    }
    actionHandlers[action]?.()
  }

  const setFormEdit = () => {
    clearForm()
    const data = props.data
    if (data) {
      Object.assign(models.value, {
        ...data,
        status: data.status?.id,
      })
    }
  }

  const isEmpty = (obj: Record<string, any>): boolean => {
    return Object.values(obj).every(
      (value) => value === 0 || value === '' || value === null
    )
  }

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    }
  )

  watch(
    () => models.value,
    () => {
      if (isEmpty(models.value)) {
        _setDataCollectionsConcepts(null)
      } else {
        _setDataCollectionsConcepts({
          structure_id: models.value.structure_id ?? null,
          structure_name: models.value.structure_name ?? null,
          structure_use: models.value.structure_use ?? null,
          structure_code: models.value.structure_code ?? null,
          type: models.value.type ?? null,
          description: models.value?.description ?? null,
          status_id: models.value.status ?? null,
        })

        _dataBasicError(null)
      }
    },
    { deep: true }
  )

  watch(
    () => models.value.structure_id,
    (newValue) => {
      const selectedStructure = Array.isArray(
        account_structures_collection.value
      )
        ? account_structures_collection.value.find(
            (item) => item.value === newValue
          )
        : undefined
      if (selectedStructure) {
        models.value.structure_name = selectedStructure.structure ?? null
        models.value.structure_use = selectedStructure.purpose ?? null
      } else {
        models.value.structure_name = null
        models.value.structure_use = null
      }
    },
    { immediate: true }
  )

  onMounted(async () => {
    handlerActionForm(props.action)
    await _getResources(keys)
  })

  return {
    formInformation,
    models,
    account_structures_collection,
    collection_concept_type,
    collection_concept_status,
  }
}

export default useInformationForm
