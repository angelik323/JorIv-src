import { ref, onMounted, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { IOpeningRecord, IOpeningRecordModel } from '@/interfaces/customs'
import {
  useAccountingResourceStore,
  useOpeningRecordStore,
  useResourceManagerStore,
  useResourceStore,
} from '@/stores'
import { defaultIconsLucide } from '@/utils'
import { QTable } from 'quasar'
import moment from 'moment'
import { useRules } from '@/composables'

const useOpeningRecordForm = (
  props: {
    action: 'create' | 'edit' | 'view'
    data?: IOpeningRecordModel
  },
  emits: Function
) => {
  const { _getAccountingResources } = useResourceStore('v1')
  const {
    opening_record_structures,
    available_account_charts,
    available_cost_center_structures,
    account_structures,
    account_structures_available,
    account_chart_options,
  } = storeToRefs(useResourceStore('v1'))

  const { not_consolidator_business_trust } = storeToRefs(
    useAccountingResourceStore('v1')
  )

  const { opening_bussines_list } = storeToRefs(useOpeningRecordStore('v1'))

  const { _getResources } = useResourceManagerStore('v1')

  const keys = ['account_structures_with_purpose']

  const openingRecordForm = ref()
  const isEdit = computed(() => props.action === 'edit')
  const isFormValid = ref(false)
  const selectedBusiness = ref()
  const showTable = ref(false)

  const selectedRows = computed({
    get: () => models.value.business_ids,
    set: (val) => {
      models.value.business_ids = val
    },
  })

  const models = ref<IOpeningRecordModel>({
    accounts_chart_id: 1,
    id: undefined,
    structure_id: 0,
    from_business_id: 0,
    to_business_id: 0,
    leave_in_period: '',
    current_period: '',
    business_ids: [],
  })

  if (props.action === 'edit' && props.data) {
    models.value = { ...models.value, ...props.data }
  }

  const pagination = ref({
    page: 1,
    rowsPerPage: 5,
  })

  const validate = async () => {
    const result = await openingRecordForm.value?.validate?.()
    return result
  }

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: IOpeningRecord[]
    pages: { currentPage: number; lastPage: number }
  }>({
    title: 'Listado de negocios',
    loading: false,
    columns: [
      {
        name: 'business_trust',
        label: 'Negocio',
        align: 'left',
        field: (row) => row.business_trust,
        sortable: true,
      },
      {
        name: 'consolidated',
        label: 'Consolidado',
        align: 'left',
        field: (row) => (row.consolidated ? 'Sí' : 'No'),
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })

  const setFormData = () => {
    if (!props.data) return
    models.value.structure_id = props.data.structure_id
    models.value.from_business_id = props.data.from_business_id || 0
    models.value.to_business_id = props.data.to_business_id || 1
    models.value.leave_in_period = props.data.leave_in_period || ''
    models.value.current_period = props.data.current_period || ''
    models.value.business_ids = props.data.business_ids ?? []
  }

  const getFormData = () => {
    const data = JSON.parse(JSON.stringify(models.value))

    return data
  }

  onMounted(async () => {
    await _getAccountingResources(`keys[]=${keys.join('&keys[]=')}`)

    if (props.action === 'edit') {
      await _getAccountingResources(
        'keys[]=account_structures&keys[]=account_structures_available'
      )
    }

    setFormData()
  })

  watch(
    () => props.data,
    () => setFormData()
  )

  watch(models, () => emits('update'), { deep: true })
  watch(
    models,
    async () => {
      const hasBusinesses =
        Array.isArray(models.value.business_ids) &&
        models.value.business_ids.length > 0

      emits('hasSelectedBusiness', hasBusinesses)
    },
    { deep: true }
  )

  watch(opening_bussines_list, () => {
    tableProps.value.rows = opening_bussines_list.value
  })

  watch(
    () => models.value.structure_id,
    (val) => {
      if (val) {
        _getResources(
          {
            accounting: ['not_consolidator_business_trust'],
          },
          `filter[accounting_structure_id]=${val}`,
          'v2'
        )
      }
    }
  )

  watch(
    () => models.value.from_business_id,
    (val) => {
      if (val) {
        const find = not_consolidator_business_trust.value.find(
          (item) => item.business_code === String(val)
        )

        if (find) {
          const formattedPeriod = find.current_period
            ? moment(find.current_period).format('YYYY-MM')
            : ''
          models.value.current_period = formattedPeriod
        }
      }
    }
  )

  const handleContinue = async () => {
    if (!openingRecordForm.value) return

    if (!openingRecordForm.value.validate()) {
      return
    }

    const params = {
      accounting_structure_id: models.value.structure_id || 0,
      period: models.value.current_period ?? '',
      from_business_code: models.value.from_business_id || undefined,
      to_business_code: models.value.to_business_id || undefined,
    }
    await useOpeningRecordStore('v1')._getOpeningRecordBusinessListing(params)
    showTable.value = true
  }

  const leavePeriodRule = useRules().within_months_from(
    () => models.value.current_period ?? '',
    6,
    'YYYY-MM'
  )

  const leavePeriodWarning = computed(() => {
    const res = leavePeriodRule(models.value.leave_in_period || '')
    return res === true ? '' : String(res)
  })

  watch(
    () => models.value.leave_in_period,
    (val) => {
      const cur = moment(models.value.current_period, 'YYYY-MM', true)
      const sel = moment(val, 'YYYY-MM', true)
      if (!cur.isValid() || !sel.isValid()) return
    }
  )

  return {
    openingRecordForm,
    models,
    isEdit,
    pagination,
    defaultIconsLucide,
    available_cost_center_structures,
    available_account_charts,
    account_structures,
    account_structures_available,
    account_chart_options,
    tableProps,
    opening_record_structures,
    not_consolidator_business_trust,
    selectedBusiness,
    isFormValid,
    opening_bussines_list,
    selectedRows,
    showTable,
    leavePeriodWarning,
    validate,
    handleContinue,
    getFormData,
  }
}

export default useOpeningRecordForm
