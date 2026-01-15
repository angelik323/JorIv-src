import { Ref, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useMainLoader } from '@/composables'
import { defaultIconsLucide } from '@/utils'

import type { ITabs } from '@/interfaces/global'
import type {
  IOpeningRecordCreatePayload,
  IOpeningRecordResponse,
  OpeningRecordFormExpose,
  IOpeningRecordProcessReportData,
  ISuccessRow,
  IPendingRow,
} from '@/interfaces/customs'
import { useOpeningRecordStore, useResourceStore } from '@/stores'

const useOpeningRecordCreate = (
  openingRecordForm: Ref<OpeningRecordFormExpose | null>
) => {
  const processData = ref<IOpeningRecordProcessReportData | null>(null)

  const { openMainLoader } = useMainLoader()
  const { _createOpeningRecord } = useOpeningRecordStore('v1')
  const { opening_record_structures } = storeToRefs(useResourceStore('v1'))
  const hasSelectedBusiness = ref(false)

  const headerOpeningRecord = {
    title: 'Crear apertura de período contable',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad' },
      { label: 'Registro de apertura de período', route: 'OpeningRecordList' },
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
    {
      name: 'process_report',
      label: 'Informe de procesos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: false,
      required: false,
    },
  ])

  const activeTab = ref<string>(tabs.value[0].name)
  const activeTabIdx = ref<number>(0)

  const onCreate = async () => {
    if (!openingRecordForm.value) return

    const isValid = await openingRecordForm.value.validate?.()
    if (!isValid) return

    const raw = openingRecordForm.value.getFormData?.()
    if (!raw) return

    type BusinessIdValue = { id: number } | number

    const businessIds = (raw.business_ids ?? []) as BusinessIdValue[]

    const payload: IOpeningRecordCreatePayload = {
      accounting_structure_id: raw.structure_id,
      accounts_chart_id: raw.accounts_chart_id,
      from_business: raw.from_business_id,
      to_business: raw.to_business_id,
      business_ids: businessIds.map((b) => (typeof b === 'number' ? b : b.id)),
    }

    const tabToShow = tabs.value.find((t) => t.name === 'process_report')
    if (tabToShow) tabToShow.show = true
    activeTab.value = 'process_report'

    const result: IOpeningRecordResponse | null = await _createOpeningRecord(
      payload
    )

    if (result?.data) {
      const { id, successful, pending } = result.data

      processData.value = {
        processId: id as number,
        successful: (successful ?? []) as ISuccessRow[],
        pending: (pending ?? []) as IPendingRow[],
      }

      activeTab.value = 'process_report'
    }

    openMainLoader(false)
  }

  return {
    headerOpeningRecord,
    tabs,
    activeTab,
    activeTabIdx,
    openingRecordForm,
    opening_record_structures,
    processData,
    hasSelectedBusiness,
    onCreate,
  }
}

export default useOpeningRecordCreate
