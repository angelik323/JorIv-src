import { useGoToUrl, useMainLoader } from '@/composables'
import { IAdjustmentNoteRecordInformationForm } from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'
import { useAdjustmentNoteRecordStore } from '@/stores'
import { defaultIconsLucide } from '@/utils'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const useAdjustmentNoteRecordListView = () => {
  const { openMainLoader } = useMainLoader()
  const { _showAction } = useAdjustmentNoteRecordStore('v1')
  const { goToURL } = useGoToUrl()

  const route = useRoute()

  const searchId = +route.params.id

  const formInformationRef = ref()

  const headerProps = {
    title: 'Ver nota de ajuste',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Facturación y cartera',
        route: '',
      },
      {
        label: 'Registros de notas de ajustes',
        route: 'InvoicesCommissionNotesList',
      },
      {
        label: 'Ver',
        route: 'AdjustmentNoteRecordView',
      },
      {
        label: `${searchId}`,
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'basic-data',
      label: 'Datos básicos*',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const basic_data_form = ref<IAdjustmentNoteRecordInformationForm | null>(null)

  const showInformation = async () => {
    const data = await _showAction(searchId)
    if (data) {
      basic_data_form.value = {
        invoice_id: data.id,
        invoice_number: data.invoice_number,
        note_type: data.adjustment_notes?.note_type ?? '',
        affects: data.adjustment_notes?.affects ?? '',
        amount: data.adjustment_notes?.amount ?? '',
        adjustment_date: data.adjustment_notes?.adjustment_date ?? '',
        observations: data.adjustment_notes?.observations ?? '',
      }
    }
  }

  onMounted(async () => {
    openMainLoader(true)
    await showInformation()
    openMainLoader(false)
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    formInformationRef,
    basic_data_form,
    goToURL,
  }
}
export default useAdjustmentNoteRecordListView
