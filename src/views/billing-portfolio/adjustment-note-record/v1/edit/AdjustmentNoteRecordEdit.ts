// vue - pinia
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  IAdjustmentNoteRecordInformationForm,
  IAdjustmentNoteRecordPayloadCreate,
} from '@/interfaces/customs'

// Composables
import { useAlert, useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useAdjustmentNoteRecordStore } from '@/stores/billing-portfolio/adjustment-note-record'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useAdjustmentNoteRecordUpdate = () => {
  const { _getResources } = useResourceManagerStore('v1')
  const { showAlert } = useAlert()
  const { _showAction, _updateInvoiceAdjustmentNote } =
    useAdjustmentNoteRecordStore('v1')
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()

  const basic_data_form = ref<IAdjustmentNoteRecordInformationForm | null>(null)
  const basicDataFormRef = ref()

  const { openMainLoader } = useMainLoader()

  const headerProps = {
    title: 'Editar nota de ajuste',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Facturación y cartera', route: '' },
      {
        label: 'Registros de notas de ajustes',
        route: 'InvoicesCommissionNotesList',
      },
      { label: 'Editar', route: 'AdjustmentNoteRecordEdit' },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'basic-data',
      label: 'Datos básicos*',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const makeDataRequest = (): IAdjustmentNoteRecordPayloadCreate | null => {
    if (!basic_data_form.value) return null

    return {
      note_type: basic_data_form.value.note_type,
      affects: basic_data_form.value.affects,
      amount: basic_data_form.value.amount ?? '0',
      adjustment_date: basic_data_form.value.adjustment_date,
      observations: basic_data_form.value.observations,
    }
  }

  const validateForms = async () => {
    return await basicDataFormRef.value?.validateForm()
  }

  const route = useRoute()
  const invoiceId = ref<number | null>(null)
  const noteId = ref<number | null>(null)

  const loadNoteInfo = async () => {
    if (!invoiceId.value) return
    const data = await _showAction(invoiceId.value)

    if (data) {
      basic_data_form.value = {
        invoice_id: data.id,
        invoice_number: data.invoice_number,
        note_type: data.adjustment_notes?.note_type ?? '',
        affects: data.adjustment_notes?.affects ?? '',
        amount: data.adjustment_notes?.amount ?? null,
        adjustment_date: data.adjustment_notes?.adjustment_date ?? '',
        observations: data.adjustment_notes?.observations ?? '',
      }
    }
  }

  onMounted(async () => {
    invoiceId.value = Number(route.params.invoiceId ?? null)
    noteId.value = Number(route.params.noteId ?? null)

    if (!invoiceId.value || !noteId.value) {
      showAlert('No se encontró la información de la nota a editar', 'error')
      goToURL('InvoicesCommissionNotesList')
      return
    }

    openMainLoader(true)
    await _getResources({ billing_collect: ['invoices_notes'] })
    await loadNoteInfo()
    openMainLoader(false)
  })

  const onSubmit = async () => {
    const valid = await validateForms()
    if (!valid) {
      return
    }

    openMainLoader(true)
    const payload = makeDataRequest()

    if (!payload || !invoiceId.value || !noteId.value) {
      openMainLoader(false)
      return
    }

    const success = await _updateInvoiceAdjustmentNote(
      invoiceId.value,
      noteId.value,
      payload
    )

    if (success) {
      goToURL('InvoicesCommissionNotesList')
    }

    openMainLoader(false)
  }

  return {
    basic_data_form,
    basicDataFormRef,
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    onSubmit,
    goToURL,
  }
}
export default useAdjustmentNoteRecordUpdate
