// core
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// interfaces
import { ITabs } from '@/interfaces/global'
import {
  IIcaActivitiesUpdatePayload,
  IIcaActivitiesForm,
} from '@/interfaces/customs/accounts-payable/IcaActivities'

// stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useIcaActivitiesStore } from '@/stores/accounts-payable/ica-activities'

const useIcaActivitiesEdit = () => {
  // hooks
  const route = useRoute()
  const activityId = +route.params.id
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()

  // refs
  const keys = ref({
    third_party: ['ciius'],
    accounts_payable: [
      'ica_activity_types',
      'third_party_types',
      'settlement_concept',
      'ica_activity_statuses',
    ],
  })
  const keysParams = ref({
    accounting: ['account_structures'],
  })
  const keysParams2 = ref({
    accounts_payable: ['fiscal_charges'],
  })
  const keysParamV2 = ref({
    accounting: ['accounts_chart'],
  })
  const basicDataFormRef = ref()
  const activities_form = ref<IIcaActivitiesForm | null>()

  // stores
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _getActivityById, _updateActivity } = useIcaActivitiesStore('v1')

  // configs
  const headerProps = {
    title: 'Editar actividad ICA',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Cuentas por pagar',
        route: '',
      },
      {
        label: 'Actividades ICA',
        route: 'IcaActivitiesList',
      },
      {
        label: 'Editar',
        route: 'IcaActivitiesEdit',
      },
      {
        label: `${activityId}`,
        route: '',
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  // actions
  const makePayload = (form: IIcaActivitiesForm) => {
    return {
      city_id: form.city_id,
      third_party_nit: form.third_party_nit,
      periodicity: form.periodicity,
      ica_relation_id: form.ica_relation_id,
      economic_activity_id: form.economic_activity_id,
      activity_type: form.activity_type,
      fiscal_charge_id: form.fiscal_charge_id,
      applies_to_third_party: form.applies_to_third_party,
      third_party_type: form.third_party_type,
      account_structure_id: form.account_structure_id,
      account_chart_id: form.account_chart_id,
      minimum_base_pesos:
        form.minimum_base_pesos != null
          ? String(form.minimum_base_pesos)
          : null,
      minimum_base_uvt:
        form.minimum_base_uvt != null ? String(form.minimum_base_uvt) : null,
      percentage: form.percentage,
      settlement_concept_id: form.settlement_concept_id,
      status_id: form.status_id,
    } as IIcaActivitiesUpdatePayload
  }

  const handleEdit = async () => {
    const isValid = await basicDataFormRef.value?.validateForm()
    if (!isValid) return

    if (!activities_form.value) return

    openMainLoader(true)
    const payload = makePayload(activities_form.value)
    if (await _updateActivity(payload, activityId)) {
      goToURL('IcaActivitiesList')
    }

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  // lifecycle hooks
  onMounted(async () => {
    openMainLoader(true)

    await _getResources(keys.value)
    await _getResources(
      keysParams.value,
      'filter[type]=Catálogo de cuentas contables&filter[status_id]=1'
    )
    await _getResources(
      keysParams2.value,
      'filter[tax_type_id]=3&filter[status_id]=1'
    )

    activities_form.value = await _getActivityById(activityId)

    setTimeout(() => {
      openMainLoader(false)
    }, 500)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys.value)
    _resetKeys(keysParams.value)
    _resetKeys(keysParams2.value)
    _resetKeys(keysParamV2.value)
  })

  return {
    // configs
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,

    // refs
    basicDataFormRef,
    activities_form,

    // methods
    handleEdit,
    goToURL,
  }
}

export default useIcaActivitiesEdit
