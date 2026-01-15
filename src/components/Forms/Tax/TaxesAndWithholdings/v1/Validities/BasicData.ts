import { ref, watch } from 'vue'

// Interfaces
import { ActionType } from '@/interfaces/global'
import {
  ITaxesAndWithholdingsValidities,
  Validity,
} from '@/interfaces/customs/tax/TaxesAndWithholdings'
import { ITableProps } from '@/interfaces/customs'

// Composables
import { useUtils, useRules, useMainLoader } from '@/composables'

// Stores
import { useTaxesAndWithholdingsStore } from '@/stores/tax/taxes-and-withholdings'

const useInformationForm = (
  props: {
    action: ActionType
    data: ITaxesAndWithholdingsValidities | null
  },
  emits: Function
) => {
  const { openMainLoader } = useMainLoader()

  const formInformationRef = ref()

  const initialModelsValues: ITaxesAndWithholdingsValidities = {
    validities: [],
  }

  const formValuesModal = ref<Validity>({
    id: null,
    rate_percentage: null,
    valid_from: null,
    valid_to: null,
    is_active: false,
  })

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const tableProps = ref<ITableProps<Validity>>({
    loading: false,
    title: 'Listado de vigencias',
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'valid_from',
        required: true,
        label: 'Valido desde',
        align: 'left',
        field: 'valid_from',
        sortable: true,
        format: (val) => useUtils().formatDate(val, 'YYYY-MM-DD'),
      },
      {
        name: 'valid_to',
        required: true,
        label: 'Valido hasta',
        align: 'left',
        field: 'valid_to',
        sortable: true,
        format: (val) => useUtils().formatDate(val, 'YYYY-MM-DD'),
      },
      {
        name: 'rate_percentage',
        required: true,
        label: 'Importe',
        align: 'left',
        field: 'rate_percentage',
        sortable: true,
      },
      {
        name: 'status',
        required: true,
        label: 'Estado',
        align: 'left',
        field: 'status',
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ],
    rows: [],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
    customColumns: ['actions', 'status'],
  })

  const validityModalRef = ref()
  const modalProps = ref({
    title: 'Agregar vigencia',
    action: 'create' as ActionType,
  })

  const _setValueModel = () => {
    if (!props.data) return
    models.value.validities = props.data.validities
  }

  const openModal = (row?: Validity) => {
    validityModalRef.value.openModal()
    modalProps.value.action = 'create'

    if (row) {
      formValuesModal.value = { ...row }
      modalProps.value.action = 'edit'
      modalProps.value.title = 'Editar vigencia'
    }
    formValuesModal.value.calculation = 'Porcentual'
  }

  const saveValidity = async () => {
    if (formInformationRef.value) {
      const valid = await formInformationRef.value.validate()
      if (!valid) return
    }

    const { action } = modalProps.value
    if (action === 'create') {
      models.value.validities.push({
        id: models.value.validities.length + 1,
        rate_percentage: formValuesModal.value.rate_percentage,
        valid_from: formValuesModal.value.valid_from,
        valid_to: formValuesModal.value.valid_to,
        is_active: true,
      })
    }
    if (action === 'edit') {
      const idx = models.value.validities.findIndex(
        (v) => v.id === formValuesModal.value.id
      )
      models.value.validities[idx] = {
        ...models.value.validities[idx],
        rate_percentage: formValuesModal.value.rate_percentage,
        valid_from: formValuesModal.value.valid_from,
        valid_to: formValuesModal.value.valid_to,
        is_active: true,
      }
    }

    cleanValues()

    validityModalRef.value.closeModal()
  }

  const cleanValues = () => {
    formValuesModal.value.rate_percentage = null
    formValuesModal.value.valid_from = null
    formValuesModal.value.valid_to = null
  }

  const deleteValidity = (row: Validity) => {
    if (!row) return

    models.value.validities = models.value.validities.filter(
      (e) => e.id !== row.id
    )
  }

  const downloadExcel = async () => {
    openMainLoader(true)
    await useTaxesAndWithholdingsStore()._getDownloadExcel()
    openMainLoader(false)
  }

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
      emits('update:data', useUtils().isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  watch(
    () => models.value.validities,
    (val) => {
      tableProps.value.rows = val
    },
    { deep: true, immediate: true }
  )

  return {
    tableProps,
    formValuesModal,
    formInformationRef,
    validityModalRef,
    modalProps,
    defaultIconsLucide: useUtils().defaultIconsLucide,
    rules: useRules(),
    downloadExcel,
    openModal,
    saveValidity,
    deleteValidity,
  }
}

export default useInformationForm
