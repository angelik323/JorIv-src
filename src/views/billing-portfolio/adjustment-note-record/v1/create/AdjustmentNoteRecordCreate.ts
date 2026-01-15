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
import { useAlert, useMainLoader, useUtils, useGoToUrl } from '@/composables'

// Stores
import { useAdjustmentNoteRecordStore } from '@/stores/billing-portfolio/adjustment-note-record'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useAdjustmentNoteRecordCreate = () => {
  const { _getResources } = useResourceManagerStore('v1')
  const { showAlert } = useAlert()
  const { _createInvoiceAdjustmentNote } = useAdjustmentNoteRecordStore('v1')
  const basic_data_form = ref<IAdjustmentNoteRecordInformationForm | null>(null)
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const basicDataFormRef = ref()

  const { openMainLoader } = useMainLoader()

  const headerProps = {
    title: 'Crear nota de ajuste',
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
        label: 'Crear',
        route: 'AdjustmentNoteRecordCreate',
      },
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
    const forms = [basicDataFormRef]
    return (await forms[tabActiveIdx]?.value?.validateForm()) ?? false
  }

  const route = useRoute()
  const selectedIds = ref<number[]>([])

  onMounted(() => {
    if (route.query.ids) {
      selectedIds.value = String(route.query.ids)
        .split(',')
        .map((id) => Number(id))
    }
  })

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)

    const payload = makeDataRequest()
    if (!payload) {
      openMainLoader(false)
      return
    }

    if (!selectedIds.value.length) {
      showAlert(
        'Debe seleccionar una factura para crear la nota de ajuste',
        'warning'
      )
      openMainLoader(false)
      return
    }

    const invoiceId = selectedIds.value[0]

    const success = await _createInvoiceAdjustmentNote(invoiceId, payload)

    if (success) {
      goToURL('InvoicesCommissionNotesList')
    }

    openMainLoader(false)
  }

  onMounted(() => {
    _getResources({ billing_collect: ['invoices_notes'] })
  })

  return {
    basic_data_form,
    basicDataFormRef,
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,

    goToURL,
    onSubmit,
  }
}

export default useAdjustmentNoteRecordCreate
