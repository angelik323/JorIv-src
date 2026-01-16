//Vue - Pinia
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

//Interfaces
import {
  IReportNotes,
  IReportSignatures,
  IReportTemplatePayload,
  IReportTemplateReportsGeneric,
  IReportTemplateReportSignatureGeneric,
} from '@/interfaces/customs/accounting/ReportTemplates'

import { IBaseTableProps } from '@/interfaces/global/Table'
import { ReportTemplateActions, ActionType } from '@/interfaces/global/Action'

// Composables
import { useUtils } from '@/composables/useUtils'
//Stores
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'

const useInformationForm = (
  props: {
    action: ActionType
    section?: ReportTemplateActions | string
    data?: IReportTemplatePayload
  },
  emits: Function
) => {
  //Desestructure
  const {
    report_modules,
    presentation_business_report_headers,
    responsible_report_signatures,
    type_report_signatures,
    report_template_signatures,
    report_template_logos,
  } = storeToRefs(useAccountingResourceStore('v1'))
  const informationFormRef = ref()
  //Utils
  const { defaultIconsLucide, isEmptyOrZero } = useUtils()

  //Models
  const selectedRows = ref<{ id: number }[]>([])

  const models = ref<IReportTemplatePayload>({
    header: {
      has_first_header: false,
      has_first_logo: false,
      first_logo_id: 0,
      has_second_logo: false,
      show_header_name: false,
      show_business_type: false,
      has_accounting_book: false,
      has_second_header: false,
      text_second_header: '',
      text_first_header: '',
    },
    signatures: [],
    notes: [],
    list_reports: [],
  })

  const modelsSignatures = ref<IReportSignatures>({
    manage_signature: false,
    responsible_type: '',
    report_signature_id: 0,
    order: 0,
    signature_type: '',
    show_position: false,
    show_identification_number: false,
    show_professional_card: false,
    show_signature_image: false,
    show_signature_legend: false,
    profession_card_number: '',
    signature_legend: '',
  })

  const modelNotes = ref<IReportNotes>({
    has_note: false,
    description: '',
    position: 0,
  })

  //Table Properties
  const tablePropertiesFinancialStatements = ref<
    IBaseTableProps<IReportTemplateReportsGeneric>
  >({
    title: 'Estados financieros',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'check',
        required: false,
        label: '',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'name',
        required: false,
        label: 'Nombre del reporte',
        align: 'left',
        field: 'name',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })
  const tablePropertiesBooks = ref<
    IBaseTableProps<IReportTemplateReportsGeneric>
  >({
    title: 'Libros oficiales',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'check',
        required: false,
        label: '',
        align: 'center',
        field: 'id',
        sortable: true,
      },
      {
        name: 'name',
        required: false,
        label: 'Nombre del reporte',
        align: 'left',
        field: 'name',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })
  const tablePropertiesBalance = ref<
    IBaseTableProps<IReportTemplateReportsGeneric>
  >({
    title: 'Balances',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'check',
        required: false,
        label: '',
        align: 'center',
        field: 'id',
        sortable: true,
      },
      {
        name: 'name',
        required: false,
        label: 'Nombre del reporte',
        align: 'left',
        field: 'name',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })
  const tablePropertiesAuxReports = ref<
    IBaseTableProps<IReportTemplateReportsGeneric>
  >({
    title: 'Libros auxiliares',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'check',
        required: false,
        label: '',
        align: 'center',
        field: 'id',
        sortable: true,
      },
      {
        name: 'name',
        required: false,
        label: 'Nombre del reporte',
        align: 'left',
        field: 'name',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })

  const tablePropertiesSignatures = ref<
    IBaseTableProps<IReportTemplateReportSignatureGeneric>
  >({
    title: 'Listado de firmas',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'name',
        required: false,
        label: 'Nombre',
        align: 'left',
        field: 'name',
        sortable: true,
      },
      {
        name: 'position',
        required: false,
        label: 'Tipo de responsable',
        align: 'left',
        field: 'position',
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        align: 'center',
        field: 'id',
      },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })

  // Methods
  const _setValueModel = () => {
    if (!props.data) return
    models.value = { ...props.data }
    modelsSignatures.value = { ...props.data?.signatures[0] }
    modelNotes.value = props.data?.notes[0]
  }

  const loadSignaturePartial = () => {
    if (!Array.isArray(models.value.signatures)) {
      models.value.signatures = []
    }

    const index = tablePropertiesSignatures.value.rows.length + 1

    models.value.signatures.push({
      index,
      ...modelsSignatures.value,
    })

    tablePropertiesSignatures.value.rows.push({
      id: index,
      name: modelsSignatures.value.signature_type,
      position: modelsSignatures.value.responsible_type,
    })
  }

  const getFullSignatureById = (id: number) => {
    return models.value.signatures.find((signature) => signature.index === id)
  }

  const deleteSignaturePartial = (idRow: number) => {
    const index = tablePropertiesSignatures.value.rows.findIndex(
      (row) => row.id === idRow
    )
    if (index !== -1) {
      tablePropertiesSignatures.value.rows.splice(index, 1)
      models.value.signatures.splice(index, 1)
    }
  }

  // Watches
  watch(
    () => report_modules.value,
    () => {
      const financialModule = report_modules.value.find(
        (module) => module.name === 'Estados Financieros'
      )
      tablePropertiesFinancialStatements.value.rows =
        financialModule && 'reports' in financialModule
          ? (financialModule as { reports: IReportTemplateReportsGeneric[] })
              .reports
          : []
      const balanceModule = report_modules.value.find(
        (module) => module.name === 'Balances'
      )

      tablePropertiesBalance.value.rows =
        balanceModule && 'reports' in balanceModule
          ? (balanceModule as { reports: IReportTemplateReportsGeneric[] })
              .reports
          : []
      const booksModule = report_modules.value.find(
        (module) => module.name === 'Libros Oficiales'
      )
      tablePropertiesBooks.value.rows =
        booksModule && 'reports' in booksModule
          ? (booksModule as { reports: IReportTemplateReportsGeneric[] })
              .reports
          : []
      const auxReportsModule = report_modules.value.find(
        (module) => module.name === 'Libros Auxiliares'
      )
      tablePropertiesAuxReports.value.rows =
        auxReportsModule && 'reports' in auxReportsModule
          ? (auxReportsModule as { reports: IReportTemplateReportsGeneric[] })
              .reports
          : []
    }
  )

  watch(
    () => props.data,
    (newVal) => {
      if (!newVal) return
      _setValueModel()
    }
  )

  watch(
    () => modelNotes.value,
    (newVal) => {
      if (!newVal) return
      const notes: IReportNotes[] = []
      if (newVal.has_note) {
        notes.push({ ...newVal, position: 1 })
      }
      if (
        'has_second_note' in newVal &&
        (newVal as { has_second_note: boolean }).has_second_note
      ) {
        notes.push({ ...newVal, has_note: true, position: 2 })
      }
      if (
        'has_third_note' in newVal &&
        (newVal as { has_third_note: boolean }).has_third_note
      ) {
        notes.push({ ...newVal, has_note: true, position: 3 })
      }
      models.value.notes = notes
    },
    { deep: true }
  )

  watch(
    () => selectedRows.value,
    () => {
      models.value.list_reports = selectedRows.value.map((row) => row.id)
    },
    { deep: true }
  )

  watch(
    () => models.value,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emits('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  return {
    //Models
    models,
    modelsSignatures,
    modelNotes,
    //Data refs
    report_modules,
    presentation_business_report_headers,
    responsible_report_signatures,
    type_report_signatures,
    report_template_signatures,
    report_template_logos,
    informationFormRef,

    //Table Properties
    tablePropertiesFinancialStatements,
    tablePropertiesBooks,
    tablePropertiesBalance,
    tablePropertiesAuxReports,
    tablePropertiesSignatures,

    //Others
    selectedRows,
    defaultIconsLucide,
    loadSignaturePartial,
    deleteSignaturePartial,
    getFullSignatureById,
  }
}

export default useInformationForm
