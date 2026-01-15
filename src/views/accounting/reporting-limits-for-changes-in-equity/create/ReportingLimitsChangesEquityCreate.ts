import { IReportingLimitChangesInEquityCreatePayload } from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'
import router from '@/router'
import {
  useReportingLimitsForChangesInEquityStore,
  useResourceManagerStore,
} from '@/stores'
import { defaultIconsLucide } from '@/utils'
import { computed, onBeforeMount, onMounted, ref } from 'vue'

const useReportingLimitsForChangesInEquityCreate = () => {
  const { _createEquityChangeReportLimit } =
    useReportingLimitsForChangesInEquityStore('v1')
  const reportingLimitsChangesEquityForm = ref()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const headerProps = {
    title: 'Límites de reporte cambios en el patrimonio',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad', route: '' },
      {
        label: 'Límites de reporte cambios en el patrimonio',
        route: 'ReportingLimitsChangesEquityList',
      },
      { label: 'Crear', route: '' },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))

  const tabActive = ref(filteredTabs.value[0].name)

  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const onSubmit = async () => {
    const data: IReportingLimitChangesInEquityCreatePayload =
      reportingLimitsChangesEquityForm.value.getFormData()

    const payload: IReportingLimitChangesInEquityCreatePayload = {
      accounting_structure_id: data.accounting_structure_id,
      limit: data.limit.map((item) => ({
        from_account: item.from_account,
        to_account: item.to_account,
        limit_type: item.limit_type,
      })),
    }

    const success = await _createEquityChangeReportLimit(payload)
    if (success) {
      router.push({ name: 'ReportingLimitsChangesEquityList' })
    }
  }

  onMounted(async () => {
    await _getResources({ accounting: ['account_structures_with_purpose'] })
  })

  onBeforeMount(async () => {
    await _resetKeys({ accounting: ['account_structures_with_purpose'] })
  })

  return {
    headerProps,
    reportingLimitsChangesEquityForm,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    onSubmit,
  }
}

export default useReportingLimitsForChangesInEquityCreate
