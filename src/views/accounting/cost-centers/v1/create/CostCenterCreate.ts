import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMainLoader } from '@/composables'
import { defaultIconsLucide } from '@/utils'
import { ITabs } from '@/interfaces/global'
import { ICostCenterCreatePayload } from '@/interfaces/customs'
import { useCostCenterStore } from '@/stores'

export default function useCostCenterCreate() {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { _createCostCenter } = useCostCenterStore('v1')

  const costCenterForm = ref()

  const headerCenterCost = {
    title: 'Crear centro de costo',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad' },
      { label: 'Centro de costos', route: 'CostCenterList' },
      { label: 'Crear' },
    ],
    showBackBtn: true,
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'basic_data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ])
  const activeTab = ref<string>(tabs.value[0].name)
  const activeTabIdx = ref<number>(0)

  const onCreate = async () => {
    if (await costCenterForm.value?.validate()) {
      openMainLoader(true)

      const raw = costCenterForm.value.getFormData()

      const payload: ICostCenterCreatePayload = {
        account_structures_id: raw.account_structure_id,
        accounts_chart_id: raw.account_chart_id,
        centers: raw.costCenters.map(
          (item: { code: string; name: string; type: string }) => ({
            code: item.code,
            name: item.name,
            type: item.type,
          })
        ),
      }

      if (await _createCostCenter(payload)) {
        router.push({ name: 'CostCenterList' })
      }
      openMainLoader(false)
    }
  }

  return {
    headerCenterCost,
    tabs,
    activeTab,
    activeTabIdx,
    costCenterForm,
    onCreate,
  }
}
