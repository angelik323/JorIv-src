// core
import { nextTick, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// composables
import { useUtils, useRules, useAlert } from '@/composables'

// interfaces
import { ActionType, IBaseTableProps } from '@/interfaces/global'
import {
  IAvalibleCities,
  IIcaActivitiesForm,
} from '@/interfaces/customs/accounts-payable/IcaActivities'

// constants
import { TIMEOUT_ALERT } from '@/constants/alerts'

// stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'
import { useAccountsPayableResourceStore } from '@/stores/resources-manager/accounts-payable'
import { useThirdPartyResourceStore } from '@/stores/resources-manager/third-party'
import { useIcaActivitiesStore } from '@/stores/accounts-payable/ica-activities'
import { IGenericResource } from '@/interfaces/customs'

const useBasicDataForm = (
  props: {
    action?: ActionType
    data?: IIcaActivitiesForm | null
  },
  emit: Function
) => {
  // hooks
  const { isEmptyOrZero, capitalize } = useUtils()
  const {
    is_required,
    only_number_with_max_integers_and_decimals_ignore_symbols,
  } = useRules()
  const { formatCurrencyString, defaultIconsLucide } = useUtils()
  const { showAlert } = useAlert()

  // stores
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _getAvalibleCities } = useIcaActivitiesStore('v1')
  const {
    ica_activity_types,
    fiscal_charges,
    third_party_types,
    settlement_concept,
    ica_activity_statuses,
  } = storeToRefs(useAccountsPayableResourceStore('v1'))
  const { ciius } = storeToRefs(useThirdPartyResourceStore('v1'))
  const { account_structures_payment_concepts, accounts_chart } = storeToRefs(
    useAccountingResourceStore('v1')
  )

  // refs
  const keysParamV2 = {
    accounting: ['accounts_chart'],
  }
  const cities = ref()
  const isPesosBased = ref(false)
  const isUvtBased = ref(false)
  const alertModalRef = ref()

  // configs
  const basicDataFormRef = ref()

  const models = ref<IIcaActivitiesForm>({
    id: null,
    city_id: null,
    third_party_nit: null,
    periodicity: null,
    ica_relation_id: null,
    economic_activity_id: null,
    activity_type: null,
    fiscal_charge_id: null,
    applies_to_third_party: false,
    third_party_type: null,
    account_structure_id: null,
    account_chart_id: null,
    minimum_base_pesos: '',
    minimum_base_uvt: '',
    percentage: '',
    settlement_concept_id: null,
    actions: '',
  })

  const tableProps = ref<IBaseTableProps<IIcaActivitiesForm>>({
    title: 'Listado de cargue de movimientos por pagar',
    loading: false,
    columns: [
      {
        name: 'city_label',
        required: false,
        label: 'Ciudad',
        field: 'city_label',
        align: 'left',
        sortable: true,
      },
      {
        name: 'economic_activity_code',
        required: false,
        label: 'Actividad económica',
        field: 'economic_activity_code',
        align: 'center',
        sortable: true,
      },
      {
        name: 'economic_activity_description',
        required: false,
        label: 'Descripción actividad económica',
        field: 'economic_activity_description',
        align: 'left',
        sortable: true,
      },
      {
        name: 'activity_type',
        required: false,
        label: 'Tipo de actividad',
        field: (row) => capitalize(row.activity_type ?? ''),
        align: 'left',
        sortable: true,
      },
      {
        name: 'fiscal_charge_code',
        required: false,
        label: 'Cargo fiscal',
        field: 'fiscal_charge_code',
        align: 'center',
        sortable: true,
      },
      {
        name: 'fiscal_charge_description',
        required: false,
        label: 'Descripción cargo fiscal',
        field: 'fiscal_charge_description',
        align: 'left',
        sortable: true,
      },
      {
        name: 'applies_to_third_party',
        required: false,
        label: 'Aplica terceros registrados en cámara de comercio',
        field: 'applies_to_third_party',
        align: 'center',
        sortable: true,
      },
      {
        name: 'third_party_type',
        required: false,
        label: 'Tipo de tercero',
        field: 'third_party_type',
        align: 'left',
        sortable: true,
      },
      {
        name: 'account_structure_description',
        required: false,
        label: 'Estructura contable',
        field: 'account_structure_description',
        align: 'left',
        sortable: true,
      },
      {
        name: 'account_chart_code',
        required: false,
        label: 'Cuenta contable',
        field: 'account_chart_code',
        align: 'left',
        sortable: true,
      },
      {
        name: 'account_chart_description',
        required: false,
        label: 'Descripción cuenta contable',
        field: 'account_chart_description',
        align: 'left',
        sortable: true,
      },
      {
        name: 'settlement_concept_description',
        required: false,
        label: 'Concepto de liquidación',
        field: 'settlement_concept_description',
        align: 'left',
        sortable: true,
      },
      {
        name: 'minimum_base_pesos',
        required: false,
        label: 'Base mínima en pesos',
        field: (item) => formatCurrencyString(item.minimum_base_pesos ?? 0),
        align: 'left',
        sortable: true,
      },
      {
        name: 'minimum_base_uvt',
        required: false,
        label: 'Base mínima en UVT',
        field: (item) => formatCurrencyString(item.minimum_base_uvt ?? 0),
        align: 'left',
        sortable: true,
      },
      {
        name: 'percentage',
        required: false,
        label: 'Porcentaje',
        field: (item) => `${item.percentage} %`,
        align: 'left',
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        field: 'actions',
        align: 'left',
        sortable: false,
      },
    ],
    rows: [] as IIcaActivitiesForm[],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const alertModalConfig = ref({
    title: '¿Desea eliminar el registro de la actividad económica ICA?',
    description: '',
    textBtnConfirm: 'Aceptar',
    textBtnCancel: 'Cancelar',
    id: 0 as number,
    type: 'warning',
  })

  // actions
  const changeCity = async ($event: number) => {
    models.value.city_id = $event

    const city = cities.value.find(
      (item: IAvalibleCities) => item.id === $event
    )

    models.value.third_party_nit = ''
    models.value.periodicity = ''
    models.value.ica_relation_id = null

    if (city) {
      await nextTick()
      models.value.city_label = `${city.code} - ${city.name}`
      models.value.third_party_nit = `${city.third_party?.document ?? ''} ${
        city.third_party?.natural_person?.full_name ??
        city.third_party?.legal_person?.business_name ??
        ''
      }`
      models.value.periodicity = capitalize(city.periodicity)
      models.value.ica_relation_id = city.ica_relation_id ?? null
    }
  }

  const changeEconomicActivity = async ($event: number) => {
    models.value.economic_activity_id = $event

    const activity = ciius.value.find(
      (item: IGenericResource) => item.id == $event
    )

    models.value.economic_activity_code = ''
    models.value.economic_activity_description = ''

    if (activity) {
      await nextTick()
      models.value.economic_activity_code = activity?.code ?? ''
      models.value.economic_activity_description = activity?.description ?? ''
    }
  }

  const changeFiscalCharge = async ($event: number) => {
    models.value.fiscal_charge_id = $event

    const charges = fiscal_charges.value.find(
      (item: IGenericResource) => item.id == $event
    )

    models.value.fiscal_charge_code = ''
    models.value.fiscal_charge_description = ''

    if (charges) {
      await nextTick()
      models.value.fiscal_charge_code = charges?.code ?? ''
      models.value.fiscal_charge_description = charges?.name ?? ''
    }
  }

  const changeAccountStructure = async ($event: number) => {
    models.value.account_structure_id = $event

    const structure = account_structures_payment_concepts.value.find(
      (item: IGenericResource) => item.id == $event
    )

    models.value.account_structure_description = ''

    if (structure) {
      await nextTick()
      models.value.account_structure_description = structure?.purpose ?? ''
    }
  }

  const changeAccountChart = async ($event: number) => {
    models.value.account_chart_id = $event

    const account = accounts_chart.value.find(
      (item: IGenericResource) => item.id == $event
    )

    models.value.account_chart_code = ''
    models.value.account_chart_description = ''

    if (account) {
      await nextTick()
      models.value.account_chart_code = account?.code ?? ''
      models.value.account_chart_description = account?.name ?? ''
    }
  }

  const changeSettlementConcept = async ($event: number) => {
    models.value.settlement_concept_id = $event

    const concept = settlement_concept.value.find(
      (item: IGenericResource) => item.id == $event
    )

    models.value.settlement_concept_description = ''

    if (concept) {
      await nextTick()
      models.value.settlement_concept_description = concept?.description ?? ''
    }
  }

  const changePesosBased = () => {
    isUvtBased.value = false
    models.value.minimum_base_pesos = null
    models.value.minimum_base_uvt = null
  }

  const changeUvtBased = () => {
    isPesosBased.value = false
    models.value.minimum_base_pesos = null
    models.value.minimum_base_uvt = null
  }

  const openAlertModal = (row: IIcaActivitiesForm) => {
    alertModalConfig.value.id = row.id ?? 0
    alertModalRef.value?.openModal()
  }

  const handleDelete = () => {
    const id = alertModalConfig.value.id
    const index = tableProps.value.rows.findIndex((row) => row.id === id)

    if (index !== -1) {
      tableProps.value.rows.splice(index, 1)
    }

    alertModalRef.value?.closeModal()
  }

  const handleAddRow = async () => {
    if (
      (await basicDataFormRef.value.validate()) === false ||
      (!isUvtBased.value && !isPesosBased.value)
    )
      return

    const exists = tableProps.value.rows.some(
      (row) =>
        row.economic_activity_id === models.value.economic_activity_id &&
        row.account_structure_id === models.value.account_structure_id
    )

    if (exists) {
      showAlert(
        'Esta combinación de Actividad económica y Estructura contable se encuentra en uso por otro registro y no puede ser repetida.',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
      return
    }

    const newId =
      tableProps.value.rows.length === 0
        ? 1
        : Math.max(...tableProps.value.rows.map((r) => r.id || 0)) + 1

    tableProps.value.rows.push({
      id: newId,
      city_id: models.value.city_id,
      city_label: models.value.city_label,
      economic_activity_id: models.value.economic_activity_id,
      economic_activity_code: models.value.economic_activity_code,
      economic_activity_description: models.value.economic_activity_description,
      activity_type: models.value.activity_type,
      fiscal_charge_id: models.value.fiscal_charge_id,
      fiscal_charge_code: models.value.fiscal_charge_code,
      fiscal_charge_description: models.value.fiscal_charge_description,
      applies_to_third_party: models.value.applies_to_third_party,
      third_party_type: models.value.third_party_type,
      account_structure_id: models.value.account_structure_id,
      account_structure_description: models.value.account_structure_description,
      account_chart_id: models.value.account_chart_id,
      account_chart_code: models.value.account_chart_code,
      account_chart_description: models.value.account_chart_description,
      settlement_concept_id: models.value.settlement_concept_id,
      settlement_concept_description:
        models.value.settlement_concept_description,
      minimum_base_pesos:
        models.value.minimum_base_pesos !== null
          ? String(models.value.minimum_base_pesos)
          : null,
      minimum_base_uvt:
        models.value.minimum_base_uvt !== null
          ? String(models.value.minimum_base_uvt)
          : null,
      percentage:
        models.value.percentage !== null
          ? String(models.value.percentage)
          : null,
      ica_relation_id: models.value.ica_relation_id,
      third_party_nit: models.value.third_party_nit,
      periodicity: models.value.periodicity,
      actions: '',
    })

    handleResetForm()
  }

  const handleResetForm = () => {
    models.value = {
      id: null,
      city_id: null,
      third_party_nit: null,
      periodicity: null,
      ica_relation_id: null,
      economic_activity_id: null,
      activity_type: null,
      fiscal_charge_id: null,
      applies_to_third_party: false,
      third_party_type: null,
      account_structure_id: null,
      account_chart_id: null,
      minimum_base_pesos: '',
      minimum_base_uvt: '',
      percentage: '',
      settlement_concept_id: null,
      actions: '',
    }

    isPesosBased.value = false
    isUvtBased.value = false

    setTimeout(() => {
      basicDataFormRef.value?.resetValidation()
    }, 100)
  }

  // lifecycle hooks
  watch(
    () => models.value,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  watch(
    () => props.data,
    (val) => {
      if (val && props.data) {
        models.value = props.data
        models.value.economic_activity_id =
          props.data.economic_activity?.id ?? null
        models.value.fiscal_charge_id = props.data.fiscal_charge?.id ?? null
        models.value.account_structure_id =
          props.data.account_structure?.id ?? null
        models.value.account_chart_id = props.data.account_chart?.id ?? null
        models.value.settlement_concept_id =
          props.data.settlement_concept?.id ?? null
        models.value.city_id = props.data.ica_relation?.city_id ?? null
        models.value.ica_relation_id = props.data.ica_relation?.id ?? null
        models.value.status_id = props.data.status?.id ?? null

        if (models.value.city_id) {
          changeCity(models.value.city_id)
        }

        isPesosBased.value = props.data.minimum_base_pesos ? true : false
        isUvtBased.value = props.data.minimum_base_uvt ? true : false
      }
    },
    { immediate: true }
  )

  watch(
    () => models.value.account_structure_id,
    async (val) => {
      await _resetKeys(keysParamV2)
      models.value.account_chart_id = props.data?.account_chart?.id ?? null

      if (!val) return

      await _getResources(
        keysParamV2,
        `fields[accounts_chart]=id,code,name,nature&filter[status_id]=1&filter[type]=Operativo&filter[account_structure_id]=${val}`,
        'v2'
      )

      await nextTick()
    }
  )

  onMounted(async () => {
    cities.value = await _getAvalibleCities({ is_associated: true })
  })

  return {
    basicDataFormRef,
    models,
    tableProps,
    alertModalRef,
    alertModalConfig,

    // refs
    isPesosBased,
    isUvtBased,

    // selects
    cities,
    ciius,
    ica_activity_types,
    fiscal_charges,
    third_party_types,
    account_structures_payment_concepts,
    accounts_chart,
    settlement_concept,
    ica_activity_statuses,

    // utils
    defaultIconsLucide,

    // methods
    changeCity,
    changeUvtBased,
    changePesosBased,
    openAlertModal,
    handleDelete,
    handleAddRow,
    handleResetForm,
    changeEconomicActivity,
    changeFiscalCharge,
    changeAccountStructure,
    changeAccountChart,
    changeSettlementConcept,

    // rules
    is_required,
    only_number_with_max_integers_and_decimals_ignore_symbols,
  }
}

export default useBasicDataForm
