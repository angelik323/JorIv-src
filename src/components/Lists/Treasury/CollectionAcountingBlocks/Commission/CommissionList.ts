import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { useUtils, useRules, useGoToUrl, useMainLoader, useRouteValidator } from '@/composables'

import { IFieldFilters } from '@/interfaces/customs'
import { IBankingEntitiesAccountingParametersCommissions } from '@/interfaces/customs/treasury/BankingEntitesAccountingParametersComissions'
import { ICollectionFormList } from '@/interfaces/customs/treasury/CollectionForms'

import { useBankingEntitiesAccountingParametersCommissionsStore } from '@/stores/treasury/banking-entities'
import { useCollectionFormsStore } from '@/stores/treasury/collection-forms'

const useCommissionList = (props: { controls?: boolean, data: number | null }) => {
  const { banking_entities_list } = storeToRefs(useBankingEntitiesAccountingParametersCommissionsStore('v1'))

  const {
    _getBankingEntitiesAccountingParametersCommissionsList,
    _deleteBankingEntitiesAccountingParametersCommissions
  } = useBankingEntitiesAccountingParametersCommissionsStore('v1')

  const { collection_forms_list } = storeToRefs(useCollectionFormsStore('v1'))

  const {
    _getCollectionFormsList,
    _deleteCollectionForms,
  } = useCollectionFormsStore('v1')

  const { defaultIconsLucide, truncateDecimals, formatParamsCustom } = useUtils()
  const { min_length, max_length } = useRules()
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()

  const { validateRouter } = useRouteValidator()

  const filtersFormat = ref<Record<string, string | number>>({})
  const bankingEntitySelected = ref<number | null>(null)
  const alertModalBankEntityRef = ref()
  const alertModalCollectionMethodsRef = ref()

  const headerProps = {
    title: `Comisión`,
    breadcrumbs: [],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-12',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Código banco o nombre',
      rules: [
        (val: string) => max_length(val, 50),
        (val: string) => min_length(val, 3),
      ],
    },
  ])

  const bankEntityTable = ref({
    title: 'Entidades bancarias',
    loading: false,
    columns: [
      ...(props.controls ? [{
          name: 'select',
          field: 'id',
          label: '',
          align: 'left',
          sortable: true,
          required: true,
        }]
      : []),
      {
        name: 'id',
        field: 'id',
        label: '#',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'bank_description',
        field: (row: IBankingEntitiesAccountingParametersCommissions) => `${(row.bank?.bank_code ?? '')}`,
        label: 'Codigo del banco',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'description',
        field: 'description',
        label: 'Descripción',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'code',
        field: (row: IBankingEntitiesAccountingParametersCommissions) => row.treasury_movement_code?.code,
        label: 'Movimiento tesorería',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'validates_collection_method',
        field: (row: IBankingEntitiesAccountingParametersCommissions) => row.validates_collection_method ? 'Si' : 'No',
        label: '¿Valida forma de recaudo?',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'commission_rate',
        field: 'commission_rate',
        label: 'Tipo comisión',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'commission_percentage',
        field: (row: IBankingEntitiesAccountingParametersCommissions) => `${truncateDecimals(row.commission_percentage)} %`,
        label: 'Porcentaje comisión',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'fixed_value',
        field: (row: IBankingEntitiesAccountingParametersCommissions) => `$ ${row.fixed_value ?? 0}`,
        label: 'Valor fijo',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'observations',
        field: 'observations',
        label: 'Observaciones',
        align: 'left',
        sortable: true,
        required: true,
      },
      ...(props.controls ? [{
          name: 'actions',
          label: 'Acciones',
          field: 'actions',
          align: 'center',
          required: false,
        }]
      : []),
    ] as QTable['columns'],
    rows: [] as IBankingEntitiesAccountingParametersCommissions[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
    rowsPerPage: 20,
    selection: 'multiple',
    selected: ref([]),
  })

  const collectionMethods = ref({
    title: 'Formas de recaudo asociado al cobro de comisión',
    loading: false,
    columns: [
      {
        label: '#',
        name: 'id',
        field: (row: ICollectionFormList) => row.id,
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        label: 'Formas de recaudo',
        name: 'means_of_payment_description',
        field: (row: ICollectionFormList) => row.type_receive?.description ?? '-',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        label: 'Descripción',
        name: 'description',
        field: (row: ICollectionFormList) => `${row.bank_entity.bank.bank_code ?? ''} - ${row.bank_entity.bank.description ?? ''}`,
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        label: 'Tipo Comisión',
        name: 'commission_rate',
        field: (row: ICollectionFormList) => row.commission_rate,
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        label: 'Porcentaje Comisión',
        name: 'commission_percentage',
        field: (row: ICollectionFormList) => `${truncateDecimals(row.commission_percentage)} %`,
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        label: 'Valor Fijo',
        name: 'fixed_value',
        field: (row: ICollectionFormList) => `$ ${row.fixed_value ?? 0}`,
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        label: 'Observaciones',
        name: 'observations',
        field: (row: ICollectionFormList) => row.observations,
        align: 'left',
        sortable: true,
        required: true,
      },
      ...(props.controls ? [{
          name: 'actions',
          label: 'Acciones',
          field: 'actions',
          align: 'center',
          required: false,
        }]
      : []),
    ] as QTable['columns'],
    rows: [] as ICollectionFormList[],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
    rowsPerPage: 20,
    selection: 'multiple',
    selected: ref([]),
  })

  const alertModalBankEntityConfig = ref({
    title: 'Advertencia',
    description: '¿Desea eliminar el parámetro de la entidad bancaria?',
    id: null as number | null,
  })

  const alertModalCollectionMethodsConfig = ref({
    title: 'Advertencia',
    description: '¿Desea eliminar el parámetro de Formas de recaudo asociado al cobro de comisión?',
    id: null as number | null,
  })

  const handleFilter = ($filters: { 'filter[search]': string }) => {
    filtersFormat.value = {
      ...$filters,
      paginate: 1,
      rows: 20,
    }

    const queryString = formatParamsCustom(filtersFormat.value)
    listActionCommissionsList(queryString ? '&' + queryString : '')
  }

  const handleClear = () => {
    filtersFormat.value = {}
    bankEntityTable.value.rows = []
    collectionMethods.value.rows = []
  }

  const updatePage = async (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: page,
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    await listActionCommissionsList(queryString ? '&' + queryString : '')
  }

  const listActionCommissionsList = async (filters: string = '') => {
    bankEntityTable.value.rows = []
    bankEntityTable.value.loading = true
    await _getBankingEntitiesAccountingParametersCommissionsList(filters, props.data ?? 0)
    bankEntityTable.value.loading = false
  }
  
  const listActionCollectionForm = async (filters: string = '') => {
    collectionMethods.value.rows = []
    collectionMethods.value.loading = true
    await _getCollectionFormsList(filters)
    collectionMethods.value.loading = false
  }

  const handleEdit_BankingEntity = (id: number) => {
    goToURL('BankingEntityParametersEdit', {id})
  }

  const handleDelete_BankingEntity = async (id: number) => {
    if (id) {
      alertModalBankEntityConfig.value.id = id
      await alertModalBankEntityRef.value.openModal()
    }
  }

  const deleteCollectionParam = async () => {
    openMainLoader(true)
    await alertModalBankEntityRef.value.closeModal()
    if (!alertModalBankEntityConfig.value.id) return
    await _deleteBankingEntitiesAccountingParametersCommissions(alertModalBankEntityConfig.value.id)

    filtersFormat.value = {
      accounting_blocks_collection_id: props.data ?? 0,
      paginate: 1,
      rows: 20,
    }

    const queryString = formatParamsCustom(filtersFormat.value)

    listActionCommissionsList(queryString ? '&' + queryString : '')
    openMainLoader(false)
  }

  const handleEdit_CollectionMethods = (id: number) => {
    goToURL('CollectionsMethodsEdit', {id})
  }

  const handleDelete_CollectionMethods = async (id: number) => {
    if (id) {
      alertModalCollectionMethodsConfig.value.id = id
      await alertModalCollectionMethodsRef.value.openModal()
    }
  }

  const deleteCollectionMethods = async () => {
    openMainLoader(true)
    await alertModalCollectionMethodsRef.value.closeModal()
    if (!alertModalCollectionMethodsConfig.value.id) return
    await _deleteCollectionForms(alertModalCollectionMethodsConfig.value.id)
    listActionCollectionForm()
    openMainLoader(false)
  }

  watch(
    () => props.data,
    (val) => {
      if (!val) return
      filtersFormat.value = {
        paginate: 1,
        rows: 20,
      }

      const queryString = formatParamsCustom(filtersFormat.value)
      listActionCommissionsList(queryString ? '&' + queryString : '')
    },
    { deep: true, immediate: true }
  )

  watch(bankingEntitySelected,
    async () => {
      const filterCollectionForm = formatParamsCustom({
        accounting_blocks_collection_id: props.data ?? 0,
        bank_entity_id: bankingEntitySelected.value,
        paginate: 1,
        rows: 20,
      })
      listActionCollectionForm(filterCollectionForm ? filterCollectionForm : '')
    }
  )

  watch(
    () => banking_entities_list.value,
    () => {
      bankEntityTable.value.rows = banking_entities_list.value
    }
  )

  watch(
    () => collection_forms_list.value,
    () => {
      collectionMethods.value.rows = collection_forms_list.value
    }
  )

  return {
    headerProps,
    defaultIconsLucide,
    filterConfig,
    bankEntityTable,
    collectionMethods,
    alertModalBankEntityRef,
    alertModalBankEntityConfig,
    alertModalCollectionMethodsRef,
    alertModalCollectionMethodsConfig,

    bankingEntitySelected,

    validateRouter,
    handleFilter,
    handleClear,
    updatePage,
    handleEdit_BankingEntity,
    handleDelete_BankingEntity,
    handleEdit_CollectionMethods,
    handleDelete_CollectionMethods,
    deleteCollectionParam,
    deleteCollectionMethods,
    goToURL,
  }
}

export default useCommissionList
