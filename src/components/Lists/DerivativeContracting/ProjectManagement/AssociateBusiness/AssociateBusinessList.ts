// Vue - Pinia - Router - Quasar
import { ref, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

// Composables
import { useUtils, useRules } from '@/composables'

// Interfaces
import { IFieldFilters } from '@/interfaces/customs/Filters'
import {
  IBaseTableProps,
  ActionType,
  ActionTypeEnum,
} from '@/interfaces/global'
import { ProjectManagementFilter } from '@/interfaces/global/DerivativeContracting'
import {
  IProjectManagementAssociatedBusinessForm,
  IProjectManagementAssociatedBusinessItem,
  IProjectManagementAssociatedBusinessList,
} from '@/interfaces/customs/derivative-contracting/ProjectManagement'

// Stores
import { useTrustBusinessResourceStore } from '@/stores/resources-manager'
import { useProjectManagementStore } from '@/stores/derivative-contracting/project-management'

const useAssociateBusinessList = (
  props: {
    action: ActionType
    associatedBusinessForm?: IProjectManagementAssociatedBusinessForm | null
    associatedBusinessList?: IProjectManagementAssociatedBusinessList | null
  },
  emit: Function
) => {
  const { formatParamsCustom, isEmptyOrZero } = useUtils()
  const route = useRoute()

  const { business_trusts_derivate_contracting } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )
  const store = useProjectManagementStore('v1')
  const { _getListBusinessChildrenAction, _getListChildrensAction } = store
  const { associated_business_list } = storeToRefs(store)

  const projectManagementId = +route.params.id

  const fiduciary_business_old_id = ref<number | null>(null)

  const models = ref<IProjectManagementAssociatedBusinessForm>({
    fiduciary_business_id: null,
    business_type_id: null,
    business_status_id: null,
  })

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: ProjectManagementFilter.FIDUCIARY_BUSINESS_ID,
      label: 'Negocio',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 col-lg-4',
      options: business_trusts_derivate_contracting,
      autocomplete: true,
      disable: props.action === ActionTypeEnum.VIEW,
      clean_value: true,
      placeholder: 'Todos',
      rules: [
        (val: string) => useRules().is_required(val, 'Negocio es requerido'),
      ],
    },
    {
      name: ProjectManagementFilter.BUSINESS_TYPE_ID,
      label: 'Tipo de negocio',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 col-lg-4',
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      name: ProjectManagementFilter.BUSINESS_STATUS_ID,
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 col-lg-4',
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
  ])

  const tableProps = ref<
    IBaseTableProps<IProjectManagementAssociatedBusinessItem>
  >({
    title: 'Negocios vinculados',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'center',
        field: 'id',
        sortable: true,
      },
      {
        name: 'business_code',
        required: false,
        label: 'Código de negocio',
        align: 'center',
        field: (row: IProjectManagementAssociatedBusinessItem) => {
          return row.business_code ?? row.code ?? ''
        },
        sortable: true,
      },
      {
        name: 'name',
        required: false,
        label: 'Nombre de negocio',
        align: 'center',
        field: 'name',
        sortable: true,
      },
      {
        name: 'status_id',
        required: false,
        label: 'Estado',
        align: 'center',
        field: 'status',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const selectedAssociatedBusiness = ref<
    IProjectManagementAssociatedBusinessItem[]
  >([])
  const filtersFormat = ref<Record<string, string | number>>({})
  const filtersRef = ref()

  const setValueModel = (
    data: IProjectManagementAssociatedBusinessForm | null
  ) => {
    Object.assign(models.value, data)
  }

  const normalizeBusinessData = (
    item: IProjectManagementAssociatedBusinessItem
  ): IProjectManagementAssociatedBusinessItem => {
    if (item.business_id && !item.id) {
      return {
        ...item,
        id: item.business_id,
      }
    }
    return item
  }

  const setValueTableProps = (
    data: IProjectManagementAssociatedBusinessList | null
  ) => {
    const normalizedData = data?.map(normalizeBusinessData) ?? []
    tableProps.value.rows = normalizedData

    if (normalizedData.length && props.action !== ActionTypeEnum.CREATE) {
      const selectedItems = normalizedData.filter((item) => item.is_associated)

      selectedAssociatedBusiness.value = selectedItems
      emit('update:selectedAssociatedBusinessList', selectedItems)
    }
  }

  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true

    const fiduciaryBusinessId = models.value?.fiduciary_business_id ?? null

    if (
      fiduciary_business_old_id.value === null ||
      fiduciary_business_old_id.value !== fiduciaryBusinessId
    ) {
      await _getListChildrensAction(
        fiduciaryBusinessId ? '/' + String(fiduciaryBusinessId) : '',
        filters
      )
    } else {
      await _getListBusinessChildrenAction(
        projectManagementId ? '/' + String(projectManagementId) : '',
        filters
      )
    }

    tableProps.value.loading = false
  }

  const handleFilter = async () => {
    const queryString = formatParamsCustom(filtersFormat.value)
    await listAction(queryString ? '?' + queryString : '')
  }

  const handleFilterClear = () => {
    models.value = {
      fiduciary_business_id: null,
      business_type_id: null,
      business_status_id: null,
    }
    filtersFormat.value = {}
    tableProps.value.rows = []
    selectedAssociatedBusiness.value = []
  }

  const onFilterChange = (filters: Record<string, string | number | null>) => {
    const fiduciaryBusinessId =
      filters['filter[' + ProjectManagementFilter.FIDUCIARY_BUSINESS_ID + ']']
    if (fiduciaryBusinessId) {
      const findBusiness = business_trusts_derivate_contracting.value.find(
        (item) => item.value === fiduciaryBusinessId
      )
      if (findBusiness && filtersRef.value) {
        filtersRef.value.setFieldValueByName(
          ProjectManagementFilter.BUSINESS_TYPE_ID,
          findBusiness.register_type
        )
        filtersRef.value.setFieldValueByName(
          ProjectManagementFilter.BUSINESS_STATUS_ID,
          findBusiness.status?.status ?? null
        )

        models.value = {
          ...models.value,
          fiduciary_business_id: findBusiness.id ?? null,
          business_type_id: findBusiness.business_type_id ?? null,
          business_status_id: findBusiness.status_id ?? null,
        }
      }
    } else {
      filtersRef.value.setFieldValueByName(
        ProjectManagementFilter.BUSINESS_TYPE_ID,
        null
      )
      filtersRef.value.setFieldValueByName(
        ProjectManagementFilter.BUSINESS_STATUS_ID,
        null
      )

      models.value = {
        ...models.value,
        fiduciary_business_id: null,
        business_type_id: null,
        business_status_id: null,
      }
    }
  }

  const onUpdateSelectedAssociatedBusiness = (
    selecteds: IProjectManagementAssociatedBusinessItem[]
  ) => {
    selectedAssociatedBusiness.value = selecteds
    emit('update:selectedAssociatedBusinessList', selecteds)
  }

  onMounted(() => {
    const stop = watch(
      () => props.associatedBusinessForm,
      (val) => {
        if (!val) return

        if (props.action === ActionTypeEnum.CREATE) {
          stop()
          return
        }

        fiduciary_business_old_id.value = val?.fiduciary_business_id
          ? Number(val.fiduciary_business_id)
          : null

        if (val?.fiduciary_business_id) {
          filtersRef.value.setFieldValueByName(
            ProjectManagementFilter.FIDUCIARY_BUSINESS_ID,
            val.fiduciary_business_id
          )
        }

        _getListBusinessChildrenAction(
          projectManagementId ? '/' + String(projectManagementId) : '',
          ''
        )

        stop()
      },
      { immediate: true, deep: true }
    )
  })

  watch(
    () => props.associatedBusinessForm,
    (val) => {
      if (!val) return
      setValueModel(val)
    },
    { deep: true, immediate: true }
  )

  watch(
    () => models.value,
    (val) => {
      emit('update:associatedBusinessForm', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  watch(
    () => associated_business_list.value,
    (val) => {
      if (!val) return
      setValueTableProps(val)
    },
    { immediate: true, deep: true }
  )

  return {
    filtersRef,
    filterConfig,
    tableProps,
    selectedAssociatedBusiness,

    handleFilter,
    handleFilterClear,
    onFilterChange,
    onUpdateSelectedAssociatedBusiness,
  }
}

export default useAssociateBusinessList
